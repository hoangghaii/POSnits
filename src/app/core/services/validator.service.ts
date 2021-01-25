import { RegexValidator } from 'src/app/constants/global-const';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as mo from 'moment';

export class ValidatorService extends Validators {
  /**
   * Validate selected
   * Returns the validation result if enabled, otherwise null.
   */
  static selectRequired(ctrl: AbstractControl): ValidationErrors {
    if (!ctrl || !ctrl.value) {
      return { selectRequired: true };
    }
    return null;
  }

  /**
   * Validate date
   * Returns the validation result if enabled, otherwise null.
   */
  static dateRequired(ctrl: AbstractControl): ValidationErrors {
    if (!ctrl || !ctrl.value) {
      return { dateRequired: true };
    }
    return null;
  }

  /**
   * Validate compare date | hour
   * Returns the validation result if enabled, otherwise null.
   */
  static isGteDate(field: string, isHour = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      let stDate = control.root.get(field)?.value;
      let sdDate = control.value;
      if (stDate && stDate != null && sdDate != null) {
        if (isHour) {
          const now = mo().format('YYYY-MM-DD');
          stDate = mo(now + ' ' + stDate + ':00').format('YYYY-MM-DD HH:mm:ss');
          sdDate = mo(now + ' ' + sdDate + ':00').format('YYYY-MM-DD HH:mm:ss');
        }

        if (!mo(stDate).isValid() || !mo(sdDate).isValid()) {
          return { isDate: true };
        }

        return (mo(stDate).isSameOrBefore(mo(sdDate))) ? null : { isGteDate: true };
      }

      return null;
    };
  }

  /**
   * Validate compare date | hour
   * Returns the validation result if enabled, otherwise null.
   */
  static isLteDate(field: string, isHour = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      let stDate = control.root.get(field)?.value;
      let sdDate = control.value;
      if (stDate && stDate != null && sdDate != null) {
        if (isHour) {
          const now = mo().format('YYYY-MM-DD');
          stDate = mo(now + ' ' + stDate + ':00').format('YYYY-MM-DD HH:mm:ss');
          sdDate = mo(now + ' ' + sdDate + ':00').format('YYYY-MM-DD HH:mm:ss');
        }

        if (!mo(stDate).isValid() || !mo(sdDate).isValid()) {
          return { isDate: true };
        }

        return (mo(stDate).isSameOrAfter(mo(sdDate))) ? null : { isLteDate: true };
      }

      return null;
    };
  }

  /**
   * Validate number
   * Returns the validation result if enabled, otherwise null.
   */
  static isNumber(ctrl: AbstractControl): ValidationErrors {
    if (ctrl.value && !ctrl.value.toString().match(RegexValidator.numberOnlyRegex)) {
      return { isNumber: true };
    }
    return null;
  }

  /**
   * Validate number
   * Returns the validation result if enabled, otherwise null.
   */
  static isDay(ctrl: AbstractControl): ValidationErrors {
    if (ctrl.value === '') {
      return null;
    }
    const b = Number(ctrl.value);
    if (isNaN(b)) {
      return { isNumberZipCode: true };
    }
    if (b < 1 || b > 31) {
      return { isDay: true };
    }

    return null;
  }

  /**
   * Validate email
   * Returns the validation result if enabled, otherwise null.
   */
  static email(ctrl: AbstractControl): ValidationErrors {
    if (ctrl.value && !ctrl.value.toString().match(RegexValidator.emailRegex)) {
      return { email: true };
    }
    return null;
  }

  /**
   * Validate min
   * Returns the validation result if value fewer than @min, otherwise null.
   */
  static min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (control.value === '') {
        return null;
      }
      const b = +control.value;
      if (b < min) {
        return { min: true };
      }
      return null;
    };
  }

  /**
   * Validate isTelepphoneNumber
   * Returns the validation result if enabled, otherwise null.
   */
  static isTelNumber(length: number): ValidatorFn {``
    return (control: AbstractControl): ValidationErrors => {
      const b = control.value;
      if (!control || !control.value) {
        return { isTelNumber: true, length: length };
      }
      if (b && !b.toString().match(RegexValidator.numberOnlyRegex)) {
        return { isTelNumber: true, length: length };
      }
      if (control.value.length > length) {
        return { isTelNumber: true, length: length };
      }
      return null;
    };
  }

  /**
   * Validate isTelepphoneNumber
   * Returns the validation result if enabled, otherwise null.
   */
  static isPostalCdNumber(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const b = control.value;
      if (!control || !control.value) {
        return { isPostalCdNumber: true, length: length };
      }
      if (b && !b.toString().match(RegexValidator.numberOnlyRegex)) {
        return { isPostalCdNumber: true, length: length };
      }
      if (b.length !== length) {
        return { isPostalCdNumber: true, length: length };
      }
      return null;
    };
  }

  /**
   * Validate number
   * Returns the validation result if enabled, otherwise null.
   */
  static isCharacterKatakana(ctrl: AbstractControl): ValidationErrors {
    if (ctrl.value && !ctrl.value.toString().match(RegexValidator.characterKatakana)) {
      return { isCharacterKatakana: true };
    }
    return null;
  }
}
