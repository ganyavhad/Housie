import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }
  guestLogin() {
    console.log("guestLogin")
    this.apiService.guestLogin().subscribe(
      (res: any) => {
        console.log(res);
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/table']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
