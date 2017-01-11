import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

import {AboutModule} from './about/about.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {AssetsModule} from './assets/assets.module';
import {BuildModule} from './build/build.module';
import {ChampionModule} from './champion/champion.module';
import {MainModule} from './main/main.module';
import {RegionModule} from './region/region.module';
import {LolApiService} from './services/lolapi.service';
import {SharedModule} from './shared/shared.module';
import {SummonerModule} from './summoner/summoner.module';

@NgModule({
  providers: [LolApiService],
  declarations: [AppComponent],
  imports: [
    BrowserModule, CommonModule, AppRoutingModule, HttpModule, AssetsModule, SharedModule,
    AboutModule, BuildModule, ChampionModule, MainModule, RegionModule, SummonerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
