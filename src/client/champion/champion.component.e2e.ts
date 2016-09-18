'use strict';
describe('ChampionComponent', () => {

  // Temporary fix for zone.js issue #234
  beforeEach((done) => {
    browser.get('/euw');
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
    expect(browser.getTitle()).toEqual('Legend Builder');
  });

  it('should find Amumu', () => {
    element(by.css('champion filters input[type=\'text\']')).sendKeys('am\'umu');
    element(by.css('champion filters input[value=\'Tank\']')).click();
    element(by.css('champion filters input[value=\'Mage\']')).click();
    element(by.css('champion filters input[value=\'attack\']')).click();
    let championCount = element.all(by.css('champion .champion')).count();
    expect(championCount).toEqual(1);
  });

  it('should find Velkoz', () => {
    element(by.css('champion filters input[type=\'text\']')).sendKeys('Velkoz');
    let championCount = element.all(by.css('champion .champion')).count();
    expect(championCount).toEqual(1);
  });

  it('should find Marksmen', () => {
    element(by.css('champion filters input[value=\'Marksman\']')).click();
    let championCount = element.all(by.css('champion .champion')).count();
    expect(championCount).not.toBeLessThan(1);
  });

});
