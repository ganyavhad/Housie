
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SocketioService } from '../socketio.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inside-table',
  templateUrl: './inside-table.component.html',
  styleUrls: ['./inside-table.component.scss']
})
export class InsideTableComponent implements OnInit {
  numbers = [];
  draw = [];
  ticket = <any>{};
  drawNum = <any>Number;
  tiketId: Number
  roomData = <any>{}
  getTicket(id) {
    this.apiService.getTicket(id).subscribe(
      (res: any) => {
        console.log(res);
        this.tiketId = res._id
        this.ticket = res.ticket;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  generateNumArr = function () {
    let counter = 1;
    for (let i = 0; i < 9; i++) {
      this.draw.push([]);
      for (let j = 0; j < 10; j++) {
        this.draw[i].push({ number: counter, status: 'Open' });
        counter++;
      }
    }
  };
  constructor(
    public apiService: ApiService,
    private socketService: SocketioService,
    private route: ActivatedRoute,
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
    let id = this.route.snapshot.paramMap.get('id');
    this.drawNum = 0
    console.log(id)
    this.getTicket(id);
    this.getRoom(id)
    this.generateNumArr();
    this.socketService.setupSocketConnection();
    this.socketService.socket.on('draw_' + id, (num) => {
      this.drawNum = num;
      for (let i = 0; i < 9; i++) {
        let index = this.draw[i].findIndex((n) => {
          return num == n.number;
        });
        if (index !== -1) {
          this.draw[i][index].status = 'Closed';
          return;
        }
      }
    });
  }
  getRoom(roomId) {
    this.apiService.getRoom(roomId).subscribe(
      (res: any) => {
        this.roomData = res
        this.drawNum = res.draw[res.draw.length - 1]
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 10; j++) {
            let index = res.draw.findIndex((n) => {
              return this.draw[i][j].number == n;
            });
            if (index !== -1) {
              this.draw[i][j].status = 'Closed';
            }
          }
        }
      },
      (err) => {
        console.log("error", err);
      }
    );
  }
  selectNumber(line, number, status) {
    console.log(line, number, status)
    let numStatus = status == 'Selected' ? 'Closed' : 'Selected'
    this.apiService.selectNumber({
      _id: this.tiketId, line: line, number: number, status: numStatus
    }).subscribe(
      (res: any) => {
        let index = this.ticket[line].findIndex((n) => {
          return number == n.number;
        });
        if (index !== -1) {
          this.ticket[line][index].status = numStatus;
          return;
        }
        this.ticket[line]
      },
      (err) => {
        console.log("error", err);
      }
    );
  }
  fullHousie() {
    this.apiService.fullHousie({ _id: this.tiketId, roomId: this.roomData._id }).subscribe(
      (res: any) => {
        this.presentToast(res.message)
        if (res.errorNo == 0) {
          console.log(res.message)
        } else {
          console.log(res.message)
        }
      },
      (err) => {
        this.presentToast("Something went wrong")
        console.log("error", err);
      }
    );
  }
}

