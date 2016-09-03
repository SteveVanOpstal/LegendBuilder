import {Routes} from '@angular/router';

import {BuildComponent} from './build/build.component';
import {ChampionsComponent} from './champions/champions.component';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {RegionsComponent} from './region/region.component';
import {SignupComponent} from './signup/signup.component';
import {SummonerComponent} from './summoner/summoner.component';

export const ROUTES: Routes = [
  {path: 'build/:region/:summoner/:champion', component: BuildComponent},
  {path: 'build/:region/:summoner', component: ChampionsComponent},
  {path: 'build/:region', component: SummonerComponent},
  {path: 'build', component: RegionsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: '', component: MainComponent}
];
