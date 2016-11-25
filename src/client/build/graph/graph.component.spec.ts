import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {LolApiService} from '../../services/lolapi.service';
import {StatsService} from '../../services/stats.service';
import {TestModule} from '../../testing';

import {GraphComponent} from './graph.component';
import {LegendComponent} from './legend/legend.component';

xdescribe('GraphComponent', () => {
  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphComponent, LegendComponent],
      providers: [LolApiService, StatsService],
      imports: [TestModule]
    });
    let fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let stats = {
    'MP': [{time: 0, value: 4.17}, {time: 3600000, value: 390}],
    'Magic Damage': [{time: 0, value: 0}, {time: 10, value: 15}, {time: 3600000, value: 20}],
    'Movement Speed': [{time: 0, value: 0}, {time: 3600000, value: 205.2}]
  };

  let samples = {'xp': [0, 30000], 'gold': [500, 20000]};

  it('should add stats to graph', async(inject([MockBackend], (backend) => {
       component.ngOnInit();
       backend.success(stats);
       let result = component.paths.map((path) => {
         return path.name;
       });
       expect(result).toHaveEqualContent(Object.keys(stats));
     })));

  it('should add samples to graph', async(inject([MockBackend], (backend) => {
       component.ngOnInit();
       backend.success(samples);
       let result = component.paths.map((path) => {
         return path.name;
       });
       expect(result).toHaveEqualContent(Object.keys(samples));
     })));
});
