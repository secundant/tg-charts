import { Application } from './views';

const application = new Application();

document.addEventListener(
  'DOMContentLoaded',
  () => {
    application.render([]);
  },
  false
);
