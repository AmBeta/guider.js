const PACKAGE_NAME = 'guider';

/** guider is ready */
export const STATUS_READY = 0;
/** step target not found, waiting for dom mutation and query */
export const STATUS_TARGET_QUERY = 1;
/** watch for step target mutation */
export const STATUS_TARGET_WATCH = 2;
/** step target out of view */
export const STATUS_TARGET_LOST = 3;
/** guider finished running all steps */
export const STATUS_FINISHED = 4;
/** guider is on moving */
export const STATUS_MOVING = 5;

export const CLASS_OVERLAY = `${PACKAGE_NAME}_overlay`;
export const CLASS_HIGHLIGHTER = `${PACKAGE_NAME}_highlighter`;
export const CLASS_MASK = 'with-mask';
export const CLASS_TOOLTIP = `${PACKAGE_NAME}_tooltip`;
export const CLASS_TOOLTIP_CARET = `${CLASS_TOOLTIP}-caret`;
export const CLASS_TOOLTIP_TITLE = `${CLASS_TOOLTIP}-title`;
export const CLASS_TOOLTIP_DESCRIPTION = `${CLASS_TOOLTIP}-description`;

export const TOOLTIP_DISTANCE = 10;
/** Time for mask animation, DO MODIFY THE CORRESPONDING SCSS VAR */
export const MASK_ANIM_TIME = 300;
/** Border width for highlighter, DO MODIFY THE CORRESPONDING SCSS VAR! */
export const HIGHLIGHTER_BORDER_WIDTH = 2;

export const HTML_OVERLAY = `<div class="${CLASS_OVERLAY}"></div>`;
export const HTML_HIGHLIGHTER = `<div class="${CLASS_HIGHLIGHTER}"></div>`;
export const HTML_TOOLTIP = `
  <div class="${CLASS_TOOLTIP}">
    <div class="${CLASS_TOOLTIP_CARET}"></div>
    <div class="${CLASS_TOOLTIP_TITLE}"></div>
    <div class="${CLASS_TOOLTIP_DESCRIPTION}"></div>
  </div>
`;
export const HTML_TOOLTIP_TITLE = (index, total, title = '') => `
  <div class="${CLASS_TOOLTIP_TITLE}-content">
    第<span class="${CLASS_TOOLTIP_TITLE}-index">${index}/${total}</span>步
    &nbsp;&nbsp;${title}
  </div>
`;
