import { photos } from './data.js';

const renderPictures = () => {
  const container = document.querySelector('.pictures');
  const templateFragment = document.querySelector('#picture').content;
  const template = templateFragment.querySelector('.picture');
  const fragment = document.createDocumentFragment();

  photos.forEach(({ id, url, description, comments, likes }) => {
    const element = template.cloneNode(true);

    element.dataset.pictureId = id;
    element.querySelector('.picture__img').src = url;
    element.querySelector('.picture__img').alt = description;
    element.querySelector('.picture__comments').textContent = comments.length;
    element.querySelector('.picture__likes').textContent = likes;

    fragment.appendChild(element);
  });

  container.appendChild(fragment);
};

export { renderPictures };
