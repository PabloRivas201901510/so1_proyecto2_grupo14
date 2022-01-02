import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ServiceRedisService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {}

  socket = io('http://172.18.0.30:8080');

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      //console.log("data-> ", message)
      this.message$.next(message);
    });
    return this.message$.asObservable();
  };
}
