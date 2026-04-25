const renderPictures = (photos) => {
  const container = document.querySelector('.pictures');
  const templateFragment = document.querySelector('#picture').content;
  const template = templateFragment.querySelector('.picture');
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < photos.length; i++) {
    const element = template.cloneNode(true);

    const picture = {
      el: element,
      image: element.querySelector('.picture__img'),
      comments: element.querySelector('.picture__comments'),
      likes: element.querySelector('.picture__likes')
    };

    picture.image.src = photos[i]?.url;
    picture.image.alt = photos[i]?.description;
    picture.comments.textContent = photos[i]?.comments.length;
    picture.likes.textContent = photos[i]?.likes;

    fragment.appendChild(picture.el);
  }

  container.appendChild(fragment);
};

export { renderPictures };
