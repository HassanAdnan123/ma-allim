import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Options } from 'selenium-webdriver';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public httpClient: HttpClient) { }

  responseFromAPI: any
  usersCatalog: any
  setNoResponse = false

  async sendPostRequest(requestJson) {
    this.setNoResponse = false
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }

    let postRequest = {
      "userid" : requestJson.userid,
      "month" : requestJson.month,
      "year": requestJson.year
    }

    await this.httpClient.post("https://maallim-backend-node.herokuapp.com/attendance", postRequest, httpOptions).toPromise().then(data => {
      this.responseFromAPI = data
    }, error => {
      this.setNoResponse = true
    })
    if(!this.setNoResponse)
      return this.responseFromAPI
    else { 
      console.log("Error response is set to: "+this.setNoResponse)
      return {error: this.setNoResponse} 
    }
  }

  async fetchAllUsers() {
    this.setNoResponse = false
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }


    await this.httpClient.post("https://maallim-backend-node.herokuapp.com/users", httpOptions).toPromise().then(data => {
      this.usersCatalog = data
    }, error => {
      console.log("Unable to fetch users")
      this.usersCatalog = null
    })

      return this.usersCatalog
    
  }

}
