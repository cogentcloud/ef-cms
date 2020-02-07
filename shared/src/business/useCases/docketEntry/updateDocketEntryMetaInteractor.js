const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { NotFoundError } = require('../../../errors/errors');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the caseId of the case to be updated
 * @param {object} providers.docketRecordIndex the index of the docket record entry to be updated
 * @param {object} providers.docketEntryMeta the docket entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.updateDocketEntryMetaInteractor = async ({
  applicationContext,
  caseId,
  docketEntryMeta,
  docketRecordIndex,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized to update docket entry');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketRecordEntry = caseEntity.docketRecord.find(
    record => record.index === docketRecordIndex,
  );

  const {
    action,
    description,
    filedBy,
    filingDate,
    servedAt,
  } = docketEntryMeta;

  const docketRecordEntity = new DocketRecord({
    ...docketRecordEntry,
    action: action || docketRecordEntry.action,
    description: description || docketRecordEntry.description,
    filedBy: filedBy || docketRecordEntry.filedBy,
    filingDate: filingDate || docketRecordEntry.filingDate,
  });

  if (servedAt || filedBy || filingDate) {
    const documentDetail = caseEntity.getDocumentById({
      documentId: docketRecordEntity.documentId,
    });

    if (documentDetail) {
      const servedAtUpdated = servedAt && servedAt !== documentDetail.servedAt;
      const filingDateUpdated =
        filingDate && filingDate !== documentDetail.createdAt;
      const shouldGenerateCoversheet = servedAtUpdated || filingDateUpdated;

      const documentEntity = new Document(
        {
          ...documentDetail,
          createdAt: filingDateUpdated ? null : documentDetail.createdAt, // setting to null will regenerate it for the coversheet
          filedBy: filedBy || documentDetail.filedBy,
          servedAt: servedAt || documentDetail.servedAt,
        },
        { applicationContext },
      );

      if (shouldGenerateCoversheet) {
        // servedAt or filingDate has changed, generate a new coversheet
        await applicationContext.getUseCases().addCoversheetInteractor({
          applicationContext,
          caseId,
          documentId: documentDetail.documentId,
        });
      }
      caseEntity.updateDocument(documentEntity);
    }
  }

  caseEntity.updateDocketRecordEntry(docketRecordEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};