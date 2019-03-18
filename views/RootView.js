import { DataSource, Draggable, ScreenModel, ViewBoxModel } from '../models';
import { el } from '../utils/dom/createElement';
import { createButton, createButtonsGroupElement } from './createButton';
import { SVGCanvasView } from './SVGCanvasView';
import { PositionControlView } from './PositionControlView';
import style from '../vanilla/style.scss';

export class RootView {
  constructor(dataSource) {
    this.screen = new ScreenModel();
    this.dataSource = new DataSource(dataSource);
    this.draggable = new Draggable();
    this.viewBox = new ViewBoxModel({
      dataSource: this.dataSource,
      screen: this.screen,
      height: 280,
      padding: 10
    });
    this.previewViewBox = new ViewBoxModel({
      dataSource: this.dataSource,
      screen: this.screen,
      height: 60,
      offset: 0,
      visible: 100,
      padding: 4
    });
    this.mainCanvasView = new SVGCanvasView({
      viewBox: this.viewBox,
      dataSource: this.dataSource
    });
    this.previewCanvasView = new SVGCanvasView({
      viewBox: this.previewViewBox,
      dataSource: this.dataSource,
      strokeWidth: 1
    });
    this.positionControlView = new PositionControlView({
      draggable: this.draggable,
      viewBox: this.viewBox
    });
    this.mainChartElement = el('div', {
      class: style.Graph
    });
    this.previewChartElement = el('div', {
      class: style.Preview
    });
    this.mainCanvasView.renderTo(this.mainChartElement);
    this.previewCanvasView.renderTo(this.previewChartElement);
    this.positionControlView.renderTo(this.previewChartElement);
    this.buttonsGroupElement = createButtonsGroupElement();
    this.dataSource.dataSets.forEach(dataSet => this.buttonsGroupElement.appendChild(createButton(dataSet)));
  }

  renderTo(element) {
    const fragment = document.createDocumentFragment();

    fragment.appendChild(this.mainChartElement);
    fragment.appendChild(this.previewChartElement);
    fragment.appendChild(this.buttonsGroupElement);
    element.appendChild(fragment);
    requestAnimationFrame(() => {
      this.screen.update();
    });
  }
}
