var base64 = require("../images/base64");
Page({
  data: {
    user_id:1,
    url:"",
    textnumber: 0,
    userInput: '',//Provinces, cities and counties
    place: [{ id: 1, address: '河北省', community: '神奇小区1', job_status:0 },
     ],
    region: ['河北省', '廊坊市', '广阳区'],
    customItem: '全部'
  },
  onLoad: function () {
    try {
      var value = wx.getStorageSync('GoodJob_user')
      if (value) {
        this.setData({
          user_id: value.user.id,
        })

      }
    } catch (e) {
      console.log("获取数据出错");
      return;
    }
    try {
      var value = wx.getStorageSync('key')
      if (value) {
        this.getdata();
      }
    } catch (e) {
     console.log("获取数据出错");
    }
    var app = getApp();
    this.setData({
      icon: base64.icon20,
      url: app.url
    }); 

    wx.setNavigationBarTitle({
      title: '工作列表'
    });
  },
  getdata:function(e){
    var that = this;
    wx: wx.request({
      url: 'http://47.94.7.71/goodskill/show_jobs.do?jsoncallback=?',
      //url: 'http://192.168.0.117:8080/framework/show_jobs.do?jsoncallback=?',
      data: {
        user_id: this.data.user_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data);
        if(data.flag==1){
          console.log(data);
          var i; var p; var m; var id; var status; var d1; var d2; var d3; var d4;
          for (i = 0; i < data.msg.length; i++) {
            p = data.msg[i].address;
            m = data.msg[i].community;
            id = data.msg[i].id;
            status = data.msg[i].job_status;
           
            d1 = "place[" + i + "].address";
            d2 = "place[" + i + "].id";
            d3 = "place[" + i + "].community";
            d4 = "place[" + i + "].job_status";

            that.setData({
              [d1]: p,
              [d2]: id,
              [d3]: m,
              [d4]: status,
            })
          }

        }else{
          console.log("查询出错。flag："+data.flag);
        }
        
      }
    })
  },
  bindRegionChange: function (e) {
    //console.log(e)
    console.log('选择地址：', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    this.topcheckplace();
  },
  topurl: function (e) {
    console.log(e);
    wx.setStorage({
      key: "job_id",
      data: e.target.id
    })
    wx.navigateTo({
      url: '/example/show_job_jobitems/show_job_jobitems'
    })
  },
  topcheckplace: function (e) {
    var that = this;
    wx: wx.request({
      url: 'http://47.94.7.71/goodskill/show_jobs.do?jsoncallback=?',
      //url: 'http://192.168.0.117:8080/framework/show_jobs.do?jsoncallback=?',
      data: {
        user_id: this.data.user_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data);
        console.log(data);
        var i; var p; var m; var id; var status; var d1; var d2; var d3; var d4;
        for (i = 0; i < data.msg.length; i++) {
          p = data.msg[i].address;
          m = data.msg[i].community;
          id = data.msg[i].id;
          status = data.msg[i].job_status;
          console.log(p + m + id + status)
          d1 = "place[" + i + "].address";
          d2 = "place[" + i + "].id";
          d3 = "place[" + i + "].community";
          d4 = "place[" + i + "].job_status";
          that.setData({
            [d1]: p,
            [d2]: id,
            [d3]: m,
            [d4]: status,
          })
        }
      }
    })
  },
  ttext: function (e) {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        page.loadCity(longitude, latitude)
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=您的ak&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success    
        console.log(res);
        var city = res.data.result.addressComponent.city;
        page.setData({ currentCity: city });
      },
      fail: function () {
        page.setData({ currentCity: "获取定位失败" });
      },
    })
  },
  checksubmit:function(e){
 
  },
  newpublish:function(e){
    wx.setStorage({
      key: "publishtype",
      data: 1
    })
    wx.navigateTo({
      url: '/example/add_job/add_job'
    })
  },
})
