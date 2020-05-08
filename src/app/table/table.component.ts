import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  roomId = <any>Number
  players = []
  roomData = {}
  user = <any>{}
  creator = <any>{};
  constructor(
    public apiService: ApiService,
    private router: Router,
    private socketService: SocketioService,
    public toastController: ToastController,
    private route: ActivatedRoute
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
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.getRoomBeforeStart(this.roomId)
    this.players = []
    this.user = JSON.parse(localStorage.getItem('user'));
    this.socketService.setupSocketConnection();
    this.socketService.socket.on('table_join_' + this.roomId, (member) => {
      this.players.push(member)
    })
    this.socketService.socket.on('game_start_' + this.roomId, (data) => {
      this.router.navigate(['/inside-table', this.roomId])
    })
  }
  startGame(roomData) {
    this.apiService.startGame(roomData).subscribe(
      (res) => {
        console.log("start", res)
        this.router.navigate(['/inside-table', roomData.roomId])
      },
      (err) => {
        this.presentToast(err.error.message);
        console.log("error", err);
      }
    );
  }
  getRoomBeforeStart(roomId) {
    this.apiService.getRoomBeforeStart(roomId).subscribe(
      (res: any) => {
        this.roomData = res
        this.creator = res.creator
        this.players = res.players
      },
      (err) => {
        console.log("error", err);
      }
    );
  }
}
