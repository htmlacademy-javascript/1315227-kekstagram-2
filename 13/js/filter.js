import { debounce } from './util.js';

const RENDER_DEBOUNCE = 500;
const RANDOM_PHOTOS_COUNT = 10;
const filters = document.querySelector('.img-filters');
const filtersForm = filters.querySelector('.img-filters__form');
const filterButtons = filters.querySelectorAll('.img-filters__button');

const FilterType = {
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const filterRandom = (photos) => {
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photos[i], photos[j]] = [photos[j], photos[i]];
  }

  return photos.slice(0, RANDOM_PHOTOS_COUNT);
};

const filterDiscussed = (photos) => photos.sort((a, b) => b.comments.length - a.comments.length);

const sortPhotos = (photos, filterType) => {
  const photosCopy = photos.slice();

  switch (filterType) {
    case FilterType.RANDOM:
      return filterRandom(photosCopy);
    case FilterType.DISCUSSED:
      return filterDiscussed(photosCopy);
    default:
      return photosCopy;
  }
};

const setFilter = (cb, photos) => {
  filters.classList.remove('img-filters--inactive');

  const debouncedRender = debounce(cb, RENDER_DEBOUNCE);

  filtersForm.addEventListener('click', (evt) => {
    const currentButton = evt.target.closest('.img-filters__button');

    if (!currentButton || currentButton.classList.contains('img-filters__button--active')) {
      return;
    }

    filterButtons.forEach((button) => {
      button.classList.remove('img-filters__button--active');
    });

    currentButton.classList.add('img-filters__button--active');
    const currentId = currentButton.id;
    const sortedPhotos = sortPhotos(photos, currentId);

    debouncedRender(sortedPhotos);
  });
};

export { setFilter };
