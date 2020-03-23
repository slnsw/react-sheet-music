import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import SheetMusic from '../.';

import songs from './songs';

const App = () => {
  const song = songs[0];
  const [isPlaying, setIsPlaying] = React.useState(false);
  const handleEvent = (event) => {
    if (event && event.notes) {
      console.log(event.notes);

  
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
        notation={song.notation}
        bpm={80}
        onEvent={handleEvent}
        isPlaying={isPlaying}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
