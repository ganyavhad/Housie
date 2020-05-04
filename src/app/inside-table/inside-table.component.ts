
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
  timer = <any>Number;
  id = <any>Number
  ticket = <any>{};
  drawNum = <any>Number;
  tiketId: Number
  roomData = <any>{}
  interVal = <any>{}
  isJuldiFive: Boolean
  isFirstLine: Boolean
  isSecondLine: Boolean
  isThirdLine: Boolean

  getTicket(id) {
    this.apiService.getTicket(id).subscribe(
      (res: any) => {
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
    this.id = this.route.snapshot.paramMap.get('id');
    let id = this.id
    this.isJuldiFive = false
    this.isFirstLine = false
    this.isSecondLine = false
    this.isThirdLine = false
    this.timer = 5
    this.drawNum = 0
    this.getTicket(id);
    this.getRoom(id)
    this.generateNumArr();
    this.socketService.setupSocketConnection();
    let user = localStorage.getItem('user');
    let userId = JSON.parse(user)._id

    this.socketService.socket.on('winner_declared_' + this.id, (data) => {
      console.log("Einner called", data, userId)
      if (data._id != userId) {
        this.clearTimer();
        this.router.navigate(['/winner', this.id])
      }
    })
    this.socketService.socket.on('juldi_five_' + this.id, (data) => {
      if (data.winner._id != userId) {
        this.isJuldiFive = true
        this.presentToast(`Juldi five win by ${data.winner.name}`)
      }
    })
    this.socketService.socket.on('first_line_' + this.id, (data) => {
      if (data.winner._id != userId) {
        this.isFirstLine = true
        this.presentToast(`First line win by ${data.winner.name}`)
      }
    })
    this.socketService.socket.on('second_line_' + this.id, (data) => {
      if (data.winner._id != userId) {
        this.isSecondLine = true
        this.presentToast(`Second line win by ${data.winner.name}`)
      }
    })
    this.socketService.socket.on('third_line_' + this.id, (data) => {
      if (data.winner._id != userId) {
        this.isThirdLine = true
        this.presentToast(`Third line win by ${data.winner.name}`)
      }
    })
    this.socketService.socket.on('draw_' + id, (num) => {
      this.timer = 5;
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
  setTimer() {
    this.interVal = setInterval(() => {
      this.timer--
      if (this.timer < -2) {
        this.clearTimer()
      }
    }, 1000)
  }
  clearTimer() {
    this.timer = 0
    clearInterval(this.interVal)
  }
  getRoom(roomId) {
    this.apiService.getRoom(roomId).subscribe(
      (res: any) => {
        this.roomData = res
        this.drawNum = res.draw[res.draw.length - 1]
        this.setTimer()
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
          this.router.navigate(['/winner', this.id])
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
  juldiFive() {
    this.apiService.juldiFive({ _id: this.tiketId, roomId: this.roomData._id }).subscribe(
      (res: any) => {
        if (res.errorNo == 0) {
          this.isJuldiFive = true
        } else {
          console.log(res.message)
        }
        this.presentToast(res.message)
      },
      (err) => {
        this.presentToast("Something went wrong")
        console.log("error", err);
      }
    );
  }
  firstLine() {
    this.apiService.firstLine({ _id: this.tiketId, roomId: this.roomData._id }).subscribe(
      (res: any) => {
        if (res.errorNo == 0) {
          this.isFirstLine = true
        } else {
          console.log(res.message)
        }
        this.presentToast(res.message)
      },
      (err) => {
        this.presentToast("Something went wrong")
        console.log("error", err);
      }
    );
  }
  secondLine() {
    this.apiService.secondLine({ _id: this.tiketId, roomId: this.roomData._id }).subscribe(
      (res: any) => {
        if (res.errorNo == 0) {
          this.isSecondLine = true
        } else {
          console.log(res.message)
        }
        this.presentToast(res.message)
      },
      (err) => {
        this.presentToast("Something went wrong")
        console.log("error", err);
      }
    );
  }
  thirdLine() {
    this.apiService.thirdLine({ _id: this.tiketId, roomId: this.roomData._id }).subscribe(
      (res: any) => {
        if (res.errorNo == 0) {
          this.isThirdLine = true
        } else {
          console.log(res.message)
        }
        this.presentToast(res.message)
      },
      (err) => {
        this.presentToast("Something went wrong")
        console.log("error", err);
      }
    );
  }
}

