import { createApplication } from './views';
import { listen } from './utils/dom';
import input from './models/input.json';

function main() {
  createApplication(document.body, [input[2]]);
}

if (document.readyState !== 'loading') main();
else listen(document, ['DOMContentLoaded'], main);
