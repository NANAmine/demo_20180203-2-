Page({
  data: {
    list: [
      {
        id: 'form',
        name: '表单',
        open: false,
        pages: ['button', 'list', 'input', 'slider', 'uploader']
      },
      {
        id: 'widget',
        name: '基础组件',
        open: false,
        pages: ['article', 'badge', 'flex', 'footer', 'gallery', 'grid', 'icons', 'loadmore', 'panel', 'preview', 'progress']
      },
      {
        id: 'feedback',
        name: '操作反馈',
        open: false,
        pages: ['actionsheet', 'dialog', 'msg', 'picker', 'toast']
      },
      {
        id: 'nav',
        name: '导航相关',
        open: false,
        pages: ['navbar', 'tabbar']
      },
      {
        id: 'search',
        name: '搜索相关',
        open: false,
        pages: ['searchbar']
      },
      {
        id: 'goodskill',
        name: '示例',
        open: false,
        pages: ['add_job', 'show_job_jobitems', 'wode', 'selfinfo', 'show_job_list', 'evaluation', 'rework', 'person_realname', 'company_realname', 'appindex', 'workdetails', 'workerinfo', 'userinfo', 'login', 'register', 'forgive_password', 'get_order', 'history_order','worker_evaluation'
]
      }
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  onLoad: function () {
    var user = {
      "flag": "1",
      "user": {
        "id": 9,
        "clientid": "12212",
        "token": "121212",
        "name": "哎",
        "password": "517146c99c2725e1beb1b0cb7e2be7d3",
        "sex": "男",
        "phone": "13222222222",
        "id_card": "123",
        "id_card_front_url": "fileUpload\\user\\e46b4ede-8aec-4ddf-8ffe-23e61e877453.jpg",
        "id_card_back_url": "fileUpload\\user\\31160b01-9b16-4eff-a5a2-09cfe929aae1.jpg",
        "beans": 16,
        "money": 0.0,
        "credit": 0,
        "create_time": "May 7, 2018 7:19:44 PM",
        "user_authenticPer": 1,
        "user_authenticCom": 0,
        "is_vip": 0,
        "avgscore_worker": 0,
        "avgscore_boss": 0,
        "status": 1,
        "salt": "111723387565768715668423202582052535847742700385608556874615624844225072578446860465144676621052202217021080816720833150751022027210050635237372505286715502778848460866844813413080248846015626644372315634487833571187171618355540630452012337771086112732862",
        "jobtypes": [],
        "skills": []
      }
    }

    // wx.setStorage({
    //   key: "GoodJob_user",
    //   data: user
    // })
    // try {
    //   var value = wx.getStorageSync('GoodJob_user')
    //   if (value) {
    //     console.log(value);
       
    //   }
    // } catch (e) {
    //   console.log("获取数据出错");
    // }
   
  }
  
});
