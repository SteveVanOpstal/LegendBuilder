import {inject, TestBed} from '@angular/core/testing';
import {curveLinear} from 'd3-shape';

import {Line} from '../graph.component';

import {LegendComponent} from './legend.component';

xdescribe('LegendComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [LegendComponent]});
  });

  let changes;
  beforeEach(inject([LegendComponent], (component) => {
    const lines: Array<Line> = [
      {
        preview: false,
        enabled: false,
        name: 'test1',
        path: [{time: 0, value: 0}],
        curve: curveLinear,
        currentValue: 0
      },
      {
        preview: false,
        enabled: false,
        name: 'test2',
        path: [{time: 0, value: 0}],
        curve: curveLinear,
        currentValue: 0
      }
    ];

    changes = {
      paths: {
        currentValue: [
          {
            preview: false,
            enabled: false,
            name: 'test3',
            data: [{time: 0, value: 0}],
            curve: curveLinear
          },
          {
            preview: false,
            enabled: false,
            name: 'test2',
            data: [{time: 0, value: 0}],
            curve: curveLinear
          }
        ],
        previousValue: lines
      }
    };

    component.lines = lines;
  }));

  it('should keep enabled states on changes', inject([LegendComponent], (component) => {
       component.ngOnChanges(changes);
       expect(changes['lines'].currentValue).toHaveEqualContent([
         {
           preview: false,
           enabled: false,
           name: 'test3',
           data: [{time: 0, value: 0}],
           curve: curveLinear
         },
         {
           preview: false,
           enabled: true,
           name: 'test2',
           data: [{time: 0, value: 0}],
           curve: curveLinear
         }
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
