import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Options } from 'selenium-webdriver';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public httpClient: HttpClient) { }

  responseFromAPI: any

  async sendPostRequest(noOfRecs) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }

    let postRequest = {
      "noOfRecs": noOfRecs
    }

    await this.httpClient.post("https://localhost:44385/api/maallim", postRequest, httpOptions).toPromise().then(data => {
      this.responseFromAPI = data
    }, error => {
      console.log(error);
    })

    return this.responseFromAPI
  }

}
