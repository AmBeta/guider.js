import Guider from 'guider';

const guider = new Guider();

guider.setSteps([
  {
    element: 'h1',
    mask: true,
    trigger: true,
    tooltip: {
      title: 'First Step',
      description: 'This is the name of the package.',
    },
  },
  {
    element: 'h2',
    mask: true,
    trigger: true,
    tooltip: {
      title: 'Second Step',
      description: 'You can highlight any element.',
    },
  },
  [
    { element: '#demo', mask: true, trigger: false, tooltip: 'Feature List' },
    { element: '#demo ul > li', mask: false, trigger: false },
  ],
]);

guider.start();
