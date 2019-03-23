import { createDraggable, createRenderer, createTransition, GlobalStateModel, ScreenModel } from '../models';
import style from './style.scss';
import { createElementWithClassName } from '../utils/dom/createElement';
import { createRootView } from './RootView';
import { appendChild, applyClassList, CLASS_LIST_METHOD_TOGGLE, listen } from '../utils/dom';
import { forEach } from '../utils/fn';

export const createApplication = (target, input) => {
  const globalState = new GlobalStateModel();
  const screen = new ScreenModel();
  const renderer = createRenderer();
  const draggable = createDraggable();
  const transition = createTransition(renderer);
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
  forEach(input, dataSource =>
    appendChild(applicationElement, createRootView(dataSource, renderer, transition, screen, draggable, globalState))
  );

  renderer('application-init', () => screen.update());
};
