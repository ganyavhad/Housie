import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoggedIn = false
  ticket = {
    "firstLine": [
      {
        "_id": "5eae90e8cd1e224388c9996d",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c9996e",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c9996f",
        "number": 21,
        "status": "Selected"
      },
      {
        "_id": "5eae90e8cd1e224388c99970",
        "number": 32,
        "status": "Pending"
      },
      {
        "_id": "5eae90e8cd1e224388c99971",
        "number": 42,
        "status": "Selected"
      },
      {
        "_id": "5eae90e8cd1e224388c99972",
        "number": 51,
        "status": "Pending"
      },
      {
        "_id": "5eae90e8cd1e224388c99973",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c99974",
        "number": 72,
        "status": "Pending"
      },
      {
        "_id": "5eae90e8cd1e224388c99975",
        "number": 0,
        "status": "None"
      }
    ],
    "secondLine": [
      {
        "_id": "5eae90e8cd1e224388c99976",
        "number": 5,
        "status": "Pending"
      },
      {
        "_id": "5eae90e8cd1e224388c99977",
        "number": 13,
        "status": "Pending"
      },
      {
        "_id": "5eae90e8cd1e224388c99978",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c99979",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c9997a",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c9997b",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c9997c",
        "number": 64,
        "status": "Pending"
      },
      {
        "_id": "5eae90e8cd1e224388c9997d",
        "number": 73,
        "status": "Selected"
      },
      {
        "_id": "5eae90e8cd1e224388c9997e",
        "number": 88,
        "status": "Pending"
      }
    ],
    "thirdLine": [
      {
        "_id": "5eae90e8cd1e224388c9997f",
        "number": 8,
        "status": "Selected"
      },
      {
        "_id": "5eae90e8cd1e224388c99980",
        "number": 16,
        "status": "Pending"
      },
      {
        "_id": "5eae90e8cd1e224388c99981",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c99982",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c99983",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c99984",
        "number": 57,
        "status": "Selected"
      },
      {
        "_id": "5eae90e8cd1e224388c99985",
        "number": 67,
        "status": "Pending"
      },
      {
        "_id": "5eae90e8cd1e224388c99986",
        "number": 0,
        "status": "None"
      },
      {
        "_id": "5eae90e8cd1e224388c99987",
        "number": 89,
        "status": "Selected"
      }
    ]
  }
  constructor(public apiService: ApiService, private router: Router, private fb: Facebook) {
    fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if (res.status === 'connect') {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
  }

  ngOnInit(): void {
    let user = localStorage.getItem('user')
    if (user) {
      this.router.navigate(['/home']);
    }
  }
  guestLogin() {
    this.apiService.guestLogin().subscribe(
      (res: any) => {
        console.log(res);
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/home']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getUserDetail(userid: any) {
    this.fb.api('/' + userid + '/?fields=id,email,name,picture,gender', ['public_profile'])
      .then(res => {
        this.saveUser({ id: res.id, name: res.name, profilePic: res.picture.data.url })
      })
      .catch(e => {
        console.log(e);
      });
  }
  fbLogin() {
    this.fb.login(['public_profile', 'user_friends', 'email', 'gender'])
      .then((res: FacebookLoginResponse) => {
        if (res.status === 'connected') {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }
  saveUser(data) {
    this.apiService.facebookLogin(data).subscribe(
      (res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/table']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
