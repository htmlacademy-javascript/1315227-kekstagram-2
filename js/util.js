const ALERT_SHOW_TIME = 5000;
const DEFAULT_DELAY = 500;

const SocialPictureSize = {
  WIDTH: 35,
  HEIGHT: 35
};

const errorFragment = document.querySelector('#data-error').content;
const errorTemplate = errorFragment.querySelector('.data-error');
const body = document.body;

let currentPopup = null;

const isEscapeKey = (evt) => evt.key === 'Escape';

const showErrorAlert = (message) => {
  const alert = errorTemplate.cloneNode(true);
  const alertTitle = alert.querySelector('.data-error__title');

  alertTitle.textContent = message;
  body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, ALERT_SHOW_TIME);
};

const showPopupMessage = (type) => {
  if (currentPopup) {
    return;
  }

  const fragment = document.querySelector(`#${type}`).content;
  const popup = fragment.querySelector(`.${type}`).cloneNode(true);
  const popupCloseButton = popup.querySelector(`.${type}__button`);

  const onDocumentClick = (evt) => {
    if (!evt.target.closest(`.${type}__inner`)) {
      closePopup();
    }
  };

  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closePopup();
    }
  };

  const onPopupCloseButtonClick = () => {
    closePopup();
  };

  function closePopup() {
    if (!currentPopup) {
      return;
    }

    popup.remove();
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKeydown);
    currentPopup = null;
  }

  popupCloseButton.addEventListener('click', onPopupCloseButtonClick);
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onDocumentKeydown);
  body.appendChild(popup);

  currentPopup = popup;
};

const createCommentMarkup = ({ avatar, message, name }) => {
  const comment = document.createElement('li');
  const commentImage = document.createElement('img');
  const commentText = document.createElement('p');

  commentText.classList.add('social__text');
  commentImage.classList.add('social__picture');
  comment.classList.add('social__comment');

  commentImage.src = avatar;
  commentImage.alt = name;
  commentImage.width = SocialPictureSize.WIDTH;
  commentImage.height = SocialPictureSize.HEIGHT;
  commentText.textContent = message;

  comment.appendChild(commentImage);
  comment.appendChild(commentText);

  return comment;
};

const debounce = (callback, timeoutDelay = DEFAULT_DELAY) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), timeoutDelay);
  };
};

export { isEscapeKey, showErrorAlert, showPopupMessage, createCommentMarkup, debounce };
