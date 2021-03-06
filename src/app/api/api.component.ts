import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { environment } from './../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {

  public title = "Projet ICC 2k19";
  public backEndUrl = environment.backEndUrl;
  public isCollapsed = true;

  // Lien vers l'api scala entré par l'utilisateur
  public apiLink = "/hiking/72314";
  // Json response
  public jsonResponse = null;
  // Body bodyRequest
  public bodyRequest = "";
  public body = false;

  public mapBodyRequest = {
    "/extract": "",
    "/geolocalize": "",
    "/utm": "",
    "/images": "",
    "/tiles": "",
    "/save": "",
    "/metadata": "",
    "/elasticsearch": ""
  };

  editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    minimap: {
      enabled: false
    },
    wordWrap: "on",
    formatOnPaste: "true"
  };

  constructor(private httpClient: HttpClient) { }

  getApiLink(ngbTabChangeEvent: NgbTabChangeEvent){
    this.apiLink = ngbTabChangeEvent.nextId;
    this.body = !(this.apiLink == "/hiking/72314" || this.apiLink == "/tiles/status/");
    this.jsonResponse = null;
    this.bodyRequest = this.mapBodyRequest[this.apiLink];
  }

  onSubmit(){
    if (this.body) {
      this.httpClient.post(environment.backEndUrl + this.apiLink, this.bodyRequest, httpOptions).subscribe(
        res => {
          this.jsonResponse = res;
        },
        error => this.jsonResponse = { "error": error.error }
      );
    } else {
      this.httpClient.get(environment.backEndUrl + this.apiLink).subscribe(
        res => {
          this.jsonResponse = res;
        },
        error => this.jsonResponse = { "error": error.error }
      );
    }
  }

  bodyRequestChange(){
    this.mapBodyRequest[this.apiLink] = this.bodyRequest;
  }

  copyToClipBoard(){
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    dummy.value = JSON.stringify(this.jsonResponse, null, 4);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  ngOnInit() {
    this.onSubmit();
  }

}
