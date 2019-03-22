import { Draggable, Renderer, ScreenModel, Transition } from '../models';
import style from './style.scss';
import { createElementWithClassName } from '../utils/dom/createElement';
import { createRootView } from './RootView';
import { appendChild, applyClassList, CLASS_LIST_METHOD_TOGGLE, listen } from '../utils/dom';
import { forEach } from '../utils/fn';

export const createApplication = (target, input) => {
  const screen = new ScreenModel();
  const renderer = new Renderer();
  const draggable = new Draggable();
  const transition = new Transition(renderer);
  const titleElement = createElementWithClassName(style.Title, [], 'h1');
  const headerElement = createElementWithClassName(style.Heading, [titleElement]);
  const toPrevInputElement = createElementWithClassName(style.Prev);
  const toNextInputElement = createElementWithClassName(style.Next);
  const switchThemeElement = createElementWithClassName(style.Switch);
  const appControlsElement = createElementWithClassName(style.Controls, [
    toPrevInputElement,
    switchThemeElement,
    toNextInputElement
  ]);
  const applicationElement = createElementWithClassName(style.Application, [headerElement, appControlsElement]);

  listen(switchThemeElement, ['click'], () =>
    applyClassList(applicationElement, style.DarkTheme, CLASS_LIST_METHOD_TOGGLE)
  );
  titleElement.textContent = 'Followers';
  switchThemeElement.textContent = 'Switch theme';
  appendChild(target, applicationElement);
  forEach(input, dataSource => appendChild(applicationElement, createRootView(
    dataSource, renderer, transition, screen, draggable
  )));

  renderer.set('application-init', () => screen.update());
};
