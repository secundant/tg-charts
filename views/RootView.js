import { DataSource, Draggable, Renderer, ScreenModel, Transition, ViewBoxModel } from '../models';
import { el } from '../utils/dom/createElement';
import { createButton, createButtonsGroupElement } from './createButton';
import { SVGCanvasView } from './SVGCanvasView';
import { PositionControlView } from './PositionControlView';
import style from './style.scss';
import { appendChildren } from '../utils/dom/append';

export class RootView {
  /**
   * @param {Object} dataSource
   * @param {Renderer} renderer
   * @param {Transition} transition
   * @param {ScreenModel} screen
   * @param {Draggable} draggable
   */
  constructor({ dataSource, renderer, transition, screen, draggable }) {
    this.dataSource = new DataSource(dataSource);
    this.transition = transition;
    this.draggable = draggable;
    this.renderer = renderer;
    this.screen = screen;
    this.viewBox = new ViewBoxModel({
      dataSource: this.dataSource,
      screen: this.screen,
      height: 280,
      padding: 10,
      transition: this.transition
    });
    this.previewViewBox = new ViewBoxModel({
      dataSource: this.dataSource,
      screen: this.screen,
      height: 60,
      offset: 0,
      visible: 100,
      padding: 4,
      transition: this.transition
    });
    this.mainCanvasView = new SVGCanvasView({
      viewBox: this.viewBox,
      dataSource: this.dataSource,
      renderer: this.renderer
    });
    this.previewCanvasView = new SVGCanvasView({
      viewBox: this.previewViewBox,
      dataSource: this.dataSource,
      strokeWidth: 1,
      renderer: this.renderer
    });
    this.positionControlView = new PositionControlView({
      draggable: this.draggable,
      viewBox: this.viewBox,
      renderer: this.renderer
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
    this.dataSource.dataSets.forEach(dataSet =>
      this.buttonsGroupElement.appendChild(createButton(dataSet, this.renderer))
    );
  }

  renderTo(element) {
    const fragment = document.createDocumentFragment();

    appendChildren(fragment, [this.mainChartElement, this.previewChartElement, this.buttonsGroupElement]);
    element.appendChild(fragment);
    requestAnimationFrame(() => {
      this.screen.update();
    });
  }
}
