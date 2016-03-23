import {Directive, Input, ElementRef, OnChanges} from 'angular2/core';

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

  updateElement(realm: any) {
    if (this.x >= 0 && this.y >= 0) {
      this.el.nativeElement.setAttribute('style', this.buildStyle(this.image, realm, this.x, this.y));
    } else if (this.el.nativeElement.tagName === 'IMG') {
      this.el.nativeElement.setAttribute('src', this.buildUrl(this.image, realm));
    } else {
      this.el.nativeElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.buildUrl(this.image, realm));
    }
  }

  buildStyle(image: string, realm: any, x: number, y: number): string {
    return 'background:url(' + this.buildUrl(image, realm) + ') ' + x + 'px ' + y + 'px;';
  }

  buildUrl(image: string, realm: any): string {
    if (!image || !realm) {
      return this.default;
    }

    var type = image.substr(0, image.lastIndexOf('/'));

    if (type === 'ui') {
      return realm.cdn + '/5.5.1/img/' + image;
    }

    for (var obj in realm.n) {
      if (obj === type) {
        return realm.cdn + '/' + realm.n[obj] + '/img/' + image;
      }
    }

    return realm.cdn + '/img/' + image;
  }

  ngOnChanges() {
    this.updateElement(this.realm);
  }
}
