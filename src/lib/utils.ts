import { Note } from '../SheetMusic';

export const listAdjustments = (adjs) => {
  const out = {};
  for (let adj of adjs) {
    out[adj.note.toUpperCase()] = adj.acc;
  }
  return out;
};

export const parseJSON = (json, { bpm }) => {
  let line: any;
  let staff: any;
  let adjustments: any;
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
      adjustments = listAdjustments(staff.key.accidentals);
      for (const note of voices) {
        if (note.el_type === 'bar') {
          // clear the adjustments each bar - note that this doesn't
          // allow for ties to carry accidentals to next bar...
          adjustments = listAdjustments(staff.key.accidentals);
        }
        if (note.startTriplet) {
          tripletMultiplier = note.tripletMultiplier;
        }
        if (note.pitches && note.el_type === 'note') {
          const duration =
            note.duration * tripletMultiplier * (60 / bpm) * beatsPerBar;
          const index = `s${note.startChar}e${note.endChar}`;
          const reactronicaNotes: Note[] = [];

          for (const pitch of note.pitches) {
            const noteAndOctave = computeNoteAndOctave(pitch.pitch);
            const noteName = noteAndOctave.note;
            const octave = noteAndOctave.octave;
            // note this doesn't allow for double sharp, double flat, etc
            let accidental = '';
            if (pitch.accidental) {
              adjustments[`${noteName}${octave}`] = pitch.accidental;
            }
            if (adjustments[`${noteName}${octave}`] === 'sharp') {
              accidental = '#';
            } else if (adjustments[`${noteName}${octave}`] === 'flat') {
              accidental = 'b';
            } else if (adjustments[`${noteName}${octave}`] === 'natural') {
              accidental = '';
            } else if (adjustments[`${noteName}`] === 'sharp') {
              accidental = '#';
            } else if (adjustments[`${noteName}`] === 'flat') {
              accidental = 'b';
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

export const computeNoteAndOctave = (noteNumber: number) => {
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
  const note = noteLetters[(noteNumber + 700) % 7];
  // The + 2 here makes sure note 0 is in the correct octave
  const octave = Math.floor(noteNumber / 7) + 3;
  const out = { note, octave };

  return out;
};
