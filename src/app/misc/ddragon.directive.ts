import {Directive, Input, ElementRef, OnChanges} from '@angular/core';

import {LolApiService} from './lolapi.service';

@Directive({
  selector: '[ddragon]'
})

export class DDragonDirective implements OnChanges {
  @Input('ddragon') image: string;
  @Input() x: number = -1;
  @Input() y: number = -1;

  private default: string = '/assets/images/hourglass.svg';
  private realm: any;

  constructor(private el: ElementRef, private lolApi: LolApiService) {
    this.lolApi.getRealm()
      .subscribe(res => { this.realm = res; this.updateElement(this.realm); });
  }

  ngOnChanges() {
    this.updateElement(this.realm);
  }

  private updateElement(realm: any) {
    if (this.x >= 0 && this.y >= 0) {
      this.el.nativeElement.setAttribute('style', this.buildStyle(this.image, realm, this.x, this.y));
    } else if (this.el.nativeElement.tagName === 'IMG') {
      this.el.nativeElement.setAttribute('src', this.buildUrl(this.image, realm));
    } else {
      this.el.nativeElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.buildUrl(this.image, realm));
    }
  }

  private buildStyle(image: string, realm: any, x: number, y: number): string {
    return 'background:url(' + this.buildUrl(image, realm) + ') ' + x + 'px ' + y + 'px;';
  }

  private buildUrl(image: string, realm: any): string {
    if (!image || !realm) {
      return this.default;
    }

    let type = image.substr(0, image.lastIndexOf('/'));
    return realm.cdn + this.getVersion(realm, type) + '/img/' + image;
  }

  private getVersion(realm: any, type: string): string {
    if (type === 'ui') {
      return '/5.5.1';
    }

    if (type === 'champion/loading') {
      return '';
    }

    for (let obj in realm.n) {
      if (obj === type) {
        return '/' + realm.n[obj];
      }
    }

    return '/' + realm.v;
  }
}
