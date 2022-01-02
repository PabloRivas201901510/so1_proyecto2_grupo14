import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ServiceRedisService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {}

  socket = io('http://34.82.25.144:8080' || 'http://so1g14.tk:8080');

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      //console.log("data-> ", message)
      this.message$.next(message);
    });
    return this.message$.asObservable();
  };
}
