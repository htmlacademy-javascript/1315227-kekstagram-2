import { isEscapeKey, extractNumber } from './util.js';

const Scale = {
  STEP: 25,
  MIN: 25,
  MAX: 100,
  DEFAULT: 100
};

const effectsConfig = {
  chrome: {
    property: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    property: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    property: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    property: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    property: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  },
};

const uploadImage = document.querySelector('.img-upload');
const uploadImageFileInput = uploadImage.querySelector('#upload-file');
const uploadImageForm = uploadImage.querySelector('#upload-select-image');
const uploadImageOverlay = uploadImage.querySelector('.img-upload__overlay');
const uploadImageClose = uploadImage.querySelector('#upload-cancel');
const uploadImagePreview = uploadImage.querySelector('.img-upload__preview img');
const uploadImageEffectLevel = uploadImage.querySelector('.img-upload__effect-level');
const uploadImageEffects = uploadImage.querySelector('.img-upload__effects');
const uploadImageEffectValue = uploadImage.querySelector('[name="effect-level"]');
const uploadImageEffectSlider = uploadImage.querySelector('.effect-level__slider');
const scaleControlSmaller = uploadImage.querySelector('.scale__control--smaller');
const scaleControlBigger = uploadImage.querySelector('.scale__control--bigger');
const scaleControlInput = uploadImage.querySelector('[name="scale"]');

let slider = null;
let currentEffect = 'none';

const applyFilterEffect = (effect, value) => `${effectsConfig[effect]?.property}(${parseFloat(value)}${effectsConfig[effect]?.unit})`;
const applyTransformScale = (value) => `scale(${parseFloat(value) / 100})`;

const onSliderUpdate = () => {
  if (currentEffect === 'none') {
    return;
  }
  const value = parseFloat(slider.get());
  uploadImagePreview.style.filter = applyFilterEffect(currentEffect, value);
  uploadImageEffectValue.value = value;
};

const initEffectSlider = () => {
  const options = {
    connect: [true, false],
    start: [effectsConfig[currentEffect].max],
    step: effectsConfig[currentEffect].step,
    range: {
      'min': effectsConfig[currentEffect].min,
      'max': effectsConfig[currentEffect].max
    }
  };

  if (!slider) {
    slider = noUiSlider.create(uploadImageEffectSlider, options);
    slider.on('update', onSliderUpdate);
  } else {
    slider.updateOptions(options);
    slider.set(effectsConfig[currentEffect].max);
  }
};

const checkEffectSliderVisibility = (effect) => {
  currentEffect = effect;

  if (effect === 'none') {
    uploadImageEffectLevel.classList.add('hidden');
    uploadImagePreview.style.filter = '';
    uploadImageEffectValue.value = '';
  } else {
    uploadImageEffectLevel.classList.remove('hidden');
    initEffectSlider();
  }
};

const onScaleControlSmallerClick = () => {
  const currentValue = extractNumber(scaleControlInput.value);
  const newValue = Math.max((currentValue - Scale.STEP), Scale.MIN);
  scaleControlInput.value = `${newValue}%`;
  uploadImagePreview.style.transform = applyTransformScale(newValue);
};

const onScaleControlBiggerClick = () => {
  const currentValue = extractNumber(scaleControlInput.value);
  const newValue = Math.min((currentValue + Scale.STEP), Scale.MAX);
  scaleControlInput.value = `${newValue}%`;
  uploadImagePreview.style.transform = applyTransformScale(newValue);
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadImage();
  }
};

const onUploadImageCloseClick = () => {
  closeUploadImage();
};

const clearUploadImageForm = () => {
  uploadImageFileInput.value = '';
  uploadImagePreview.style.filter = '';
  uploadImagePreview.style.transform = '';
  scaleControlInput.value = `${Scale.DEFAULT}%`;
  uploadImageForm.reset();
  currentEffect = 'none';

  if (slider) {
    slider.destroy();
    slider = null;
  }
};

const openUploadImage = () => {
  document.body.classList.add('modal-open');
  uploadImageOverlay.classList.remove('hidden');
  checkEffectSliderVisibility('none');

  document.addEventListener('keydown', onDocumentKeydown);
};

const initUploadImage = () => {
  uploadImageFileInput.addEventListener('change', openUploadImage);
  scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
  uploadImageClose.addEventListener('click', onUploadImageCloseClick);

  uploadImageEffects.addEventListener('click', (evt) => {
    const targetEffect = evt.target.closest('.effects__radio');
    if (targetEffect) {
      checkEffectSliderVisibility(targetEffect.value);
    }
  });
};

function closeUploadImage() {
  clearUploadImageForm();
  document.body.classList.remove('modal-open');
  uploadImageOverlay.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydown);
}

export { initUploadImage };
