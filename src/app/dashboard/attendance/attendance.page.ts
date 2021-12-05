import { Component, OnInit } from '@angular/core';
import { DataService } from './../../services/data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  APIdata: any
  constructor(private dataService: DataService, private alertController: AlertController) { }
  data = []
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
  }
  async callService(){
    this.startloader = true
     this.APIdata = await this.dataService.sendPostRequest({userid: this.userid, month: this.month, year: this.year})
    
     if(!this.APIdata.error)
     this.populateGrid(this.APIdata)
     else await this.presentAlert("Server down","Unable to get data from database server!");
     this.startloader = false
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
      cssClass: 'my-custom-class',
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
