import {ElementRef} from '@angular/core';
import {inject, TestBed} from '@angular/core/testing';

import {Path} from './graph.component';
import {LegendComponent} from './legend.component';

describe('GraphComponent', () => {
  let path1;
  let path2;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [LegendComponent]});
  });

  beforeEach(inject([LegendComponent], (component) => {
    path1 = {enabled: false, preview: false, name: 'test', obj: {}};
    path2 = {enabled: true, preview: true, name: 'test', obj: {}};
    component.paths = [path1, path2];
  }));

  it('should initialise', inject([LegendComponent], (component) => {}));

  it('should preview when hovering on disabled paths', inject([LegendComponent], (component) => {
       expect(path1.preview).toBeFalsy();
       component.mouseEnter(path1);
       expect(path1.preview).toBeTruthy();
       component.mouseLeave(path1);  // leaving button
       expect(path1.preview).toBeFalsy();

       component.mouseEnter(path1);
       expect(path1.preview).toBeTruthy();
       component.mouseLeave(undefined);  // leaving the button area
       expect(path1.preview).toBeFalsy();
     }));

  it('should toggle enabled/disabled when dragging', inject([LegendComponent], (component) => {
       expect(path1.enabled).toBeFalsy();
       path2.enabled = false;
       expect(path2.enabled).toBeFalsy();
       component.mouseDown(path2);
       expect(path1.enabled).toBeFalsy();
       expect(path2.enabled).toBeTruthy();
       component.mouseEnter(path1);
       expect(path1.enabled).toBeTruthy();
       component.mouseEnter(path2);
       expect(path2.enabled).toBeFalsy();
     }));

  it('should not toggle enabled/disabled when not dragging',
     inject([LegendComponent], (component) => {
       expect(path1.enabled).toBeFalsy();
       expect(path2.enabled).toBeTruthy();
       component.mouseEnter(path1);
       expect(path1.enabled).toBeFalsy();
       component.mouseEnter(path2);
       expect(path2.enabled).toBeTruthy();
     }));
});
