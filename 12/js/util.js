const ALERT_SHOW_TIME = 5000;

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

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

export { getRandomInteger, getRandomArrayElement, isEscapeKey, showDataErrorAlert };
