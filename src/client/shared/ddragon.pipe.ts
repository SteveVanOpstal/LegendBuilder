import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {LolApiService} from '../services';

export let defaultImage: string = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-hourglass" width="24" height="24" viewBox="0 0 24 24">
    <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/>
    <path d="M0 0h24v24H0V0z" fill="none"/>
  </svg>`);

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
