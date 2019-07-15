const {
  GET_USERS_IN_SECTION,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
/**
 * getUsersInSectionInteractor
 *
 * @param section
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.getUsersInSectionInteractor = ({ applicationContext, section }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, GET_USERS_IN_SECTION)) {
    throw new UnauthorizedError('Unauthorized');
  }
  return applicationContext.getPersistenceGateway().getUsersInSection({
    applicationContext,
    section,
  });
};
