'use strict';
describe('ChampionsComponent', () => {

  it('should have a title', () => { expect(browser.getTitle()).toEqual('Legend Builder'); });

  it('should find Amumu', () => {
    element(by.css('champions filters input[type=\'text\']')).sendKeys('am\'umu');
    element(by.css('champions filters input[value=\'Tank\']')).click();
    element(by.css('champions filters input[value=\'Mage\']')).click();
    element(by.css('champions filters input[value=\'attack\']')).click();
    let championCount = element.all(by.css('champions .champion')).count();
    expect(championCount).toEqual(1);
  });

  it('should find Velkoz', () => {
    element(by.css('champions filters input[type=\'text\']')).sendKeys('Velkoz');
    let championCount = element.all(by.css('champions .champion')).count();
    expect(championCount).toEqual(1);
  });

  it('should find Marksmen', () => {
    element(by.css('champions filters input[value=\'Marksman\']')).click();
    let championCount = element.all(by.css('champions .champion')).count();
    expect(championCount).not.toBeLessThan(1);
  });

});
