import {ElementRef} from '@angular/core';

export class MockElementRef implements ElementRef {
  nativeElement = {};
}

export class MockNativeElement {
  private attributes: Array<string> = new Array<string>();
  private attributesNS: Array<string> = new Array<string>();

  constructor(private tagName: string) {}

  setAttribute(attr: string, value: string): number {
    this.attributes[attr] = value;
    return this.attributes.length;
  }
  getAttribute(attr: string): Object {
    return this.attributes[attr];
  }

  setAttributeNS(scope: string, attr: string, value: string): number {
    this.attributesNS[attr] = value;
    return this.attributesNS.length;
  }
  getAttributeNS(attr: string): Object {
    return this.attributesNS[attr];
  }
}
