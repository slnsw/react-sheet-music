import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import SheetMusic from '../.';
import '../dist/SheetMusic.css';

import songs from './songs';

const App = () => {
  const song = songs[0];
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleEvent = (event) => {
    if (event && event.notes) {
      console.log('--- our computed note data ---');
      console.log(event.notes);
      console.log('--- abcjs midi note data ---');
      console.log(event.midiPitches);
    }
  };

  return (
    <div>
      <h1>{song.title}</h1>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="button--light"
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>

      <SheetMusic
        // id="paper"
        className="test"
        notation={song.notation}
        bpm={80}
        onEvent={handleEvent}
        isPlaying={isPlaying}
        // returnFormat="notes" // other option is "event" which no longer includes our parsed version of the note data as midiPitches is now working
      />

      {/* <style>{`
        .test .abcjs-note_playing {
          fill: red;
        }
      `}</style> */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
