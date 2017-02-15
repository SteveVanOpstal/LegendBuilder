import {Component, Input} from '@angular/core';

@Component({
  selector: 'lb-champion',
  template: `
    <a id="{{champion?.id}}" [routerLink]="[champion?.key]">
      <img [attr.alt]="champion?.name"
            class="nodrag"
            [attr.src]="'champion/loading/' + champion?.key + '_0.jpg' | lbDDragon">
      <div class="info">
        <p class="nodrag noselect">{{champion?.name}}</p>
        <lb-bar title="Attack Damage" class="attack"  [value]="champion?.info.attack"></lb-bar>
        <lb-bar title="Ability Power" class="magic"   [value]="champion?.info.magic"></lb-bar>
        <lb-bar title="Defense"       class="defense" [value]="champion?.info.defense"></lb-bar>
        <lb-bar title="Difficulty" class="difficulty" [value]="champion?.info.difficulty"></lb-bar>
      </div>
    </a>`
})

export class ChampionComponent {
  @Input() champion: {key: ''};
}
