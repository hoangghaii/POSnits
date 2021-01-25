import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { CommonServicesService } from 'src/app/core/services/common-services.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  /**
   * Open popup
   */
  isOpen = false;

  /**
   * Current user
   */
  userLogin: any;
  constructor(public commonServicesService: CommonServicesService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(res => {
      this.userLogin = res;
    });
  }

  /**
   * Toogle menu
   */
  toogleMenu(): void {
    this.commonServicesService.isToogle = !this.commonServicesService.isToogle;
  }

  /**
   * Open modal
   */
  openModal(): void {
    this.isOpen = true;
  }

  /**
   * Close modal
   */
  closeModalRegister(event: any): void {
    this.isOpen = event.open;
  }
}
