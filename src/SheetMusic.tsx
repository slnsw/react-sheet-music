import React from 'react';

import { parseJSON } from './lib/utils';

import './SheetMusic.css';

type Props = {
  id?: string;
  isPlaying?: boolean;
  /** In ABC notation format */
  notation?: string;
  bpm?: number;
  scale?: number;
  staffWidth?: number;
  responsive?: boolean;
  oneSvgPerLine?: boolean;
  className?: string;
  onClick?: Function;
  onBeat?: Function;
  onEvent?: Function;
  onLineEnd?: Function;
};

export type Note = {
  name: string;
  duration: number;
  octave: number;
  line: number;
};

const SheetMusic: React.FunctionComponent<Props> = ({
  id = 'sheet-music',
  isPlaying,
  notation,
  bpm = 80,
  scale = 1,
  staffWidth = 800,
  responsive = 'resize',
  oneSvgPerLine = false,
  className,
  onClick,
  onBeat,
  onEvent,
  onLineEnd,
}) => {
  const timer = React.useRef<{
    start: Function;
    stop: Function;
  }>();
  const abcjs = React.useRef<{
    renderAbc: Function;
    parseOnly: Function;
    TimingCallbacks: any;
  }>();
  const tune = React.useRef<{
    setTiming: Function;
  }>();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      /* eslint-disable */
      abcjs.current = require('abcjs');
      /* eslint-enable */

      if (notation && abcjs?.current) {
        // Use abcjs' built in parser to turn the
        // text string into structured JSON:
        const json = abcjs.current.parseOnly(notation);
        // now use our function to turn that into an array
        // of notes or chords using note names and durations
        // that things like Tone.js and Reactronica understand:
        const noteList = parseJSON(json, { bpm });

        // Now render actual score:
        tune.current = abcjs.current.renderAbc(id, notation, {
          add_classes: true,
          scale,
          staffwidth: staffWidth,
          responsive,
          oneSvgPerLine,
          ...(typeof onClick === 'function'
            ? {
                clickListener: onClick,
              }
            : {}),
        });

        if (tune && tune.current) {
          console.log(tune.current[0]);
          timer.current = new abcjs.current.TimingCallbacks(tune.current[0], {
            qpm: bpm,
            beatSubdivisions: json[0].lines[0].staff[0].meter.value[0].num, // 4,
            beatCallback: (beatNumber, totalBeats, totalTime) => {
              if (typeof onBeat === 'function') {
                onBeat(beatNumber, totalBeats, totalTime);
                if (tune && tune.current) {
                  tune.current[0].setTiming(bpm);
                }
              }
            },
            lineEndCallback: (info) => {
              if (typeof onLineEnd === 'function') {
                onLineEnd(info);
              }
            },
            eventCallback: (event) => {
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
                    .filter((char) => Boolean(char));
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
              for (let note of [].slice.call(notes)) {
                note.classList.remove('abcjs-note_playing');
              }

              // Remove all highlighted rests
              for (let rest of [].slice.call(rests)) {
                rest.classList.remove('abcjs-rest_playing');
              }

              // Remove all highlighted lyrics
              for (let lyric of [].slice.call(lyrics)) {
                lyric.classList.remove('abcjs-lyric_playing');
              }

              // Highlight current playing lyric/rest/note
              event.elements.forEach((nodes) => {
                nodes.forEach((node) => {
                  const classes = node.className.baseVal;
                  let type;

                  if (classes.indexOf('abcjs-lyric') > -1) {
                    type = 'lyric';
                  } else if (classes.indexOf('abcjs-rest') > -1) {
                    type = 'rest';
                  } else if (classes.indexOf('abcjs-note') > -1) {
                    type = 'note';
                  }

                  node.classList.add(`abcjs-${type}_playing`);
                });
              });

              return null;
            },
          });
        }
      }
    }
    /* eslint-disable */
  }, [JSON.stringify(notation), bpm]);
  /* eslint-enable */

  // uncomment this below and remove bpm from the above useEffect, also comment out lines 96-98.
  // React.useEffect(() => {
  //   if (tune && tune.current) {
  //     tune.current[0].setTiming(bpm);
  //     console.log(bpm, tune.current[0].getBpm(bpm));
  //   }
  // }, [bpm]);

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

  return <div id={id} className={['sheet-music', className || ''].join(' ')} />;
};

export default SheetMusic;
