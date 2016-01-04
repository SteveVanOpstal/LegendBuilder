/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {NgIf} from 'angular2/common';

import {LolApiService} from 'app/lolapi.service';

@Component({
  selector: 'ddragonimage',
  changeDetection: ChangeDetectionStrategy.OnPush
  template: '<img src="{{getUrl()}}">',
  directives: [NgIf]
})

export class DDragonImageComponent {
  @Input() image: string;
  
  private realm: any;
  private cdn: string;
  
  constructor(public lolApi: LolApiService) {
  }
  
  public getUrl() {
    this.realm = this.lolApi.getRealm();
    
    if (this.realm) {
      this.cdn = this.realm.cdn;
    }
    else {
      return "";
    }
    
    if (!this.needsVersion(this.image)) {
      return this.cdn + "/img/" + this.image;
    }
    
    var type = this.image.substr(0, this.image.indexOf("/"));
    
    if (type === "ui") {
      return this.cdn + "/5.5.1" + "/img/" + this.image;
    }  
    
    for (var obj in this.realm.n) {
      if (obj === type) {
        return this.cdn + "/" + this.realm.n[obj] + "/img/" + this.image;
      }
    }
    
    if (this.needsVersion(this.image)) {
        return this.cdn + "/" + this.realm.v + "/img/" + this.image;
    }  
    
    return this.cdn + "/img/" + this.image;
  }
  
  public needsVersion(image: string)
  {
    if (image.indexOf("champion/loading") > -1) {
      return false;
    }
    return true;
  }
}