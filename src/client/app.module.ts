import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {ActionsComponent} from './actions.component';
import {AppComponent} from './app.component';
import {ROUTES} from './app.routes';
import {AssetsModule} from './assets/assets.module';
import {BuildModule} from './build/build.module';
import {ChampionModule} from './champion/champion.module';
import {LoginModule} from './login/login.module';
import {MainModule} from './main/main.module';
import {RegionModule} from './region/region.module';
import {SharedModule} from './shared/shared.module';
import {SignupModule} from './signup/signup.module';
import {SummonerModule} from './summoner/summoner.module';

@NgModule({
  imports: [
    BrowserModule, CommonModule, RouterModule.forRoot(ROUTES), HttpModule, AssetsModule,
    SharedModule, BuildModule, ChampionModule, LoginModule, MainModule,
    RegionModule, SignupModule, SummonerModule
  ],
  declarations: [AppComponent, ActionsComponent],
  bootstrap: [AppComponent, ActionsComponent]
})
export class AppModule {
}
