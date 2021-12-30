import { Component, OnInit } from '@angular/core';
import {ServiceRedisService} from '../../services/service-redis.service'

@Component({
  selector: 'app-component-home',
  templateUrl: './component-home.component.html',
  styleUrls: ['./component-home.component.css']
})
export class ComponentHomeComponent implements OnInit {

  eventName = "send-message"
  public message: string = "h";

  constructor(private webSocketService: ServiceRedisService) { }

  ngOnInit(): void {
    this.webSocketService.listen('text-event').subscribe((data) => {
      this.message = data+"";
    })
  }

}
