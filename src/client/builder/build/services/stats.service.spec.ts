import {async, inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {Router} from '@angular/router';

import {Item} from '../../../data/item';
import {Samples} from '../../../data/samples';
import {LolApiService} from '../../../services/lolapi.service';
import {MockRouter, TestModule} from '../../../testing';

import {StatsService} from './stats.service';

describe('StatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Router, useValue: new MockRouter()}, StatsService, LolApiService],
      imports: [TestModule]
    });
  });

  const samples: Samples = {xp: [17000], gold: []};

  const champion = {
    stats: {
      attackrange: 125,
      attackdamage: 61.1116,
      attackdamageperlevel: 3.62,
      armor: 24.38,
      attackspeedoffset: 0
    }
  };

  const championStatsResults = {
    'Attack Range': [{time: 0, value: 125}, {time: 3600000, value: 125}],
    'Attack Damage': [
      {time: 0, value: 64.73}, {time: 59294, value: 68.35}, {time: 139765, value: 71.97},
      {time: 241412, value: 75.59}, {time: 364235, value: 79.21}, {time: 508235, value: 82.83},
      {time: 673412, value: 86.45}, {time: 859765, value: 90.07}, {time: 1067294, value: 93.69},
      {time: 1296000, value: 97.31}, {time: 1545882, value: 100.93}, {time: 1816941, value: 104.55},
      {time: 2109176, value: 108.17}, {time: 2422588, value: 111.79},
      {time: 2757176, value: 115.41}, {time: 3112941, value: 119.03},
      {time: 3489882, value: 122.65}, {time: 3888000, value: 126.27},
      {time: 3600000, value: 126.27}
    ],
    'armor': [{time: 0, value: 24.38}, {time: 3600000, value: 24.38}]
  };

  const items: Array<Item> = [
    {id: 1, name: '', gold: {total: 0}, time: 0, stats: {rFlatMPModPerLevel: 4.1667}}, {
      id: 1,
      name: '',
      gold: {total: 0},
      time: 10,
      stats: {rFlatMagicDamageMod: 15, FlatMPPool: 250}
    },
    {
      id: 2,
      name: '',
      gold: {total: 0},
      time: 673412,
      stats: {PercentMovementSpeedPerLevel: 0.002167}
    },
    {
      id: 3,
      name: '',
      gold: {total: 0},
      time: 1296000,
      stats: {PercentMPPool: 0.2, FlatMagicDamage: 5}
    },
    {id: 4, name: '', gold: {total: 0}, time: 2750000, stats: {FlatMovementSpeedMod: 100}},
    {id: 5, name: '', gold: {total: 0}, time: 2420000, stats: {FlatMovementSpeedMod: 100}}
  ];

  const itemStatsResults = {
    'MP': [
      {time: 0, value: 4.17},        {time: 10, value: 254.17},     {time: 59294, value: 258.33},
      {time: 139765, value: 262.5},  {time: 241412, value: 266.67}, {time: 364235, value: 270.83},
      {time: 508235, value: 275},    {time: 673412, value: 279.17}, {time: 859765, value: 283.33},
      {time: 1067294, value: 287.5}, {time: 1296000, value: 350},   {time: 1545882, value: 355},
      {time: 1816941, value: 360},   {time: 2109176, value: 365},   {time: 2422588, value: 370},
      {time: 2757176, value: 375},   {time: 3112941, value: 380},   {time: 3489882, value: 385},
      {time: 3888000, value: 390},   {time: 3600000, value: 390}
    ],
    'Magic Damage': [
      {time: 0, value: 0}, {time: 10, value: 15}, {time: 1296000, value: 20},
      {time: 3600000, value: 20}
    ],
    'Movement Speed': [
      {time: 0, value: 0}, {time: 2420000, value: 101.52}, {time: 2422588, value: 101.73},
      {time: 2750000, value: 203.47}, {time: 2757176, value: 203.9}, {time: 3112941, value: 204.33},
      {time: 3489882, value: 204.77}, {time: 3888000, value: 205.2},
      {time: 3600000, value: 205.2}
    ]
  };

  const levelTimeMarks = [
    0, 59294, 139765, 241412, 364235, 508235, 673412, 859765, 1067294, 1296000, 1545882, 1816941,
    2109176, 2422588, 2757176, 3112941, 3489882, 3888000
  ];

  xit('should process when samples are valid',
      async(inject([MockBackend, StatsService], (backend, service) => {
        spyOn(service.stats, 'next');
        backend.success(samples);
        backend.run();
        expect(service.stats.next).toHaveBeenCalled();
        expect(service.levelTimeMarks).toHaveEqualContent(levelTimeMarks);
      })));

  it('should not process when samples are invalid',
     async(inject([MockBackend, StatsService], (backend, service) => {
       spyOn(service.stats, 'next');
       backend.success({xp: [], gold: []});
       expect(service.stats.next).not.toHaveBeenCalled();
       expect(service.levelTimeMarks).not.toBeDefined();
     })));

  it('should not process when there are no samples', async(inject([StatsService], (service) => {
       service.pickedItems.next(undefined);
       service.stats.subscribe(() => {
         fail('unexpected success');
       });
     })));

  it('should not calculate when there are no stats',
     async(inject([MockBackend, StatsService], (backend, service) => {
       backend.success(samples);
       service.pickedItems.next(undefined);
       service.stats.subscribe((stats) => {
         expect(stats).toHaveEqualContent({});
       });
     })));

  xit('should process champion stats',
      async(inject([MockBackend, StatsService], (backend, service) => {
        backend.success('', samples);
        backend.success('', champion);
        backend.run();
        service.stats.subscribe((stats) => {
          expect(stats).toHaveEqualContent(championStatsResults);
        });
      })));

  xit('should process item stats', async(inject([MockBackend, StatsService], (backend, service) => {
        backend.success(
            'https://localhost:8082/euw/match/DinosHaveNoLife/Velkoz?gameTime=2700000&samples=32',
            samples);
        backend.success(
            'https://localhost:8081/static-data/euw/v1.2/champion/Velkoz?champData=' +
                'allytips,altimages,image,partype,passive,spells,stats,tags',
            items);
        // backend.run();
        service.stats.subscribe(
            (stats) => {
              // done();
              console.log(stats);
              console.log(itemStatsResults);
              expect(stats).toHaveEqualContent(itemStatsResults);
            },
            () => {
              // done();
              console.log('failure');
              fail('unexpected failure');
            });
      })));
});
