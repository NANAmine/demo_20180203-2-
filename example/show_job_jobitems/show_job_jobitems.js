// example/show_job_jobitems/show_job_jobitems.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobitemItems: [],
    job_id: "",
    jobitem_id: 1,
    worker_id: 1,
    boss_id: 1,
    worktype_id: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    try {
      var value = wx.getStorageSync('job_id')
      if (value) {
        this.setData({
          job_id: value,
        })
        this.getdata();
      }
    } catch (e) {
      console.log("获取数据出错");
    }
  },
  getdata: function (e) {
    var that = this;
    wx.request({
      url: 'http://47.94.7.71/goodskill/show_job_byid.do?jsoncallback=?',
      data: {
        job_id: this.data.job_id,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res)
        var data = res.data.substring(1, res.data.length - 1);
        data = JSON.parse(data);
        console.log(data);
        if (data.flag == "1") {
          if (data.msg.length != 0) {
            wx.setNavigationBarTitle({
              title: " 工作详情"
            })
            that.setData({
              title: data.msg[0].jobitem.job.community,
              jobitemItems: data.msg,
              boss_id: data.msg[0].jobitem.job.user.id,
              worktype_id: data.msg[0].jobitem.jobtype.id
            })
          } else {
            that.setData({
              title: '',
              jobitemItems: [],
            })
          }
        }
      },
    })
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

  },

  toUpdate_jobitem: function (e) {
    console.log(this.data.jobitemItems);
    var work = this.data.jobitemItems;
    if (this.data.jobitemItems[0].jobitem.jobitem_status != 0) {
      console.log("无法修改");
      wx.showModal({
        content: '该工作状态已改变，无法修改',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '确认修改',
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            console.log("1111");
            console.log(work);
            wx.setStorage({
              key: "publishtype",
              data: 2,
            })
            wx.setStorage({
              key: "updatainformation",
              data: work,
            })
            wx.navigateTo({
              url: '/example/add_job/add_job'
            })
            console.log('用户点击确认')
          } else {
            console.log('用户点击取消')
          }
        }
      });
    }
  },
  phono: function (e) {
    wx.makePhoneCall({
      phoneNumber: '100001' //仅为示例，并非真实的电话号码
    })
  },
  delete_jobitem: function (e) {
    var jobitem_id = e.currentTarget.dataset.id;
    console.log(jobitem_id);
    var that = this;
    if (this.data.jobitemItems[0].jobitem.jobitem_status != 0) {
      console.log("无法修改");
      wx.showModal({
        content: '该工作状态已改变，无法修改',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '是否删除？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: 'http://47.94.7.71/goodskill/delete_jobitem.do?jsoncallback=?',
              data: {
                jobitem_id: jobitem_id,
              },
              dataType: 'JSON',
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                var data = res.data.substring(1, res.data.length - 1);
                data = JSON.parse(data);
                console.log(data);
                if (data.flag == 1) {
                  console.log("删除成功");
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                  });
                  that.onLoad();
                } else {
                  console.log("删除失败");
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //确认用工
  ensure_user: function (e) {
    var that = this;
    wx.request({
      url: 'http://47.94.7.71/goodskill/ensure_user.do?jsoncallback=?',
      data: {
        jobitem_user_id: e.currentTarget.dataset.id,
      },
      dataType: 'JSON',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var data = res.data.substring(1, res.data.length - 1);
        data = JSON.parse(data);
        console.log(data);
        if (data.flag == 1) {
          console.log("确认成功");
          //刷新页面
          wx.showToast({
            title: '已确认用工',
            icon: 'success',
            duration: 2000
          });
          that.onLoad();
        }
      }
    })
  },
  //开工请求
  startwork: function (e) {
    var that = this;
    wx.request({
      url: 'http://47.94.7.71/goodskill/start_request.do?jsoncallback=?',
      data: {
        jobitem_user_id: e.currentTarget.dataset.id,
      },
      dataType: 'JSON',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var data = res.data.substring(1, res.data.length - 1);
        data = JSON.parse(data);
        console.log(data);
        if (data.flag == 1) {
          console.log("确认成功");
          //刷新页面
          wx.showToast({
            title: '已发出请求',
            icon: 'success',
            duration: 2000
          });
          that.onLoad();
        }
      }
    })
  },
  //返工请求
  rework: function (e) {
    wx.setStorage({
      key: "jobitem_id",
      data: this.data.job_id,
    })
    wx.navigateTo({
      url: '/example/rework/rework'
    })
  },
  //确认完工
  endwork: function (e) {
    console.log(e);
    var that = this;
    wx.request({
      url: 'http://47.94.7.71/goodskill/end_response.do?jsoncallback=?',
      data: {
        jobitem_user_id: e.currentTarget.dataset.id,
      },
      dataType: 'JSON',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var data = res.data.substring(1, res.data.length - 1);
        data = JSON.parse(data);
        console.log(data);
        if (data.flag == 1) {
          console.log("确认成功");
          //刷新页面
          wx.showToast({
            title: '已完工',
            icon: 'success',
            duration: 2000
          });

          that.toevaluation();
          that.onLoad();
        }
      }
    })
  },
  //自动完工
  zdendwork: function (e) {

  },
  toevaluation: function (e) {
    var evaluation = { worktype_id: this.data.worktype_id, worker_id: 1, boss_id: this.data.boss_id, jobitem_id: this.data.job_id};
    console.log(evaluation);
    wx.setStorage({
      key: "evaluation",
      data: evaluation,
    })

    wx.navigateTo({
      url: '/example/evaluation/evaluation'
    })
  },
  toJobitem: function (e) {
    //显示工作详情
    console.log(e.currentTarget.dataset.id);
    wx.setStorage({
      key: "jobitem_id",
      data: e.currentTarget.dataset.id
    })
    wx.setStorage({
      key: "boss_id",
      data: 1
    })
    wx.navigateTo({
      url: '/example/workdetails/workdetails'
    })
  },
  toUser: function (e) {
    //显示工人详情
    console.log(e.currentTarget.dataset.id);
    wx.setStorage({
      key: "worker_id",
      data: e.currentTarget.dataset.id
    })
    wx.navigateTo({
      url: '/example/workerinfo/workerinfo'
    })
  },

})