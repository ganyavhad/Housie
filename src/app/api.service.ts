import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }
  getTicket(id) {
    let user = localStorage.getItem('user');
    let data = {
      roomId: id,
      userId: JSON.parse(user)._id
    }
    return this.httpClient.post(environment.serverUrl + '/ticket/getTicket', data);
  }
  guestLogin() {
    return this.httpClient.post(environment.serverUrl + '/player/guestLogin', {});
  }
  facebookLogin(data) {
    return this.httpClient.post(environment.serverUrl + '/player/facebookLogin', data);
  }
  createRoom() {
    let user = localStorage.getItem('user');
    let userId = JSON.parse(user)._id
    return this.httpClient.post(environment.serverUrl + '/room/createRoom', { _id: userId, maxPlayer: 2 });
  }
  startGame(data) {
    let user = localStorage.getItem('user');
    let userId = JSON.parse(user)._id
    return this.httpClient.post(environment.serverUrl + '/room/startGame', { _id: userId, roomId: data.roomId });
  }
  joinRoom(data) {
    let user = localStorage.getItem('user');
    let userId = JSON.parse(user)._id
    return this.httpClient.post(environment.serverUrl + '/room/joinRoom', { _id: userId, roomId: data.roomId });
  }
  getRoom(roomId) {
    return this.httpClient.get(environment.serverUrl + '/room/getRoom/' + roomId);
  }
  selectNumber(data) {
    return this.httpClient.post(environment.serverUrl + '/ticket/selectNumber', data);
  }
  fullHousie(data) {
    return this.httpClient.post(environment.serverUrl + '/ticket/fullHousie', data);
  }
}

