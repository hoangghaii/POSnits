import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class YubinbangoService {
  private apiUrl = 'https://yubinbango.github.io/yubinbango-data/data/';

  constructor() {
  }

  /**
   * Postcode for JAPAN
   *
   * @param {number} code
   *
   * @return {any}
   */
  private getContent(code) {
    const apiFullUrl = this.apiUrl + code + '.js';
    let xmlHttp = null;
    let result = null;

    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlHttp = new XMLHttpRequest();
    }
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        result = xmlHttp.responseText;
      }
    };

    xmlHttp.open('GET', apiFullUrl, false);
    xmlHttp.send();

    return result;
  }

  /**
   * Postcode for JAPAN
   *
   * @param {number} code
   *
   * @return {null | any} The Object post code
   */
  getPostalCode(code) {
    let postalCodes = this.getContent(code);
    if (postalCodes) {
      postalCodes = postalCodes.replace('$yubin(', '');
      postalCodes = postalCodes.replace(');', '');

      return JSON.parse(postalCodes);
    }

    return null;
  }
}
