import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SheetMusic from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SheetMusic />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
