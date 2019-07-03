const sinon = require('sinon');
const {
  assignWorkItems,
} = require('../useCases/workitems/assignWorkItemsInteractor');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  getDocumentQCInboxForUser,
} = require('../useCases/workitems/getDocumentQCInboxForUserInteractor');
const {
  setWorkItemAsRead,
} = require('../useCases/workitems/setWorkItemAsReadInteractor');
const { createCase } = require('../useCases/createCaseInteractor');
const { getCase } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');
const { WorkItem } = require('../entities/WorkItem');

const DATETIME = '2019-03-01T22:54:06.000Z';

describe('setWorkItemAsReadInteractor integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATETIME);
    applicationContext = createTestApplicationContext({
      user: {
        name: 'Rick Petitioner',
        role: 'petitioner',
        userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should create the expected case into the database', async () => {
    const { caseId } = await createCase({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: 'domestic',
          email: 'taxpayer@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AP',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: 'Petitioner',
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'richard',
        role: 'petitionsclerk',
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    const createdCase = await getCase({
      applicationContext,
      caseId,
    });

    const workItem = createdCase.documents.find(
      d => d.documentType === 'Petition',
    ).workItems[0];

    const workItemEntity = new WorkItem(workItem);

    let inbox = await getDocumentQCInboxForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toEqual([]);

    await assignWorkItems({
      applicationContext,
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'richard',
      workItemId: workItem.workItemId,
    });
    inbox = await getDocumentQCInboxForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox.isRead).toBeFalsy();

    await setWorkItemAsRead({
      applicationContext,
      workItemId: workItemEntity.workItemId,
    });

    inbox = await getDocumentQCInboxForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toMatchObject([
      {
        isRead: true,
      },
    ]);
  });
});
