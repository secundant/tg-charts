import { createApplication } from './views';
import { listen } from './utils/dom';

listen(document, ['DOMContentLoaded'], () => createApplication(document.body, []));
