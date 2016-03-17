import {Directive, Input, ElementRef, OnChanges} from 'angular2/core';

@Directive({
  selector: '[clip]'
})

export class ClipDirective implements OnChanges {
  @Input('clip') clip: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(private el: ElementRef) {
    this.updateElement();
  }

  updateElement() {
    if (!this.clip) {
      return;
    }
    var input = this.clip.split(' ');
    if (this.el.nativeElement.tagName == "IMG") {
      this.el.nativeElement.setAttribute("style", this.buildClip(+input[0], +input[1], +input[2], +input[3]));
    }
  }

  // buildClip(x: number, y: number, width: number, height: number): string {
  //   var polygon = this.buildPolygon(x, y, width, height);
  //   return "clip-path:" + polygon + ";-webkit-clip-path:" + polygon;
  // }

  // buildPolygon(x: number, y: number, width: number, height: number) {
  //   var x2 = width + x;
  //   var y2 = height + y;
  //   return "polygon(" + x + "px " + y + "px, " + x2 + "px " + y + "px, " + x2 + "px " + y2 + "px, " + x + "px " + y2 + "px)"
  // }

  buildClip(x: number, y: number, width: number, height: number): string {
    return "width:" + width + "px; height:" + height + "px; background:" + "url(" + src + ") repeat; backgroundPosition:" + "0px 0px";
  }

  ngOnChanges() {
    this.updateElement();
  }
}