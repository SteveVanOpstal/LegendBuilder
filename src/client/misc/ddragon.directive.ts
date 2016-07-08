import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {LolApiService} from './lolapi.service';

enum AttributeType {
  style,
  src,
  xlink
}

@Directive({selector: '[ddragon]'})

export class DDragonDirective implements OnInit {
  @Input('ddragon') image: string;
  @Input() x: number = -1;
  @Input() y: number = -1;

  private defaultImg: string = '/assets/images/hourglass.svg';

  constructor(private el: ElementRef, private lolApi: LolApiService) {}

  ngOnInit() {
    this.setImage(this.defaultImg);
    this.lolApi.getRealm().subscribe((realm) => {
      this.setImage(this.buildImage(realm));
    });
  }

  setImage(image: string) {
    switch (this.getType()) {
      case AttributeType.style:
        this.el.nativeElement.setAttribute('style', image);
        break;
      case AttributeType.src:
        this.el.nativeElement.setAttribute('src', image);
        break;
      default:
        this.el.nativeElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', image);
    }
  }

  private buildImage(realm: any) {
    switch (this.getType()) {
      case AttributeType.style:
        return this.buildStyle(this.image, realm, this.x, this.y);
      default:
        return this.buildUrl(this.image, realm);
    }
  }

  private getType(): AttributeType {
    if (this.x >= 0 && this.y >= 0) {
      return AttributeType.style;
    } else if (this.el.nativeElement.tagName === 'IMG') {
      return AttributeType.src;
    } else {
      return AttributeType.xlink;
    }
  }

  private buildStyle(image: string, realm: any, x: number, y: number): string {
    return 'background:url(' + this.buildUrl(image, realm) + ') ' + x + 'px ' + y + 'px;';
  }

  private buildUrl(image: string, realm: any): string {
    if (!image || !realm) {
      return this.defaultImg;
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
