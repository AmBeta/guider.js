/**
 * Turns a string into a node
 * @param {string} htmlString to convert
 * @returns {HTMLElement|Node} converted node element
 */
export const createNodeFromString = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.firstChild;
};

/**
 * @returns {{ height: number, width: number }}
 */
export const getFullPageSize = () => {
  const { body, documentElement: html } = document;

  return {
    height: Math.max(body.scrollHeight, body.offsetHeight, html.scrollHeight, html.offsetHeight),
    width: Math.max(body.scrollWidth, body.offsetWidth, html.scrollWidth, html.offsetWidth),
  };
};

/**
 * Check if an element is visible
 * @param {HTMLElement} element target dom element
 */
export const isVisible = (element) => {
  const { offsetWidth, offsetHeight } = element;
  return offsetWidth > 0 && offsetHeight > 0;
};

export const queryVisibleElement = (queryString) => {
  const elements = document.querySelectorAll(queryString);
  return [].find.call(elements,
    (element) => isVisible(element));
};
