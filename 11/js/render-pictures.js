import { photos } from './data.js';

const renderPictures = () => {
  const pictures = document.querySelector('.pictures');
  const pictureFragment = document.querySelector('#picture').content;
  const pictureTemplate = pictureFragment.querySelector('.picture');
  const fragment = document.createDocumentFragment();

  photos.forEach(({ id, url, description, comments, likes }) => {
    const pictureTemplateClone = pictureTemplate.cloneNode(true);
    const pictureImage = pictureTemplateClone.querySelector('.picture__img');

    pictureImage.src = url;
    pictureImage.alt = description;

    pictureTemplateClone.querySelector('.picture__comments').textContent = comments.length;
    pictureTemplateClone.querySelector('.picture__likes').textContent = likes;
    pictureTemplateClone.dataset.pictureId = id;

    fragment.appendChild(pictureTemplateClone);
  });

  pictures.appendChild(fragment);
};

export { renderPictures };
