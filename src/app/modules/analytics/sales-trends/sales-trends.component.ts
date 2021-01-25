import { DecimalPipe } from '@angular/common';
import { compileNgModule } from '@angular/compiler';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Constants } from 'src/app/constants/constants';
import { AuthService, FileDownloadService, ValidatorService } from 'src/app/core/services';
import { StaffService } from 'src/app/core/services/apis';
import { SalesTrendsService } from 'src/app/core/services/apis/sales-trends.service';
/**
 * SalesTrendsComponent
 * 販売動向コンポーネント
 */
@Component({
  selector: 'app-sales-trends',
  templateUrl: './sales-trends.component.html',
  styleUrls: ['./sales-trends.component.scss']
})
export class SalesTrendsComponent implements OnInit {

  public listStage = Constants.stage_type;
  public chartType = Constants.chart_type;
  public listMonth = ['1', '2', '3', '4', '5', '6', '7','8', '9','10', '11','12'];
  public title?:any;
  public listStaff =[];
  public listDays = [];
  public listData = [];
  public listDataSkill = [];
  public listDataCourse = [];
  public listDataItem = [];
  public saleForm : FormGroup;

  formMap;
  public submitted = false;
  public barChartOptions = {

  };
  public labelTotalSale ='';
  public labelTotalItem  ='';
  public labelTotalSkill  ='';
  public labelTotalCourse  ='';
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = this.listMonth;
  public lineChartColors: Color[] = [
    {
      borderColor: 'red',
      backgroundColor: 'transparent',
    },
    {
      borderColor: 'blue',
      backgroundColor: 'transparent',
    },
    {
      borderColor: 'green',
      backgroundColor: 'transparent',
    },
    {
      borderColor: 'black',
      backgroundColor: 'transparent',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  public userLogin :any;
  public listSalesTrends = [];
  constructor(
    private authService :AuthService,
    private staffService : StaffService,
    private saleService : SalesTrendsService,
    private fb :FormBuilder,
    private translate :TranslateService,
    private fileDownloadService: FileDownloadService
  ) {

   }

  async ngOnInit(): Promise<void> {
     this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listStaff = await this.staffService.getStaffList(this.userLogin.shop_id).toPromise();

  }
  /**
   * 初期化フォーム
   */
  initForm(){
    this.translate.get('salesTrends').subscribe((trans) => {
     this.labelTotalSale= trans?.totalSale,
      this.labelTotalItem =trans?.totalItem,
     this.labelTotalSkill=trans?.totalSkill,
      this.labelTotalCourse=trans?.totalCourse,
      this.formMap = {
        type_stage: trans?.type_stage,
        month_stage: trans?.month_stage,
        staff:trans?.staff,
      };
      let obj =[
      { data: [], label: this.labelTotalSale },
      { data: [], label: this.labelTotalSkill },
      { data: [], label: this.labelTotalItem},
      { data: [], label: this.labelTotalCourse},
    ];
    this.lineChartData = obj;
    });
    this.saleForm = this.fb.group({
      type_stage :['0',[ValidatorService.required]],
      month_stage:['',[ValidatorService.required]],
      staff:['',[ValidatorService.required]],
      type_chart:['0',]
    })
  }
  /**
   * フォーマットデータロードチャート
   */
 async formatDataLoadChart():Promise<void>{
    let obj = this.parseObj(this.saleForm.value);
    this.changeTitle();
    this.listSalesTrends = await this.saleService.getReservationList(this.userLogin.shop_id,obj.type_stage,obj.month_stage,obj.staff).toPromise();
    if(this.listSalesTrends['now_year']){
      this.listData= [];
      this.listDataSkill = [];
      this.listDataItem = [];
      this.listDataCourse = [];
      if(this.saleForm.value.type_stage=='0'){

        this.lineChartLabels = this.listMonth;
        this.listMonth.forEach(item=>{
          let element = this.listSalesTrends['now_year'];
          if(typeof element[Number(item)-1]=='string'||!element[Number(item)-1]){
            this.listData.push(0);
            this.listDataSkill.push(0);
            this.listDataItem.push(0);
            this.listDataCourse.push(0);
          }
          else{
            //money
            if(this.saleForm.value.type_chart=='1'){
              this.listData.push(element[Number(item)-1].total.total_customer_sale);
              this.listDataSkill.push(element[Number(item)-1].skills.total_main_of_sale_skill);
              this.listDataItem.push(element[Number(item)-1].item.number_of_sale_item);
              this.listDataCourse.push(element[Number(item)-1].contract.contract_amount_of_course_digestion);
            }
            else{
              //customer
              if(this.saleForm.value.type_chart=='0'){
                this.listData.push(element[Number(item)-1].total.total_number_of_guest);
                this.listDataSkill.push(element[Number(item)-1].skills.number_of_member_guest_skill
                +element[Number(item)-1].skills.number_of_non_member_guest_skill
                );
                this.listDataItem.push(element[Number(item)-1].item.number_of_guest_item);
                this.listDataCourse.push(element[Number(item)-1].contract.number_of_guest_course_digestion);
              }
              else{
                //avg
                if(this.saleForm.value.type_chart=='2'){
                  this.listData.push(element[Number(item)-1].total.total_avg.toFixed(1));
                  if(element[Number(item)-1].skills.total_main_of_sale_skill==0){
                    this.listDataSkill.push(0);
                  }
                  else
                  {
                    this.listDataSkill.push(
                      (element[Number(item)-1].skills.total_main_of_sale_skill/(
                      element[Number(item)-1].skills.number_of_member_guest_skill
                      +element[Number(item)-1].skills.number_of_non_member_guest_skill
                    ).toFixed(1))
                    ) ;
                  }
                  if(element[Number(item)-1].item.number_of_sale_item==0){
                    this.listDataItem.push(0);
                  }
                  else
                  {
                    this.listDataItem.push((element[Number(item)-1].item.number_of_sale_item/(
                      element[Number(item)-1].item.number_of_guest_item
                    ).toFixed(1))
                    );
                  }
                  if(element[Number(item)-1].contract.contract_amount_of_course_digestion==0){
                    this.listDataCourse.push(0);
                  }
                  else
                  {
                    this.listDataCourse.push((element[Number(item)-1].contract.contract_amount_of_course_digestion/(
                      element[Number(item)-1].contract.number_of_guest_course_digestion
                    )).toFixed(1)
                    );
                  }
                }
                else{
                  if(!this.listSalesTrends['last_year']||typeof this.listSalesTrends['last_year'][Number(item)-1]=='string')
                    {
                        this.listData.push(0);
                        this.listDataSkill.push(0);
                        this.listDataCourse.push(0);
                        this.listDataItem.push(0);

                    }
                  else{
                    this.listData.push(
                      ((element[Number(item)-1].contract.total_customer_sale*100)/
                      this.listSalesTrends['last_year'][Number(item)-1].contract.total_customer_sale).toFixed(1)
                      );
                    this.listDataSkill.push(
                      (element[Number(item)-1].skills.total_main_of_sale_skill*100/
                      this.listSalesTrends['last_year'][Number(item)-1].skills.total_main_of_sale_skill).toFixed(1)
                    );
                    this.listDataCourse.push(
                      (element[Number(item)-1].contract.contract_amount_of_course_digestion*100/
                      this.listSalesTrends['last_year'][Number(item)-1].contract.contract_amount_of_course_digestion).toFixed(1)
                    );
                    this.listDataItem.push(
                     ( element[Number(item)-1].item.number_of_sale_item*100/
                      this.listSalesTrends['last_year'][Number(item)-1].item.number_of_sale_item).toFixed(1)
                    );
                  }


                }
              }
            }

          }
        })

      }
      else{
          let temp = new Date();
          let date = new Date(temp.getFullYear(),Number(this.saleForm.value.month_stage),0);
          let listDay = [];

          for(let i=0;i<date.getDate();i++){
            listDay.push((i+1).toString());
            let element = this.listSalesTrends['now_year'];
            if(typeof element[i]=='string'||!element[i]){

              this.listData.push(0);
              this.listDataSkill.push(0);
              this.listDataItem.push(0);
              this.listDataCourse.push(0);
            }
            else{
              if(this.saleForm.value.type_chart=='1'){
                this.listData.push(element[i].total.total_customer_sale);
                this.listDataSkill.push(element[i].skills.total_main_of_sale_skill);
                this.listDataItem.push(element[i].item.number_of_sale_item);
                this.listDataCourse.push(element[i].contract.contract_amount_of_course_digestion);
              }
              else{
                if(this.saleForm.value.type_chart=='0'){
                  this.listData.push(element[i].total.total_number_of_guest);
                  this.listDataSkill.push(element[i].skills.number_of_member_guest_skill
                  +element[i].skills.number_of_non_member_guest_skill
                  );
                  this.listDataItem.push(element[i].item.number_of_guest_item);
                  this.listDataCourse.push(element[i].contract.number_of_guest_course_digestion);
                }
                else{
                  if(this.saleForm.value.type_chart=='2'){

                    this.listData.push(element[i].total.total_avg.toFixed(1));
                    if(element[i].skills.total_main_of_sale_skill==0){
                      this.listDataSkill.push(0);
                    }
                    else
                    {
                      this.listDataSkill.push(
                        (element[i].skills.total_main_of_sale_skill/(
                        element[i].skills.number_of_member_guest_skill
                        +element[i].skills.number_of_non_member_guest_skill
                      ).toFixed(1))
                      ) ;
                    }
                    if(element[i].item.number_of_sale_item==0){
                      this.listDataItem.push(0);
                    }
                    else
                    {
                      this.listDataItem.push((element[i].item.number_of_sale_item/(
                        element[i].item.number_of_guest_item
                      ).toFixed(1))
                      );
                    }
                    if(element[i].contract.contract_amount_of_course_digestion==0){
                      this.listDataCourse.push(0);
                    }
                    else
                    {
                      this.listDataCourse.push((element[i].contract.contract_amount_of_course_digestion/(
                        element[i].contract.number_of_guest_course_digestion
                      )).toFixed(1)
                      );
                    }

                  }
                  else{
                    if(!this.listSalesTrends['last_year']||typeof this.listSalesTrends['last_year'][i]=='string')
                    {
                        this.listData.push(0);
                        this.listDataSkill.push(0);
                        this.listDataCourse.push(0);
                        this.listDataItem.push(0);

                    }
                  else{
                    this.listData.push(
                      ((element[i].contract.total_customer_sale*100)/
                      this.listSalesTrends['last_year'][i].contract.total_customer_sale).toFixed(1)
                      );
                    this.listDataSkill.push(
                      (element[i].skills.total_main_of_sale_skill*100/
                      this.listSalesTrends['last_year'][i].skills.total_main_of_sale_skill).toFixed(1)
                    );
                    this.listDataCourse.push(
                      (element[i].contract.contract_amount_of_course_digestion*100/
                      this.listSalesTrends['last_year'][i].contract.contract_amount_of_course_digestion).toFixed(1)
                    );
                    this.listDataItem.push(
                     ( element[i].item.number_of_sale_item*100/
                      this.listSalesTrends['last_year'][i].item.number_of_sale_item).toFixed(1)
                    );
                  }
                  }
                }
              }

            }
          }
          this.lineChartLabels = listDay;
      }
    }
    else{
    this.listSalesTrends = [];
    this.listData = [];
    this.listDataSkill = [];
    this.listDataCourse = [];
    this.listDataItem = [];
    }
  }
  /**
   * フォーマットインデックス
   * @param index
   */
  formatIndex(index :string ):string{
   if( Number(index)/10 >=1)
      return index;
    return '0'+index;
  }
  /**
   * CSVをエクスポート
   */
 async displayChart() :Promise<void>{
  this.submitted = true;
  if(!this.saleForm.valid)
    return ;
    let obj = this.parseObj(this.saleForm.value);
    let data=  await this.saleService.exportCSV(this.userLogin.shop_id,obj.type_stage,obj.month_stage,obj.staff).toPromise();
    let fileName = '月次推移表';
    if (obj.type_stage == '1') {
      fileName = '日次推移表';
    }
    this.fileDownloadService.downloadExcel(data, fileName);
  }

  parseObj(obj){
    return {
      type_stage :obj.type_stage,
      month_stage:obj.month_stage,
      staff:obj.staff,
      type_chart:obj.type_chart
    }
  }
  /**
   * タイプチャートを選択
   */
  async chooseTypeChart():Promise<void>{
  //  this.submitted = true;
    if(!this.saleForm.valid||!this.saleForm.value.type_chart)
    return ;
    await this.formatDataLoadChart();
    this.lineChartData[0].data = this.listData;
    this.lineChartData[1].data = this.listDataSkill;
    this.lineChartData[2].data = this.listDataItem;
    this.lineChartData[3].data = this.listDataCourse;
  }
  changeTitle(){
    let temp = new Date();
    let obj={};
    if(this.saleForm.value.type_stage=='0'){

         obj ={
          title: {
            text:  '( '+temp.getFullYear().toString()+'年1月 ~ '+temp.getFullYear().toString()+'年12月 )',
            display: true
          }
        };

    }
    else{
      let date = new Date(temp.getFullYear(),Number(this.saleForm.value.month_stage),0);
       obj ={
        title: {
          text:  '（ '+this.saleForm.value.month_stage+'月１日～'+this.saleForm.value.month_stage+'月'+date.getDate()+'日 ）',
          display: true
        }
      };

    }
    this.barChartOptions = obj;
  }

}
