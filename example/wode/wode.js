// example/selfinfo/selfinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      var value = wx.getStorageSync('GoodJob_user')
      if (value) {
        var user_id = value.id;
        that.setData({
          user_id: user_id
        })
      }
    } catch (e) {
      console.log("user_id获取失败")
    }
    wx.setNavigationBarTitle({
      title: '我的'
    }),
      wx.request({
      url: 'http://47.94.7.71/goodskill/get_UserMes.do?jsoncallback=?',
        data: {
          // user_id:2
          user_id: that.data.user_id,
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          var data = res.data.substring(1, res.data.length - 1);
          data = JSON.parse(data);
          console.log(data.user);
          that.setData({
            user: data.user
          })
        },
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  toSelfinfo: function(e) {
    wx.navigateTo({
      url: '/example/selfinfo/selfinfo?user_id='+this.data.user.id,
    })
  }
})