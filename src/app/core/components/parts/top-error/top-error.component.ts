import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-top-error',
  templateUrl: './top-error.component.html',
  styleUrls: ['./top-error.component.scss']
})
export class TopErrorComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formMap;
;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Show errors
   */
  showErrors(): boolean {
    if (this.form && this.form.invalid) {
      return this.form.invalid;
    }
    return false;
  }

  /**
   * Get form Err
   */
  getFormChildErr(form: FormGroup, item): object {
    let err = {};

    if (form.get(item) instanceof FormArray) {
      const formArr = form.get(item) as FormArray;
      if (formArr.invalid) {
        formArr.controls.forEach((itemGroup: FormGroup) => {
          if (itemGroup.invalid) {
            for (const [iptKey, iptValue] of Object.entries(itemGroup.controls)) {
              if (itemGroup.controls[iptKey].errors) {
                err = {...err, ...{[iptKey]: {errors: itemGroup.controls[iptKey].errors}}};
              }
            }
          }
        });
      }
    } else if (form.get(item) instanceof FormGroup) {
      const formGro = form.get(item) as FormGroup;
      if (formGro.invalid) {
        for (const [iptKey, iptValue] of Object.entries(formGro.controls)) {
          if (formGro.controls[iptKey].errors) {
            err = {...err, ...{[iptKey]: {errors: formGro.controls[iptKey].errors}}};
          }
        }
      }
    }

    return err;
  }
}
