import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import SheetMusic from '../.';

import songs from './songs';

const App = () => {
  const song = songs[0];

  return (
    <div>
      <h1>{song.title}</h1>
      <SheetMusic notation={song.notation} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
