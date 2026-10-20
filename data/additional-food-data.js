// 晚自习3432：鼓楼补充店铺与仙林校区 3km 搜索补充数据。
// 百度地图仅用于地址和坐标；未核验到的美团/大众点评评分保持 null。
(() => {
  const extraPlaces = [
  {
    "id": "gulou-extra-guanghesheng",
    "name": "广和生大排档(金轮峰华天地店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": true,
    "note": "中山路金轮峰华天地店。",
    "originalLine": "广和生大排档(金轮峰华天地店)",
    "lat": 32.0537577,
    "lon": 118.7785187,
    "address": "江苏省南京市鼓楼区中山路223-4号金轮峰华1楼(珠江路地铁站1号口)",
    "area": "鼓楼区",
    "uid": "e10491575d8708434bcc4a1e",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "user"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "gulou-extra-canteen-1",
    "name": "南京大学鼓楼校区一食堂",
    "category": "校内食堂",
    "categories": [
      "校内食堂"
    ],
    "recommended": true,
    "note": "南京大学鼓楼校区南园一食堂。",
    "originalLine": "南京大学鼓楼校区一食堂",
    "lat": 32.0537517,
    "lon": 118.7759415,
    "address": "江苏省南京市鼓楼区汉口路22号南京大学鼓楼校区南园(近广州路)",
    "area": "鼓楼区",
    "uid": "c43cac4fefeb1857f90cada2",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "user"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "gulou-extra-canteen-2",
    "name": "南京大学鼓楼校区二食堂",
    "category": "校内食堂",
    "categories": [
      "校内食堂"
    ],
    "recommended": true,
    "note": "南京大学鼓楼校区第二学生餐厅。",
    "originalLine": "南京大学鼓楼校区二食堂",
    "lat": 32.0535586,
    "lon": 118.7759185,
    "address": "南京市鼓楼区汉口路22号南京大学鼓楼校区(南大汉口路门往东约30米)",
    "area": "鼓楼区",
    "uid": "2e27879070f144b30b1cc7ed",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "user"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "gulou-extra-canteen-3",
    "name": "南京大学鼓楼校区三食堂",
    "category": "校内食堂",
    "categories": [
      "校内食堂"
    ],
    "recommended": true,
    "note": "南京大学鼓楼校区南园综合楼三食堂。",
    "originalLine": "南京大学鼓楼校区三食堂",
    "lat": 32.0536148,
    "lon": 118.7759549,
    "address": "江苏省南京市鼓楼区湖南路街道南京大学鼓楼校区南园综合楼",
    "area": "鼓楼区",
    "uid": "898e7552c6479b36fd0eb097",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "user"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-db140151dd4f92552fb90861",
    "name": "清真餐厅(南京大学仙林校区店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 300 米）。",
    "originalLine": "清真餐厅(南京大学仙林校区店)",
    "lat": 32.1186905,
    "lon": 118.9502104,
    "address": "远东大道南京大学仙林校区内",
    "area": "栖霞区",
    "uid": "db140151dd4f92552fb90861",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-09906b06d70bacf0f02d8322",
    "name": "星巴克(南京大学仙林校区店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 421 米）。",
    "originalLine": "星巴克(南京大学仙林校区店)",
    "lat": 32.1160962,
    "lon": 118.9519198,
    "address": "仙林大道163号南京大学仙林校区敬文活动中心104-106室",
    "area": "栖霞区",
    "uid": "09906b06d70bacf0f02d8322",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-eeccc4edc75ca235e5e965a1",
    "name": "邮局咖啡(南京大学店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 457 米）。",
    "originalLine": "邮局咖啡(南京大学店)",
    "lat": 32.1168592,
    "lon": 118.949688,
    "address": "南京大学仙林校区诚园4幢G08仙林商铺38号",
    "area": "栖霞区",
    "uid": "eeccc4edc75ca235e5e965a1",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 3.8,
    "dianpingId": "1205328422",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-a2bfb740e3e026febca82282",
    "name": "瑞幸咖啡(南京大学仙林校区店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 510 米）。",
    "originalLine": "瑞幸咖啡(南京大学仙林校区店)",
    "lat": 32.116923,
    "lon": 118.9488673,
    "address": "仙林大道163号南京大学仙林校区诚园5幢底商",
    "area": "栖霞区",
    "uid": "a2bfb740e3e026febca82282",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-80e3dd11c775360a32f71dc9",
    "name": "麦当劳(南京大学仙林校区店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 566 米）。",
    "originalLine": "麦当劳(南京大学仙林校区店)",
    "lat": 32.1158409,
    "lon": 118.9492852,
    "address": "仙林大道163号南京大学仙林校区诚园3幢G04室和G05室",
    "area": "栖霞区",
    "uid": "80e3dd11c775360a32f71dc9",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-8443e2e99222bfada2a934ff",
    "name": "茶百道(南京大学仙林校区店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 674 米）。",
    "originalLine": "茶百道(南京大学仙林校区店)",
    "lat": 32.1142468,
    "lon": 118.9501171,
    "address": "江苏省南京市栖霞区南京大学仙林校区诚园1幢G03室",
    "area": "栖霞区",
    "uid": "8443e2e99222bfada2a934ff",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-119633a85435af400c0a70d1",
    "name": "南京大学仙林校区学生第五餐厅",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 722 米）。",
    "originalLine": "南京大学仙林校区学生第五餐厅",
    "lat": 32.1137274,
    "lon": 118.9502527,
    "address": "仙林大道163号南京大学仙林校区食堂2楼",
    "area": "栖霞区",
    "uid": "119633a85435af400c0a70d1",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 4.1,
    "dianpingId": "24045176",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-3a3ffc01e6b59543b34c4978",
    "name": "南京大学-第4食堂",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 741 米）。",
    "originalLine": "南京大学-第4食堂",
    "lat": 32.1134894,
    "lon": 118.9504084,
    "address": "仙林大道163号南京大学仙林校区",
    "area": "栖霞区",
    "uid": "3a3ffc01e6b59543b34c4978",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-db0df08b8c65c947441a32a0",
    "name": "南京大学-学生11食堂",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 795 米）。",
    "originalLine": "南京大学-学生11食堂",
    "lat": 32.1247182,
    "lon": 118.9470864,
    "address": "仙林大道163号南京大学仙林校区",
    "area": "栖霞区",
    "uid": "db0df08b8c65c947441a32a0",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-2fa00d4166030185fea77801",
    "name": "和味缘",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 820 米）。",
    "originalLine": "和味缘",
    "lat": 32.1268854,
    "lon": 118.955313,
    "address": "元化路8号南大科学园9栋70幢",
    "area": "栖霞区",
    "uid": "2fa00d4166030185fea77801",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-a827ca3c635d9dfcfbdc85b7",
    "name": "瑞幸咖啡(南京大学仙林校区四组团店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 826 米）。",
    "originalLine": "瑞幸咖啡(南京大学仙林校区四组团店)",
    "lat": 32.1257306,
    "lon": 118.947956,
    "address": "栖霞大道163号南京大学仙林校区四组团小移人家营业厅一层门面房",
    "area": "栖霞区",
    "uid": "a827ca3c635d9dfcfbdc85b7",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-6cd6dd1251e764963b13fd8b",
    "name": "海鸿兴餐饮(仙林南大店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 865 米）。",
    "originalLine": "海鸿兴餐饮(仙林南大店)",
    "lat": 32.1268577,
    "lon": 118.9568574,
    "address": "元化路8号南大科学园66栋108-1",
    "area": "栖霞区",
    "uid": "6cd6dd1251e764963b13fd8b",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 4.6,
    "dianpingId": "615751120",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-8089682b11a6c87ca1a93498",
    "name": "今牛潮汕牛肉馆",
    "category": "火锅烤肉",
    "categories": [
      "火锅烤肉"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1047 米）。",
    "originalLine": "今牛潮汕牛肉馆",
    "lat": 32.110403,
    "lon": 118.9545965,
    "address": "仙林街道仙林大道168号167幢1室-1",
    "area": "栖霞区",
    "uid": "8089682b11a6c87ca1a93498",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 4.5,
    "dianpingId": "1047606155",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-1ecbf15c7211efc697ec84b9",
    "name": "茶百道(南大和园店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1051 米）。",
    "originalLine": "茶百道(南大和园店)",
    "lat": 32.1105049,
    "lon": 118.9554876,
    "address": "仙林大道南大和园",
    "area": "栖霞区",
    "uid": "1ecbf15c7211efc697ec84b9",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-98fd436616517e5ce6e96550",
    "name": "郭家大院·老南京土菜(南大店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1052 米）。",
    "originalLine": "郭家大院·老南京土菜(南大店)",
    "lat": 32.1103888,
    "lon": 118.954801,
    "address": "仙林大道168号S07-09幢1室",
    "area": "栖霞区",
    "uid": "98fd436616517e5ce6e96550",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-bb23208a77924b751df74d03",
    "name": "食其家·牛丼咖喱(南大和园店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1059 米）。",
    "originalLine": "食其家·牛丼咖喱(南大和园店)",
    "lat": 32.1106686,
    "lon": 118.9565565,
    "address": "仙林大道南大和园164幢1-9室(近南大和园)",
    "area": "栖霞区",
    "uid": "bb23208a77924b751df74d03",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 3.8,
    "dianpingId": "19209759",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-b958bd773e7c55d45d17c39f",
    "name": "聚香园菜馆(南大和园店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1070 米）。",
    "originalLine": "聚香园菜馆(南大和园店)",
    "lat": 32.1101845,
    "lon": 118.9544859,
    "address": "南大和园168幢30室",
    "area": "栖霞区",
    "uid": "b958bd773e7c55d45d17c39f",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-d5a217a04988f55688f15de8",
    "name": "麦当劳(南大和园店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1074 米）。",
    "originalLine": "麦当劳(南大和园店)",
    "lat": 32.1107541,
    "lon": 118.9573044,
    "address": "仙林大道168号南大和园164幢一层1室-1、1室-2和1室-3",
    "area": "栖霞区",
    "uid": "d5a217a04988f55688f15de8",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-0eb488447741d27714c8f67d",
    "name": "圆仔甜品屋(南大和园店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1091 米）。",
    "originalLine": "圆仔甜品屋(南大和园店)",
    "lat": 32.1105453,
    "lon": 118.9571927,
    "address": "南大和园商业街165-16室和园商业街靠工商银行一侧",
    "area": "栖霞区",
    "uid": "0eb488447741d27714c8f67d",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 3.9,
    "dianpingId": "14709378",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-f621bbc83a0141eb39e4a6c6",
    "name": "忆江南美食(南大和园直营店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1098 米）。",
    "originalLine": "忆江南美食(南大和园直营店)",
    "lat": 32.1106071,
    "lon": 118.9575749,
    "address": "仙林大道南大和园商业街165号7室",
    "area": "栖霞区",
    "uid": "f621bbc83a0141eb39e4a6c6",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-62edfd8c2075e907f7eafcbc",
    "name": "东北炖(南大和园店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1111 米）。",
    "originalLine": "东北炖(南大和园店)",
    "lat": 32.1106088,
    "lon": 118.9579158,
    "address": "仙林大道南大和园168幢",
    "area": "栖霞区",
    "uid": "62edfd8c2075e907f7eafcbc",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 4.3,
    "dianpingId": "18133822",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-1c89a9c38ba37e8325e0a0da",
    "name": "中公汇悦酒店餐饮",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1124 米）。",
    "originalLine": "中公汇悦酒店餐饮",
    "lat": 32.1285468,
    "lon": 118.9590018,
    "address": "栖霞区元化路8号南大科学园中公汇悦酒店2楼",
    "area": "栖霞区",
    "uid": "1c89a9c38ba37e8325e0a0da",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-144287bfc5add0fe43ab9aba",
    "name": "和善园(南大和园店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1128 米）。",
    "originalLine": "和善园(南大和园店)",
    "lat": 32.110965,
    "lon": 118.9591447,
    "address": "南大和园农贸市场",
    "area": "栖霞区",
    "uid": "144287bfc5add0fe43ab9aba",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-5f241314682a973b1df74de3",
    "name": "和悦咖啡馆(南大和园店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1352 米）。",
    "originalLine": "和悦咖啡馆(南大和园店)",
    "lat": 32.1082756,
    "lon": 118.9579067,
    "address": "南大和园80栋门面房",
    "area": "栖霞区",
    "uid": "5f241314682a973b1df74de3",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-5c8b2d1484485ca957bfffdc",
    "name": "甜啦啦鲜果茶(南工院第八食堂店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1476 米）。",
    "originalLine": "甜啦啦鲜果茶(南工院第八食堂店)",
    "lat": 32.1228213,
    "lon": 118.9379002,
    "address": "南京市栖霞区仙林大学城南京工业职业技术大学第八食堂",
    "area": "栖霞区",
    "uid": "5c8b2d1484485ca957bfffdc",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-fa1aa0322a5c2535ae080f49",
    "name": "汉韵餐厅(仙林大学城生创园店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1546 米）。",
    "originalLine": "汉韵餐厅(仙林大学城生创园店)",
    "lat": 32.1332324,
    "lon": 118.9571081,
    "address": "江苏省南京市栖霞区仙林街道纬地路9号江苏生命科技创新园A2栋四楼403铺位",
    "area": "栖霞区",
    "uid": "fa1aa0322a5c2535ae080f49",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-4ff0a17d331929394107c1ce",
    "name": "沙县小吃(生命科技园店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1558 米）。",
    "originalLine": "沙县小吃(生命科技园店)",
    "lat": 32.1333859,
    "lon": 118.9569137,
    "address": "仙林街道纬地路9号A2栋1层A10号商铺",
    "area": "栖霞区",
    "uid": "4ff0a17d331929394107c1ce",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-ded49abbc568937d6e20b995",
    "name": "이태원犁太苑炭火烤肉(高科荣境店)",
    "category": "火锅烤肉",
    "categories": [
      "火锅烤肉"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1620 米）。",
    "originalLine": "이태원犁太苑炭火烤肉(高科荣境店)",
    "lat": 32.1258751,
    "lon": 118.9687455,
    "address": "西岗街道仙林大道高科荣境商业街16-68号",
    "area": "栖霞区",
    "uid": "ded49abbc568937d6e20b995",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-0fedc0513a03404f02294fe0",
    "name": "茶肆·淮扬菜(南大仙林店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1681 米）。",
    "originalLine": "茶肆·淮扬菜(南大仙林店)",
    "lat": 32.1346043,
    "lon": 118.9563912,
    "address": "仙林大学城纬地路9号A2栋112号人工湖服务中心",
    "area": "栖霞区",
    "uid": "0fedc0513a03404f02294fe0",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 4.7,
    "dianpingId": "97276282",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-b17b4090cd0d617521022013",
    "name": "肯德基(南京荣境天地店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1689 米）。",
    "originalLine": "肯德基(南京荣境天地店)",
    "lat": 32.1263485,
    "lon": 118.9692974,
    "address": "广志路荣境品苑16-9号16-10号16-51号16-52号一层",
    "area": "栖霞区",
    "uid": "b17b4090cd0d617521022013",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-506e4cdd30028322a5da39dd",
    "name": "有集餐厅",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1745 米）。",
    "originalLine": "有集餐厅",
    "lat": 32.1351905,
    "lon": 118.9563818,
    "address": "元化路(江苏生命科技创新园)C1栋",
    "area": "栖霞区",
    "uid": "506e4cdd30028322a5da39dd",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-336012d57396060a03ec0123",
    "name": "沙县小吃(高科荣境店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1757 米）。",
    "originalLine": "沙县小吃(高科荣境店)",
    "lat": 32.1262495,
    "lon": 118.9701459,
    "address": "8号荣境品苑47幢16-94室-1",
    "area": "栖霞区",
    "uid": "336012d57396060a03ec0123",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-b090979e7de137814251c068",
    "name": "正源私房菜(高科店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1788 米）。",
    "originalLine": "正源私房菜(高科店)",
    "lat": 32.1265586,
    "lon": 118.9703423,
    "address": "西岗街道广志路16-168号高科商业街2楼",
    "area": "栖霞区",
    "uid": "b090979e7de137814251c068",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-773c5da991a1d6071df74deb",
    "name": "晏三好小笼包(高科荣境店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1799 米）。",
    "originalLine": "晏三好小笼包(高科荣境店)",
    "lat": 32.1264903,
    "lon": 118.9705036,
    "address": "江苏省南京市栖霞区广志路16-26号",
    "area": "栖霞区",
    "uid": "773c5da991a1d6071df74deb",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-482d749cf522e0e02b11d1f2",
    "name": "1点点(南中医仙林校园店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 1822 米）。",
    "originalLine": "1点点(南中医仙林校园店)",
    "lat": 32.1048913,
    "lon": 118.9449668,
    "address": "仙林街道仙林大道138号南京中医药大学东门第二食堂东侧",
    "area": "栖霞区",
    "uid": "482d749cf522e0e02b11d1f2",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-1c64b74db239b5a8ee74f851",
    "name": "茶百道(南京中医药大学店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2018 米）。",
    "originalLine": "茶百道(南京中医药大学店)",
    "lat": 32.1049198,
    "lon": 118.9407881,
    "address": "江苏省南京市栖霞区仙林大道138号南京中医药大学敬文图书馆2层",
    "area": "栖霞区",
    "uid": "1c64b74db239b5a8ee74f851",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-e4fd9d393edf11f203ec011b",
    "name": "仙圣大酒店(仙林湖店)",
    "category": "正餐小吃",
    "categories": [
      "正餐小吃"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2324 米）。",
    "originalLine": "仙圣大酒店(仙林湖店)",
    "lat": 32.1316579,
    "lon": 118.9734143,
    "address": "学森路12号全季酒店5楼",
    "area": "栖霞区",
    "uid": "e4fd9d393edf11f203ec011b",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-e7b0801fbd7c549f6018099e",
    "name": "红枫路小吃街",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2377 米）。",
    "originalLine": "红枫路小吃街",
    "lat": 32.1379677,
    "lon": 118.9399461,
    "address": "红枫路与智谷大道辅路交叉口北120米",
    "area": "栖霞区",
    "uid": "e7b0801fbd7c549f6018099e",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-44963fb8de17548e99005071",
    "name": "肥叔锅贴(仙林湖店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2378 米）。",
    "originalLine": "肥叔锅贴(仙林湖店)",
    "lat": 32.1320267,
    "lon": 118.9738129,
    "address": "仙林湖社区服务中心二栋",
    "area": "栖霞区",
    "uid": "44963fb8de17548e99005071",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-0c476b6cc5bc558846e2749f",
    "name": "泉味轩豆腐脑(味洲·美邻生活广场美邻汇店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2386 米）。",
    "originalLine": "泉味轩豆腐脑(味洲·美邻生活广场美邻汇店)",
    "lat": 32.1322816,
    "lon": 118.9737103,
    "address": "西岗街道学森路12号味洲旭和生活广场A1栋1层106-2号商铺",
    "area": "栖霞区",
    "uid": "0c476b6cc5bc558846e2749f",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-d97d00b461064aae76e5b63a",
    "name": "茶百道(南京邮电大学店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2395 米）。",
    "originalLine": "茶百道(南京邮电大学店)",
    "lat": 32.1201349,
    "lon": 118.9277188,
    "address": "江苏省南京市栖霞区仙林校区南京邮电大学第三食堂3号铺",
    "area": "栖霞区",
    "uid": "d97d00b461064aae76e5b63a",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-19496c7d839f516da8f0cd61",
    "name": "南京邮电大学仙林校区-第2食堂",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2438 米）。",
    "originalLine": "南京邮电大学仙林校区-第2食堂",
    "lat": 32.1139701,
    "lon": 118.9281657,
    "address": "文苑路9号(近图书馆)",
    "area": "栖霞区",
    "uid": "19496c7d839f516da8f0cd61",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-19dac98ade6f1db6a8059d02",
    "name": "栖喜小吃",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2443 米）。",
    "originalLine": "栖喜小吃",
    "lat": 32.139042,
    "lon": 118.9407379,
    "address": "江苏省南京市栖霞区栖霞街道红枫街16-6号",
    "area": "栖霞区",
    "uid": "19dac98ade6f1db6a8059d02",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-02080dcaf7dc26ecae04575a",
    "name": "1点点(南京理工大学紫金学院仙林校区店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2537 米）。",
    "originalLine": "1点点(南京理工大学紫金学院仙林校区店)",
    "lat": 32.130667,
    "lon": 118.9294947,
    "address": "南京市栖霞区文成东路南京理工大学紫金学院",
    "area": "栖霞区",
    "uid": "02080dcaf7dc26ecae04575a",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-15a0cbf9c7a09ff8223bf21b",
    "name": "蜜雪冰城新鲜冰淇淋·茶饮(紫金店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2542 米）。",
    "originalLine": "蜜雪冰城新鲜冰淇淋·茶饮(紫金店)",
    "lat": 32.1306919,
    "lon": 118.9294518,
    "address": "文澜路89号南京理工大学紫金学院三食堂旁",
    "area": "栖霞区",
    "uid": "15a0cbf9c7a09ff8223bf21b",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-8980f81fcd24e8789e95de1a",
    "name": "瑞幸咖啡(南京邮电大学仙林校区店)",
    "category": "咖啡茶饮",
    "categories": [
      "咖啡茶饮"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2580 米）。",
    "originalLine": "瑞幸咖啡(南京邮电大学仙林校区店)",
    "lat": 32.1140143,
    "lon": 118.9266013,
    "address": "文苑路9号南京邮电大学仙林校区图书馆一层G01室",
    "area": "栖霞区",
    "uid": "8980f81fcd24e8789e95de1a",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": 4.3,
    "dianpingId": "605184007",
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-b56e3c84f08b74fef1193798",
    "name": "沙县小吃·重庆小面(文宗路店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2727 米）。",
    "originalLine": "沙县小吃·重庆小面(文宗路店)",
    "lat": 32.1258778,
    "lon": 118.9251072,
    "address": "仙林街道仙林大学城仙境路29号72幢108室-5号(学仕风华门面房)",
    "area": "栖霞区",
    "uid": "b56e3c84f08b74fef1193798",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  },
  {
    "id": "xianlin-b6d367136dcf1bd532870a52",
    "name": "沙县小吃(御湖仕家店)",
    "category": "食堂简餐",
    "categories": [
      "食堂简餐"
    ],
    "recommended": false,
    "note": "仙林校区 3 公里范围内公开地图检索结果（直线距离约 2733 米）。",
    "originalLine": "沙县小吃(御湖仕家店)",
    "lat": 32.123467,
    "lon": 118.9818313,
    "address": "江苏省南京市栖霞区仙林大道181号南京万达茂F1",
    "area": "栖霞区",
    "uid": "b6d367136dcf1bd532870a52",
    "geocodeStatus": "found",
    "dataSource": "百度地图定位（评分未采用）",
    "sources": [
      "search"
    ],
    "meituanRating": null,
    "dianpingRating": null,
    "dianpingId": null,
    "userRating": null,
    "platformCheckedAt": "2026-10-20"
  }
];
  const data = window.NANJING_MAP_DATA;
  if (!data) throw new Error("NANJING_MAP_DATA is not loaded");
  const existingNames = new Set(data.places.map((place) => String(place.name || "").trim()));
  const uniquePlaces = extraPlaces.filter((place) => {
    const key = String(place.name || "").trim();
    if (!key || existingNames.has(key)) return false;
    existingNames.add(key);
    return true;
  });
  data.places.push(...uniquePlaces);
  data.meta.sourceLabel = "晚自习3432";
  data.meta.extraStoreCount = uniquePlaces.length;
  data.meta.gulouExtraCount = uniquePlaces.filter((place) => place.id.startsWith("gulou-extra-")).length;
  data.meta.xianlinExtraCount = uniquePlaces.filter((place) => place.id.startsWith("xianlin-")).length;
  data.meta.ratingPolicy = "有用户评分：0.2×美团+0.2×大众点评+0.6×用户；无用户评分：0.5×美团+0.5×大众点评";
  data.meta.storeCount = data.places.length;
  data.meta.locatedCount = data.places.filter((place) => Number.isFinite(Number(place.lat)) && Number.isFinite(Number(place.lon)) && place.lat !== null && place.lon !== null).length;
})();
