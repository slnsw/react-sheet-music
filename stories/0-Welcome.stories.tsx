import React from 'react';
import SheetMusic from '@';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <SheetMusic notation="|EFGA|" />;

toStorybook.story = {
  name: 'to Storybook',
};
