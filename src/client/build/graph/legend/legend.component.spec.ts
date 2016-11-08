import {inject, TestBed} from '@angular/core/testing';
import {line} from 'd3-shape';

import {Path} from '../graph.component';

import {LegendComponent} from './legend.component';

describe('LegendComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [LegendComponent]});
  });

  let changes;
  beforeEach(inject([LegendComponent], (component) => {
    const paths: Array<Path> = [
      {enabled: false, preview: false, name: 'test1', d: line()},
      {enabled: true, preview: true, name: 'test2', d: line()}
    ];

    changes = {
      paths: {
        currentValue: [
          {enabled: false, preview: false, name: 'test3', d: line()},
          {enabled: false, preview: false, name: 'test2', d: line()}
        ],
        previousValue: paths
      }
    };

    component.paths = paths;
  }));

  it('should keep enabled states on changes', inject([LegendComponent], (component) => {
       component.ngOnChanges(changes);
       expect(changes['paths'].currentValue).toHaveEqualContent([
         {enabled: false, preview: false, name: 'test3', d: line()},
         {enabled: true, preview: false, name: 'test2', d: line()}
       ]);
     }));

  it('should preview when hovering', inject([LegendComponent], (component) => {
       expect(component.paths[0].preview).toBeFalsy();
       component.mouseEnter(component.paths[0]);
       expect(component.paths[0].preview).toBeTruthy();
       component.mouseLeave(component.paths[0]);  // leaving button
       expect(component.paths[0].preview).toBeFalsy();

       component.mouseEnter(component.paths[1]);
       expect(component.paths[1].preview).toBeTruthy();
       component.mouseLeave(undefined);  // leaving the button area
       expect(component.paths[1].preview).toBeFalsy();
     }));

  it('should toggle enabled when dragging', inject([LegendComponent], (component) => {
       expect(component.paths[0].enabled).toBeFalsy();
       component.mouseDown(component.paths[1]);
       expect(component.paths[0].enabled).toBeFalsy();
       expect(component.paths[1].enabled).toBeFalsy();
       component.mouseEnter(component.paths[0]);
       expect(component.paths[0].enabled).toBeTruthy();
       component.mouseEnter(component.paths[1]);
       expect(component.paths[1].enabled).toBeTruthy();
     }));

  it('should not toggle enabled when not dragging', inject([LegendComponent], (component) => {
       expect(component.paths[0].enabled).toBeFalsy();
       expect(component.paths[1].enabled).toBeTruthy();
       component.mouseEnter(component.paths[0]);
       expect(component.paths[0].enabled).toBeFalsy();
       component.mouseEnter(component.paths[1]);
       expect(component.paths[1].enabled).toBeTruthy();
     }));
});
