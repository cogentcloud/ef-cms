const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.assigneeId the id of the user to assign the work item to
 * @param {string} providers.message the message to send to the user when assigning the work item
 * @param {string} providers.workItemId the id of the work item to assign
 * @returns {object} the updated work item
 */
exports.forwardWorkItemInteractor = async ({
  applicationContext,
  assigneeId,
  message,
  workItemId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for assign work item');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const userToForwardTo = new User(
    await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: assigneeId }),
  );

  const fullWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId: workItemId,
    });

  const newMessage = new Message({
    createdAt: new Date().toISOString(),
    from: user.name,
    fromUserId: user.userId,
    message,
    to: userToForwardTo.name,
    toUserId: userToForwardTo.userId,
  });

  const workItemToForward = new WorkItem(fullWorkItem)
    .setAsInternal()
    .assignToUser({
      assigneeId: userToForwardTo.userId,
      assigneeName: userToForwardTo.name,
      section: userToForwardTo.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    })
    .addMessage(newMessage);

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId: workItemToForward.caseId,
    });

  const caseToUpdate = new Case(caseObject);

  await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
    applicationContext,
    workItem: fullWorkItem,
  });

  caseToUpdate.documents.forEach(
    document =>
      (document.workItems = document.workItems.map(item => {
        return item.workItemId === workItemToForward.workItemId
          ? workItemToForward
          : item;
      })),
  );

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseToUpdate.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().saveWorkItemForPaper({
    applicationContext,
    messageId: newMessage.messageId,
    workItem: workItemToForward.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
    applicationContext,
    workItem: {
      ...workItemToForward.validate().toRawObject(),
      createdAt: new Date().toISOString(),
    },
  });

  return workItemToForward.toRawObject();
};
