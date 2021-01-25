import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.scss'],
})
export class ShowErrorsComponent implements OnInit {
  @Input() ctrl: FormControl;
  @Input() nameControll: string;

  @Input() errorMsg?: string;
  ERROR_MESSAGE = {
    required: () => `※${this.nameControll}を入力してください。`,
    max: (par) =>
      `※ ${this.nameControll}は${par.max}以下の数値である必要があります。`,
    min: (par) =>
      `※ ${this.nameControll}は${par.min}以上の数値である必要があります。`,
    minlength: (par) =>
      `※ ${this.nameControll}は${par.requiredLength}文字以上でなければなりません。`,
    maxlength: (par) =>
      `※ ${this.nameControll}は${par.requiredLength}文字以内でなければなりません。`,
    email: () => `※ ${this.nameControll} はメールアドレス形式である必要があります。` 
    // pattern: () => `※${this.nameControll}を入力してください。`,
  };

  constructor() {}

  ngOnInit() {}

  shouldShowErrors(): boolean {
    return this.ctrl && this.ctrl.errors != null;
  }

  listOfErrors(): string[] {
    let self = this;
    return Object.keys(this.ctrl.errors).map(function (err) {
      if (err == 'pattern') {
        return self.errorMsg;
      } else {
        return self.ERROR_MESSAGE[err](self.ctrl.getError(err));
      }
    });
  }
}
