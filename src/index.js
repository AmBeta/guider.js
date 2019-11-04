import Element from './core/element';
import {
  HTML_TOOLTIP_TITLE, STATUS_READY, STATUS_MOVING, STATUS_FINISHED,
  STATUS_TARGET_WATCH, STATUS_TARGET_LOST, STATUS_TARGET_QUERY,
} from './common/constants';
import { queryVisibleElement, isVisible } from './common/utils';

const MOUSE_EVENTS = [
  'click', 'dblclick',
  'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout',
];

export default class Guider {
  constructor(options = {}) {
    this.options = {
      padding: 5,
      // restrict actions in defined scope
      restrictInScope: true,

      // TODO: hook when start
      onStart: () => {},
      onFinish: () => {},
      beforeNext: () => {},
      beforePrev: () => {},
      beforeJump: () => {},
      afterJump: () => {},

      ...options,
    };

    this.observer = new MutationObserver(this.onDomMutate.bind(this));
    this.onMouseAction = this.onMouseAction.bind(this);
    this.attachEvents();

    this.reset();
  }

  /** @private */
  attachEvents() {
    // Bind mouse event
    MOUSE_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, this.onMouseAction, true);
    });
    // Observe dom mutation
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  /** @private */
  dettachEvents() {
    MOUSE_EVENTS.forEach((eventName) => {
      document.removeEventListener(eventName, this.onMouseAction);
    });
    this.observer.disconnect();
  }

  /**
   * Mouse event handler
   * @private
   */
  onMouseAction(e) {
    if (this.options.restrictInScope && !this.isInScope(e.target, e)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    if (!this.isActive()) {
      return;
    }

    if (this.isTrigger(e.type, e.target)) {
      this.goNextStep();
    }
  }

  /**
   * MutationObserver callback
   * @private
   */
  onDomMutate(mutation) {
    // update elements position
    this.currentElements.forEach((element) => {
      if (
        mutation.some((record) => record.target.contains(element.node))
      ) {
        element.update();
      }
    });
    // check step elements accessability
    switch (this.status) {
      case STATUS_TARGET_QUERY:
        this.showStep(this.currentStep);
        break;
      case STATUS_TARGET_WATCH: {
        const hasLost = this.currentElements.some(
          (element) => !isVisible(element.node),
        );
        if (hasLost) {
          this.setStatus(STATUS_TARGET_LOST);
          this.goPrevStep();
        } else if (this.currentStep < this.reachedStep) {
          // try to jump to the farthest step reached before
          this.jumpToStep(this.reachedStep);
        }
        break;
      }
      default:
        break;
    }
  }

  /** @private */
  isActive() {
    return this.currentElements.length > 0;
  }

  /** @private */
  isTrigger(type, target) {
    return this.currentTriggers.some((element) => {
      if (element.triggerType !== type) return false;
      return element.node.contains(target);
    });
  }

  /** @private */
  isInScope(target, event) {
    const { restrictInScope } = this.options;
    const isInUserScope = typeof restrictInScope === 'function'
      && restrictInScope(target, event);

    if (isInUserScope) return true;

    return this.currentElements.some(
      (element) => element.node.contains(target),
    );
  }

  /** @private */
  canGoNext() {
    return this.currentStep < this.steps.length - 1;
  }

  /** @private */
  canGoPrev() {
    return this.currentStep > 0;
  }

  /**
   * Set current status of guider
   * @param {number} status guider status
   * @private
   */
  setStatus(status) {
    this.status = status;
  }

  /**
   * Reset guider status
   */
  reset() {
    if (this.currentElements) {
      this.currentElements.forEach(
        (element) => element.dismiss(),
      );
    }

    this.status = STATUS_READY;
    this.steps = [];
    /** @type {number} current step */
    this.currentStep = 0;
    /** @type {number} step last reached */
    this.reachedStep = 0;
    /** @type {Element[]} */
    this.currentElements = [];
    /** @type {Element[]} */
    this.currentTriggers = [];
  }

  /**
   * Destroy guider instance and do cleanup
   */
  destroy() {
    this.reset();
    this.dettachEvents();
  }

  /**
   * Set all the steps
   * @param {Array} steps steps configuration
   */
  setSteps(steps = []) {
    this.steps = steps;
  }

  /**
   * Run steps from the given index
   * @param {number} index start step index
   */
  start(index = 0) {
    if (!this.steps || !this.steps[index]) {
      throw new Error('There is no step to start from.');
    }
    this.currentStep = index;
    this.showStep(this.currentStep);
  }

  finish() {
    this.options.onFinish();
    this.reset();
    this.setStatus(STATUS_FINISHED);
  }

  /**
   * Make a step forward.
   */
  async goNextStep() {
    if (this.status === STATUS_MOVING) return;

    const nextStep = this.currentStep + 1;
    const lastStatus = this.status;
    this.setStatus(STATUS_MOVING);

    const shouldGoNext = await Promise.resolve(
      this.options.beforeNext(this.currentStep, nextStep),
    );
    if (shouldGoNext === false) {
      this.setStatus(lastStatus);
      return;
    }

    if (!this.canGoNext()) {
      // all steps get finished
      this.finish();
      return;
    }

    this.currentStep = nextStep;
    this.showStep(this.currentStep);
  }

  /**
   * Make a step backward.
   */
  async goPrevStep() {
    if (this.status === STATUS_MOVING) return;

    let nextStep = this.currentStep - 1;
    const lastStatus = this.status;
    if (this.status !== STATUS_TARGET_LOST) {
      this.setStatus(STATUS_MOVING);
    }

    const shouldGoPrev = await Promise.resolve(
      this.options.beforePrev(this.currentStep, nextStep),
    );
    if (shouldGoPrev === false) {
      this.setStatus(lastStatus);
      return;
    }

    if (!this.canGoPrev()) {
      nextStep = 0;
      this.setStatus(STATUS_TARGET_QUERY);
    }

    this.currentStep = nextStep;
    if (this.showStep(nextStep) === false
      && this.status === STATUS_TARGET_LOST
      && this.canGoPrev()
    ) {
      this.goPrevStep();
    }
  }

  async jumpToStep(index) {
    const nextStep = index;
    const lastStatus = this.status;
    this.setStatus(STATUS_MOVING);

    if (this.options.beforeJump) {
      const shouldJump = await Promise.resolve(
        this.options.beforeJump(this.currentStep, nextStep),
      );
      if (shouldJump === false) return;
    }

    if (this.showStep(nextStep, false)) {
      this.currentStep = nextStep;
      if (this.options.afterJump) {
        this.options.afterJump(nextStep);
      }
    } else {
      // restore status
      this.setStatus(lastStatus);
    }
  }

  /**
   * Show a specific step,
   * returns `true` if succeeded, otherwise `false`.
   * @param {number} index show step of the given index
   * @param {boolean} keepQuerying do keep querying when not found
   * @returns {boolean}
   * @private
   */
  showStep(index, keepQuerying = true) {
    // show the current elements
    const parsedStep = this.parseStep(index);
    if (!parsedStep) {
      if (keepQuerying && this.status !== STATUS_TARGET_LOST) {
        // keep querying targets
        this.setStatus(STATUS_TARGET_QUERY);
      }
      return false;
    }

    // hide the former elements
    const formerElements = this.currentElements;
    formerElements.forEach((element) => element.dismiss());

    const { elements, triggers } = this.parseStep(index);
    const currentElements = elements;
    currentElements.forEach((element) => element.highlight());

    if (this.reachedStep < index) this.reachedStep = index;
    this.currentElements = elements;
    this.currentTriggers = triggers;
    // watch for target change
    this.setStatus(STATUS_TARGET_WATCH);

    return true;
  }

  /**
   * Transform step definition into *elements* and *triggers*, where
   *   - elements: element to be highlighted
   *   - triggers: element acting as a trigger to next step
   *
   * As step may be an array containing multiple targets,
   * the returned elements and triggers are both of type array.
   *
   * @param {number} index index of the step
   * @returns {{ elements: Element[], triggers: Element[] }}
   * @private
   */
  parseStep(index) {
    const step = this.steps[index];
    const elementCfgs = [].concat(step);

    const elements = [];

    for (let i = 0, len = elementCfgs.length; i < len; i += 1) {
      const { element, ...options } = elementCfgs[i];

      if (!element) {
        throw new Error(`element is required in step ${index}`);
      }

      const domElement = typeof element === 'string'
        ? queryVisibleElement(element) : element;

      // target not found, returns null
      if (!domElement) return null;

      const elementOptions = { ...this.options, ...options };
      let tooltipOptions = elementOptions.tooltip;
      if (typeof tooltipOptions === 'string') {
        tooltipOptions = { description: tooltipOptions };
      }
      elements.push(new Element(domElement, {
        ...this.options,
        ...options,
        tooltip: tooltipOptions && {
          ...tooltipOptions,
          title: HTML_TOOLTIP_TITLE(index + 1, this.steps.length, tooltipOptions.title),
        },
      }));
    }

    return {
      elements,
      triggers: elements.filter(
        (element) => element.isTrigger(),
      ),
    };
  }
}
