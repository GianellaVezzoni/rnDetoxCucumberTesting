import {Before, After} from '@cucumber/cucumber';
import {device} from 'detox';

Before({timeout: 120 * 1000}, async () => {
  await device.launchApp();
  await device.reloadReactNative();
});
After({timeout: 120 * 1000}, async () => {
  await device.cleanup();
});
