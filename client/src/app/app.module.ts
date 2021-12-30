import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { ComponentHomeComponent } from './components/component-home/component-home.component';
import { ServiceRedisService } from './services/service-redis.service';

@NgModule({
  declarations: [
    AppComponent,
    ComponentHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [ServiceRedisService],
  bootstrap: [AppComponent]
})
export class AppModule { }
