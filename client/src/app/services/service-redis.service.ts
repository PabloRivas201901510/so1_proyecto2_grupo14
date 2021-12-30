import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ServiceRedisService {

  public socket:any
  constructor() {
    this.socket = io('http://localhost:5050');
  }

   

  listen(eventName : String){
    return new Observable((Subscriber)=> {
      this.socket.on(eventName, (data : any) => {
        Subscriber.next(data)
      })
    })
  }

  emit(eventName : String, data : any){
    this.socket.emit(eventName, data)
  }
}
