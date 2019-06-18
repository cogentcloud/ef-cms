import { clearModalAction } from '../actions/clearModalAction';
import { getAssociatedCasesForTrialSessionAction } from '../actions/TrialSession/getAssociatedCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { setAssociatedCasesForTrialSessionAction } from '../actions/TrialSession/setAssociatedCasesForTrialSessionAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setTrialSessionCalendarAction } from '../actions/TrialSession/setTrialSessionCalendarAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const setTrialSessionCalendarSequence = [
  setFormSubmittingAction,
  setTrialSessionCalendarAction,
  clearModalAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  getAssociatedCasesForTrialSessionAction,
  setAssociatedCasesForTrialSessionAction,
  unsetFormSubmittingAction,
];
