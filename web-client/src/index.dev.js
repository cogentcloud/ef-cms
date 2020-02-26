import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Case } from '../../shared/src/business/entities/cases/Case';
import { User } from '../../shared/src/business/entities/User';
import { app } from './app';
import { applicationContext } from './applicationContext';
import Devtools from 'cerebral/devtools';

const honeybadger = applicationContext.initHoneybadger({ onerror: true });

/**
 * Initializes the app with dev environment context
 */
let options = {
  returnSequencePromise: true,
};
if (process.env.USTC_DEBUG) {
  options.devtools = Devtools({
    allowedTypes: [Blob, User, Case],
    host: 'localhost:8585',
  });
}

app.initialize(applicationContext, options);
