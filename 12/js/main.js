import { renderPictures } from './render-pictures.js';
import { initPreview } from './preview.js';
import { initUpload, onFormSubmit } from './upload-image.js';
import { showDataErrorAlert } from './util.js';
import { setUploadFormSubmit } from './form.js';
import { loadData } from './api.js';

const getData = async () => {
  try {
    const photos = await loadData();
    renderPictures(photos);
    initPreview(photos);
  } catch (err) {
    showDataErrorAlert(err.message);
  }
};

getData();
initUpload();
setUploadFormSubmit(onFormSubmit);
