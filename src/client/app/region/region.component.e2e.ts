'use strict';
describe('RegionsComponent', () => {

  // TODO: remove
  // // Temporary fix for zone.js issue #234
  // beforeEach((done) => {
  //   browser.get('/');
  //   element(by.css('body')).isPresent().then(() => {
  //     done();
  //   }, () => {
  //     // error skipped
  //     done();
  //   });
  // });


  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Legend Builder');
  });

  it('should select EUW', () => {
    element(by.css('region button[href="/euw"]')).click();

    browser.driver.getCurrentUrl().then((url) => {
      expect(/\.*\/euw/.test(url)).toBeTruthy();
    });
  });

});
