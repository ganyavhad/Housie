import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  ivokeUserData = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  onLoginCalled(userData) {
    this.ivokeUserData.emit(userData);
  }
}    