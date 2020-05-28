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
  // console.log(data);
  // this assumes the meter is the same for all staffs and lines
  const wholeNoteMultiplier = data.lines[0].staff[0].meter.value[0].den;
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
            note.duration *
            tripletMultiplier *
            (60 / bpm) *
            wholeNoteMultiplier;
          const index = `s${note.startChar}e${note.endChar}`;
          const reactronicaNotes: Note[] = [];

          for (const pitch of note.pitches) {
            const noteAndOctave = computeNoteAndOctave(pitch.pitch);
            let noteName = noteAndOctave.note;
            let octave = noteAndOctave.octave;
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
            // fix no-existant notes.
            if (noteName === 'E' && accidental === '#') {
              noteName = 'F';
              accidental = '';
            } else if (noteName === 'F' && accidental === 'b') {
              noteName = 'E';
              accidental = '';
            } else if (noteName === 'B' && accidental === '#') {
              noteName = 'C';
              accidental = '';
              octave += 1;
            } else if (noteName === 'C' && accidental === 'b') {
              noteName = 'F';
              accidental = '';
              octave -= 1;
            }
            const midiNoteNumber = computeMidiNoteNumber(
              noteName,
              accidental,
              octave,
            );
            const noteBlob = {
              name: `${noteName}${accidental}${octave}`,
              duration,
              octave,
              line: staffNum,
              midiNoteNumber,
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

export const computeMidiNoteNumber = (
  noteName: string,
  accidental: string,
  octave: number,
) => {
  const letterToNumber = {};

  letterToNumber['C'] = 24;
  letterToNumber['D'] = 26;
  letterToNumber['E'] = 28;
  letterToNumber['F'] = 29;
  letterToNumber['G'] = 31;
  letterToNumber['A'] = 33;
  letterToNumber['B'] = 35;

  const flatAllowed = {};

  flatAllowed['A'] = true;
  flatAllowed['B'] = true;
  flatAllowed['C'] = false;
  flatAllowed['D'] = true;
  flatAllowed['E'] = true;
  flatAllowed['F'] = false;
  flatAllowed['G'] = true;

  const sharpAllowed = {};

  sharpAllowed['A'] = true;
  sharpAllowed['B'] = false;
  sharpAllowed['C'] = true;
  sharpAllowed['D'] = true;
  sharpAllowed['E'] = false;
  sharpAllowed['F'] = true;
  sharpAllowed['G'] = true;

  const out =
    letterToNumber[noteName] +
    (accidental === 'b' && flatAllowed[noteName] ? -1 : 0) +
    (accidental === '#' && sharpAllowed[noteName] ? 1 : 0) +
    octave * 12;

  return out;
};

export const computeNoteAndOctaveFromMidiNoteNumber = (
  midiNoteNumber: number,
) => {
  const noteLetters = {};
  noteLetters[0] = 'C';
  noteLetters[1] = 'C';
  noteLetters[2] = 'D';
  noteLetters[3] = 'D';
  noteLetters[4] = 'E';
  noteLetters[5] = 'F';
  noteLetters[6] = 'F';
  noteLetters[7] = 'G';
  noteLetters[8] = 'G';
  noteLetters[9] = 'A';
  noteLetters[10] = 'B';
  noteLetters[11] = 'B';

  const accidental = {};
  accidental[0] = '';
  accidental[1] = '#';
  accidental[2] = '';
  accidental[3] = '#';
  accidental[4] = '';
  accidental[5] = '';
  accidental[6] = '#';
  accidental[7] = '';
  accidental[8] = '#';
  accidental[9] = '';
  accidental[10] = 'b';
  accidental[11] = '';

  const octave = Math.floor(midiNoteNumber / 12) - 2; // or -1 ... depends...
  const noteNum = midiNoteNumber % 12;
  const note = noteLetters[noteNum];
  const acc = accidental[noteNum];
  const out = { note, acc, octave };

  return out;
};
