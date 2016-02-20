/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input} from 'angular2/core';
import {NgFor, NgClass} from 'angular2/common';

import {tim} from 'tinytim/lib/tinytim';

import {DDragonDirective} from 'app/ddragon.directive';

@Component({
  selector: 'abilities',
  template: `
    <div class="ability" [ngClass]="{ult : i == 3}" *ngFor="#spell of champion?.spells; #i = index">
      <img title="{{spell.name}}" [ddragon]="'spell/' + spell.image.full">
      <h3>{{spell.name}}</h3>
      <p>{{getExtendedTooltip(i)}}</p>
    </div>`,
  directives: [NgFor, NgClass, DDragonDirective]
})

export class AbilitiesComponent {
  @Input() private champion: any;
  
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