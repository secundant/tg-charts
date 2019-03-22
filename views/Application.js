import { Draggable, Renderer, ScreenModel, Transition } from '../models';
import styles from './style.scss';
import { createElementWithClassName } from '../utils/dom/createElement';
import { RootView } from './RootView';
import { listen } from '../utils/dom';

export const createApplication = (target, input) => {
  const screen = new ScreenModel();
  const renderer = new Renderer();
  const draggable = new Draggable();
  const transition = new Transition(renderer);
  const titleElement = createElementWithClassName(styles.Title, [], 'h1');
  const headerElement = createElementWithClassName(styles.Heading, [titleElement]);
  const toPrevInputElement = createElementWithClassName(styles.Prev);
  const toNextInputElement = createElementWithClassName(styles.Next);
  const switchThemeElement = createElementWithClassName(styles.Switch);
  const appControlsElement = createElementWithClassName(styles.Controls, [
    toPrevInputElement,
    switchThemeElement,
    toNextInputElement
  ]);
  const applicationElement = createElementWithClassName(styles.Application, [headerElement, appControlsElement]);

  listen(switchThemeElement, ['click'], () => applicationElement.classList.toggle(styles.DarkTheme));
  titleElement.textContent = 'Followers';
  switchThemeElement.textContent = 'Switch theme';
  target.appendChild(applicationElement);
  input.forEach(dataSource => {
    const root = new RootView({
      screen,
      renderer,
      draggable,
      transition,
      dataSource
    });

    root.renderTo(applicationElement);
  });

  renderer.set('application-init', () => screen.update());
};
