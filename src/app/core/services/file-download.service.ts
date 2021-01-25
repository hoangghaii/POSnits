import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import {DatePipe} from '@angular/common';

@Injectable({providedIn: 'root'})
export class FileDownloadService {
  constructor(private datePipe: DatePipe) {
  }

  /**
   * Download file xls
   *
   * @param {Blob} data
   * @param {String} name
   *
   * @return void
   */
  downloadExcel(data, name = ''): void {
    const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const blob = new Blob([data], {type: contentType});
    const fileName = name.replace('.xlsx', '') + '_' + this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss') + '.xlsx';
    FileSaver.saveAs(blob, fileName);
  }

  /**
   * Download file pdf
   *
   * @param {Blob} data
   * @param {String} name
   *
   * @return void
   */
  downloadPdf(data, name = null): void {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  /**
   * 
   */
  downloadBill(data, name = null): void {
    const contentType = 'application/pdf';
    const blob = new Blob([data], {type: contentType});
    // const fileName = name.replace('.pdf', '') + '_' + this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss') + '.pdf';
    FileSaver.saveAs(blob);
  }
}
