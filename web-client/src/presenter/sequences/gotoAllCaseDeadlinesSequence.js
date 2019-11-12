import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getAllCaseDeadlinesAction } from '../actions/CaseDeadline/getAllCaseDeadlinesAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultDateOnCalendarAction } from '../actions/CaseDeadline/setDefaultDateOnCalendarAction';

const gotoAllCaseDeadlines = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  getAllCaseDeadlinesAction,
  setCaseDeadlinesAction,
  setDefaultDateOnCalendarAction,
  setCurrentPageAction('CaseDeadlines'),
];

export const gotoAllCaseDeadlinesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAllCaseDeadlines,
    unauthorized: [redirectToCognitoAction],
  },
];