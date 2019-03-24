import { createApplication } from './views';
import { listen } from './utils/dom';

function main() {
  fetch('/chart-data.json')
    .then(result => result.json())
    .then(input => {
      console.log(input);
      createApplication(document.body, [input[4]]);
    });
}

if (document.readyState !== 'loading') main();
else listen(document, ['DOMContentLoaded'], main);
