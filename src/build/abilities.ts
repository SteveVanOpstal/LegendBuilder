/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, NgFor, NgClass} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';

import {tim} from 'tinytim/lib/tinytim';

import {ErrorComponent} from 'app/error';
import {DDragonImageComponent} from 'app/ddragonImage';

import {LolApi} from 'app/lolApi';

@Component({
  selector: 'abilities',
  providers: [LolApi]
})
@View({
  templateUrl: '/html/build/abilities.html',
  directives: [NgFor, NgClass, ErrorComponent, DDragonImageComponent]
})

export class AbilitiesComponent {
  private champion: any;
  private loading: boolean = true;
  private ok: boolean = true;
  
  constructor(params: RouteParams, private lolApi: LolApi) {
    this.getData(params.get('champion'));
  }
  
  getData(championName: string) {
    this.champion = { image: {full: null}, spells: null, name:null };
    this.loading = true;
    this.ok = true;
    
    this.lolApi.getChampion(championName)
      .subscribe(
        res => this.champion = res.json(),
        error => { this.ok = false; this.loading = false; },
        () => { this.loading = false; this.getExtendedTooltips(); }
      );
  }
  
  getExtendedTooltips() {
    for (var index in this.champion.spells) {
      this.getExtendedTooltip(index);
    }  
  }
  
  getExtendedTooltip(index: number) {
    var spell = this.champion.spells[index];
    try {
      spell.extendedTooltip = tim(spell.sanitizedTooltip, this.getEffects(spell));
    }
    catch (e) { }
  }
  
  getEffects(spell: any) {
    var effects = new Object();
    
    if (spell.effect) {
      spell.effect.forEach(function(value, i) {
        if (value) {
          effects['e' + i] = value[0];
        }
      });
    }
    
    if (spell.vars) {
      spell.vars.forEach(function(value, i) {
        if (value.key && value.coeff) {
          effects[value.key] = value.coeff[0];
        }
      });
    }
    
    var stats = this.getStats();
    for (var attrname in stats) { 
      effects[attrname] = stats[attrname];
    }
    
    return effects;
  }
  
  getStats() {
    var stats = new Object();
    
    var i = 0;
    for (var stat in this.champion.stats) {
      i++;
      stats['f' + i] = this.champion.stats[stat];
    }
    
    return stats;
  }
}