import { getRandomInteger, getRandomArrayElement } from './util.js';

const PHOTOS_COUNT = 25;

const NAMES = [
  'Артём',
  'Алексей',
  'Александр',
  'Андрей',
  'Антон',
  'Борис',
  'Вадим',
  'Валентин',
  'Василий',
  'Виктор',
  'Владимир',
  'Владислав',
  'Вячеслав',
  'Геннадий',
];

const DESCRIPTIONS = [
  'Надеюсь, вам понравится  это фото!',
  'Надеюсь, вы не пропустите',
  'Скоро, очень скоро'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

const CommentsRanges = {
  MIN: 0,
  MAX: 30
};

const AvatarRanges = {
  MIN: 1,
  MAX: 6
};

const LikesRanges = {
  MIN: 15,
  MAX: 200
};

const MessagesRanges = {
  MIN: 1,
  MAX: 2
};

const getRandomLikes = () => getRandomInteger(LikesRanges.MIN, LikesRanges.MAX);
const getRandomDescription = () => getRandomArrayElement(DESCRIPTIONS);
const getRandomAvatar = () => getRandomInteger(AvatarRanges.MIN, AvatarRanges.MAX);
const getRandomName = () => getRandomArrayElement(NAMES);
const getRandomMessage = () => {
  const messageCount = getRandomInteger(MessagesRanges.MIN, MessagesRanges.MAX);

  if (messageCount === 1) {
    return getRandomArrayElement(MESSAGES);
  }

  return `${getRandomArrayElement(MESSAGES)} ${getRandomArrayElement(MESSAGES)}`;
};

const createComment = (index) => ({
  id: index,
  avatar: `img/avatar-${getRandomAvatar()}.svg`,
  message: getRandomMessage(),
  name: getRandomName(),
});

const getRandomComments = () => {
  const count = getRandomInteger(CommentsRanges.MIN, CommentsRanges.MAX);
  return Array.from({ length: count }, (_, i) => createComment(i + 1));
};

const createPhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomDescription(),
  likes: getRandomLikes(),
  comments: getRandomComments(),
});

const createPhotos = Array.from({ length: PHOTOS_COUNT }, (_, index) => createPhoto(index + 1));

export { createPhotos };
