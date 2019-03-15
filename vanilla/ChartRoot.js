import style from './style.scss';
import { createButton, createButtonsGroup } from './views';
import { el } from '../utils/dom/createElement';
import { ChartCanvas } from './ChartCanvas';

export class ChartRoot {
  constructor({ dataSource, target }) {
    const buttonsElements = [];

    this.target = target;
    this.dataSource = dataSource;
    this.disabled = new Set();
    this.buttons = new Map();
    this.mainChartElement = el('div', {
      class: style.Graph
    });
    this.previewChartElement = el('div', {
      class: style.Preview
    }, [
      el('div', {
        class: style.PlaceholderBlock
      })
    ]);
    this.canvas = new ChartCanvas({
      dataSource,
      disabled: this.disabled
    });

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
    this.mainChartElement.appendChild(this.canvas.svg);
    this.target.appendChild(this.mainChartElement);
    this.target.appendChild(this.buttonsGroupElement);
    this.canvas.sync({
      width: document.body.offsetWidth,
      height: 300,
      offset: 10,
      visible: 50
    });
  }
}
