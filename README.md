# React Sheet Music

React component to render interactive sheet music using [ABC notation](http://abcnotation.com/learn). Powered by [ABC JS](https://paulrosen.github.io/abcjs/) under the hood.

> Work in progress

# Install

```bash
$ npm install @slnsw/react-sheet-music
```

# Usage

```jsx
import SheetMusic from 'react-sheet-music';

const MyComponent = () => {
  return (
    <SheetMusic
      // Textual representation of music in ABC notation
      // The string below will show four crotchets in one bar
      notation="|EGBF|"
    />
  );
};
```

# Props

| Prop       | Type     | Description                                                                               |
| ---------- | -------- | ----------------------------------------------------------------------------------------- |
| notation   | string   | Textual representation of music in ABC notation                                           |
| isPlaying  | boolean  | If playing, the notes will highlight and onBeat, onEvent and onLineEnd callbacks will run |
| responsive | string   | Undefined or 'resize'                                                                     |
| className  | string   | Custom class name to add to sheet music div                                               |
| onClick    | function | Callback for when any part of the sheet music is clicked on                               |
| onBeat     | function |                                                                                           |
| onEvent    | function |                                                                                           |
| onLineEnd  | function |                                                                                           |

# Development

```bash
# Install packages for this component
$ npm install
# This builds the component in watch mode
$ npm start

# Open up a new terminal window and go to repo location
$ cd example
# Install packages for example app
$ npm install
# Test out component in app
$ npm start
```
