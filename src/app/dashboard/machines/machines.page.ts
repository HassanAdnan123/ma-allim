import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.page.html',
  styleUrls: ['./machines.page.scss'],
})
export class MachinesPage implements OnInit {

  machines: any
  addedMachine = null
  addedMachineResponse
  formData: any = {}

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.fetchMachines()
  }

  async fetchMachines(){
    this.machines = await this.dataService.getAllMachines()
    this.machines.forEach(machine => {
      machine.machine_name = machine.machine_name.toUpperCase(); // Caps case
    });
  }

  async addNewMachine(){
    this.addedMachineResponse = await this.dataService.addNewMachine(this.addedMachine)
    alert(this.addedMachineResponse.response)
    await this.fetchMachines()
  }

  async deleteMachine(machineId){
    this.formData = {
      machineId
    }
    await this.dataService.postRequest(this.formData,'deletemachine').then((data: any)=>{
      alert("Machine deleted successfully!")
      this.fetchMachines()
    })
  }

}
