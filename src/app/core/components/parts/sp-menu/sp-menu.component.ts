import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { CommonServicesService } from 'src/app/core/services/common-services.service';

@Component({
  selector: 'app-sp-menu',
  templateUrl: './sp-menu.component.html',
  styleUrls: ['./sp-menu.component.scss'],
})
export class SpMenuComponent implements OnInit {
  constructor(
    public commonServicesService: CommonServicesService,
    public authService: AuthService) {}

  ngOnInit(): void {}

  toogleMenu() {
    this.commonServicesService.isToogle = !this.commonServicesService.isToogle;
  }

  /**
   * ログアウト
   */
  logOut() {
    this.authService.logOut().subscribe(() => {
      location.reload();
    });
  }
}
