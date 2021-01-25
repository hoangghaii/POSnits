import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const yubinbango_url = 'https://yubinbango.github.io/yubinbango-data/data/';

@Injectable({
  providedIn: 'root',
})
export class CommonServicesService {
  protected httpOptions = {
    headers: new HttpHeaders({}),
  };

  public isToogle: boolean = false;

  constructor(private http: HttpClient) {
  }

  getContent(code) {
    let theUrl = yubinbango_url + code + '.js';
    let xmlhttp = null;
    let currentLlocation = '';

    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        currentLlocation = xmlhttp.responseText;
      }
    };

    xmlhttp.open('GET', theUrl, false);
    xmlhttp.send();
    return currentLlocation;
  }
}
