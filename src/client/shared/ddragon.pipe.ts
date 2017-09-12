import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {LolApiService} from '../services';

export let defaultImage: string = 'data:image/svg+xml,' +
    encodeURIComponent(require('!raw-loader!svgo-loader!../assets/images/hourglass.svg'));

@Pipe({name: 'lbDDragon', pure: false})
export class DDragonPipe implements PipeTransform {
  resolvedImage: SafeUrl = '';
  currentImage = '';

  constructor(private lolApi: LolApiService, private sanitizer: DomSanitizer) {}

  transform(image: string, addDefault: boolean = true): any {
    if (!this.resolvedImage && addDefault) {
      this.resolvedImage = this.sanitizer.bypassSecurityTrustUrl(defaultImage);
    }
    if (this.currentImage === image) {
      return this.resolvedImage;
    }
    this.currentImage = image;

    this.lolApi.getRealm().subscribe((realm: any) => {
      this.resolvedImage = this.buildImage(this.currentImage, realm);
    });

    return this.resolvedImage;
  }

  private buildImage(image: string, realm: any): string|SafeUrl {
    if (!image || !realm) {
      return this.resolvedImage;
    }

    const type = image.substr(0, image.lastIndexOf('/'));
    return realm.cdn + this.getVersion(realm, type) + '/img/' + image;
  }

  private getVersion(realm: any, type: string): string {
    if (type === 'ui') {
      return '/5.5.1';
    }

    if (type.indexOf('champion/') !== -1) {
      return '';
    }

    for (const obj in realm.n) {
      if (obj === type) {
        return '/' + realm.n[obj];
      }
    }

    return '/' + realm.v;
  }
}
