import { isEscapeKey } from './util.js';

const validateForm = () => {
  const COMMENTS_MAX_CHARACTERS = 140;
  const HASHTAGS_MAX_LENGTH = 5;
  const HASHTAGS_MAX_CHARACTERS = 20;

  const ErrorMessages = {
    MAX_CHARACTERS_FOR_HASHTAGS: `максимальная длина одного хэштега ${HASHTAGS_MAX_CHARACTERS} символов`,
    INVALID_LEADING_HASH: 'хэштег должен начинаться с символа #',
    INVALID_PATTERN_FOR_HASHTAGS: 'введён невалидный хэштег',
    EXCEEDED_NUMBER_FOR_HASHTAGS: 'превышено количество хэштегов',
    REPEATED_FOR_HASHTAGS: 'хэштеги повторяются',
    ONLY_HASH_SYMBOL: 'хэштег не может состоять только из символа #',
    MAX_LENGTH_FOR_COMMENTS: `длина комментария больше ${COMMENTS_MAX_CHARACTERS} символов`
  };

  const uploadImageForm = document.querySelector('#upload-select-image');
  const hashtagsField = uploadImageForm.querySelector('[name="hashtags"]');
  const commentsField = uploadImageForm.querySelector('[name="description"]');
  const fieldsToValidate = [hashtagsField, commentsField];

  const pristine = new Pristine(uploadImageForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error',
    errorTextParent: 'img-upload__field-wrapper',
  }, true);

  const getHashtagsArray = (value) => value.trim().split(/\s+/).filter(Boolean);
  const isUniqueHashtags = (array) => array.every((item, index) => array.indexOf(item) === index);

  const validateComments = (value) => value.length <= COMMENTS_MAX_CHARACTERS;
  const validateMaxLengthHashtags = (value) => getHashtagsArray(value).length <= HASHTAGS_MAX_LENGTH;
  const validateLeadingHash = (value) => getHashtagsArray(value).every((hashtag) => hashtag.startsWith('#'));
  const validateMaxCharactersHashtags = (value) => getHashtagsArray(value).every((hashtag) => hashtag.length <= HASHTAGS_MAX_CHARACTERS);
  const validateNotOnlyHash = (value) => !getHashtagsArray(value).some((hashtag) => hashtag === '#');

  const validateRepeatedHashtags = (value) => {
    const hashtags = getHashtagsArray(value);
    const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());
    return isUniqueHashtags(lowerCaseHashtags);
  };

  const validatePatternHashtags = (value) => {
    const regexp = /^#[a-zа-яё0-9]+$/i;
    return getHashtagsArray(value).every((hashtag) => regexp.test(hashtag));
  };

  const onHashtagsFieldsKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  };

  const onCommentsFieldsKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.stopPropagation();
    }
  };

  hashtagsField.addEventListener('keydown', onHashtagsFieldsKeydown);
  commentsField.addEventListener('keydown', onCommentsFieldsKeydown);

  pristine.addValidator(hashtagsField, validateMaxLengthHashtags, ErrorMessages.EXCEEDED_NUMBER_FOR_HASHTAGS);
  pristine.addValidator(hashtagsField, validateLeadingHash, ErrorMessages.INVALID_LEADING_HASH);
  pristine.addValidator(hashtagsField, validateNotOnlyHash, ErrorMessages.ONLY_HASH_SYMBOL);
  pristine.addValidator(hashtagsField, validatePatternHashtags, ErrorMessages.INVALID_PATTERN_FOR_HASHTAGS);
  pristine.addValidator(hashtagsField, validateMaxCharactersHashtags, ErrorMessages.MAX_CHARACTERS_FOR_HASHTAGS);
  pristine.addValidator(hashtagsField, validateRepeatedHashtags, ErrorMessages.REPEATED_FOR_HASHTAGS);
  pristine.addValidator(commentsField, validateComments, ErrorMessages.MAX_LENGTH_FOR_COMMENTS);

  uploadImageForm.addEventListener('submit', (evt) => {
    const isValid = pristine.validate(fieldsToValidate);

    if (!isValid) {
      evt.preventDefault();
    }
  });
};

export { validateForm };
