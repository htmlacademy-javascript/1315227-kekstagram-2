import { photos } from './data.js';
import { isEscapeKey } from './util.js';

const COMMENTS_COUNT_STEP = 5;
let currentPhotoComments = [];
let shownCommentsCount = 0;

const pictures = document.querySelector('.pictures');
const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const bigPictureCaption = bigPicture.querySelector('.social__caption');
const bigPictureLikes = bigPicture.querySelector('.likes-count');
const bigPictureComments = bigPicture.querySelector('.social__comments');
const bigPictureCommentsLoader = bigPicture.querySelector('.social__comments-loader');
const bigPictureCommentShownCount = bigPicture.querySelector('.social__comment-shown-count');
const bigPictureCommentTotalCount = bigPicture.querySelector('.social__comment-total-count');
const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');

const createCommentMarkup = ({ avatar, message, name }) => `<li class="social__comment">
  <img
    class="social__picture"
    src="${avatar}"
    alt="${name}"
    width="35" height="35">
  <p class="social__text">${message}</p>
</li>`;

const renderCommentsStep = () => {
  const start = shownCommentsCount;
  const end = Math.min(start + COMMENTS_COUNT_STEP, currentPhotoComments.length);

  for (let i = start; i < end; i++) {
    bigPictureComments.insertAdjacentHTML(
      'beforeend',
      createCommentMarkup(currentPhotoComments[i])
    );
  }

  shownCommentsCount = end;
  bigPictureCommentShownCount.textContent = shownCommentsCount;

  if (shownCommentsCount >= currentPhotoComments.length) {
    bigPictureCommentsLoader.classList.add('hidden');
  }
};

const onCommentsLoaderClick = (evt) => {
  evt.preventDefault();
  renderCommentsStep();
};

const onBigPictureCloseClick = () => {
  closePicturePreview();
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closePicturePreview();
  }
};

const openPicturePreview = (currentId) => {
  const currentPhoto = photos.find((photo) => photo.id === Number(currentId));

  if (!currentPhoto) {
    return;
  }

  const { comments, description, likes, url } = currentPhoto;

  currentPhotoComments = comments;
  shownCommentsCount = 0;

  document.body.classList.add('modal-open');
  bigPicture.classList.remove('hidden');
  bigPictureComments.innerHTML = '';

  bigPictureImage.src = url;
  bigPictureCaption.textContent = description;
  bigPictureLikes.textContent = likes;
  bigPictureCommentTotalCount.textContent = comments.length;

  renderCommentsStep();

  if (comments.length <= COMMENTS_COUNT_STEP) {
    bigPictureCommentsLoader.classList.add('hidden');
  } else {
    bigPictureCommentsLoader.classList.remove('hidden');
  }

  document.addEventListener('keydown', onDocumentKeydown);
  bigPictureCommentsLoader.addEventListener('click', onCommentsLoaderClick);
  bigPictureCloseButton.addEventListener('click', onBigPictureCloseClick);
};

let isBigPictureInitialized = false;

const initBigPicturePreview = () => {
  if (isBigPictureInitialized) {
    return;
  }

  pictures.addEventListener('click', (evt) => {
    const targetPicture = evt.target.closest('.picture');

    if (targetPicture) {
      evt.preventDefault();
      const id = targetPicture.dataset.pictureId;
      openPicturePreview(id);
    }
  });

  isBigPictureInitialized = true;
};

function closePicturePreview() {
  document.body.classList.remove('modal-open');
  bigPictureCommentsLoader.classList.remove('hidden');
  bigPicture.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydown);
  bigPictureCloseButton.removeEventListener('click', onBigPictureCloseClick);
  bigPictureCommentsLoader.removeEventListener('click', onCommentsLoaderClick);
}

export { initBigPicturePreview };
