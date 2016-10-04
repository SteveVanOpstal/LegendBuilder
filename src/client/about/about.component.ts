import {Component, ViewEncapsulation} from '@angular/core';
import {Http} from '@angular/http';

@Component({
  selector: 'about',
  providers: [],
  encapsulation: ViewEncapsulation.None,
  styles: [require('./about.css').toString()],
  template: `
    <section>
      <h2>About</h2>
      <p>Legend Builder is an <a href="https://github.com/SteveVanOpstal/LegendBuilder">open source</a> champion builder for <a href="">League of Legends</a>.</p>
      <p>There is no guarantee that the software will fulfill your champion building dreams, but with your help we can get it there.</p>
      <ul>
        <li><span>You can <b>report a bug</b></span> by entering an <a href="https://github.com/SteveVanOpstal/LegendBuilder/issues">issue</a></li>
        <li><span>You can <b>suggest a feature</b></span> by entering an <a href="https://github.com/SteveVanOpstal/LegendBuilder/issues">issue</a></li>
        <li><span>You can <b>fix a bug</b></span> by entering a <a href="https://github.com/SteveVanOpstal/LegendBuilder/pulls">pull request</a>. 
        It is advised to first enter an <a href="https://github.com/SteveVanOpstal/LegendBuilder/issues">issue</a> which describes the bug.</li>
        <li><span>You can <b>implement a feature</b></span> by entering a <a href="https://github.com/SteveVanOpstal/LegendBuilder/pulls">pull request</a>. 
        It is advised to first enter an <a href="https://github.com/SteveVanOpstal/LegendBuilder/issues">issue</a> which describes the feature.</li>
      </ul>
    </section>
    <section *ngIf="ready">
      <h2>Contributors</h2>
      <div class="contributor" *ngFor="let contributor of contributors">
        <img [attr.src]="contributor.avatar_url"/>
        <p>{{contributor.login}}</p>
      </div>
    </section>
    <section>
      <h2>Legal</h2>
      <p>Legend Builder - An advanced League Of Legends champion builder</p>
      <p>Copyright &copy; 2016 <a href="https://github.com/SteveVanOpstal">Steve Van Opstal</a></p>
      <p>&nbsp;</p>
      <p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation,</p>
      <p>either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;</p>
      <p>without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.</p>
      <p>See the <a href="https://github.com/SteveVanOpstal/LegendBuilder/blob/master/LICENSE">GNU General Public License</a> for more details.</p>
      <p>&nbsp;</p>
      <p>Legend Builder isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.</p>
      <p>League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.</p>
    </section>`
})

export class AboutComponent {
  private ready: boolean = false;
  private contributors: any;

  constructor(private http: Http) {
    this.http.get('https://api.github.com/repos/SteveVanOpstal/LegendBuilder/contributors')
        .map(res => res.json())
        .cache()
        .subscribe(
            res => {
              // // remove greenkeeperio-bot
              // res = res.filter((contributor) => {
              //   return contributor.id !== 14790466;
              // })
              this.contributors = res;
            },
            null,
            () => {
              this.ready = true;
            });
  }
}
