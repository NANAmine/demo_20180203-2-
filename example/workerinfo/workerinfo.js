Page({
  //姓名公章评分居住地之认证公司公司地址
  data: {
    name: "未查到信息",
    graded: "未查到信息",
    skills: "未查到信息",
    sex: "未查到信息",
    days: "未查到信息",
    address: "未查到信息",
worker_id:""
  },
  onLoad: function (e) {
    
    try {
      var value = wx.getStorageSync('worker_id')
      if (value) {
        this.setData({
          worker_id: value
        })
        this.getdata();
      }
    } catch (e) {
      console.log("获取数据出错");
    }
  },
  getdata:function(e){
    var that = this;
    wx.request({
      url: 'http://47.94.7.71/goodskill/get_UserMes.do?jsoncallback=?',
      data: {
        user_id: that.data.worker_id
      },
      dataType: 'JSON',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
       
        console.log(res);

        var data = res.data.substring(1, res.data.length - 1);

        data = JSON.parse(data);
        console.log(data);
        if (data.flag==1||data.flag==undefined){
          var skillss = "暂无";


          var i;
          for (i = 0; i < data.user.skills.length; i++) {
            if (skillss == "暂无") {
              skillss = data.user.skills[i].name;
            } else {
              skillss = skillss + "," + data.user.skills[i].name;
            }
          }
          that.setData({
            name: data.user.name,
            graded: data.user.avgscore_boss,
            skills: skillss,
            sex: data.user.sex,
            days: data.user.birthday,
            address: data.user.address_home
          })

        }else{
          console.log("查询出错");
          console.log("flag:"+data.flag);
        }
        
      }
    })
    wx.setNavigationBarTitle({
      title: '工人详情'
    })
  }
})