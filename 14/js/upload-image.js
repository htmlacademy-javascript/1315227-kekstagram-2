import { isEscapeKey } from './util.js';
import { validateReset } from './form.js';
import { sendData } from './api.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const ScaleDirection = {
  DECREASE: -1,
  INCREASE: 1
};

const ScaleStep = {
  STEP: 25,
  MIN: 25,
  MAX: 100,
  DEFAULT: 100
};

const effectConfig = {
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

const body = document.body;
const upload = document.querySelector('.img-upload');
const uploadSubmitButton = upload.querySelector('#upload-submit');
const uploadFile = upload.querySelector('#upload-file');
const uploadForm = upload.querySelector('#upload-select-image');
const uploadOverlay = upload.querySelector('.img-upload__overlay');
const uploadCloseButton = upload.querySelector('#upload-cancel');
const uploadPreview = upload.querySelector('.img-upload__preview img');
const uploadEffectLevel = upload.querySelector('.img-upload__effect-level');
const uploadEffects = upload.querySelector('.img-upload__effects');
const uploadEffectsPreviews = upload.querySelectorAll('.effects__preview');
const uploadEffectValue = upload.querySelector('[name="effect-level"]');
const uploadEffectSlider = upload.querySelector('.effect-level__slider');
const uploadScaleControlSmaller = upload.querySelector('.scale__control--smaller');
const uploadScaleControlBigger = upload.querySelector('.scale__control--bigger');
const uploadScaleControlInput = upload.querySelector('[name="scale"]');

let slider = null;
let currentEffect = 'none';
let currentScale = parseFloat(uploadScaleControlInput.value);

const showAlert = (type) => {
  const fragment = document.querySelector(`#${type}`).content;
  const alert = fragment.querySelector(`.${type}`).cloneNode(true);
  const alertCloseButton = alert.querySelector(`.${type}__button`);

  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeAlert();
    }
  };

  const onDocumentClick = (evt) => {
    if (!evt.target.closest(`.${type}__inner`)) {
      closeAlert();
    }
  };

  const onAlertCloseButtonClick = () => {
    closeAlert();
  };

  function closeAlert() {
    alert.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
  }

  alertCloseButton.addEventListener('click', onAlertCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onDocumentClick);
  body.appendChild(alert);
};

const applyFilterEffect = (effect, value) => `${effectConfig[effect]?.property}(${parseFloat(value)}${effectConfig[effect]?.unit})`;

const applyTransformScale = (value) => `scale(${parseFloat(value) / 100})`;

const toggleSubmitButton = (isDisabled) => {
  uploadSubmitButton.disabled = isDisabled;
};

const onScaleControlClick = (direction) => {
  currentScale = Math.min(Math.max(currentScale + (direction * ScaleStep.STEP), ScaleStep.MIN), ScaleStep.MAX);

  uploadScaleControlInput.value = `${currentScale}%`;
  uploadPreview.style.transform = applyTransformScale(currentScale);
};

const onDocumentKeydownUpload = (evt) => {
  if (document.querySelector('.success') || document.querySelector('.error')) {
    return;
  }

  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUpload();
  }
};

const onUploadCloseButtonClick = () => {
  closeUpload();
};

const onFormSubmit = async (data) => {
  toggleSubmitButton(true);

  try {
    const request = await sendData(data);

    if (request) {
      closeUpload();
      showAlert('success');
    }
  } catch {
    showAlert('error');
  }

  toggleSubmitButton(false);
};

const onSliderUpdate = () => {
  if (currentEffect === 'none') {
    return;
  }
  const value = parseFloat(slider.get());
  uploadPreview.style.filter = applyFilterEffect(currentEffect, value);
  uploadEffectValue.value = value;
};

const initEffectSlider = () => {
  const options = {
    connect: [true, false],
    start: [effectConfig[currentEffect].max],
    step: effectConfig[currentEffect].step,
    range: {
      'min': effectConfig[currentEffect].min,
      'max': effectConfig[currentEffect].max
    }
  };

  if (!slider) {
    slider = noUiSlider.create(uploadEffectSlider, options);
    slider.on('update', onSliderUpdate);
  } else {
    slider.updateOptions(options);
    slider.set(effectConfig[currentEffect].max);
  }
};

const checkEffectSliderVisibility = (effect) => {
  currentEffect = effect;

  if (effect === 'none') {
    uploadEffectLevel.classList.add('hidden');
    uploadPreview.style.filter = '';
    uploadEffectValue.value = '';
  } else {
    uploadEffectLevel.classList.remove('hidden');
    initEffectSlider();
  }
};

const clearForm = () => {
  uploadPreview.style = '';
  uploadForm.reset();
  currentEffect = 'none';
  currentScale = ScaleStep.DEFAULT;

  if (slider) {
    slider.destroy();
    slider = null;
  }
};

const openUpload = () => {
  const currentFile = uploadFile.files[0];
  const currentFileName = currentFile.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => currentFileName.endsWith(it));

  if (matches) {
    const urlFile = URL.createObjectURL(currentFile);

    uploadPreview.src = urlFile;

    uploadEffectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${urlFile})`;
    });
  }

  body.classList.add('modal-open');
  uploadOverlay.classList.remove('hidden');
  checkEffectSliderVisibility('none');

  document.addEventListener('keydown', onDocumentKeydownUpload);
};

const setUpload = () => {
  uploadFile.addEventListener('change', openUpload);

  uploadScaleControlSmaller.addEventListener('click', () => {
    onScaleControlClick(ScaleDirection.DECREASE);
  });

  uploadScaleControlBigger.addEventListener('click', () => {
    onScaleControlClick(ScaleDirection.INCREASE);
  });

  uploadCloseButton.addEventListener('click', onUploadCloseButtonClick);
  uploadEffects.addEventListener('change', () => {
    checkEffectSliderVisibility(uploadForm['effect'].value);
  });
};

function closeUpload() {
  clearForm();
  validateReset();
  body.classList.remove('modal-open');
  uploadOverlay.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydownUpload);
}

export { setUpload, onFormSubmit };
