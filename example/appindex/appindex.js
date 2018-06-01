var base64 = require("../images/base64");
Page({
  data: {
    tplb: [{ url: "/example/images/sw2.jpg" }, { url: "/example/images/sw2.jpg" }, { url: "/example/images/sw2.jpg" }, { url: "/example/images/sw2.jpg" }],
    cssj: "",
    url: "",
    style:'none',
    textnumber: 0,
    userInput: '',//Provinces, cities and counties   
    region: ['河北省', '廊坊市', '广阳区'],
    customItem: '全部',
    buttont: [{ id: '22', types: 'primary', name: '水工' },
    { id: '23', types: 'primary', name: '木工' },
    { id: '24', types: 'primary', name: '水泥工' },
    { id: '21', types: 'primary', name: '电工' },
    { id: '34', types: 'primary', name: '墙工' },
    { id: '26', types: 'primary', name: '涂墙工' }],
    // place: [{ id: 1, provinces: '河北省', cities: '廊坊市', counties: '光阳区', community: '神奇小区1', area: "123", skills: "接电", roomtype: "毛坯", salary: "1", peonum: "1" },
    // ],
    user_id: 0,
    bean:0,
    user_authenticPer:0,
    rework_status: [],
    jobitem_user_id: [],
    showTopTips: false,
    content: [{ job_type_name: '', community: '', state: "", button: "", house: "", unit: "", start_time: "", skill: "", urgent_fee: "", urgent_fee_style: "",jobboss_id:"" ,jobitem_id:""}],
    jobtype_id:""
  },
  onLoad: function () {
    try {
      var value = wx.getStorageSync('GoodJob_user')
      if (value) {
        this.setData({
          user_id: value.id,
          bean: value.beans,
          user_authenticPer: value.user_authenticPer
        })

      }
    } catch (e) {
      console.log("获取数据出错");
    }

    var app = getApp();
    //this.textdata();
    //console.log("url:"+app.url);
    this.setData({
      icon: base64.icon20,
      url: app.url
    });
    wx.setNavigationBarTitle({
      title: '首页'
    });
    this.getorderdata();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新！")
    wx.showToast({
      title: '正在加载数据！',//提示信息
      icon: 'success',//成功显示图标
      duration: 2000//时间
    })
  }, 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title: '上拉加载数据！',//提示信息
      icon: 'success',//成功显示图标
      duration: 2000//时间
    })

  },
  getorderdata: function (e) {
    var that = this;
    wx.request({
      url: 'http://47.94.7.71/goodskill/show_jobitems.do?jsoncallback=?',
      //url: 'http://192.168.0.146:8080/framework/sendSms.do?jsoncallback=?',
      data: {
        "user_id": that.data.user_id,
        "county_code": 131003
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var i = 0, z = 0;
        var data = res.data.substring(1, res.data.length - 1);
       // console.log(data);
        data = JSON.parse(data);
        console.log(data);
        if (data.msg != null) {
          if (data.msg.length == 0) {
            that.setData({
              style: " "
            })
            wx.showToast({
              title: '暂无订单信息！',
              icon: 'loading',
              duration: 10000
            })
            
          } else {
            that.setData({
              style: "none"
            })
            console.log(data);
            that.setData({
              content:{}
            })
            for (i = 0; i < data.msg.length; i++) {
              var state, button, house, unit, fee_style;
              var flag = 1;
              var start_time;
              var skill = "未记录";
              if (data.msg[i].jobitem.job.decoration_type == 1) {
                house = "毛坯";
              } else {
                house = "旧房改造";
              }
              if (data.msg[i].jobitem.unit == 1) {
                unit = "平米";
              } else {
                unit = "延米";
              }
              if (data.msg[i].jobitem.pre_start_date == undefined) {
                start_time = "未添加";
              } else {
                start_time = data.msg[i].jobitem.pre_start_date;
              }
              if (data.msg[i].jobitem.urgent_fee != 0) {
                fee_style = " "
              } else {
                fee_style = "none"
              }
              for (z = 0; z < data.msg[i].skills.length; z++) {

                if (skill == "未记录") {
                  skill = data.msg[i].skills[z].name;
                }
                else {
                  skill = skill + "," + data.msg[i].skills[z].name;
                }
              }
             // console.log("1111111");
              //console.log(data.msg[i].jobitem.jobtype);
              if (data.msg[i].jobitem.jobtype == undefined) {
                console.log("第" + i + "条数据有误");
                var job_type_name = "未知";
              } else {
                var job_type_name = data.msg[i].jobitem.jobtype.name;
              }
              var urgent_fee = data.msg[i].jobitem.urgent_fee;
              var community = data.msg[i].jobitem.job.community;
              var area = data.msg[i].jobitem.area;
              var salary = data.msg[i].jobitem.salary;
              var jobitem_id = data.msg[i].jobitem.id;
              var job_user_id = data.msg[i].jobitem.job.user.id 
              var job_user_ids = "content[" + i + "].jobboss_id"
              var areas = "content[" + i + "].area";
              var salarys = "content[" + i + "].salary";
              var skills = "content[" + i + "].skill";
              var job_type_names = "content[" + i + "].job_type_name";
              var communitys = "content[" + i + "].community";
              var states = "content[" + i + "].state";
              var houses = "content[" + i + "].house";
              var units = "content[" + i + "].unit";
              var start_times = "content[" + i + "].start_time";
              var urgent_fees = "content[" + i + "].urgent_fee";
              var urgent_fee_styles = "content[" + i + "].urgent_fee_style";
              var rework_statuss = "content[" + i + "].rework_status";
              var jobitem_ids = "content[" + i + "].jobitem_id";
              that.setData({
                [job_user_ids]: job_user_id,
                [areas]: area,
                [salarys]: salary,
                [job_type_names]: job_type_name,
                [states]: state,
                [communitys]: community,
                [skills]: skill,
                [houses]: house,
                [units]: unit,
                [start_times]: start_time,
                [urgent_fees]: urgent_fee,
                [urgent_fee_styles]: fee_style,
                [jobitem_ids]: jobitem_id
              })
            }
            console.log(that.data.content);
          }
        } else {
          that.setData({
            errorInfo: '暂无订单信息！',
            showTopTips: true
          })
        }
      },
      error: function () {
        that.setData({
          errorInfo: '网络连接出错！',
          showTopTips: true
        })
      }
    });
  },
  changebt: function (e) {
    var strs = e.target.id;
    var up = "buttont[" + e.target.id + "].types";
    if (this.data.buttont[e.target.id].types == "primary") {
      this.setData({
        [up]: 'default'
      })
      console.log(this.data.buttont[e.target.id].name + ":取消选中");
    }
    else if (this.data.buttont[e.target.id].types == "default") {
      this.setData({
        [up]: 'primary'
      })
      console.log(this.data.buttont[e.target.id].name + ":选中");
    }
    var jobtype_ids;
    for(var i=0;i<this.data.buttont.length;i++){
      if (this.data.buttont[i].types =="primary"){
        if (jobtype_ids==""||jobtype_ids==undefined){
          jobtype_ids = this.data.buttont[i].id;
          console.log("选择条件盘点1" + jobtype_ids);
        }else{
          jobtype_ids =jobtype_ids+"_"+ this.data.buttont[i].id;
          console.log("选择条件盘点2" + jobtype_ids);
        }
      }
    }
    console.log("查询工种：");
    
    this.setData({
      jobtype_id: jobtype_ids
    })
    this.getorderdatabyworktype();
  },
  getorderdatabyworktype:function(e){
    var that = this;
   
    wx.request({
      url: 'http://47.94.7.71/goodskill/show_jobitems.do?jsoncallback=?',
      //url: 'http://192.168.0.146:8080/framework/sendSms.do?jsoncallback=?',
      data: {
        "user_id": this.data.user_id, 
        "jobtype_id": this.data.jobtype_id,
         "county_code": 131003
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var i = 0, z = 0;
        var data = res.data.substring(1, res.data.length - 1);
        // console.log(data);
        data = JSON.parse(data);
        console.log(data);
        if (data.msg != null) {
          if (data.msg.length == 0) {
            that.setData({
              content: {}
            })
            that.setData({
              style: " "
            })
            wx.showToast({
              title: '暂无订单信息！',
              icon: 'loading',
              duration: 1000
            })
          } else {
            that.setData({
              style: "none"
            })
            console.log(data);
            that.setData({
              content: {}
            })
            for (i = 0; i < data.msg.length; i++) {
              var state, button, house, unit, fee_style;
              var flag = 1;
              var start_time;
              var skill = "未记录";
              if (data.msg[i].jobitem.job.decoration_type == 1) {
                house = "毛坯";
              } else {
                house = "旧房改造";
              }
              if (data.msg[i].jobitem.unit == 1) {
                unit = "平米";
              } else {
                unit = "延米";
              }
              if (data.msg[i].jobitem.pre_start_date == undefined) {
                start_time = "未添加";
              } else {
                start_time = data.msg[i].jobitem.pre_start_date;
              }
              if (data.msg[i].jobitem.urgent_fee != 0) {
                fee_style = " "
              } else {
                fee_style = "none"
              }
              for (z = 0; z < data.msg[i].skills.length; z++) {

                if (skill == "未记录") {
                  skill = data.msg[i].skills[z].name;
                }
                else {
                  skill = skill + "," + data.msg[i].skills[z].name;
                }
              }
              // console.log("1111111");
              //console.log(data.msg[i].jobitem.jobtype);
              if (data.msg[i].jobitem.jobtype == undefined) {
                console.log("第" + i + "条数据有误");
                var job_type_name = "未知";
              } else {
                var job_type_name = data.msg[i].jobitem.jobtype.name;
              }
              var urgent_fee = data.msg[i].jobitem.urgent_fee;
              var community = data.msg[i].jobitem.job.community;
              var area = data.msg[i].jobitem.area;
              var salary = data.msg[i].jobitem.salary;
              var jobitem_id = data.msg[i].jobitem.id;
              var job_user_id = data.msg[i].jobitem.job.user.id
              var job_user_ids = "content[" + i + "].jobboss_id"
              var areas = "content[" + i + "].area";
              var salarys = "content[" + i + "].salary";
              var skills = "content[" + i + "].skill";
              var job_type_names = "content[" + i + "].job_type_name";
              var communitys = "content[" + i + "].community";
              var states = "content[" + i + "].state";
              var houses = "content[" + i + "].house";
              var units = "content[" + i + "].unit";
              var start_times = "content[" + i + "].start_time";
              var urgent_fees = "content[" + i + "].urgent_fee";
              var urgent_fee_styles = "content[" + i + "].urgent_fee_style";
              var rework_statuss = "content[" + i + "].rework_status";
              var jobitem_ids = "content[" + i + "].jobitem_id";
              that.setData({
                [job_user_ids]: job_user_id,
                [areas]: area,
                [salarys]: salary,
                [job_type_names]: job_type_name,
                [states]: state,
                [communitys]: community,
                [skills]: skill,
                [houses]: house,
                [units]: unit,
                [start_times]: start_time,
                [urgent_fees]: urgent_fee,
                [urgent_fee_styles]: fee_style,
                [jobitem_ids]: jobitem_id
              })
            }
            console.log(that.data.content);
          }
        } else {
          that.setData({
            errorInfo: '暂无订单信息！',
            showTopTips: true
          })
        }
      },
      error: function () {
        that.setData({
          errorInfo: '网络连接出错！',
          showTopTips: true
        })
      }
    });
  },
  bindRegionChange: function (e) {
    //console.log(e)
    console.log('选择地址：', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    this.getorderdata();
  },
  topurl: function (e) {
    // wx.redirectTo({
    //   url: 'test?id=1'
    // })
  },
  topcheckplace: function (e) {

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
  //查看详情
  toinformstion:function(e){
    //jobitem_id  boss_id  flag=0;
    console.log("数据显示");
    console.log(e);
    var num=e.target.id;
    var i;var str;
//     for(i=0;i<this.data.content.length;i++){
// if(this.data.content[i].jobitem_id==num){
//   str = this.data.content[i].boss_id;
// }
//     }
var boss_id = e.currentTarget.dataset.boss_id;
    wx.setStorage({
      key: "jobitem_id",
      data: e.target.id,
    });
    wx.setStorage({
      key: "boss_id",
      data: boss_id,
    });
    wx.setStorage({
      key: "flag",
      data: 0,
    });
    wx.navigateTo({
      url: '/example/workdetails/workdetails'
    })
  },
  //接单
 togetorder: function (e) {
   var that=this;
   try {
     var value = wx.getStorageSync('GoodJob_user');
     if (value) {
       console.log("1111")
       console.log(value);
       this.setData({
         user_id: value.id,
         bean: value.beans,
         user_authenticPer: value.user_authenticPer
       })
       if(this.data.bean<=0){
         console.log("您的豆子不足");
         wx.showModal({
           content: '您的豆子不足，不能接单',
           showCancel: false,
           success: function (res) {
             if (res.confirm) {
               console.log('用户点击确定')
             }
           }
         });
return;
       }
       if (this.data.user_authenticPer!=1) {
         console.log("未认证");
         wx.showModal({
           content: '您还未认证，不能接单',
           showCancel: false,
           success: function (res) {
             if (res.confirm) {
               console.log('用户点击确定')
             }
           }
         });
         return;
       }
       wx.showModal({
         title: '提示',
         content: '是否确认接单',
         success: function (res) {
           console.log(res);
           if (res.confirm) {
             wx: wx.request({
               //url: 'http://192.168.0.117:8080/framework/add_job.do?jsoncallback=?',
               url: 'http://47.94.7.71/goodskill/add_jobitem_user.do?jsoncallback=?',
               data: {
                 user_id: that.data.user_id,
                 jobitem_id: e.target.id
               },
               header: {
                 'content-type': 'application/json'
               },
               method: 'GET',
               dataType: 'json',
               success: function (res) {
                 console.log(res)
                 var data = res.data.substring(1, res.data.length - 1);
                 console.log(data);
                 data = JSON.parse(data);
                 if (data.flag == 1) {
                   wx.showModal({
                     content: '你已成功接单',
                     showCancel: false,
                     success: function (res) {
                       if (res.confirm) {
                         console.log('用户点击确定')
                       }
                     }
                   });
                   console.log("接单成功");
                 } else {
                   wx.showModal({
                     content: '接单失败',
                     showCancel: false,
                     success: function (res) {
                       if (res.confirm) {
                         console.log('用户点击确定')
                       }
                     }
                   });
                   console.log("接单失败");

                   //  jobitem_user_id = data.jobitem_user_id;
                   //  beans = beans - 1;
                   //  localStorage.setItem("beans", beans);
                   //  document.getElementById("bean").setAttribute("value", "最大接单量：" + beans + "单");

                 }
                 //  if (data.flag == 1) {
                 //    console.log("接单成功");
                 //    wx.navigateTo({
                 //      url: '/example/show_job_list/show_job_list'
                 //    })
                 //  } else {
                 //    console.log("接单失败");
                 //  }
               }
             })
             
             console.log('用户点击确认')
             that.getorderdata();
           } else {
             console.log('用户点击取消')
           }
          
         }
       });
     }
   } catch (e) {
     console.log("获取数据出错");
   }



   
  },
  //分享
  toshowother: function (e) {
console.log("点击分享");
  },
  cs: function () {
    var users = {
      phonenumber: 1,
      password: 2
    };

    wx.setStorage({
      key: '$user',
      data: users,
      success: function (res) {
        console.log("数据存储成功");
      }
    })
  },
  qwe: function () {
    var that = this;
    wx.getStorage({
      key: 'ce',
      success: function (res) {

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
  }
})
