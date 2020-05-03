import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './table/table.component';
import { SocketioService } from './socketio.service';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-gaurd.service';
import { LoginComponent } from './login/login.component';
import { InsideTableComponent } from './inside-table/inside-table.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WinnerComponent } from './winner/winner.component';
import { Facebook } from '@ionic-native/facebook/ngx';


@NgModule({
  declarations: [AppComponent, TableComponent, LoginComponent, InsideTableComponent, WinnerComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    SocketioService, AuthService, AuthGuardService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
