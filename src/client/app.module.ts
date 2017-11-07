import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {MainModule} from './main/main.module';
import {LolApiService} from './services/lolapi.service';
import {RootStoreModule} from './store/root-store.module';
import {VersionComponent} from './version.component';


@NgModule({
  providers: [LolApiService],
  declarations: [AppComponent, VersionComponent],
  imports: [BrowserModule, AppRoutingModule, HttpModule, MainModule, RootStoreModule],
  bootstrap: [AppComponent, VersionComponent]
})
export class AppModule {}
