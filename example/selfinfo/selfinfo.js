// example/selfinfo/selfinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2016-09-01',
    updateFlag: 0,
    updateAddress_com: 0,
    updateAddress_home: 0,
    updateWechat: 0,
    user_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var value = wx.getStorageSync('GoodJob_user')
      if (value) {
        this.setData({
          user_id: value.id,
        })

      }
    } catch (e) {
      console.log("获取数据出错");
      return;
    }
    var that = this;
    wx.setNavigationBarTitle({
      title: '详细资料'
    }),
      wx.request({
       // url: 'http://localhost:8080/framework/get_UserMes.do?jsoncallback=?',
      url: 'http://47.94.7.71/goodskill/get_UserMes.do?jsoncallback=?',
        data: {
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
            user: data.user,
          })
          if (data.user.birthday != null) {
            
            var date_tmp = data.user.birthday;
            var da = new Date(date_tmp);
            var year = da.getFullYear()
            var month = da.getMonth() + 1
            var day = da.getDate()
            var date_tpm = year+"-"+month+"-"+day;
            that.setData({
              date: date_tpm
            })
          }
          if (data.user.address_company != null) {
            that.setData({
              address_company: data.user.address_company
            })
          }
          if (data.user.address_home != null) {
            that.setData({
              address_home: data.user.address_home
            })
          }
          if (data.user.wechat != null) {
            that.setData({
              wechat: data.user.wechat
            })
          }
        },
      })
  },
  bindDateChange: function (e) {
    console.log('出生日期：', e.detail.value);
    if (this.data.date != e.detail.value) {
      this.setData({
        date: e.detail.value,
        updateFlag: 1
      })
    }
  },
  //修改公司地址
  updateAddress_company: function (e) {
    this.setData({
      updateAddress_com: 1
    })
  },
  checkAddress_com: function (e) {
    var address_com = e.detail.value;
    var address = this.data.address_company;
    if (address_com.length == 0 || address_com == address) {
      this.setData({
        updateAddress_com: 0,
      })
    } else {
      this.setData({
        address_company: address_com,
        updateFlag: 1,
        updateAddress_com: 0,
      })
    }
  },
  //修改居住地址
  updateAddress_home: function (e) {
    this.setData({
      updateAddress_home: 1
    })
  },
  checkAddress_home: function (e) {
    var address_home_tmp = e.detail.value;
    console.log(address_home_tmp)
    if (address_home_tmp == this.data.address_home || address_home_tmp.length == 0) {
      this.setData({
        updateAddress_home: 0,
      })
    } else {
      this.setData({
        address_home: address_home_tmp,
        updateFlag: 1,
        updateAddress_home: 0,
      })
    }
  },
  //修改微信号
  updateWechat: function (e) {
    this.setData({
      updateWechat: 1
    })
  },
  checkWechat: function (e) {
    var wechat_tmp = e.detail.value;
    console.log(wechat_tmp)
    if (wechat_tmp == this.data.wechat || wechat_tmp.length == 0) {
      this.setData({
        updateWechat: 0,
      })
    } else {
      this.setData({
        wechat: wechat_tmp,
        updateFlag: 1,
        updateWechat: 0,
      })
    }
  },
  submitUpdate: function(e){
    console.log(this.data.date + this.data.wechat + this.data.address_home + this.data.address_company);
    if (this.data.date == null){
      this.setData({
        date: ''
      })
    }
    if (this.data.wechat == null){
      this.setData({
        wechat: ''
      })
    }
    if (this.data.address_home == null){
      this.setData({
        address_home: ''
      })
    }
    if (this.data.address_company == null){
      this.setData({
        address_company: ''
      })
    }
    console.log(this.data.date + this.data.wechat + this.data.address_home + this.data.address_company);
    wx.request({
     // url: 'http://localhost:8080/framework/add_userMessage.do?jsoncallback=?',
      url: 'http://47.94.7.71/goodskill/add_userMessage.do?jsoncallback=?',
      data:{
        user_id: 1, 
        birthday: this.data.date, 
        wechat: this.data.wechat, 
        address_home: this.data.address_home,
        address_company: this.data.address_company,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var data = res.data.substring(1, res.data.length - 1);
        data = JSON.parse(data);
        console.log(data);
        if(data.flag == 1){
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  }
})