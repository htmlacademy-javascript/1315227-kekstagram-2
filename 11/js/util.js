const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const isEscapeKey = (evt) => evt.key === 'Escape';
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];
const extractNumber = (string = '') => {
  let stringWithNumbers = '';

  for (let i = 0; i <= string.toString().length; i++) {
    const number = parseInt(string.toString()[i], 10);
    if (!Number.isNaN(number)) {
      stringWithNumbers += number;
    }
  }

  return Number(stringWithNumbers) ? Number(stringWithNumbers) : NaN;
};

export { getRandomInteger, getRandomArrayElement, isEscapeKey, extractNumber };
