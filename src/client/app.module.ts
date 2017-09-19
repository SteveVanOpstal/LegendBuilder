import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {MainModule} from './main/main.module';
import {LolApiService} from './services';
import {VersionComponent} from './version.component';

@NgModule({
  providers: [LolApiService],
  declarations: [AppComponent, VersionComponent],
  imports: [BrowserModule, AppRoutingModule, HttpModule, MainModule],
  bootstrap: [AppComponent, VersionComponent]
})
export class AppModule {}
