import {browser, by, element} from 'protractor';

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
    element(by.css('lb-champions lb-filters input[type=\'text\']')).sendKeys('am\'umu');
    element(by.css('lb-champions lb-filters input[value=\'Tank\']')).click();
    element(by.css('lb-champions lb-filters input[value=\'Mage\']')).click();
    element(by.css('lb-champions lb-filters input[value=\'attack\']')).click();
    let championCount: Promise<Number> = element.all(by.css('lb-champions .champion')).count();
    championCount
        .then((count) => {
          expect(count).toEqual(1);
        })
        .catch(() => {
          fail('Count Observable failed');
        });
  });

  it('should find Velkoz', () => {
    element(by.css('lb-champions lb-filters input[type=\'text\']')).sendKeys('Velkoz');
    let championCount = element.all(by.css('lb-champions .champion')).count();
    championCount
        .then((count) => {
          expect(count).toEqual(1);
        })
        .catch(() => {
          fail('Count Observable failed');
        });
  });

  it('should find Marksmen', () => {
    element(by.css('lb-champions lb-filters input[value=\'Marksman\']')).click();
    let championCount = element.all(by.css('lb-champions .champion')).count();
    championCount
        .then((count) => {
          expect(count).not.toBeLessThan(1);
        })
        .catch(() => {
          fail('Count Observable failed');
        });
  });

});
