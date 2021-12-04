import { Component, OnInit } from '@angular/core';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  APIdata: any
  constructor(private dataService: DataService) { }
  data = []
  header = {"period": "Period",  "logindate": "Login Date",  "name": "Name",  "logintime": "Login Time"}
  ngOnInit() {
  }
  async callService(){
     this.APIdata = await this.dataService.sendPostRequest(7)
    console.log(this.APIdata)
    this.populateGrid(this.APIdata)
  }
  populateGrid(datagrid: any)
  {
    datagrid.forEach(element => {
      this.data.push({period: element.period, logindate: element.logindate, name: element.name, logintime: element.logintime})
    });

  }

}
