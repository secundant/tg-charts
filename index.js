import { createApplication } from './views';
import { listen } from './utils/dom';

function main() {
  createApplication(document.body, []);
}

if (document.readyState !== 'loading') main();
else listen(document, ['DOMContentLoaded'], main);
