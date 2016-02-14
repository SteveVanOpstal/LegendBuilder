/// <reference path="../typings/angular2/angular2.d.ts" />

import {Directive, Input, ElementRef, OnChanges, SimpleChange} from 'angular2/core';

import {LolApiService} from 'app/lolapi.service';

@Directive({
  selector: '[ddragon]'
})

export class DDragonDirective implements OnChanges {
  @Input('ddragon') image: string;
  
  private realm: any;
  private cdn: string;
  
  constructor(private el: ElementRef, private lolApi: LolApiService) {
    this.updateElement();
  }
  
  updateElement() {
    if (this.el.nativeElement.tagName == "IMG") {
      this.el.nativeElement.setAttribute("src", this.getUrl());
    }
    else {
      this.el.nativeElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.getUrl());
    }
  }
  
  getUrl() {
    if (!this.image) {
      return "";
    }  
    
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
  
  needsVersion(image: string)
  {
    if (image.indexOf("champion/loading") > -1) {
      return false;
    }
    return true;
  }

  ngOnChanges(changes: { [key: string]: SimpleChange; }) {
    this.updateElement();
  }
}