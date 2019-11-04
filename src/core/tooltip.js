import {
  HTML_TOOLTIP, CLASS_TOOLTIP_CARET, CLASS_TOOLTIP_TITLE, CLASS_TOOLTIP_DESCRIPTION,
  TOOLTIP_DISTANCE,
} from '../common/constants';
import Highlighter from './highlighter';
import { createNodeFromString, getFullPageSize } from '../common/utils';

export default class Tooltip extends Highlighter {
  constructor(target, options = {}) {
    super(target, options);

    this.target = target;
    this.options = {
      title: '',
      description: '',
      padding: 10,
      position: 'auto',
      ...options,
    };
  }

  attachNode() {
    const dom = createNodeFromString(HTML_TOOLTIP);
    document.body.appendChild(dom);

    this.node = dom;
    this.caretNode = dom.querySelector(`.${CLASS_TOOLTIP_CARET}`);
    this.titleNode = dom.querySelector(`.${CLASS_TOOLTIP_TITLE}`);
    this.descriptionNode = dom.querySelector(`.${CLASS_TOOLTIP_DESCRIPTION}`);

    this.titleNode.innerHTML = this.options.title;
    this.descriptionNode.innerHTML = this.options.description;
  }

  setInitialStyle() {
    Object.assign(this.node.style, {
      display: 'block',
      left: '0',
      top: '0',
      bottom: '',
      right: '',
    });
  }

  update() {
    const position = this.getTargetPosition();

    switch (this.options.position) {
      case 'left':
        this.positionOnLeft(position);
        break;
      case 'right':
        this.positionOnRight(position);
        break;
      case 'top':
        this.positionOnTop(position);
        break;
      case 'bottom':
        this.positionOnBottom(position);
        break;
      case 'auto':
      default:
        this.autoPosition(position);
        break;
    }
  }

  /**
   * Shows the tooltip on the left of the given position.
   * @param {Object} position target position
   * @private
   */
  positionOnLeft(position) {
    const { padding } = this.options;
    const tooltipWidth = this.getSize().width;
    const tooltipMargin = padding + TOOLTIP_DISTANCE;

    Object.assign(this.node.style, {
      left: `${position.left - tooltipWidth - tooltipMargin}px`,
      top: `${position.top - padding}px`,
      right: '',
      bottom: '',
    });

    this.caretNode.classList.add('right');
  }

  positionOnRight(position) {
    const { padding } = this.options;
    const tooltipMargin = padding + TOOLTIP_DISTANCE;

    Object.assign(this.node.style, {
      left: `${position.right + tooltipMargin}px`,
      top: `${position.top - padding}px`,
      right: '',
      bottom: '',
    });

    this.caretNode.classList.add('left');
  }

  positionOnTop(position) {
    const { padding } = this.options;
    const { height: tooltipHeight } = this.getSize();
    const tooltipMargin = padding + TOOLTIP_DISTANCE;

    Object.assign(this.node.style, {
      left: `${position.left - padding}px`,
      top: `${position.top - tooltipHeight - tooltipMargin}px`,
      right: '',
      bottom: '',
    });

    this.caretNode.classList.add('bottom');
  }

  positionOnBottom(position) {
    const { padding } = this.options;
    const tooltipMargin = padding + TOOLTIP_DISTANCE;

    Object.assign(this.node.style, {
      left: `${position.left - padding}px`,
      top: `${position.bottom + tooltipMargin}px`,
      right: '',
      bottom: '',
    });

    this.caretNode.classList.add('top');
  }

  autoPosition(position) {
    const pageSize = getFullPageSize();
    const tooltipSize = this.getSize();

    const pageHeight = pageSize.height;
    const tooltipHeight = tooltipSize.height;
    const tooltipMargin = this.options.padding + TOOLTIP_DISTANCE;

    const pageHeightAfterShow = position.bottom + tooltipHeight + tooltipMargin;

    if (pageHeightAfterShow >= pageHeight) {
      this.positionOnTop(position);
    } else {
      this.positionOnBottom(position);
    }
  }
}
