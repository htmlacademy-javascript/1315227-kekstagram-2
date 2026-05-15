import { renderPictures } from './render-pictures.js';
import { setPreview } from './preview.js';
import { setUpload, onFormSubmit } from './upload-image.js';
import { showDataErrorAlert } from './util.js';
import { setUploadFormSubmit } from './form.js';
import { setFilter } from './filter.js';
import { loadData } from './api.js';

const getData = async () => {
  try {
    const photos = await loadData();
    renderPictures(photos);
    setPreview(photos);
    setFilter(renderPictures, photos);
  } catch (err) {
    showDataErrorAlert(err.message);
  }
};

getData();
setUpload();
setUploadFormSubmit(onFormSubmit);
