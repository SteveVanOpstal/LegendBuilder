'use strict';
describe('RegionComponent', () => {

  // Temporary fix for zone.js issue #234
  beforeEach((done) => {
    browser.get('/build');
    element(by.css('body'))
        .isPresent()
        .then(
            () => {
              done();
            },
            () => {
              // error skipped
              done();
            });
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toContain('Legend Builder');
  });

  it('should select EUW', () => {
    element(by.css('lb-region button a[href="/build/euw"]')).click();
    browser.driver.getCurrentUrl().then((url) => {
      expect(/\.*\/euw/.test(url)).toBeTruthy();
    });
  });

});
