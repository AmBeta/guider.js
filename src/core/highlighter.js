import { HTML_HIGHLIGHTER, CLASS_MASK } from '../common/constants';
import { createNodeFromString } from '../common/utils';

export default class Highlighter {
  /**
   * Dom element highlighter
   * @param {HTMLElement} target
   * @param {Object} options
   */
  constructor(target, options = {}) {
    this.target = target;
    this.options = {
      mask: false,
      ...options,
    };

    // current position of the highlighter
    this.position = {};
  }

  /**
   * Prepares the DOM element
   * @private
   */
  attachNode() {
    const dom = createNodeFromString(HTML_HIGHLIGHTER);
    document.body.appendChild(dom);

    if (this.options.mask) {
      dom.classList.add(CLASS_MASK);
    }

    this.node = dom;
  }

  /**
   * Makes it visible and sets the default styles
   * @private
   */
  setInitialStyle() {
    this.position = { left: 0, top: 0, width: 0, height: 0 };
    Object.assign(this.node.style, {
      display: 'block',
      ...this.position,
    });
  }

  /**
   * Get the highlighter size
   */
  getSize() {
    return {
      height: Math.max(this.node.scrollHeight, this.node.offsetHeight),
      width: Math.max(this.node.scrollWidth, this.node.offsetWidth),
    };
  }

  /**
   * Get the highlighter position
   */
  getPosition() {
    const { top, left, width, height } = this.position;
    return { top, left, width, height };
  }

  /**
   * Get target node position
   * @private
   */
  getTargetPosition() {
    const scrollTop = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop;
    const scrollLeft = window.pageXOffset
      || document.documentElement.scrollLeft
      || document.body.scrollLeft;
    const elementRect = this.target.getBoundingClientRect();

    return {
      top: elementRect.top + scrollTop,
      left: elementRect.left + scrollLeft,
      right: elementRect.left + scrollLeft + elementRect.width,
      bottom: elementRect.top + scrollTop + elementRect.height,
    };
  }

  /**
   * Hide and remove the highlighter
   */
  hide() {
    if (!this.node || !this.node.parentElement) {
      return;
    }
    this.node.parentElement.removeChild(this.node);
  }

  /**
   * Update the highlighter position according to target
   */
  update() {
    const position = this.getTargetPosition();

    const { padding } = this.options;
    const requiredPadding = padding * 2;

    this.position = {
      top: position.top - padding,
      left: position.left - padding,
      width: (position.right - position.left) + (requiredPadding),
      height: (position.bottom - position.top) + (requiredPadding),
    };
    Object.assign(this.node.style, {
      display: 'block',
      position: 'absolute',
      top: `${this.position.top}px`,
      left: `${this.position.left}px`,
      width: `${this.position.width}px`,
      height: `${this.position.height}px`,
    });
  }

  /**
   * Shows the highlighter around the target
   */
  show() {
    this.attachNode();

    this.setInitialStyle();
    this.update();
  }
}
