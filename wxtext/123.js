// example/order/get_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    rework_status: [],
    jobitem_user_id: [],
    showTopTips: false,
    content: [{ job_type_name: '', community: '', state: "", button: "", house: "", unit: "", start_time: "", skill: "", urgent_fee: "", urgent_fee_style: "" }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: '$user',
      success: function (res) {
        var user_id = res.data.id;
        that.setData({
          user_id: user_id
        })
      },
    })
    wx.request({
      url: 'http://47.94.7.71/goodskill/show_jobitem_users.do?jsoncallback=?',
      //url: 'http://192.168.0.146:8080/framework/sendSms.do?jsoncallback=?',
      data: {
        user_id: 9
        //user_id: this.data.user_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var i = 0, z = 0;
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data);
        if (data.msg != null) {
          if (data.msg.length == 0) {
            wx.showToast({
              title: '暂无订单信息！',
              icon: 'loading',
              duration: 10000
            })
          } else {
            for (i = 0; i < data.msg.length; i++) {
              if (data.msg[i].jobitem_user.jobitem.jobitem_status != -2 && data.msg[i].jobitem_user.jobitem.jobitem_status != -1) {
                var state, button, house, unit, fee_style;
                var flag = 1;
                var start_time;
                var skill = [];
                // this.data.content[i].rework_status = data.msg[i].jobitem_user.rework_status;
                // this.data.jobitem_user_id[i] = data.msg[i].jobitem_user.id;
                if (data.msg[i].jobitem_user.jobitem_status == 2) {
                  state = "已被抢";
                  button = "删除";
                } else {
                  if (data.msg[i].jobitem_user.jobitem.jobitem_status == 2) {
                    state = "等待工长确认中";
                    button = "退单";
                  } else if (data.msg[i].jobitem_user.jobitem.jobitem_status == 3) {
                    state = "等待工长开工";
                    button = "退单";
                  } else if (data.msg[i].jobitem_user.jobitem.jobitem_status == 5) {
                    state = "工长请求开工";
                    button = "确认开工";
                  } else if (data.msg[i].jobitem_user.jobitem.jobitem_status == 5 && data.msg[i].jobitem_user.rework_status == 1) {
                    state = "工长请求返工";
                    button = "确认开工";
                  } else if (data.msg[i].jobitem_user.jobitem.jobitem_status == 1) {
                    state = "施工中";
                    button = "请求完工";
                  } else if (data.msg[i].jobitem_user.jobitem.jobitem_status == 1 && data.msg[i].jobitem_user.rework_status == 1) {
                    state = "返工中";
                    button = "请求完工";
                  } else if (data.msg[i].jobitem_user.jobitem.jobitem_status == 4) {
                    state = "工程等待工长验收";
                    button = "24小时倒计时自动确认";
                  }
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
                var job_type_name = data.msg[i].jobitem_user.jobitem.jobtype.name;
                var jobitem_user_id = data.msg[i].jobitem_user.id;
                var urgent_fee = data.msg[i].jobitem_user.jobitem.urgent_fee;
                var community = data.msg[i].jobitem_user.jobitem.job.community;
                var rework_status = data.msg[i].jobitem_user.rework_status;
                var area = data.msg[i].jobitem_user.jobitem.area;
                var salary = data.msg[i].jobitem_user.jobitem.salary
                var areas = "content[" + i + "].area"
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
                var rework_statuss = "content[" + i + "].rework_status"
                that.setData({
                  // content: [{ jobitem_user_ids:jobitem_user_id,states: state, communitys: community, buttons: button, houses: house, units: unit, start_times: start_time, urgent_fees: urgent_fee, urgent_fee_styles: fee_style, skills: skill, rework_statuss: rework_statuss}]
                  [jobitem_user_ids]: jobitem_user_id,
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
                  [urgent_fee_styles]: fee_style,
                  [rework_statuss]: rework_status
                })

              }
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
          showTopTips: true
        })
      }
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})