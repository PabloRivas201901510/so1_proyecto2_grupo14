import { Component, OnInit } from '@angular/core';
import {ServiceRedisService} from '../../services/service-redis.service'

@Component({
  selector: 'app-component-home',
  templateUrl: './component-home.component.html',
  styleUrls: ['./component-home.component.css']
})
export class ComponentHomeComponent implements OnInit {

  public message: string = "h";
  public areas: any[] = [];
  public top5 : any[] = [];

  constructor(private webSocketService: ServiceRedisService) { }

  ngOnInit(): void {
    this.webSocketService.getNewMessage().subscribe((message: string) => {
      
      if (message){
        var array = message.split("|\n")
        console.log("conectado cliente")

        // ------Ultimas 5 personas vacunadas
        try { 
          var redis = array[0].toString()
          var rediss = JSON.parse(redis)
        
          var auxlist = [];
          for(let i in rediss.retorno){
            var tmp = JSON.parse(rediss.retorno[i])
            auxlist.push(tmp)
          }
          this.top5 = auxlist;
        }catch(err){
          console.log("error redis")
        }
        // ------------------------------------

        // ------ Top 3 de áreas con mayor vacunados
        
          var mongo2 = array[2].toString()
          var mongodb2 = JSON.parse(mongo2)
          console.log(mongodb2)
          var count = 0;
          var auxlist = []
          for(let i in mongodb2.mongodb2){
            if(count > 2){
              break;
            }
            console.log(mongodb2.mongodb2[i])
            count ++;
          }
        
        
        

        this.message = array+ "\n"; 
        }
      
      
       
    });
  }

}
