const checkStringMaxLength = (string = '', maxLength = 0) => string.length <= maxLength;

const checkStringIsPalindrome = (string = '') => {
  const normalizeString = string.replaceAll(' ', '').toLowerCase();
  let reverseString = '';

  for (let i = normalizeString.length - 1; i >= 0; i--) {
    reverseString += normalizeString[i];
  }

  return reverseString === normalizeString;
};

const convertStringToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const checkMeeting = (beginningWorkingDay, endWorkingDay, beginningMeet, durationMeetInMinutes) => {
  const startDay = convertStringToMinutes(beginningWorkingDay);
  const endDay = convertStringToMinutes(endWorkingDay);
  const startMeet = convertStringToMinutes(beginningMeet);
  const endMeet = startMeet + durationMeetInMinutes;

  return startMeet >= startDay && endMeet <= endDay;
};
