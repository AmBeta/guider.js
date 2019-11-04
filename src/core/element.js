import Highlighter from './highlighter';
import Tooltip from './tooltip';

export default class Element {
  /**
   * @param {HTMLElement} node the corresponding dom element
   * @param {object} options
   */
  constructor(node, options) {
    this.node = node;
    this.options = {
      trigger: false,
      tooltip: false,
      mask: false,
      ...options,
    };

    this.highlighted = false;
    this.triggerType = this.options.trigger === true
      ? 'click' : this.options.trigger;

    this.highlighter = new Highlighter(node, {
      ...this.options,
    });
    this.tooltip = this.options.tooltip
      && new Tooltip(node, {
        ...this.options,
        ...this.options.tooltip,
      });
  }

  isTrigger() {
    return this.options.trigger !== false;
  }

  isHighlighted() {
    return this.highlighted;
  }

  /**
   * Highlight current element
   */
  highlight() {
    this.highlighter.show();
    if (this.tooltip) this.tooltip.show();
    this.highlighted = true;
  }

  /**
   * Update element position
   */
  update() {
    this.highlighter.update();
    if (this.tooltip) this.tooltip.update();
  }

  /**
   * De-highlight current element
   */
  dismiss() {
    this.highlighter.hide();
    if (this.tooltip) this.tooltip.hide();
    this.highlighted = false;
  }
}
