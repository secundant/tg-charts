import { createDraggable, createRenderer, createTransition, GlobalStateModel, ScreenModel } from '../models';
import style from './style.scss';
import { createElementWithClassName } from '../utils/dom/createElement';
import { createRootView } from './RootView';
import { appendChild, listen, setClassName } from '../utils/dom';
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
  const paintTheme = () => {
    setClassName(applicationElement, style.DarkTheme, globalState.theme === 'dark');
    switchThemeElement.textContent = `Switch to ${globalState.theme === 'dark' ? 'Day' : 'Night'} Mode`;
  };

  listen(switchThemeElement, ['click'], () => {
    globalState.setTheme(globalState.theme === 'light' ? 'dark' : 'light');
  });
  globalState.subscribe(() => renderer('application-theme', paintTheme));
  titleElement.textContent = 'Followers';
  switchThemeElement.textContent = 'Switch theme';
  appendChild(target, applicationElement);
  forEach(input, dataSource =>
    appendChild(applicationElement, createRootView(dataSource, renderer, transition, screen, draggable, globalState))
  );

  renderer('application-init', () => screen.update());
};
