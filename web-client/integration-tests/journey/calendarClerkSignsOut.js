import { applicationContext } from '../../src/applicationContext';

export default test => {
  return it('Calendar Clerk signs out', async () => {
    await test.runSequence('signOutSequence');
    expect(test.getState('user')).toBeUndefined();
    expect(applicationContext.getCurrentUser()).toEqual(null);
  });
};