// @ts-nocheck
import React from 'react';
import abcjs from 'abcjs';

type Props = {
  id?: string;
  isPlaying?: boolean;
  /** In ABC notation format */
  notation?: string;
  bpm?: number;
  scale?: number;
  className?: string;
  onBeat?: Function;
  onEvent?: Function;
  onLineEnd?: Function;
};

const SheetMusic: React.FunctionComponent<Props> = ({
  id = 'sheet-music',
  isPlaying,
  notation,
  bpm = 80,
  scale = 1,
  className,
  onBeat,
  onEvent,
  onLineEnd,
}) => {
  const timer = React.useRef<{
    start: Function;
    stop: Function;
  }>();
  const computeNoteAndOctave = n => {
    // Note number n is an integer 0 = C, 1 = D, ... 6 = B
    const noteLetters = {};
    noteLetters[0] = 'C';
    noteLetters[1] = 'D';
    noteLetters[2] = 'E';
    noteLetters[3] = 'F';
    noteLetters[4] = 'G';
    noteLetters[5] = 'A';
    noteLetters[6] = 'B';
    // And 7 is C on the next octave up. Note integers can be negative.
    // This causes a problem when using modulo - so add a large multiple
    // of 7 to avoid negatives.
    const note = noteLetters[(n + 700) % 7];
    // The + 2 here makes sure note 0 is in the correct octave
    const octave = Math.floor(n / 7) + 3;
    const out = { note, octave };
    return out;
  };

  const parseJSON = json => {
    let line: any;
    let staff: any;
    let adj: any;
    // this assumes there is only one song.
    const data = json[0];
    // this assumes the meter is the same for all staffs and lines
    const beatsPerBar = data.lines[0].staff[0].meter.value[0].num;
    const notes = {};
    let tripletMultiplier = 1;
    const lines = Object.values(data.lines);
    for (line of lines) {
      let staffNum = 0;
      const staves = Object.values(line.staff);
      for (staff of staves) {
        const voices = staff.voices[0];
        const keyAdjustments = staff.key.accidentals;
        for (const note of voices) {
          if (note.startTriplet) {
            tripletMultiplier = note.tripletMultiplier;
          }
          if (note.pitches && note.el_type === 'note') {
            const duration =
              note.duration * tripletMultiplier * (60 / bpm) * beatsPerBar;
            const index = `s${note.startChar}e${note.endChar}`;
            const reactronicaNotes = [];
            for (const pitch of note.pitches) {
              const noteAndOctave = computeNoteAndOctave(pitch.pitch);
              const noteName = noteAndOctave.note;
              const octave = noteAndOctave.octave;
              let accidental = '';
              if (pitch.accidental && pitch.accidental === 'sharp') {
                accidental = '#';
              }
              if (pitch.accidental && pitch.accidental === 'flat') {
                accidental = 'b';
              }
              for (adj of keyAdjustments) {
                if (
                  pitch.accidental &&
                  noteName === adj.note.toUpperCase() &&
                  pitch.accidental !== 'natural' &&
                  adj.acc === 'sharp'
                ) {
                  accidental = '#';
                }
                if (
                  pitch.accidental &&
                  noteName === adj.note.toUpperCase() &&
                  pitch.accidental !== 'natural' &&
                  adj.acc === 'flat'
                ) {
                  accidental = 'b';
                }
              }
              const noteBlob = {
                name: `${noteName}${accidental}${octave}`,
                duration,
                octave,
                line: staffNum,
              };
              reactronicaNotes.push(noteBlob);
            }
            notes[index] = reactronicaNotes;
          }
          if (note.endTriplet) {
            tripletMultiplier = 1;
          }
        }
        staffNum += 1;
      }
    }
    return notes;
  };

  React.useEffect(() => {
    if (notation) {
      // Use abcjs' built in parser to turn the
      // text string into structured JSON:
      const json = abcjs.parseOnly(notation);
      // now use our function to turn that into an array
      // of notes or chords using note names and durations
      // that things like Tone.js and Reactronica understand:
      const noteList = parseJSON(json);
      // Now render actual score:
      const tune = abcjs.renderAbc('paper', notation, {
        add_classes: true,
        scale,
        staffwidth: 1200,
      });

      timer.current = new abcjs.TimingCallbacks(tune[0], {
        qpm: bpm,
        beatSubdivisions: json[0].lines[0].staff[0].meter.value[0].num, // 4,
        beatCallback: (beatNumber, totalBeats, totalTime) => {
          if (typeof onBeat === 'function') {
            onBeat(beatNumber, totalBeats, totalTime);
          }
        },
        lineEndCallback: info => {
          if (typeof onLineEnd === 'function') {
            onLineEnd(info);
          }
        },
        eventCallback: event => {
          if (typeof onEvent === 'function') {
            if (event === null) {
              onEvent(null);
            } else {
              // Event.midiPitches isn't working, so we need to work out pitch from ABC notation.
              // We use the event's array of start and end positions (positions in the notation string)
              // that point out which notes are being played at this point in time (ie event).
              // Each pair of these is formed into a unique key for our array of notes: noteList.
              const allNotes = event.startCharArray.map((_, index) => {
                const startChar = event.startCharArray[index];
                const endChar = event.endCharArray[index];
                return noteList[`s${startChar}e${endChar}`];
              });
              // now smoosh all the notes into one array and remove nulls (rests)
              const charNotes = []
                .concat(...allNotes)
                .filter(char => Boolean(char));
              if (typeof onEvent === 'function') {
                onEvent({
                  ...event,
                  notes: charNotes,
                });
              }
            }
          }

          if (!event) {
            return null;
          }

          const notes = document.getElementsByClassName('abcjs-note');
          const rests = document.getElementsByClassName('abcjs-rest');
          const lyrics = document.getElementsByClassName('abcjs-lyric');

          // Remove all highlighted notes
          for (let note of notes) {
            note.classList.remove('abcjs-note-playing');
          }

          for (let rest of rests) {
            rest.classList.remove('abcjs-rest-playing');
          }

          for (let lyric of lyrics) {
            lyric.classList.remove('abcjs-lyric-playing');
          }

          // Highlight current playing notes
          // event.elements.forEach(element => {
          //   element[0].classList.add('abcjs-note-playing');
          // });
          event.elements.forEach(nodes => {
            nodes.forEach(node => {
              const classes = node.className.baseVal;
              let type;

              if (classes.indexOf('abcjs-lyric') > -1) {
                type = 'lyric';
              } else if (classes.indexOf('abcjs-rest') > -1) {
                type = 'rest';
              } else if (classes.indexOf('abcjs-note') > -1) {
                type = 'note';
              }

              node.classList.add(`abcjs-${type}-playing`);
            });
          });

          return null;
        },
      });
    }

    /* eslint-disable */
  }, [JSON.stringify(notation)]);
  /* eslint-enable */

  React.useEffect(() => {
    if (timer && timer.current) {
      if (isPlaying) {
        timer.current.start();
      } else {
        timer.current.stop();
      }
    }
  }, [isPlaying]);

  if (!notation) {
    return null;
  }

  return (
    <>
      <div
        id={id}
        // ref={paper}
        className={className || ''}
      ></div>

      <style>
        {`
          .sheet-music {
            width: 100%;
            margin: 0 auto 2rem auto;
            background-color: #FFF;
          }

          #${id} .abcjs-note {
            transition: 0.2s;
          }

          #${id} .abcjs-rest {
            transition: 0.2s;
          }

          #${id} .abcjs-note-playing {
            fill: #e6007e;
          }

          #${id} .abcjs-rest-playing {
            fill: #e6007e;
          }

          #${id} .abcjs-lyric-playing {
            fill: #e6007e;
          }

          #${id} .abcjs-note_selected {
            fill: #e6007e;
          }
        `}
      </style>
    </>
  );
};

export default SheetMusic;
