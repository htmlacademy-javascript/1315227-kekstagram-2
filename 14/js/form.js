import { isEscapeKey } from './util.js';

const COMMENTS_MAX_CHARACTERS = 140;
const HASHTAGS_MAX_LENGTH = 5;
const HASHTAGS_MAX_CHARACTERS = 20;

const ErrorMessage = {
  MAX_CHARACTERS_FOR_HASHTAGS: `максимальная длина одного хэштега ${HASHTAGS_MAX_CHARACTERS} символов`,
  INVALID_LEADING_HASH: 'хэштег должен начинаться с символа #',
  INVALID_PATTERN_FOR_HASHTAGS: 'введён невалидный хэштег',
  EXCEEDED_NUMBER_FOR_HASHTAGS: 'превышено количество хэштегов',
  REPEATED_FOR_HASHTAGS: 'хэштеги повторяются',
  ONLY_HASH_SYMBOL: 'хэштег не может состоять только из символа #',
  MAX_LENGTH_FOR_COMMENTS: `длина комментария больше ${COMMENTS_MAX_CHARACTERS} символов`
};

const form = document.querySelector('#upload-select-image');
const formHashtagsField = form.querySelector('[name="hashtags"]');
const formCommentsField = form.querySelector('[name="description"]');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
}, true);

let lastErrorMessage = '';

const regexp = /^#[a-zа-яё0-9]+$/i;
const getHashtagsArray = (value) => value.trim().split(/\s+/).filter(Boolean);
const isUniqueHashtags = (array) => array.every((item, index) => array.indexOf(item) === index);
const validateComments = (value) => value.length <= COMMENTS_MAX_CHARACTERS;

const validateHashtags = (value) => {

  if (value.trim() === '') {
    return true;
  }

  const hashtags = getHashtagsArray(value);
  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  if (hashtags.length > HASHTAGS_MAX_LENGTH) {
    lastErrorMessage = ErrorMessage.EXCEEDED_NUMBER_FOR_HASHTAGS;
    return false;
  }

  if (!isUniqueHashtags(lowerCaseHashtags)) {
    lastErrorMessage = ErrorMessage.REPEATED_FOR_HASHTAGS;
    return false;
  }

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      lastErrorMessage = ErrorMessage.INVALID_LEADING_HASH;
      return false;
    }

    if (hashtag === '#') {
      lastErrorMessage = ErrorMessage.ONLY_HASH_SYMBOL;
      return false;
    }

    if (hashtag.length > HASHTAGS_MAX_CHARACTERS) {
      lastErrorMessage = ErrorMessage.MAX_CHARACTERS_FOR_HASHTAGS;
      return false;
    }

    if (!regexp.test(hashtag)) {
      lastErrorMessage = ErrorMessage.INVALID_PATTERN_FOR_HASHTAGS;
      return false;
    }
  }

  return true;
};

const getHashtagsErrorMessage = () => lastErrorMessage;

const onHashtagFieldKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const onCommentFieldKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const setUploadFormSubmit = (onSubmit) => {
  formHashtagsField.addEventListener('keydown', onHashtagFieldKeydown);
  formCommentsField.addEventListener('keydown', onCommentFieldKeydown);

  pristine.addValidator(formHashtagsField, validateHashtags, getHashtagsErrorMessage);
  pristine.addValidator(formCommentsField, validateComments, ErrorMessage.MAX_LENGTH_FOR_COMMENTS);

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();

    if (isValid) {
      const data = new FormData(evt.target);
      onSubmit(data);
    }
  });
};

const validateReset = () => pristine.reset();

export { setUploadFormSubmit, validateReset };
