import {Then, Given} from '@cucumber/cucumber';
import {expect, element, by} from 'detox';
import {it} from 'jest-circus';

Given('User is on the {string} screen', async elementId => {
  it('', async () => {
    const elementIdFounded = element(by.id(elementId));
    console.log('elementIdFounded ', elementIdFounded);
    // expect(element(by.id(elementId)));
  });
});

Then('User should see the {string} text', async text => {
  it('', async () => {
    await expect(element(by.text(text))).toBeVisible();
  });
});
