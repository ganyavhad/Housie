import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './api.service';
import { SocketioService } from './socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  player = <any>{}
  balance = <any>Number
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public apiService: ApiService,
    private socketService: SocketioService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.player = JSON.parse(localStorage.getItem('user'));
      if (this.player) {
        this.balance = this.player.balance
        this.socketService.setupSocketConnection();
        this.socketService.socket.on('balance_' + this.player._id, (playerData) => {
          console.log("playerData socket", playerData)
          this.balance = playerData.balance
        })
        this.getPlayerDetail({ _id: this.player._id })
      }
    });
  }
  getPlayerDetail(data) {
    this.apiService.getPlayerDetail(data).subscribe(
      (res: any) => {
        this.balance = res.balance
      },
      (err) => {
        console.log("error", err);
      }
    );
  }
}
