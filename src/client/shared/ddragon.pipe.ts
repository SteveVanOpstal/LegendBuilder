import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {LolApiService} from '../services/lolapi.service';

export let defaultImage: string =
    'data:image/svg+xml,' + encodeURIComponent(require('../assets/images/hourglass.svg'));

@Pipe({name: 'lbDDragon', pure: false})
export class DDragonPipe implements PipeTransform {
  image: SafeUrl = '';

  constructor(private lolApi: LolApiService, sanitizer: DomSanitizer) {
    this.image = sanitizer.bypassSecurityTrustUrl(defaultImage);
  }

  transform(image: string): any {
    this.lolApi.getRealm().subscribe((realm: any) => {
      this.image = this.buildImage(image, realm);
    });
    return this.image;
  }

  private buildImage(image: string, realm: any): string|SafeUrl {
    if (!image || !realm) {
      return this.image;
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
