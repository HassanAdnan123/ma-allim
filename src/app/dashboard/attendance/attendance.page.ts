import { Component, OnInit } from '@angular/core';
import { DataService } from './../../services/data.service';
import { AlertController } from '@ionic/angular';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  constructor(private dataService: DataService, private alertController: AlertController) { }

  APIdata: any
  data = []
  users = []

  AbsenceSummary: object = null
  // monthsWith31Days = [{January: 0},
  // ]


  startloader = false
  userid = ""
  month = ""
  year = "2021"

  header = {"period": "Period",  
            "logindate": "Login Date",  
            "name": "Name",
            "logintime": "Login Time",
            "status":"Status",
            "minuteslate": "Minutes Late"
          }
  ngOnInit() {
    this.getAllUsers()
  }
  async callService(){
    this.startloader = true
    
    this.APIdata = await this.dataService.sendPostRequest({userid: this.userid, month: this.month, year: this.year})
    
     if(!this.APIdata.error){
     this.populateGrid(this.APIdata)
     this.AbsenceSummary = this.calculateAbsences(this.data)
    }
     else await this.presentAlert("Server down","Unable to get data from database server!");
    
    this.startloader = false
  }

  async getAllUsers(){
    this.users = await this.dataService.fetchAllUsers()
  }

  calculateAbsences(data: any){
    let dated: number, dayspresent: number = 0
    console.log(data.length)
      for(let day = 1; day<31; day++){
        for(let element of data) {
          dated = new Date(element.logindate).getDate()
          if (dated == day) { 
            dayspresent++
            break
          }
        }
      }
    console.log("Days Present: "+dayspresent+" Days Absent: "+(31-dayspresent))
    return {dayspresent: dayspresent, daysabsent: (31-dayspresent)}
  }

  populateGrid(datagrid: any)
  {
    this.data = []
    datagrid.forEach(element => {
      this.data.push({period: element.period, 
                      logindate: element.datelogged, 
                      name: element.name, 
                      logintime: element.logintime,
                      minuteslate: element.minuteslate,
                      status: element.status
                    })
    });

  }

  async presentAlert(errortitle: string, errormessage: string) {
    const alert = await this.alertController.create({
      cssClass: 'options',
      header: errortitle,
      //subHeader: errortitle,
      message: errormessage,
      buttons: ['Dismiss']
    });

    await alert.present();

    //const { role } = await alert.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);
  }

}
