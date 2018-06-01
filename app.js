App({
  data: {},
  url: "http://192.168.0.106:8080/framework/",

  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'http://47.94.7.71/goodskill/add_job.do?jsoncallback=?',
            data: {
              code: res.code
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var data = res.data.substring(1, res.data.length - 1);
              console.log(data);
              data = JSON.parse(data);
              console.log(data);
              if (data.flag == 1) {                      //老用户直接登录
                wx.navigateTo({
                  // url: 'example/appindex/appindex'
                })
              }
              else if (data.flag == 0) {
                wx.navigateTo({                          //新用户需要注册
                  // url: 'example/appshow/appshow'
                  // url:'example/get_order/get_order'
                })
                console.log("new user need to register");
              }
            }
          });
          console.log('登录成功！' + res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  onShow: function () {
    // wx.request({
    //   url: 'http://localhost:8080/framework/get_skillbyjobtype.do?jsoncallback=?',
    //   data: {
    //     code: data.code
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var data = res.data.flag;
    //     console.log(data);
    //     data = JSON.parse(data);
    //     if(data==1){
    //       window.location.href = "appindex"; 
    //     }
    //     else{
    //       window.location.href = "register";
    //     }
    //     that.setData({
    //       checkboxItems: data.list
    //     })
    //     //this.data.checkboxItems[0].checked = true;
    //   }
    // });

    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  }
});