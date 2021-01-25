import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { Tax, Tech, TechClassification } from 'src/app/core/models';
import { Helper } from 'src/app/core/utils/helper';
import { TaxService, TechClassificationService, TechService } from 'src/app/core/services/apis';
import { AuthService } from 'src/app/core/services';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  public categoryCd: string = Constants.categoryClass.TECH;
  public techList: any[] = [];
  public techClassList: any[] = [];
  public tech: Tech[] = [];
  public techListFilter: any[] = [];
  public listTaxes: Tax[] = [];
  public helper = Helper;
  public statusOpen = null;
  public selectCurrent: any;
  public userLogin: any;
  public isOpen: boolean;

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
   * @param techService
   * @param techClassService
   * @param taxService
   * @param authService
   */
  constructor(
    private techService: TechService,
    private techClassService: TechClassificationService,
    private taxService: TaxService,
    private authService: AuthService
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.techList = await this.getSkillList();
    this.getTaxList();
  }

  /**
   * 税金リストを取得する
   */
  getTaxList(): void {
    this.taxService.getTaxList(this.userLogin.shop_id).subscribe((res) => {
      this.listTaxes = res;
    });
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
      this.techList = await this.getSkillList();
    }
    this.isOpen = event.isOpen;
  }

  /**
   * モーダルを開く。
   */
  selectedRow(select: TechClassification): void {
    this.selectCurrent = select;
    this.isOpen = true;
  }

  /**
   * タイプのアイテムをフィルタリングする
   * @param classId
   */
  filterItemsOfType(classId: number): any {
    return this.techList.filter((x) => x.class_id === classId).sort((a, b) => Number(a.sort) - Number(b.sort));
  }

  /**
   * ドロップリストを処理する
   * @param event
   * @param classId
   */
  handleDropList(event: CdkDragDrop<string[]>, classId: number): void {
    this.techListFilter = this.techList.filter(
      (item) => item.class_id === classId
    );
    let beforeIndex: number = event.previousIndex;
    let afterIndex: number = event.currentIndex;

    const before: Tech = this.techListFilter[beforeIndex];
    const after: Tech = this.techListFilter[afterIndex];

    for (const { index, value } of this.techList.map((value, index) => ({
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

    moveItemInArray(this.techList, beforeIndex, afterIndex);
    for (let i = 0; i < this.techList.length; i++) {
      this.techList[i].sort = i;
    }
    this.updateSortSkills();
  }

  /**
   * ソートスキルを更新する
   */
  updateSortSkills(): void {
    const body = {
      shopId: this.userLogin.shop_id,
      list: JSON.stringify(this.techList),
    };
    this.techService.updateSortSkills(body).subscribe((techList) => {
      this.getSkillList();
    });
  }


  /**
   * Toggle list
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
  async getSkillList(): Promise<any> {
    const skills = await this.techService
      .getSkillList(this.userLogin.shop_id, this.categoryCd)
      .toPromise();
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
        this.skillArr.push(skill);
      }

    });

    this.classArr.sort((a, b) => Number(a.sort) - Number(b.sort));
    return skills;
  }

}
