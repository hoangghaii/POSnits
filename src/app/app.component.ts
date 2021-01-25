import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLogin = false;
  title = 'POSnist';
  showComponents: boolean = false;

  constructor(
    private translate: TranslateService,
    private router: Router,
    public http: HttpClient,
    public auth: AuthService
  ) {
    translate.setDefaultLang('jp');
    // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] != '/login' && event['url'] != '/forgot-password' && this.auth.isAuthenticated()) {
          this.showComponents = true;
        } else {
          this.showComponents = false;
        }
      }
    });
  }

  /**
   * Init component
   */
  ngOnInit(): void {
  }

  /**
   * Change language
   */
  switchLanguage(language: string): void {
    this.translate.use(language);
  }
}
