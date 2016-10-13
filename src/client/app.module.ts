import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {AUTH_PROVIDERS} from 'angular2-jwt';

import {AboutModule} from './about/about.module';
import {ActionsComponent} from './actions.component';
import {AppComponent} from './app.component';
import {ROUTES} from './app.routes';
import {AssetsModule} from './assets/assets.module';
import {BuildModule} from './build/build.module';
import {ChampionModule} from './champion/champion.module';
import {LoginModule} from './login/login.module';
import {MainModule} from './main/main.module';
import {RegionModule} from './region/region.module';
import {AuthService} from './services/auth.service';
import {LolApiService} from './services/lolapi.service';
import {SharedModule} from './shared/shared.module';
import {SignupModule} from './signup/signup.module';
import {SummonerModule} from './summoner/summoner.module';

@NgModule({
  providers: [LolApiService, AUTH_PROVIDERS, AuthService],
  declarations: [AppComponent, ActionsComponent],
  imports: [
    BrowserModule, CommonModule, RouterModule.forRoot(ROUTES), HttpModule, AssetsModule,
    SharedModule, AboutModule, BuildModule, ChampionModule, LoginModule, MainModule, RegionModule,
    SignupModule, SummonerModule
  ],
  bootstrap: [AppComponent, ActionsComponent]
})
export class AppModule {
}
