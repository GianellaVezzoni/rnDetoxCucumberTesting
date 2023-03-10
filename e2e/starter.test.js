import {device, element, by} from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
    await expect(
      element(by.text('Open up App.js to start working on your app!')),
    ).toBeVisible();
  });
});
