import {Directive, ElementRef, Input, OnChanges, OnInit} from '@angular/core';

import {LolApiService} from '../services/lolapi.service';

enum AttributeType {
  style,
  src,
  xlink
}

export let defaultImage: string =
    'data:image/svg+xml,' + encodeURIComponent(require('../assets/images/hourglass.svg'));

@Directive({selector: '[ddragon]'})
export class DDragonDirective implements OnInit, OnChanges {
  @Input('ddragon') image: string;
  @Input() x: number = -1;
  @Input() y: number = -1;

  private realm: any = undefined;

  constructor(private el: ElementRef, private lolApi: LolApiService) {}

  ngOnInit() {
    this.setImage(defaultImage);
    this.lolApi.getRealm().subscribe((realm: any) => {
      this.realm = realm;
      this.setImage(this.buildImage(this.image, this.realm));
    });
  }

  ngOnChanges() {
    if (this.realm) {
      this.setImage(this.buildImage(this.image, this.realm));
    }
  }

  setImage(image: string) {
    switch (this.getType()) {
      case AttributeType.style:
        let style = 'background:url(' + image + ') ' + this.x + 'px ' + this.y + 'px;';
        this.el.nativeElement.setAttribute('style', style);
        break;
      case AttributeType.src:
        this.el.nativeElement.setAttribute('src', image);
        break;
      default:
        this.el.nativeElement.setAttribute('href', image);
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

  private buildImage(image: string|undefined, realm: any|undefined): string {
    if (!image || !realm) {
      return defaultImage;
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
