import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {LolApiService} from '../services/lolapi.service';

export let defaultImage: string =
    'data:image/svg+xml,' + encodeURIComponent(require('../assets/images/hourglass.svg'));

@Pipe({name: 'lbDDragon', pure: false})
export class DDragonPipe implements PipeTransform {
  resolvedImage: SafeUrl = '';
  image: string = '';

  constructor(private lolApi: LolApiService, sanitizer: DomSanitizer) {
    this.resolvedImage = sanitizer.bypassSecurityTrustUrl(defaultImage);
  }

  transform(image: string): any {
    if (this.image === image) {
      return this.resolvedImage;
    }
    this.image = image;

    this.lolApi.getRealm().subscribe((realm: any) => {
      this.resolvedImage = this.buildImage(this.image, realm);
    });

    return this.resolvedImage;
  }

  private buildImage(image: string, realm: any): string|SafeUrl {
    if (!image || !realm) {
      return this.resolvedImage;
    }

    let type = image.substr(0, image.lastIndexOf('/'));
    return realm.cdn + this.getVersion(realm, type) + '/img/' + image;
  }

  private getVersion(realm: any, type: string): string {
    if (type === 'ui') {
      return '/5.5.1';
    }

    if (type.indexOf('champion/') !== -1) {
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
