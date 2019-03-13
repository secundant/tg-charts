import { createButton, createButtonsGroup } from './views';

export class ChartRoot {
  constructor({ dataSource, target }) {
    const buttonsElements = [];

    this.target = target;
    this.dataSource = dataSource;
    this.disabled = new Set();
    this.buttons = new Map();

    for (const name of dataSource.names) {
      const { title, color } = dataSource.dataSets.get(name);
      const button = createButton({
        color,
        title
      });

      buttonsElements.push(button.element);
      button.element.addEventListener('click', this.createDataSetSwitcher(name), false);
      this.buttons.set(name, button);
    }
    this.buttonsGroupElement = createButtonsGroup(buttonsElements);
  }

  createDataSetSwitcher(name) {
    return () => {
      const checked = !this.disabled.has(name);

      console.log('CLICK:', checked);
      if (!checked) {
        this.disabled.delete(name);
      } else {
        this.disabled.add(name);
      }
      this.buttons.get(name).setChecked(checked);
    }
  }

  render() {
    this.target.appendChild(this.buttonsGroupElement);
  }
}
