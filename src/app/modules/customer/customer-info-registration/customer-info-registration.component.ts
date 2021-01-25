import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/core/services';
import { PersonalInfoComponent } from './personal-info/personal-info.component';


@Component({
  selector: 'app-customer-info-registration',
  templateUrl: './customer-info-registration.component.html',
  styleUrls: ['./customer-info-registration.component.scss']
})
export class CustomerInfoRegistrationComponent implements OnInit {
  userLogin;
  id;
  /**
   * Tab current
   */
  tabCurrent: any = new BehaviorSubject<object>({active: true, index: 0});
  @ViewChild(PersonalInfoComponent) tab1: PersonalInfoComponent;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,) { }

  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.id = this.route.snapshot.paramMap.get('id');
  }

  /**
   * Open tab
   * @param evt
   * @param tabName
   */
  openTab(i) {
    this.tabCurrent.next({active: true, index: i});
  }
}
