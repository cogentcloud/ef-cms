const moment = require('moment-timezone');

const USTC_TZ = 'America/New_York';

/**
 * @param {string} dateString a date string to be sent to persistence
 * @returns {string} a formatted ISO date string
 */
module.exports.createISODateString = dateString => {
  let result;
  if (!dateString) {
    result = moment();
  } else {
    result = moment.tz(dateString, USTC_TZ);
  }

  return result.toISOString();
};

/**
 * @param {string} dateString a date string like YYYY-MM-DD or an ISO date retrieved from persistence
 * @param {string} formatStr the desired formatting as specified by the moment library
 * @returns {string} a formatted date string
 */
module.exports.formatDateString = (dateString, formatStr) => {
  let result = moment.tz(dateString, USTC_TZ).format(formatStr);
  return result;
};
