import { Draggable, Renderer, ScreenModel, Transition } from '../models';
import styles from './style.scss';
import { el } from '../utils/dom/createElement';
import { RootView } from './RootView';

function read(file) {
  const reader = new FileReader();

  return new Promise(resolve => {
    reader.onload = e => resolve(e.target.result);
    reader.readAsText(file);
  });
}

if (IS_CLIENT) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.addEventListener(eventName, preventDefaults, false);
  });
}
const preventDefaults = e => e.preventDefault();

export class Application {
  /**
   * @param {HTMLElement?} target
   */
  constructor({ target } = {}) {
    this.screen = new ScreenModel();
    this.renderer = new Renderer();
    this.draggable = new Draggable();
    this.transition = new Transition(this.renderer);
    this.titleElement = el('h1', {
      class: styles.Title
    });
    this.headerElement = el(
      'div',
      {
        class: styles.Heading
      },
      [this.titleElement]
    );
    this.titleElement.textContent = 'Followers';
    if (!target && IS_CLIENT) {
      target = el('div');
      document.body.appendChild(target);
    }
    this.target = target;
    if (IS_CLIENT) {
      document.addEventListener('drop', async ({ dataTransfer: { files: [file] } }) => {
        this.render(JSON.parse(await read(file)));
      });
    }
  }

  render(input) {
    while (this.target.firstChild) {
      this.target.removeChild(this.target.firstChild);
    }
    this.target.appendChild(this.headerElement);
    input.forEach(dataSource => {
      const root = new RootView({
        dataSource,
        renderer: this.renderer,
        transition: this.transition,
        screen: this.screen,
        draggable: this.draggable
      });

      root.renderTo(this.target);
    });
  }
}
