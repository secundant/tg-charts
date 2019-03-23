import style from './style.scss';
import { createElementWithClassName, el } from '../utils/dom/createElement';
import { listen, nextID, setClassName } from '../utils';

export function createButtonsGroupElement() {
  return createElementWithClassName(style.ButtonsGroup);
}

export function createButton(dataSet, renderer) {
  const { color, title } = dataSet;
  const id = nextID();

  const label = createElementWithClassName(style.Label);
  const element = createElementWithClassName(
    style.Button + ' ' + style.checked,
    [
      el(
        'div',
        {
          class: style.Status,
          style: `background-color: ${color}`
        },
        [createElementWithClassName(style.Circle), createElementWithClassName(style.Check)]
      ),
      label
    ],
    'button'
  );
  const paint = () => setClassName(element, style.checked, !dataSet.disabled);
  const update = () => renderer(id, paint);

  label.textContent = title;
  dataSet.subscribe(update);
  listen(element, ['click'], () => dataSet.set(!dataSet.disabled));
  return element;
}
