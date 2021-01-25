export class Constants {
  public static listRegion = [
    null,
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県',
  ];

  public static listAccounting = [
    {key: 1, value: '四捨五入'},
    {key: 2, value: '切り上げ'},
    {key: 3, value: '切り捨て'},
  ];

  public static facilities = [
    {value: 1, text: '使用する'},
    {value: 2, text: '使用しない'},
  ];

  public static breakTimeList = [
    {key: 5, value: '5'},
    {key: 10, value: '10'},
    {key: 15, value: '15'},
    {key: 20, value: '20'},
    {key: 30, value: '30'},
  ];

  public static listTechWeb = [
    {key: 0, value: '不可'},
    {key: 1, value: '可'},
  ];

  public static categoryClass = {
    TECH: '01',
    COURSE: '02',
    PRODUCT: '03',
    SETMENU: '04',
    COUPON: '05'
  };

  public static listDiscountCd = [
    {
      value: '00',
      key: '技術、コース、商品が全て',
    },
    {
      value: '01',
      key: '技術',
    },
    {
      value: '02',
      key: 'コース',
    },
    {
      value: '03',
      key: '商品',
    },
  ];

  public static listDiscountType = [
    {
      key: '1',
      value: '割引',
    },
    {
      key: '2',
      value: '値引',
    },
  ];

  public static monthMenuFlg = [
    {
      key: '0',
      value: '初回',
    },
    {
      key: '1',
      value: '全て',
    },
  ];

  public static isToogleMenu = false;

  /**
   * Gender
   */
  public static listMember = [
    {
      key: '0',
      value: '非会員',
    },
    {
      key: '1',
      value: '会員',
    },
  ];

  public static sex = [
    {
      key: '0',
      value: '男性',
    },
    {
      key: '1',
      value: '女性',
    },
  ];

  public static listLanguage = [
    {
      key: '日本語',
      value: '001',
    },
    {
      key: '英語',
      value: '002',
    },
  ];

  public static timeStore = {
    startTime: '08:00',
    endTime: '17:00',
    breakTime: '5',
  };
  public static webFlagStaffRecepts = [
    {
      key: '不可',
      value: '0',
    },
    {
      key: '可',
      value: '1',
    },
  ];
  public static cancelFlg = [
    {
      key: '未キャンセル',
      value: '0',
    },
    {
      key: 'キャンセル済',
      value: '1',
    },
  ];
  public static cancelSettingFlg = [
    {
      key: '不可',
      value: '0',
    },
    {
      key: '可',
      value: '1',
    },
  ];
  public static cancelWaitFlg = [
    {
      key: '不可',
      value: '0',
    },
    {
      key: '可',
      value: '1',
    },
  ];
  public static reservInterval = [
    {
      key: '5分',
      value: '0',
    },
    {
      key: '10分',
      value: '1',
    },
    {
      key: '15分',
      value: '2',
    },
    {
      key: '20分',
      value: '3',
    },
    {
      key: '30分',
      value: '4',
    },
    {
      key: '60分',
      value: '5',
    },
  ];
  public static receptRest = [
    {
      key: '30分',
      value: '0',
    },
    {
      key: '1時間',
      value: '1',
    },
    {
      key: '2時間',
      value: '2',
    },
    {
      key: '3時間',
      value: '3',
    },
    {
      key: '12時間',
      value: '4',
    },
    {
      key: '1日',
      value: '5',
    },
    {
      key: '3日',
      value: '6',
    },
    {
      key: '1週間',
      value: '7',
    },
  ];
  public static cancelLimit = [
    {
      key: '1時間前',
      value: '1',
    },
    {
      key: '3時間前',
      value: '2',
    },
    {
      key: '6時間前',
      value: '3',
    },
    {
      key: '12時間前',
      value: '4',
    },
    {
      key: '1日前',
      value: '0',
    },
    {
      key: '2日前',
      value: '0',
    },
    {
      key: '3日前',
      value: '0',
    },
    {
      key: '4日前',
      value: '0',
    },
    {
      key: '5日前',
      value: '0',
    },
    {
      key: '6日前',
      value: '0',
    },
    {
      key: '7日前',
      value: '0',
    },
  ];
  public static futureReservNum = [
    {
      key: '１です。',
      value: '1',
    },
    {
      key: '２です。',
      value: '2',
    },
    {
      key: '３です。',
      value: '3',
    },
    {
      key: '４です。',
      value: '4',
    },
    {
      key: '５です。',
      value: '5',
    },
    {
      key: '６です。',
      value: '6',
    },
    {
      key: '７です。',
      value: '7',
    },
    {
      key: '８です。',
      value: '8',
    },
    {
      key: '９です。',
      value: '9',
    },
  ];

  public static listEqupmentCd = [
    {
      key: '01',
      value: '機材',
    },
    {
      key: '02',
      value: '施術台',
    },
  ];
  public static visitFlg = [
    {
      key: '来店待ち',
      value: '0',
    },
    {
      key: '来店済み',
      value: '1',
    },
  ];
  public static categoryCd = [
    {
      key: '技術',
      value: '1',
    },
    {
      key: 'コース',
      value: '2',
    },
    {
      key: '商品',
      value: '3',
    },
    {
      key: 'セットメニュー',
      value: '4',
    },
    {
      key: 'クーポン',
      value: '5',
    },
  ];
  public static listTarget = [
    {key: 0, value: '新規'},
    {key: 1, value: '全て'},
  ];
  public static viewFlg = [
    {key: 'OFF', value: '0'},
    {key: 'ON', value: '1'},
  ];
  public static requiredFlg = [
    {key: 'OFF', value: '0'},
    {key: 'ON', value: '1'},
  ];
  public static descriptionType = [
    {key: '非表示', value: '0'},
    {key: '上', value: '1'},
    {key: '下', value: '2'},
  ];
  public static shopCustomerInfomationItemType = [
    {key: 'ふりがな', value: '0'},
    {key: '性別', value: '1'},
    {key: '生年月日', value: '2'},
    {key: '住所', value: '3'},
  ];
  public static dayOfWeek = [
    {key: '日', value: 0},
    {key: '月', value: 1},
    {key: '火', value: 2},
    {key: '水', value: 3},
    {key: '木', value: 4},
    {key: '金', value: 5},
    {key: '土', value: 6},
  ];
  public static abbreviationCategory = [
    {key: '【技】', value: '01'},
    {key: '【コ】', value: '02'},
    {key: '【商】', value: '03'},
    {key: '【セ】', value: '04'},
    {key: '【ク】', value: '05'},
  ];

  public static sex_type = [
    {
      key: '全て',
      value: '0'
    },
    {
      key: '男性',
      value: '1'
    },
    {
      key: '女性',
      value: '2'
    }
  ];
  public static visit_amount_type = [
    {
      key: '期間内来店回数',
      value: '0'
    },
    {
      key: '総来店回数',
      value: '1'
    }
  ];
  public static sale_type = [
    {
      key: '期間内売上',
      value: '0'
    },
    {
      key: '総売上',
      value: '1'
    }
  ];
  public static menu_select_type = [
    {
      key: '全て含む',
      value: '0'
    },
    {
      key: 'いずれか含む',
      value: '1'
    },
    {
      key: '全て含まない',
      value: '2'
    }
  ];
  public static day_type = [
    {
      key: '予約日',
      value: '0'
    },
    {
      key: '来店日',
      value: '1'
    },
    {
      key: '最終来店日',
      value: '2'
    }
  ];
  public static maxSize = 5120;
  public static availableType = [
    'image/png',
    'image/gif',
    'image/jpeg',
    'image/bmp',
  ];
  public static stage_type=[
    {
      key:'月別',
      value:'0'
    },
    {
      key:'日別',
      value:'1'
    },
];
  public static chart_type =[
    {
      key :'客数',
      value :'0'
    },
    {
      key :'売上',
      value :'1'
    },
    {
      key :'客単価',
      value :'2'
    },
    {
      key :'売上比較',
      value :'3'
    }
  ]
  public static mail_type = [
    {
      key:"即時配信",
      value:"0"
    },
    {
      key:"予約配信",
      value:"1"
    }
  ]
}
