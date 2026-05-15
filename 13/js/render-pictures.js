const pictures = document.querySelector('.pictures');
const pictureFragment = document.querySelector('#picture').content;
const pictureTemplate = pictureFragment.querySelector('.picture');

const renderPictures = (photos) => {
  const pictureListFragment = document.createDocumentFragment();
  const existingPictures = pictures.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  photos.forEach(({ id, url, description, comments, likes }) => {
    const picture = pictureTemplate.cloneNode(true);
    const pictureImage = picture.querySelector('.picture__img');

    pictureImage.src = url;
    pictureImage.alt = description;

    picture.querySelector('.picture__comments').textContent = comments.length;
    picture.querySelector('.picture__likes').textContent = likes;
    picture.dataset.pictureId = id;

    pictureListFragment.appendChild(picture);
  });

  pictures.appendChild(pictureListFragment);
};

export { renderPictures };
