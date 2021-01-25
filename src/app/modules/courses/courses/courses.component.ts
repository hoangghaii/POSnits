import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from 'src/app/constants/animation';
import { Courses, Tax, TechClassification } from 'src/app/core/models';
import { CoursesService, TaxService, TechClassificationService } from 'src/app/core/services/apis';
import { AuthService } from 'src/app/core/services';
import { Constants } from 'src/app/constants/constants';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  animations: [fadeAnimation],
})
export class CoursesComponent implements OnInit {
  public shopId = '';
  public categoryCd = Constants.categoryClass.COURSE;
  public courseList: Courses[] = [];
  public techClassList: any[] = [];
  public courseListFilter: any[] = [];
  public status = false;
  public courseId = '';
  public listTaxes: Tax[] = [];
  helper = Helper;
  /**
   * current user login
   */
  userLogin: any;

  /**
   * Class
   */
  classArr: any[] = [];

  /**
   * Skill
   */
  skillArr: any[] = [];

  /**
   * コンストラクタ
   * @param courseService
   * @param techClassService
   */
  constructor(
    private courseService: CoursesService,
    private techClassService: TechClassificationService,
    private authService: AuthService,
    private taxService: TaxService
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.listTaxes = await this.taxService.getTaxList(this.shopId).toPromise();
    this.courseList = await this.getCourseList();
    this.techClassList = await this.techClassService.getClasses(this.userLogin.shop_id, this.categoryCd).toPromise();
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */

  /**
   * クラスリストを取得する
   */
  async getClassList(): Promise<TechClassification[]> {
    return await this.techClassService
      .getClasses(this.shopId, this.categoryCd)
      .toPromise();
  }

  /**
   * 開いた
   * @param courseId
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.courseId = null;
    }
    this.status = true;
  }

  /**
   * Selected row
   */
  selectedRow(courseId: any): void {
    this.courseId = courseId;
    this.status = true;
  }

  /**
   * タイプのアイテムをフィルタリングする
   * @param courseId
   */
  filterItemsOfType(classId: number): any {
    return this.courseList.filter((x) => x.class_id === classId).sort((a, b) => Number(a.sort) - Number(b.sort));
  }

  /**
   * ドロップリストを処理する
   * @param event
   * @param courseId
   */
  handleDropList(event: CdkDragDrop<string[]>, courseId: number): void {
    this.courseListFilter = this.courseList.filter(
      (item) => item.class_id === courseId
    );
    let beforeIndex: number = event.previousIndex;
    let afterIndex: number = event.currentIndex;

    const before: Courses = this.courseListFilter[beforeIndex];
    const after: Courses = this.courseListFilter[afterIndex];

    for (const { index, value } of this.courseList.map((value, index) => ({
      index,
      value,
    }))) {
      if (before.id == value.id) {
        beforeIndex = index;
      }
      if (after.id == value.id) {
        afterIndex = index;
      }
    }

    moveItemInArray(this.courseList, beforeIndex, afterIndex);
    for (let i = 0; i < this.courseList.length; i++) {
      this.courseList[i].sort = i;
    }
    this.updateSortCourses();
  }

  /**
   * 並べ替えコースを更新する
   */
  updateSortCourses(): void {
    const body = {
      shopId: this.shopId,
      list: JSON.stringify(this.courseList)
    };
    this.courseService.updateSortCourses(body).subscribe((courseList) => {
      this.getCourseList();
    });
  }

  async closeModal(event: any): Promise<void> {
    if (event.status && event.status === 'upCreate') {
      this.courseList = await this.getCourseList();
    }
    this.status = event.open;
  }

  /**
   * Toggle
   */
  toggleAccordian(event: any, index): any {
    event.classList.toggle('active');
    if (this.classArr[index].isActive) {
      this.classArr[index].isActive = true;
    } else {
      this.classArr[index].isActive = false;
    }
    const panel = event.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = null;

    }
  }

  /**
   * スキルリストを取得する
   */
  async getCourseList(): Promise<any> {
    const skills = await this.courseService.getCourseList(this.shopId, this.categoryCd).toPromise();
    skills.forEach((skill: any) => {
      let isExisted = false;
      for (const item of this.classArr) {
        if (skill.class == null || item.id === skill.class?.id) {
          isExisted = true;
          break;
        }
      }

      if (!isExisted) {
        this.classArr.push(skill.class);
      }

      if (skill.class) {
        this.classArr.push(skill);
      }

    });

    this.classArr.sort((a, b) => Number(a.sort) - Number(b.sort));
    return skills;
  }
}
