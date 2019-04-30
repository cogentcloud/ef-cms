import { AppTimeoutModal } from './AppTimeoutModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import IdleTimer from 'react-idle-timer';
import React from 'react';

export const IdleActivityMonitor = connect(
  {
    constants: state.constants,
    debounce: state.debounce,
    onIdle: sequences.setIdleStatusIdleSequence,
    showAppTimeoutModalHelper: state.showAppTimeoutModalHelper,
  },
  ({ onIdle, constants, showAppTimeoutModalHelper }) => {
    return (
      <>
        <IdleTimer
          debounce={constants.SESSION_DEBOUNCE}
          timeout={constants.SESSION_TIMEOUT}
          onIdle={onIdle}
        />
        {showAppTimeoutModalHelper.showModal && <AppTimeoutModal />}
      </>
    );
  },
);
