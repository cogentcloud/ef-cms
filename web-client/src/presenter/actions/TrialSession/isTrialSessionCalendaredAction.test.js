import { isTrialSessionCalendaredAction } from './isTrialSessionCalendaredAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('isTrialSessionCalendaredAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeEach(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return path.yes() if a trial session is calendared', async () => {
    await runAction(isTrialSessionCalendaredAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          isCalendared: true,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() if a trial session is NOT calendared', async () => {
    await runAction(isTrialSessionCalendaredAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          isCalendared: false,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
