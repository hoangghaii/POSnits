import {Component, OnInit} from '@angular/core';
import {TechClassification} from 'src/app/core/models';
import {Constants} from 'src/app/constants/constants';
import {TechClassificationService} from 'src/app/core/services/apis';
import {AuthService} from 'src/app/core/services';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-skill-classes',
  templateUrl: './skill-classes.component.html',
  styleUrls: ['./skill-classes.component.scss']
})
export class SkillClassesComponent implements OnInit {
  public techClassificationList: TechClassification[];
  public isOpen: boolean;
  public categoryCd = Constants.categoryClass.TECH;
  public statusOpen = null;
  public selectCurrent: any;
  public userLogin: any;

  /**
   * コンストラクタ
   * @param techClassificationService
   * @param authService
   */
  constructor(
    private techClassificationService: TechClassificationService,
    private authService: AuthService
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.techClassificationList = await this.getClasses();
  }

  /**
   * レジスターを開く
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.isOpen = true;
  }

  /**
   * モーダルを閉じる
   */
  async closeModal(event: any): Promise<void> {
    if (event.status && event.status === 'upCreate') {
      this.techClassificationList = await this.getClasses();
    }
    this.isOpen = event.isOpen;
  }

  /**
   * 分類情報一覧を取得する
   */
  async getClasses(): Promise<TechClassification[]> {
    return await this.techClassificationService
      .getClasses(this.userLogin.shop_id, this.categoryCd)
      .toPromise();
  }

  /**
   * モーダルを開く。
   */
  selectedRow(select: TechClassification): void {
    this.selectCurrent = select;
    this.isOpen = true;
  }

  /**
   * 落とす
   * @param event
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.techClassificationList,
      event.previousIndex,
      event.currentIndex
    );
    for (let i = 0; i < this.techClassificationList.length; i++) {
      this.techClassificationList[i].sort = i;
    }
    this.updateSortIndex();
  }

  /**
   * 分類情報一覧を取得する
   */
  updateSortIndex(): void {
    const body = {
      shopId: this.userLogin.shop_id,
      list: JSON.stringify(this.techClassificationList),
      category_cd: this.categoryCd,
    };
    this.techClassificationService
      .updateSortIndex(this.userLogin.shop_id, body)
      .subscribe((rs) => {
        this.getClasses();
      });
  }

  /**
   * Toggle big list
   */
  toggleBigList(): void {
    const toggle = document.getElementById('toggle-bigList');
    const btnToggle = document.getElementById('btn-toggle-bigList');
    if (toggle.hasAttribute('open')) {
      toggle.removeAttribute('open');
      toggle.classList.remove('animation');
      btnToggle.classList.toggle('animation');
    } else {
      toggle.setAttribute('open', '');
      toggle.classList.toggle('animation');
      btnToggle.classList.toggle('animation');
    }
  }
}
