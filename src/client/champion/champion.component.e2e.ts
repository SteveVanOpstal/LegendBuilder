'use strict';
describe('ChampionComponent', () => {

  // Temporary fix for zone.js issue #234
  beforeEach((done) => {
    browser.get('/build/euw/DinosHaveNoLife');
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

  it('should find Amumu', () => {
    element(by.css('lb-champion lb-filters input[type=\'text\']')).sendKeys('am\'umu');
    element(by.css('lb-champion lb-filters input[value=\'Tank\']')).click();
    element(by.css('lb-champion lb-filters input[value=\'Mage\']')).click();
    element(by.css('lb-champion lb-filters input[value=\'attack\']')).click();
    let championCount = element.all(by.css('lb-champion .champion')).count();
    expect(championCount).toEqual(1);
  });

  it('should find Velkoz', () => {
    element(by.css('lb-champion lb-filters input[type=\'text\']')).sendKeys('Velkoz');
    let championCount = element.all(by.css('lb-champion .champion')).count();
    expect(championCount).toEqual(1);
  });

  it('should find Marksmen', () => {
    element(by.css('lb-champion lb-filters input[value=\'Marksman\']')).click();
    let championCount = element.all(by.css('lb-champion .champion')).count();
    expect(championCount).not.toBeLessThan(1);
  });

});
