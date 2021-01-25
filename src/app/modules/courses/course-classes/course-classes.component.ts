import {Component, OnInit} from '@angular/core';
import {CoursesClassification} from '../../../core/models';
import {Constants} from '../../../constants/constants';
import {TechClassificationService} from '../../../core/services/apis';
import {AuthService} from '../../../core/services';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-course-classes',
  templateUrl: './course-classes.component.html',
  styleUrls: ['./course-classes.component.scss']
})
export class CourseClassesComponent implements OnInit {
  public courseClassificationList: CoursesClassification[];
  public isOpen: boolean;
  public categoryCd = Constants.categoryClass.COURSE;
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
    this.courseClassificationList = await this.getClasses();
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
      this.courseClassificationList = await this.getClasses();
    }
    this.isOpen = event.isOpen;
  }

  /**
   * 分類情報一覧を取得する
   */
  async getClasses(): Promise<CoursesClassification[]> {
    return await this.techClassificationService
      .getClasses(this.userLogin.shop_id, this.categoryCd)
      .toPromise();
  }

  /**
   * モーダルを開く。
   */
  selectedRow(select: CoursesClassification): void {
    this.selectCurrent = select;
    this.isOpen = true;
  }

  /**
   * 落とす
   * @param event
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.courseClassificationList,
      event.previousIndex,
      event.currentIndex
    );
    for (let i = 0; i < this.courseClassificationList.length; i++) {
      this.courseClassificationList[i].sort = i;
    }
    this.updateSortIndex();
  }

  /**
   * 分類情報一覧を取得する
   */
  updateSortIndex(): void {
    const body = {
      shopId: this.userLogin.shop_id,
      list: JSON.stringify(this.courseClassificationList),
      category_cd: this.categoryCd,
    };
    this.techClassificationService
      .updateSortIndex(this.userLogin.shop_id, body)
      .subscribe(
        (rs) => {
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
