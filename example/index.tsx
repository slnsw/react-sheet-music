import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SheetMusic from '../.';

const App = () => {
  return (
    <div>
      <SheetMusic notation="|EEEE|"></SheetMusic>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
