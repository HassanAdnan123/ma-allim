import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  formData: any = {}
  editEnabled = false
  editedRows= []
  editedPeriodDuration = false
  periodduration: number
  selectedMachineId = null
  machines: any
  addPeriodFlag = false

  ngOnInit() {
    this.fetchMachines()
  }

  async getAllPeriods(){
    this.periodsData = await this.dataService.fetchAllPeriodsByMachine(this.selectedMachineId)
    if(this.periodsData==null){
      this.periodsData = [{PERIODSTART: "Couldn't fetch periods. ",
    PERIOD:"", PERIODEND: ""}]
    }


    for(let i=0; i<this.periodsData.length; i++){
      this.editedRows.push({PERIODID: this.periodsData[i].PERIODID, edited: false})
    }
  }

  async fetchMachines(){
    this.machines = await this.dataService.getAllMachines()
    this.machines.forEach(machine => {
      machine.machine_name = machine.machine_name.toUpperCase(); // Caps case
    });
  }

  async editTimetable(i: number){

    this.editedRows[i].edited = true

  }


  async saveRow(i: number, PERIODID: number, PERIOD: string, PERIODSTART: string, PERIODEND: string){

    this.editedRows[i].edited = false
    this.dataService.savePeriod(PERIODID,PERIOD,PERIODSTART,PERIODEND)
    console.log("Updating data for PeriodId ", PERIODID)

  }


  toggleAddPeriod(){
    this.addPeriodFlag = !this.addPeriodFlag
  }

  async savePeriodDuration(){

    this.editedPeriodDuration = false
    this.dataService.savePeriodDuration(this.periodduration)
    console.log(`Updating period duration to ${this.periodduration}`)

  }

  async addPeriod(){
    if(this.selectedMachineId == null){
      alert("Please select a machine first to add period.")
    }
    else {
      this.formData = {...this.formData,
        machineId : this.selectedMachineId
      }
      console.log(this.formData)
      await this.dataService.postRequest(this.formData,'addPeriod').then(data=>{
        alert("Period added successfully.")
        this.toggleAddPeriod()
        this.getAllPeriods()
      })
    }

    

    

  }

  async deletePeriod(periodId: any){
    let confirmation = confirm("Are you sure you want to remove this period?")
    // console.log("Deleting Period: ",periodId , confirmation)
    if(confirmation){
      await this.dataService.postRequest({
        periodId
      },"deleteperiod").then((data)=> {
        
        alert("Period deleted succesfully")
        this.getAllPeriods() 
      })
    }
  }

}
