import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  players: any[];
  player: any;
  type: string;

  constructor(
    public apiService: ApiService,
    private router: Router,
    public toastController: ToastController
  ) { }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: `<span style="">${message}</span>`,
      position: 'top',
      duration: 1000,
      animated: true
    });
    toast.present();
  }

  ngOnInit() {
    this.players = []
    this.player = JSON.parse(localStorage.getItem('user'));
    this.players.push(this.player)
    this.type = 'Create'
  }
  select(type) {
    this.type = type
  }
  createRoom(max) {
    this.apiService.createRoom(max).subscribe(
      (res: any) => {
        this.router.navigate(['/table', res.roomId])
      },
      (err) => {
        this.presentToast(err.error);
        console.log(err);
      }
    );
  }

  joinRoom(roomId) {
    this.apiService.joinRoom({ roomId: roomId }).subscribe(
      (res: any) => {
        this.router.navigate(['/table', res.roomId])
      },
      (err) => {
        this.presentToast(err.error);
        console.log(err);
      }
    );
  }

}
