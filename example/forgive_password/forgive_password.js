// example/login/login.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: false,
    password: ' ',
    phonenumber: ' ',
    repassword: ' ',
    code: '',
    display: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    this.createCode();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    this.createCode;
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
  //手机号验证
  blurPhonenumber: function (e) {
    var that = this;
    console.log(e.detail.value);
    var phonenumber = e.detail.value;
    var regphone = /^(13[0-9]|15[0-9]|18[0-9]|16[0-9])\d{8}$/;
    if (phonenumber.length <= 0 || !regphone.test(phonenumber)) {
      console.log("手机号格式错误");
      this.setData({
        errorInfo: '手机号格式错误',
        addFlag1: true,
        addFlag4: false,
        showTopTips: true
      })
    } else {
      console.log("合法数据");
      this.setData({
        phonenumber: phonenumber,
        addFlag1: false,
        addFlag4: true,
        showTopTips: false
      })
    }
  },
  //刷新验证码
  createCode: function () {
    var that = this;
    var code = '';
    var codeLength = 4;
    //验证码的长度 
    var codeChars = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    //所有候选组成验证码的字符，当然也可以用中文的
    for (var i = 0; i < codeLength; i++) {
      var charNum = Math.floor(Math.random() * 52);
      code += codeChars[charNum];
    }
    console.log(code);
    this.setData({
      code: code
    })
  },
  //验证码校验
  blurvalidateCode: function (e) {
    var that = this;
    var inputCode = e.detail.value;
    if (inputCode.length <= 0) {
      this.setData({
        errorInfo: '请输入验证码',
        addFlag7: true,
        addFlag8: false,
        showTopTips: true
      })
    } else if (inputCode.toUpperCase() != this.data.code.toUpperCase()) {
      this.setData({
        errorInfo: '验证码输入错误！',
        addFlag7: true,
        addFlag8: false,
        showTopTips: true
      })
      this.createCode();
    } else if (inputCode.toUpperCase() == this.data.code.toUpperCase()) {
      this.setData({
        addFlag7: false,
        addFlag8: true,
        showTopTips: false
      })
      if (this.data.addFlag4 == true && this.data.addFlag8 == true) {
        console.log(111)
        this.setData({
          display: ''
        })
      }
    }
  },
  //密码校验
  blurPassword: function (e) {
    var that = this;
    console.log(e.detail.value);
    length = e.detail.value.length;
    var password = e.detail.value;
    if (length < 6) {
      console.log("密码长度至少为6位");
      this.setData({
        errorInfo: '密码长度至少为6位',
        addFlag2: true,
        addFlag3: false,
        showTopTips: true
      })
    } else {
      console.log("合法数据");
      this.setData({
        password: password,
        addFlag2: false,
        addFlag3: true,
        showTopTips: false
      })
    }
  },
  //确认密码校验
  reblurPassword: function (e) {
    var that = this;
    console.log(e.detail.value);
    length = e.detail.value.length;
    var repassword = e.detail.value;
    if (repassword != this.data.password) {
      console.log("两次密码不一致");
      this.setData({
        errorInfo: '两次密码不一致',
        addFlag5: true,
        addFlag6: false,
        showTopTips: true
      })
    } else if (repassword.length == 0) {
      console.log("密码不能为空");
      this.setData({
        errorInfo: '密码不能为空',
        addFlag5: true,
        addFlag6: false,
        showTopTips: true
      })
    } else {
      console.log("合法数据");
      this.setData({
        repassword: repassword,
        addFlag5: false,
        addFlag6: true,
        showTopTips: false
      })
    }
  },
  //验证码发送ajax
  sendnum: function (e) {
    console.log(1111)
    var that = this;
    var code = '';
    //				var data = "phonenumber=" + account1 + "&password_again=" + account2;
    wx.request({
      url: 'http://47.94.7.71/goodskill/sendSms.do?jsoncallback=?',
      data: {
        phone: this.data.phonenumber,
        type: 1
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data);
        if (data.flag == 1) {
          wx.showToast({
            title: '验证码发送成功！',
            icon: 'success',
            duration: 3000
          });
          that.setData({
            addFlag9: false,
            addFlag10: false,
            showTopTips: false,
            messagecode: data.code
          })
        }
        if (data.flag == 0) {
          that.setData({
            errorInfo: '验证码发送失败',
            addFlag9: false,
            addFlag10: false,
            showTopTips: true
          })
        }
      },
      error: function () {
        that.setData({
          errorInfo: '网络连接出错！',
          addFlag9: false,
          addFlag10: false,
          showTopTips: true
        })
      }
    });

  },
  //短信验证码校验
  blurmessageCode: function (e) {
    var that = this;
    var inputCode = e.detail.value;
    console.log(inputCode);
    console.log(this.data.messagecode)
    if (inputCode.length <= 0) {
      this.setData({
        errorInfo: '请输入验证码',
        addFlag9: true,
        addFlag10: false,
        showTopTips: true
      })
    } else if (inputCode.toUpperCase() != this.data.messagecode.toUpperCase()) {
      this.setData({
        errorInfo: '验证码输入错误！',
        addFlag9: true,
        addFlag10: false,
        showTopTips: true
      })
    } else if (inputCode.toUpperCase() == this.data.messagecode.toUpperCase()) {
      this.setData({
        addFlag9: false,
        addFlag10: true,
        showTopTips: false
      })
    }
  },
  //操作成功提示
  openToast: function () {
    wx.showToast({
      title: '已完成',
      icon: 'success',
      duration: 3000
    });
  },
  //数据加载提示
  openLoading: function () {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 3000
    });
  },
  //提交表格
  form2Submit: function (e) {
    var that = this;
    if (this.data.addFlag1 == true) {
      this.setData({
        errorInfo: '手机号错误！',
        showTopTips: true
      })
      return;
    }
    if (this.data.addFlag2 == true) {
      this.setData({
        errorInfo: '密码错误！',
        showTopTips: true
      })
      return;
    }
    if (this.data.addFlag5 == true) {
      this.setData({
        errorInfo: '确认密码错误！',
        showTopTips: true
      })
      return;
    }
    if (this.data.addFlag7 == true) {
      this.setData({
        errorInfo: '验证码错误！',
        showTopTips: true
      })
      return;
    }
    if (this.data.addFlag9 == true) {
      this.setData({
        errorInfo: '短信验证码错误！',
        showTopTips: true
      })
      return;
    }
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        that.setData({
          version: res.version
        })
      }
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            // url: 'https://test.com/onLogin',
            url: 'http://47.94.7.71/goodskill/update_userPassword.do?jsoncallback=?',
            data: {
              phone: that.data.phonenumber,
              password: that.data.repassword,
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var data = res.data.substring(1, res.data.length - 1);
              console.log(data);
              data = JSON.parse(data);
              if (data.flag == 1) {
                wx.showToast({
                  title: '修改成功！',
                  icon: 'success',
                  duration: 3000
                });
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 3000);
              }
              if (data.flag == 2) {
                that.setData({
                  errorInfo: '手机号未注册！修改失败！',
                  showTopTips: true,
                })
                // wx.navigateTo({
                //   url: '../login/login'
                // })
              }
              if (data.flag == 0) {
                that.setData({
                  errorInfo: '注册失败！',
                  showTopTips: true,
                })
                // wx.navigateTo({
                //   url: '../login/login'
                // })
              }
            }
          })
        } else {
          that.setData({
            errorInfo: '注册失败！',
            showTopTips: true,
          })
          console.log('注册失败！' + res.errMsg)
        }

      }
    });
  },
  //点击事件
  tabClick: function (e) {
    this.setData({
      showTopTips: false,
      addFlag1: false,
      addFlag2: false,
      addFlag3: false,
      addFlag4: false,
      addFlag5: false,
      addFlag6: false,
      addFlag7: false,
      addFlag8: false,
      addFlag9: false,
      addFlag10: false,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //安全协议
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  }
})