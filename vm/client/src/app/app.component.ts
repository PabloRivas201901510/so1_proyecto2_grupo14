import { Component } from '@angular/core';
import {ServiceRedisService} from './services/service-redis.service'
import { ChartConfiguration, ChartData, ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "covid"
  public message : any[] = [];
  public areas: any[] = [];
  public top5 : any[] = [];

  public mostrar_monitory: Boolean = false;
  public mostrar_dashboard: Boolean = true;

  //----------------------------------- Chats js configs
  public pieChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: false,
    scales: {
    },
    annotation: {
    },
    legend: {
      display: true,
      position: 'right',
      labels: {
          fontColor: 'white',
          fontSize: 20,
      }
  },
  };
  public pieChartType: ChartType = 'pie';
  //----------------------------------------------------------------------

  //---------------------- One Dode ---------------------------
  public pieChartDataOneDose: ChartDataSets[] = [
    { data: [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], label: 'One Dose' }
  ];
  public pieChartLabelsOneDose: Label[] = [];
  //----------------------------------------------------------------------

  //---------------------- Complete Scheme ----------------------------------

  public pieChartDataCompleteScheme: ChartDataSets[] = [
    { data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], label: 'Complete Scheme' }
  ];
  public pieChartLabelsCompleteScheme: Label[] = [];
  //----------------------------------------------------------------------

  //------------------ Age Range -------------------------------

  public barChartDataAgeRange: ChartDataSets[] = [
    { data: [1,2,3], label: ' Age Range Trend' }
  ];
  //
  public barChartLabelsAgeRange: Label[] = ['niños: 0-10', 'adolecentes: 11-18', 'jovenes: 19-26', 'adultos: 27-59', 'vejez: 60 o mas'];
  public barChartOptionsAgeRange: (ChartOptions & { annotation: any }) = {
    responsive: false,
    legend: {
      display: true,
      labels: {
          fontColor: 'white',
          fontSize: 15,
      }
    },
    elements:{
      line : {
        tension : 0
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          fontColor: 'white',
        },
        scaleLabel: {
          display: true,
          labelString: 'Age range',
          fontColor: 'white',
          fontSize: 20
      },
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            color: 'rgba(255,255,255,0.3)',
          },
          ticks: {
            fontColor: 'white',
          },
          scaleLabel: {
            display: true,
            labelString: 'Number of people',
            fontColor: 'white',
            fontSize: 20
        },
        },
        
      ]
    },
    annotation: {
      
    },
  };
  public barChartColorsAgeRange: Color[] = [
    
    { 
      backgroundColor: 'rgba(255,255,255,0.4)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public barChartLegendAgeRange = true;
  public barChartTypeAgeRange: ChartType = 'bar';

  //----------------------------------------------------------------------

  public reloj = ""

  constructor(private webSocketService: ServiceRedisService) { }

  ngOnInit(): void {
    this.webSocketService.getNewMessage().subscribe((message: string) => {
      this.reloj = this.voidReloj()
      if (message){
        var array = message.split("|\n")
        console.log("conectado cliente")

        // ------ Ultimas 5 personas vacunadas ------
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
        // ------------------------------------------------

        // ------ Top 3 de áreas con mayor vacunados ------
        var mongo2 = array[2].toString()
        var mongodb2 = JSON.parse(mongo2)
        console.log(mongodb2)
        var count = 0;
        var auxlist1 = []
        var sumCompletSq = 0

        for(let i in mongodb2.mongodb2){
          if(count < 3){
            auxlist1.push(mongodb2.mongodb2[i])
          }
          sumCompletSq+=<number>mongodb2.mongodb2[i].count;
          count ++;
        }
        this.areas = auxlist1;
        // ------------------------------------------------
        
        // --------------------- Grafica de Esquema Completo ---------------------------
        var auxlistSqName = []
        var auxlistSqCount = []
        for(let i in mongodb2.mongodb2){
          var tmp1 : number = (<number>mongodb2.mongodb2[i].count* 100)/ sumCompletSq
          auxlistSqName.push(mongodb2.mongodb2[i]._id+" | "+mongodb2.mongodb2[i].count+" | "+tmp1.toFixed(2)+"%")
          auxlistSqCount.push(tmp1)
        }
        this.pieChartDataCompleteScheme[0].data = auxlistSqCount;
        this.pieChartLabelsCompleteScheme = auxlistSqName;
        // -------------------------------------------------------------------------

        // ---------------------- Grafica de Una dosis --------------------------
        var mongo1 = array[1].toString()
        var mongodb1 = JSON.parse(mongo1)
        var auxlistOnedoseName = []
        var auxlistOnedoseCount = []
        var countOneDose = 0
        for(let i in mongodb1.mongodb1){
          countOneDose += <number>mongodb1.mongodb1[i].count;
        }
        for(let i in mongodb1.mongodb1){
          var tmp1 : number = (<number>mongodb1.mongodb1[i].count* 100)/ countOneDose
          auxlistOnedoseName.push(mongodb1.mongodb1[i]._id+" | "+mongodb1.mongodb1[i].count+" | "+tmp1.toFixed(2)+"%")
          auxlistOnedoseCount.push(tmp1)
        }
        this.pieChartDataOneDose[0].data = auxlistOnedoseCount
        this.pieChartLabelsOneDose = auxlistOnedoseName
        // -------------------------------------------------------------------------


        // ----------------Grafica de Dosis por rango de edades--------------------------------
        this.barChartDataAgeRange[0].data = [ rediss.retorno1, rediss.retorno2, rediss.retorno3, rediss.retorno4, rediss.retorno5]
        
        // -------------------------------------------------------------------------

        this.message =  JSON.parse(array[3]).mongodb3; 
      }
    });
  }

  voidReloj(){
    var fechaHora = new Date();
    var horas = fechaHora.getHours();
    var minutos = fechaHora.getMinutes();
    var segundos = fechaHora.getSeconds();

    var sufijo = ' am';
    if(horas > 12) {
      horas = horas - 12;
      sufijo = ' pm';
    }
    var h= horas+""
    var m = minutos+""
    var s = segundos+""
    if(horas < 10) { h = '0' + horas; }
    if(minutos < 10) { m = '0' + minutos; }
    if(segundos < 10) { s = '0' + segundos; }
    return h+":"+m+sufijo
  }

  voidshowdashboard(){
    this.mostrar_dashboard = true;
    this.mostrar_monitory = false;
  }

  voidshowmonitory(){
    this.mostrar_dashboard = false;
    this.mostrar_monitory = true;
  }

  
}
