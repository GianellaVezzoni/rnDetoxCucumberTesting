import {Before, After} from '@cucumber/cucumber';
import {detox, device} from 'detox';
import {describe, beforeAll, beforeEach} from 'jest-circus';

Before({timeout: 120 * 1000}, async () => {
  describe('Example', () => {
    beforeAll(async () => {
      await detox.init();
      await device.launchApp();
      await device.reloadReactNative();
    });
  });
});

After({timeout: 120 * 1000}, async () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await detox.cleanup();
  });
});
