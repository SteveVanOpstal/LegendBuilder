"use strict"
describe('ChampionsComponent', () => {

  beforeEach(() => {
    browser.get('/euw');
  });


  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Legend Builder');
  });

  it('should find Amumu', () => {
    element(by.css('choose champions filters input[type=\'text\']')).sendKeys('am\'umu');
    let championCount = element.all(by.css('choose champions .champion')).count();
    expect(championCount).toEqual(1);
  });

  it('should find Velkoz', () => {
    element(by.css('choose champions filters input[type=\'text\']')).sendKeys('Velkoz');
    let championCount = element.all(by.css('choose champions .champion')).count();
    expect(championCount).toEqual(1);
  });

  it('should find Mages', () => {
    element(by.css('choose champions filters input[value=\'Mage\']')).click();
    let championCount = element.all(by.css('choose champions .champion')).count();
    expect(championCount).not.toBeLessThan(1);
  });

});
