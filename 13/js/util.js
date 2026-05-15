const ALERT_SHOW_TIME = 5000;
const DEFAULT_DELAY = 500;

const dataErrorFragment = document.querySelector('#data-error').content;
const dataErrorTemplate = dataErrorFragment.querySelector('.data-error');
const body = document.body;

const showDataErrorAlert = (message) => {
  const alert = dataErrorTemplate.cloneNode(true);
  const title = alert.querySelector('.data-error__title');

  title.textContent = message;
  body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, ALERT_SHOW_TIME);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

function debounce(callback, timeoutDelay = DEFAULT_DELAY) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

function throttle(callback, delayBetweenFrames = DEFAULT_DELAY) {
  let lastTime = 0;

  return (...rest) => {
    const now = new Date();

    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, rest);
      lastTime = now;
    }
  };
}

export { isEscapeKey, showDataErrorAlert, debounce, throttle };
