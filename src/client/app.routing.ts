import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AboutComponent} from './about/about.component';
import {BuildComponent} from './build/build.component';
import {ChampionComponent} from './champion/champion.component';
// import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {RegionComponent} from './region/region.component';
// import {SignupComponent} from './signup/signup.component';
import {SummonerComponent} from './summoner/summoner.component';

@NgModule({
  imports: [RouterModule.forRoot([
    {path: '', component: MainComponent}, {path: 'about', component: AboutComponent},
    // {path: 'login', component: LoginComponent}, {path: 'signup', component: SignupComponent},
    {path: 'build', component: RegionComponent},
    {path: 'build/:region', component: SummonerComponent},
    {path: 'build/:region/:summoner', component: ChampionComponent},
    {path: 'build/:region/:summoner/:champion', component: BuildComponent}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
