// example/order/get_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    style:'none',
    user_id: 0,
    rework_status: [],
    jobitem_user_id: [],
    showTopTips: false,
    loadingHidden: false,
    content: [{ job_type_name: '', community: '', state: "", button: "", house: "", unit: "", start_time: "", skill: "", urgent_fee: "", urgent_fee_style: "", job_user_id: "", jobitem_id: "" }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      var value = wx.getStorageSync('GoodJob_user')
      if (value) {
        console.log(value)
        var user_id = value.id;
        that.setData({
          user_id: user_id
        })
      }
    } catch (e) {
      console.log("user_id获取失败")
    }
    wx.request({
      url: 'http://47.94.7.71/goodskill/show_jobitem_users_his.do?jsoncallback=?',
      //url: 'http://192.168.0.146:8080/framework/sendSms.do?jsoncallback=?',
      data: {
        // user_id: 9
        user_id: that.data.user_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var i = 0, z = 0;
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        console.log(data.msg)
        data = JSON.parse(data);
        if (data.msg != null) {
          if (data.msg.length == 0) {
            that.setData({
              showform: "none"
            })
            that.setData({
              style: " "
            })
            wx.showToast({
              title: '暂无订单信息！',
              icon: 'loading',
              duration: 2000
            })
          } else {
            that.setData({
              style: "none"
            })
            for (i = 0; i < data.msg.length; i++) {
                var state, button, house, unit, fee_style;
                var flag = 1;
                var start_time;
                var skill = [];
                if (data.msg[i].jobitem_user.jobitem.jobitem_status == -1) {
                  button = "评价";
                } else if (data.msg[i].jobitem_user.jobitem.jobitem_status == -2) {
                    button = "删除";
                } 
                if (data.msg[i].jobitem_user.jobitem.job.decoration_type == 1) {
                  house = "毛坯";
                } else {
                  house = "旧房改造";
                }
                if (data.msg[i].jobitem_user.unit == 1) {
                  unit = "平米";
                } else {
                  unit = "延米";
                }
                if (data.msg[i].jobitem_user.jobitem.pre_start_date == undefined) {
                  start_time = "未添加";
                } else {
                  start_time = data.msg[i].jobitem_user.jobitem.pre_start_date;
                }
                if (data.msg[i].jobitem_user.jobitem.urgent_fee != 0) {
                  fee_style = " "
                } else {
                  fee_style = "none"
                }
                for (z = 0; z < data.msg[i].skills.length; z++) {
                  skill[z] = data.msg[i].skills[z].name;
                }
                var jobitem_id = data.msg[i].jobitem_user.jobitem.id
                var job_type_name = data.msg[i].jobitem_user.jobitem.jobtype.name;
                var jobitem_user_id = data.msg[i].jobitem_user.id;
                var urgent_fee = data.msg[i].jobitem_user.jobitem.urgent_fee;
                var community = data.msg[i].jobitem_user.jobitem.job.community;
                var area = data.msg[i].jobitem_user.jobitem.area;
                var salary = data.msg[i].jobitem_user.jobitem.salary
                var job_user_id = data.msg[i].jobitem_user.jobitem.job.user.id
                var areas = "content[" + i + "].area"
                var jobitem_ids = "content[" + i + "].jobitem_id"
                var job_user_ids = "content[" + i + "].job_user_id"
                var salarys = "content[" + i + "].salary"
                var jobitem_user_ids = "content[" + i + "].jobitem_user_id"
                var skills = "content[" + i + "].skill"
                var job_type_names = "content[" + i + "].job_type_name"
                var communitys = "content[" + i + "].community"
                var states = "content[" + i + "].state"
                var buttons = "content[" + i + "].button"
                var houses = "content[" + i + "].house"
                var units = "content[" + i + "].unit"
                var start_times = "content[" + i + "].start_time"
                var urgent_fees = "content[" + i + "].urgent_fee"
                var urgent_fee_styles = "content[" + i + "].urgent_fee_style"
                that.setData({
                  [jobitem_user_ids]: jobitem_user_id,
                  [jobitem_ids]: jobitem_id,
                  [job_user_ids]: job_user_id,
                  [skills]: skill,
                  [areas]: area,
                  [salarys]: salary,
                  [job_type_names]: job_type_name,
                  [states]: state,
                  [communitys]: community,
                  [buttons]: button,
                  [houses]: house,
                  [units]: unit,
                  [start_times]: start_time,
                  [urgent_fees]: urgent_fee,
                  [urgent_fee_styles]: fee_style
                })
            }
            console.log(that.data.content)
          }
        } else {
          this.setData({
            errorInfo: '暂无订单信息！',
            showTopTips: true
          })
        }
      },
      error: function () {
        that.setData({
          errorInfo: '网络连接出错！',
          loadingHidden: false,
          showTopTips: true
        })
      }
    });
    setTimeout(function () {
      that.setData({
        loadingHidden: true
      });
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //自定义功能函数
  //删除订单
  delete_order: function (jobitem_user_id) {
    var that = this;
    wx.request({
      url: "http://47.94.7.71/goodskill/delete_jobitem_user.do?jsoncallback=?",
      //url: 'http://192.168.0.146:8080/framework/get_newUser.do?jsoncallback=?',
      data: {
        jobitem_user_id: jobitem_user_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("请求成功！")
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data);
        wx.redirectTo({
          url: '../history_order/history_order',
        })
      },
      error: function (res) {
        alert(res);
        console.log("网络连接出错！");
      }
    })
  },
  //点击button函数
  submit_onclick: function (e) {
    var that = this;
    var jobitem_user_id = e.currentTarget.dataset.jobitem_user_id;
    var job_user_id = e.currentTarget.dataset.job_user_id;
    var button = e.currentTarget.dataset.button;
    if (button == "删除") {
      wx.showModal({
        title: '用户操作',
        content: '确认删除订单？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.delete_order(jobitem_user_id);
            that.onLoad(); //刷新页面
            //beans();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (button == "评价") {
      try {
        wx.setStorageSync('jobitem_user_id', jobitem_user_id)
        console.log("订单ID写入成功！")
      } catch (e) {
        console.log("订单ID写入失败！")
      }
      try {
        wx.setStorageSync('boss_id', job_user_id)
        console.log("bossID写入成功！")
      } catch (e) {
        console.log("bossID写入失败！")
      }
      wx.navigateTo({
        url: '../worker_evaluation/worker_evaluation'
      })
    } 
  },

  //查看工作详细信息
  order_info: function (e) {
    var boss_id = e.currentTarget.dataset.boss_id;
    var jobitem_id = e.currentTarget.dataset.jobitem_id;
    var flag = e.currentTarget.dataset.flag;
    try {
      wx.setStorageSync('boss_id', boss_id)
      console.log("工长ID写入成功！")
    } catch (e) {
      console.log("工长ID写入失败！")
    }
    try {
      wx.setStorageSync('jobitem_id', jobitem_id)
      console.log("订单ID写入成功！")
      console.log(jobitem_id)
    } catch (e) {
      console.log("订单ID写入失败！")
    }
    try {
      wx.setStorageSync('flag', flag)
      console.log("flag写入成功！")
    } catch (e) {
      console.log("flag写入失败！")
    }
    this.setData({
      showTopTips: true
    })
    wx.navigateTo({
      url: '../workdetails/workdetails'
    })
  }
})