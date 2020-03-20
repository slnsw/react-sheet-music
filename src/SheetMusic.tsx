import React from 'react';
import abcjs from 'abcjs';

type Props = {
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
  isPlaying,
  notation,
  bpm,
  scale = 1,
  className,
  onBeat,
  onEvent,
  onLineEnd,
}) => {
  // const paper = React.useRef();
  const timer = React.useRef<{
    start: Function;
    stop: Function;
  }>();

  React.useEffect(() => {
    if (notation) {
      const tune = abcjs.renderAbc('paper', notation, {
        add_classes: true,
        scale,
        staffwidth: 1200,
      });

      timer.current = new abcjs.TimingCallbacks(tune[0], {
        qpm: bpm,
        beatSubdivisions: 4,
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
              // Event.midiPitches isn't working, so we need to work out pitch from ABC notation
              // const note = notation[event.startChar];
              const note = notation.slice(event.startChar, event.endChar);

              onEvent({
                ...event,
                note,
              });
            }
          }

          if (!event) {
            return null;
          }

          // const notes = document.getElementsByClassName('abcjs-note');
          // const rests = document.getElementsByClassName('abcjs-rest');

          // for (let note of notes) {
          //   note.classList.remove('abcjs-note-playing');
          // }

          // for (let rest of rests) {
          //   rest.classList.remove('abcjs-note-playing');
          // }

          // event.elements.forEach(element => {
          //   element[0].classList.add('abcjs-note-playing');
          // });

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
        id="paper"
        // ref={paper}
        className={className || ''}
      ></div>

      <style>
        {`
          #paper .abcjs-note, #paper .abcjs-rest {
            transition: 0.2s;
          }

          #paper .abcjs-note-playing {
            fill: #d10fc9;
          }
        `}
      </style>
    </>
  );
};

export default SheetMusic;
