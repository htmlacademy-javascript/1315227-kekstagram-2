import { isEscapeKey } from './util.js';

const COMMENTS_COUNT_STEP = 5;
let currentPhotoComments = [];
let shownCommentsCount = 0;

const body = document.body;
const pictures = document.querySelector('.pictures');
const preview = document.querySelector('.big-picture');
const previewImage = preview.querySelector('.big-picture__img img');
const previewCaption = preview.querySelector('.social__caption');
const previewLikes = preview.querySelector('.likes-count');
const previewComments = preview.querySelector('.social__comments');
const previewCommentsLoader = preview.querySelector('.social__comments-loader');
const previewCommentShownCount = preview.querySelector('.social__comment-shown-count');
const previewCommentAddField = preview.querySelector('.social__footer-text');
const previewCommentTotalCount = preview.querySelector('.social__comment-total-count');
const previewCloseButton = preview.querySelector('.big-picture__cancel');

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
    previewComments.insertAdjacentHTML(
      'beforeend',
      createCommentMarkup(currentPhotoComments[i])
    );
  }

  shownCommentsCount = end;
  previewCommentShownCount.textContent = shownCommentsCount;

  if (shownCommentsCount >= currentPhotoComments.length) {
    previewCommentsLoader.classList.add('hidden');
  }
};

const onCommentAddFieldKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const onCommentsLoaderClick = (evt) => {
  evt.preventDefault();
  renderCommentsStep();
};

const onPreviewCloseButtonClick = () => {
  closePreview();
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closePreview();
  }
};

const openPreview = (currentId, allPhotos) => {
  const currentPhoto = allPhotos.find((photo) => photo.id === Number(currentId));

  if (!currentPhoto) {
    return;
  }

  const { comments, description, likes, url } = currentPhoto;

  currentPhotoComments = comments;
  shownCommentsCount = 0;

  body.classList.add('modal-open');
  preview.classList.remove('hidden');
  previewComments.innerHTML = '';

  previewImage.src = url;
  previewCaption.textContent = description;
  previewLikes.textContent = likes.toString();
  previewCommentTotalCount.textContent = comments.length.toString();

  renderCommentsStep();

  previewCommentsLoader.classList.toggle('hidden', comments.length <= COMMENTS_COUNT_STEP);

  document.addEventListener('keydown', onDocumentKeydown);
};

const setPreview = (allPhotos) => {

  pictures.addEventListener('click', (evt) => {
    const targetPicture = evt.target.closest('.picture');

    if (targetPicture) {
      evt.preventDefault();
      const id = targetPicture.dataset.pictureId;
      openPreview(id, allPhotos);
    }
  });

  previewCommentsLoader.addEventListener('click', onCommentsLoaderClick);
  previewCloseButton.addEventListener('click', onPreviewCloseButtonClick);
  previewCommentAddField.addEventListener('keydown', onCommentAddFieldKeydown);
};

function closePreview() {
  body.classList.remove('modal-open');
  previewCommentsLoader.classList.remove('hidden');
  preview.classList.add('hidden');
  previewCommentAddField.value = '';

  document.removeEventListener('keydown', onDocumentKeydown);
}

export { setPreview };
