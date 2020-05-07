import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss'],
})
export class WinnerComponent implements OnInit {
  roomData = <any>{};
  user = <any>{};
  constructor(public apiService: ApiService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getRoomForWinner(id)
  }
  getRoomForWinner(roomId) {
    this.apiService.getRoomForWinner(roomId).subscribe(
      (res: any) => {
        this.roomData = res
      },
      (err) => {
        console.log("error", err);
      }
    );
  }
}
