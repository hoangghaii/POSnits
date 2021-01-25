import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { ModalService, UploadService } from 'src/app/core/services';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @Input() imagesUrl = null;
  @Input() label = '';
  @Input() isButton = true;
  @Input() fileSelectionLabel = '';
  maxSize = Constants.maxSize;
  availableType = Constants.availableType;

  @Output() confirm: EventEmitter<any> = new EventEmitter();

  constructor(
    private uploadService: UploadService,
    private translate: TranslateService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Execute file
   */
  fileSelected(files: FileList): void {
    if (!files.length || files.length <= 0) {
      return;
    }
    const selectFile: File = files[0];
    const file = Math.round((selectFile.size / 1024));
    let available = false;
    for (let i = 0; i < this.availableType.length; i++) {
      if (selectFile.type === this.availableType[i]) {
        available = true;
        break;
      }
    }
    if ( !available ) {
      this.translate.get('msgError.typeImageError').subscribe(msg => {
        this.modalService.open(msg);
      });
      return;
    }
    if ( file > this.maxSize ) {
      this.translate.get('msgError.sizeImageError').subscribe(msg => {
        this.modalService.open(msg);
      });
      return;
    }
    if (file < this.maxSize && available) {
      this.uploadService.upload(selectFile)
      .subscribe(res => {
        this.confirm.emit({file: res});
        this.imagesUrl = res.url;
      });
    }
  }

  removeImg() {
    this.imagesUrl = null;
  }
}
