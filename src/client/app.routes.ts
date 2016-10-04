import {Routes} from '@angular/router';

import {AboutComponent} from './about/about.component';
import {BuildComponent} from './build/build.component';
import {ChampionComponent} from './champion/champion.component';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {RegionComponent} from './region/region.component';
import {SignupComponent} from './signup/signup.component';
import {SummonerComponent} from './summoner/summoner.component';

export const ROUTES: Routes = [
  {path: 'build/:region/:summoner/:champion', component: BuildComponent},
  {path: 'build/:region/:summoner', component: ChampionComponent},
  {path: 'build/:region', component: SummonerComponent},
  {path: 'build', component: RegionComponent}, {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}, {path: 'about', component: AboutComponent},
  {path: '', component: MainComponent}
];
