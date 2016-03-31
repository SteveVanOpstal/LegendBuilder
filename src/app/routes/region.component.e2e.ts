'use strict';
describe('RegionsComponent', () => {

  // Temporary fix for zone.js issue #234 (TODO: remove)
  beforeEach((done) => {
    browser.get('/');
    element(by.css('body')).isPresent().then(() => {
      done();
    }, () => {
      //error skipped
      done();
    });
  });


  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Legend Builder');
  });

  it('should select EUW', () => {
    element(by.css('region button[href="/euw"]')).click();

    browser.driver.getCurrentUrl().then(function(url) {
      expect(/\.*\/euw/.test(url)).toBeTruthy();
    });
  });

});
