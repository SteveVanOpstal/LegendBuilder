/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, NgFor, NgClass, Input} from 'angular2/angular2';

import {tim} from 'tinytim/lib/tinytim';

import {DDragonImageComponent} from 'app/ddragonImage';

@Component({
  selector: 'abilities'
})
@View({
  templateUrl: '/html/build/abilities.html',
  directives: [NgFor, NgClass, DDragonImageComponent]
})

export class AbilitiesComponent {
  @Input() private champion: any;
  
  constructor() {
    this.champion = { image: {full: null}, spells: null, name:null };
  }
  
  getExtendedTooltip(index: number) {
    var spell = this.champion.spells[index];
    try {
      return tim(spell.sanitizedTooltip, this.getEffects(spell));
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