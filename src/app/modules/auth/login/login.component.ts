import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { GlobalConst } from 'src/app/constants/global-const';

import { ModalService } from 'src/app/core/services/modal.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidatorService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**
   * Login form
   */
  loginForm: FormGroup;

  /**
   * Set submitted value
   */
  submitted = false;
  formMap
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private modalService: ModalService,
    private router: Router
  ) {}

  /**
   * Init component
   */
  ngOnInit(): void {
    // Init form
    this.initForm();
  }

  /**
   * Init form
   */
  initForm() {
    this.translate.get('login').subscribe((trans) => {
      this.formMap = {
        email: trans?.lbEmail,
        password: trans?.lbPassword,
      };
    });
    this.loginForm = this.fb.group({
      email: ['', [ValidatorService.required,ValidatorService.email]],
      password: ['', ValidatorService.required],
    });
  }

  /**
   * 製品情報フォームコントロールを取得する
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Login action
   */
  login() {
    this.submitted = true;
    // Valid login form
    if (this.loginForm.invalid) {
      return;
    }

    // Call api login
    this.authService.login(this.loginForm.getRawValue()).subscribe(
      (res) => {
        if (res.token) {
          this.localStorageService.setItem(
            GlobalConst.LocalStorageKeyMapping.token,
            res.token
          );
          this.authService.getCurrentUser().subscribe((user) => {
            localStorage.setItem('getUser', JSON.stringify(user));
            this.router.navigateByUrl('/top');
          });
        }
      },
      (error) => {
        this.submitted = false;
        this.translate
          .get('errors.login.incorrectUserPassword')
          .subscribe((msg: string) => {
            this.modalService.open(msg, { width: '335px' });
          });
      }
    );
  }
}
