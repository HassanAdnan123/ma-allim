import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Options } from 'selenium-webdriver';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public httpClient: HttpClient) { }


  // environment = {backendApi: "https://maallim-backend-node.vercel.app"}
  environment = {backendApi: "https://anxious-train-ray.cyclic.app"}
  // environment = {backendApi: "http://localhost:8080"}

  responseFromAPI: any
  usersCatalog: any
  periods: any
  periodsmapping: any
  setNoResponse = false
  periodduration: any

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  async sendPostRequest(requestJson) {
    this.setNoResponse = false

    let postRequest = {
      "userid" : requestJson.userid,
      "month" : requestJson.month,
      "year": requestJson.year
    }

    await this.httpClient.post(`${this.environment.backendApi}/attendance`, postRequest, this.httpOptions).toPromise().then(data => {
      this.responseFromAPI = data
    }, error => {
      this.setNoResponse = true
    })
    if(!this.setNoResponse)
    { 
      return this.responseFromAPI[0] }
    else { 
      console.log("Error response is set to: "+this.setNoResponse)
      return {error: this.setNoResponse} 
    }
  }


  async postRequest(requestBody, requestUrl) {
    return this.httpClient.post(`${this.environment.backendApi}/${requestUrl}`, requestBody, this.httpOptions).toPromise();
  }

  async fetchAllUsers() {
    this.setNoResponse = false


    await this.httpClient.post(`${this.environment.backendApi}/users`, this.httpOptions).toPromise().then(data => {
      this.usersCatalog = data
    }, error => {
      console.log("Unable to fetch users")
      this.usersCatalog = null
    })

      return this.usersCatalog
    
  }


  async fetchAllPeriods() {


    await this.httpClient.post(`${this.environment.backendApi}/periods`, this.httpOptions).toPromise().then(data => {
      this.periods = data
    }, error => {
      console.log("Unable to get periods.")
    })

      return this.periods
    
  }

  async fetchAllPeriodsByMachine(machineId: any) {

    let postRequest = {"machineId" : machineId}
    console.log(postRequest)

    await this.httpClient.post(`${this.environment.backendApi}/periodsbymachineid`,postRequest, this.httpOptions).toPromise().then(data => {
      this.periods = data
    }, error => {
      console.log("Unable to get periods.")
    })

      return this.periods
    
  }

  async fetchUserPeriodMapping(userid: number, machineId: number) {


    let postRequest = {
      "userid": userid,
      "machineId": machineId

  }

    await this.httpClient.post(`${this.environment.backendApi}/periodsmapping`,postRequest, this.httpOptions).toPromise().then(data => {
      this.periodsmapping = data
    }, error => {
      console.log("Unable to get assigned periods to user.")
    })

      return this.periodsmapping[0]
    
  }

  async deleteMapping(userid: number) {
    let postRequest = {"userid": userid}
    console.log(userid)

    await this.httpClient.post(`${this.environment.backendApi}/deletemapping`,postRequest, this.httpOptions).toPromise().then(data => {
    }, error => {
      console.log("Error deleting mapping.")
    })
    
  }

  async insertMapping(userid: number, periodid: number, machineId) {
    
    let postRequest = {userid,periodid,machineId}

    await this.httpClient.post(`${this.environment.backendApi}/insertmapping`,postRequest, this.httpOptions).toPromise().then(data => {
    }, error => {
      console.log("Error inserting records.", error)
    })
    
  }

  async populatePeriodicData(machineId: number) {
    
    let postRequest = {machineId}

    await this.httpClient.post(`${this.environment.backendApi}/populateperiodicdata`,postRequest, this.httpOptions).toPromise().then(data => {
    }, error => {
      console.log("Error populating attendance.", error)
    })
    
  }

  async savePeriod(PERIODID: number, PERIOD: string, PERIODSTART: string, PERIODEND: string) {
    
    let postRequest = {"periodid": PERIODID, "period": PERIOD, "periodstart": PERIODSTART, "periodend":PERIODEND}

    await this.httpClient.post(`${this.environment.backendApi}/updateperiod`,postRequest, this.httpOptions).toPromise().then(data => {
    }, error => {
      console.log("Error updating period", error)
    })
    
  }

  async getPeriodDuration() {
    await this.httpClient.get(`${this.environment.backendApi}/periodduration`, this.httpOptions).toPromise().then(data => {
      this.periodduration = data
    }, error => {
      console.log("Error getting period duration.", error)
    })
    return this.periodduration[0].value
  }


  async savePeriodDuration(PeriodDuration: number) {
    
    let postRequest = {"periodduration": PeriodDuration}
    await this.httpClient.post(`${this.environment.backendApi}/updateperiodduration`,postRequest, this.httpOptions).toPromise().then(data => {
      console.log(data)
    }, error => {
      console.log("Error updating period", error)
    })
    
  }

  async getAllMachines(){
    let machines: any
    await this.httpClient.get(`${this.environment.backendApi}/getallmachines`, this.httpOptions).toPromise().then(data => {
      machines = data
    }, error => {
      console.log("Error getting machine details", error)
    })
    return machines
  }

  async addNewMachine(machine){
    let postRequest = {"machine": machine}
    let response: any
    await this.httpClient.post(`${this.environment.backendApi}/addmachine`,postRequest, this.httpOptions).toPromise().then(data => {
      response = data
    }, error => {
      console.log("Error adding new machine", error)
    })
    return response
  }

  async deleteMachine(){
    
  }

}
