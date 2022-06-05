import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.page.html',
  styleUrls: ['./periods.page.scss'],
})
export class PeriodsPage implements OnInit {

  constructor(private dataService: DataService) { }

  periodsData: any
  editEnabled = false
  editedRows= []

  ngOnInit() {
    this.getAllPeriods()
  }

  async getAllPeriods(){
    this.periodsData = await this.dataService.fetchAllPeriods()
    if(this.periodsData==null){
      this.periodsData = [{PERIODSTART: "Couldn't fetch periods. ",
    PERIOD:"", PERIODEND: ""}]
    }

    for(let i=0; i<this.periodsData.length; i++){
      this.editedRows.push({PERIODID: this.periodsData[i].PERIODID, edited: false})
    }

    console.log(this.editedRows)
    
  
  }

  async editTimetable(i: number){

    // for(let i=0; i<this.editedRows.length; i++){
    //   if(this.editedRows[i].PERIODID == PERIODID)  this.editedRows[i].edited = true
    //   break
    // }

    this.editedRows[i].edited = true

  }

  async saveRow(i: number, PERIODID: number, PERIOD: string, PERIODSTART: string, PERIODEND: string){

    this.editedRows[i].edited = false
    this.dataService.savePeriod(PERIODID,PERIOD,PERIODSTART,PERIODEND)
    console.log("Updating data for PeriodId ", PERIODID)

  }

}
