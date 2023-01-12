import { Component, OnInit } from '@angular/core';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.page.html',
  styleUrls: ['./timetable.page.scss'],
})
export class TimetablePage implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getAllPeriods()
    this.fetchMachines()
  }

  periodsData: any
  periodsDataByMachine: any
  users: []
  periodsmapping: any
  machines: any
  selecteduserid: any
  editEnabled = false
  formData: any = {}
  selectedMachineId: any = null
  selectedMachineName: any = null

  selectedperiods = []

  setPeriodsMapping = []

  selectMachine(machineId: any){
    this.selectedMachineId = machineId
    this.selectedMachineName = this.machines.find( item => item.machine_id == machineId ).machine_name
    this.getAllPeriodsByMachineId()
  }

async getAllPeriods(){
  this.periodsData = await this.dataService.fetchAllPeriods()
  if(this.periodsData==null){
    this.periodsData = [{PERIODSTART: "Couldn't fetch periods. ",
  PERIOD:"", PERIODEND: ""}]
  }

}

async getAllPeriodsByMachineId() {
  if(this.selectedMachineId == null)
    alert("No machine selected")

  
  else {
    this.formData = {
      machineId : this.selectedMachineId
    }

    await this.dataService.postRequest(this.formData,"periodsbymachineid").then((data:any)=>{
      this.periodsDataByMachine = data
    })
  }
  
}

async getAllUsersByMachine(){
  if (this.selectedMachineId == null) {
    alert("Please select a machine first!")
  }
  else {
    this.formData = {...this.formData,
      machineId : this.selectedMachineId
    }

    await this.dataService.postRequest(this.formData,'usersbymachine').then((data: any)=>{
      this.users = data
    })
  }

}

async getUserPeriodMapping(){
  if(this.selecteduserid!=null){
    this.periodsmapping = await this.dataService.fetchUserPeriodMapping(this.selecteduserid)
    if(this.periodsmapping.length == 0){
      this.periodsmapping = [{NAME: "This user has no timetable.",
      PERIOD:""}]
      console.log("This user has no timetable.")
    }
  }
  else {
    this.periodsmapping = [{NAME: "Please select a valid user.",
    PERIOD:""}]
    console.log("Please select a valid user.")
  }
  
}

async getAllUsers(){
  this.users = await this.dataService.fetchAllUsers()
  if(this.users == null) {
    console.log("Users data missing.")
  }
}

async editTimetable(){
  if(this.selecteduserid != null){
  if(this.editEnabled==false){ // For editing data 
    this.editEnabled=true

    if(this.selecteduserid != null){
      this.setPeriodsMapping = []
      await this.getUserPeriodMapping()
      

      for(let i = 0; i<this.periodsData.length; i++){
        this.setPeriodsMapping.push({val: this.periodsData[i].PERIOD, PERIODID : this.periodsData[i].PERIODID, isChecked: false})

        for(let j = 0; j < this.periodsmapping.length; j++){
          if (this.setPeriodsMapping[i].PERIODID == this.periodsmapping[j].PERIODID)
            {this.setPeriodsMapping[i].isChecked = true
               break}
        }

        
        
      }

    }

  }
  else //For saving data
  { 
    this.editEnabled = false
    console.log(this.setPeriodsMapping)
    await this.dataService.deleteMapping(this.selecteduserid)
    
    for(let i=0; i<this.setPeriodsMapping.length; i++){
      if (this.setPeriodsMapping[i].isChecked){
        console.log("calling insertion for periodid: ", this.setPeriodsMapping[i].PERIODID)
        await this.dataService.insertMapping(this.selecteduserid, this.setPeriodsMapping[i].PERIODID)
      }
    }
  }
}

}
async fetchMachines(){
  this.machines = await this.dataService.getAllMachines()
  this.machines.forEach(machine => {
    machine.machine_name = machine.machine_name.toUpperCase(); // Caps case
  });
}

}
