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

  monthsInWords = [ 'January','February','March','April','May','June',
                    'July','August','September','October','November','December']

  AbsenceSummary: object = null
  noOfDaysInMonths = {
    with30days: [4,6,9,11],
    with31days: [1,3,5,7,8,10,12],
    with28days: 2
  }


  startloader = false
  userid = ""
  month: number
  year = ""
  selectedUser = ""

  header = {"period": "Period",  
            "logindate": "Date",  
            "name": "Name",
            "logintime": "Login Time",
            "status":"Status",
            "minuteslate": "Minutes Late"
          }
  ngOnInit() {
    this.getAllUsers()
    this.dataService.populatePeriodicData()
  }
  async callService(){
    if(this.userid === "" || this.year === "" || this.month === null){
      this.presentAlert("Insufficient data","Please fill all fields!")
    }
    else{
    this.startloader = true
    this.APIdata = await this.dataService.sendPostRequest({userid: this.userid, month: this.month, year: this.year})
    
     if(!this.APIdata.error){
     this.populateGrid(this.APIdata)
     this.AbsenceSummary = this.calculateAbsences(this.data)
    }
     else await this.presentAlert("Server down","Unable to get data from database server!");
    
    this.startloader = false
  }
  }

  async getAllUsers(){
    this.users = await this.dataService.fetchAllUsers()
    if(this.users == null) await this.presentAlert("Server down","Unable to get users from database server!");
  }

  calculateAbsences(data: any){
    
    if(data.length > 0) this.selectedUser = data[0].name
    else this.selectedUser = "No data found"

    let monthLength = (this.noOfDaysInMonths.with31days.includes(this.month)) ? 31 : (this.noOfDaysInMonths.with30days.includes(this.month))?30:28
    let noOfFridays = 0

    let dayspresent: number = 0, daysLate: number = 0;
      for(let day = 1; day<=monthLength; day++){

        // Check for days the user was present
        for(let element of data) {
          let checkday = new Date(element.logindate).getDate()
          if (checkday == day) {
            dayspresent++
            break
          }
        }

        for(let element of data) {
          let checkday = new Date(element.logindate).getDate()
          if (checkday == day) {
            if(element.minuteslate>5)
              { daysLate++
                break
              }
          }
        }

        //Check for official off days (Fridays)
        var dayCheck = new Date(this.year+'-'+this.month+'-'+day)
        if(dayCheck.toString().includes('Fri')) noOfFridays++

      }
    //console.log("Days Present: "+dayspresent+" Days Absent: "+(monthLength-noOfFridays-dayspresent))
    return {dayspresent: dayspresent, 
      daysabsent: (monthLength-noOfFridays-dayspresent),
      totalWorkDays: monthLength-noOfFridays,
      noOfFridays: noOfFridays,
      daysLate: daysLate
    }
  }


  populateGrid(datagrid: any)
  {
    this.data = []
    datagrid.forEach(element => {
      this.data.push({period: element.period, 
                      logindate: element.datelogged.substring(0,10), 
                      name: element.name, 
                      logintime: element.logintime,
                      minuteslate: element.minuteslate,
                      minuteslateinhours: this.convertToHours(element.minuteslate),
                      status: element.status
                    })
    });

  }
  convertToHours(minutes){
    let hoursAndMinutes: string
    if(minutes > 59){
      hoursAndMinutes = Math.floor((minutes/60)).toString()+"h "+(minutes%60)+"min"
      return hoursAndMinutes
    }
    else return minutes.toString()+" min"
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

  toCsv(table){
    // Query all rows
    const rows = table.querySelectorAll('tr');

    return [].slice
        .call(rows)
        .map(function (row) {
            // Query all cells
            const cells = row.querySelectorAll('th,td');
            return [].slice
                .call(cells)
                .map(function (cell) {
                    return cell.textContent;
                })
                .join(',');
        })
        .join('\n');
}
  download(text, fileName){
    const link = document.createElement('a');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`);
    link.setAttribute('download', fileName);

    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  saveAsCsv(){
    const table = document.getElementById('exportToCSV')
    const csv = this.toCsv(table);
    // Download it
    this.download(csv, this.selectedUser +' ('+this.monthsInWords[this.month-1]+'-'+this.year+')' +'.csv');
  }
}
