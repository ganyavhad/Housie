import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { SocketioService } from '../socketio.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  form: FormGroup
  type: String
  roomCreated: Boolean
  roomId: Number
  roomJoined: Boolean
  players = []
  roomData = {}
  player = {}
  constructor(
    public apiService: ApiService, private router: Router, private socketService: SocketioService, public toastController: ToastController
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
    this.type = 'Create'
    this.roomJoined = false
    this.socketService.setupSocketConnection();
  }
  select(type) {
    this.type = type
    this.roomCreated = false
    console.log(type)
  }
  createRoom(max) {
    this.apiService.createRoom(max).subscribe(
      (res: any) => {
        this.roomCreated = true
        this.roomData = res
        this.socketService.socket.on('table_join_' + res.roomId, (member) => {
          console.log(member)
          this.players.push(member)
        })
      },
      (err) => {
        this.presentToast(err.error);
        console.log(err);

      }
    );
  }
  startGame(roomData) {
    this.apiService.startGame(roomData).subscribe(
      (res) => {
        console.log("start", res)
        this.router.navigate(['/inside-table', roomData.roomId])
      },
      (err) => {
        this.presentToast(err.error);
        console.log("error", err);
      }
    );
  }
  joinRoom(roomId) {
    this.apiService.joinRoom({ roomId: roomId }).subscribe(
      (res: any) => {
        this.roomJoined = true
        this.socketService.socket.on('game_start_' + roomId, (data) => {
          let id = roomId;
          this.router.navigate(['/inside-table', roomId])
        })
      },
      (err) => {
        this.presentToast(err.error.message);
        console.log(err);
      }
    );
  }
}
