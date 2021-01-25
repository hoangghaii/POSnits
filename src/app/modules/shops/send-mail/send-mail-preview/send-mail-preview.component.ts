import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-send-mail-preview',
  templateUrl: './send-mail-preview.component.html',
  styleUrls: ['./send-mail-preview.component.scss']
})
export class SendMailPreviewComponent implements OnInit {
  @Input() open : boolean;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  public body= '';
  constructor() { }

  ngOnInit(): void {
  }
  closeModal(){
    this.body = '';
    this.confirm.emit({ open: false });
  
  }

}
