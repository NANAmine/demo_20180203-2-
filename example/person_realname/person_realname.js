Page({
  data: {
    sunmitshow: 1,
    personreamnameflag: "",
    files: [],
    filess: [],
    files_1: '',
    files_2: '',
    username: "",
    idcardnumber: "",
    sexbtn_1: "primary",
    sexbtn_2: "default",
    buttonname_1: "上传身份证正面照片",
    buttonname_2: "上传身份证反面照片",
    imgsrc_1: "/example/images/idsample2.jpg",
    imgsrc_2: "/example/images/idsample.png",
    disabledflag:0,
    user_id:""
  },
  comeback: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (e) {
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
    wx.setNavigationBarTitle({
      title: '个人实名认证'
    });
    //获取认证状态
    var that = this;
    wx: wx.request({
      //url: 'http://192.168.0.117:8080/framework/get_UserMes.do?jsoncallback=?',
      url: 'http://47.94.7.71/goodskill/get_UserMes.do?jsoncallback=?',
      data: {
        "user_id":this.data.user_id,
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
if(data.flag==1||data.flag==undefined){
  var user_authenticPer = data.user.user_authenticPer;
  var realname_btn_1; var realname_btn_2;
  if (user_authenticPer == 1) {
    console.log(data.user.sex);
    console.log(data.user.sex == "女");
    if (data.user.sex == "女") {
      realname_btn_1 = "default";
      realname_btn_2 = "primary";
    }
    else if (data.user.sex == "男") {
      realname_btn_2 = "default";
      realname_btn_1 = "primary";
    }
    else {
      //数据出错
      console.log("无性别信息");
      realname_btn_2 = "default";
      realname_btn_1 = "default";
    }
    console.log("加入数据前" + realname_btn_1);
    that.setData({
      personreamnameflag: "已认证",
      username: data.user.name,
      idcardnumber: data.user.id_card,
      sexbtn_1: realname_btn_1,
      sexbtn_2: realname_btn_2,
      disabledflag: 1
    });
  } else if (user_authenticPer == 0) {
    that.setData({
      sunmitshow: 0,
      personreamnameflag: "未认证"
    });
  } else if (user_authenticPer == 2) {
    if (data.user.sex == "女") {
      realname_btn_1 = "default";
      realname_btn_2 = "primary";
    }
    if (data.user.sex == "男") {
      realname_btn_2 = "default";
      realname_btn_1 = "primary";
    }
    else {
      //数据出错
      console.log("无性别信息");
      realname_btn_2 = "default";
      realname_btn_1 = "default";
    }
    that.setData({
      personreamnameflag: "审核中，请耐心等侯",
      username: data.user.name,
      idcardnumber: data.user.id_card,
      sexbtn_1: realname_btn_1,
      sexbtn_2: realname_btn_2,
      disabledflag: 1
    });
  }
}else{
  console.log("查询出错。flag:"+data.flag)
}
        
      }
    });
  },
  gettextarea: function (e) {
    if (e.target.id == "username") {
      this.setData({
        username: e.detail.value
      })
      console.log("用户输入姓名：" + e.detail.value);
    }
    if (e.target.id == "idcardnumber") {
      this.setData({
        idcardnumber: e.detail.value
      })
      console.log("用户输入身份证号：" + e.detail.value)
    }

  },
  chooseImage: function (e) {
    if (this.data.disabledflag){
      return;
    }
    var that = this;
    console.log(e)
    if (e.target.id == "btn_1") {
      that.setData({
        files_1: ""
      });
    }
    if (e.target.id == "btn_2") {
      that.setData({
        files_2: ""
      });
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("22222222222" + e.target.id)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        if (e.target.id == "btn_1" || e.target.id == "vie_1") {
          that.setData({
            files_1: that.data.files_1.concat(res.tempFilePaths),
            buttonname_1: "更改身份证正面照片"
          });
          console.log("用户上传身份证正面照片");
        }
        if (e.target.id == "btn_2" || e.target.id == "vie_2") {
          that.setData({
            files_2: that.data.files_2.concat(res.tempFilePaths),
            buttonname_2: "更改身份证反面照片"
          });
          console.log("用户上传身份证反面照片");
        }
      }
    })

  },
  previewImage: function (e) {
    // var f1="files[0]";
    // var f2 ="files[1]";
    // this.setData({
    //   [f1]: this.data.files_1,
    //   [f2]: this.data.files_2,
    // })
    var f1 = "filess[0]"
    if (e.target.id == "img_1") {
      this.setData({
        [f1]: this.data.files_1,
      })
    }
    if (e.target.id == "img_2") {
      this.setData({
        [f1]: this.data.files_2,
      })
    }
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.filess // 需要预览的图片http链接列表
    })
  },
  sexchange: function (e) {
    if (e.target.id == "man") {
      this.setData({
        sexbtn_1: "primary",
        sexbtn_2: "default",
      })
      console.log("选择性别：男");
    }
    if (e.target.id == "woman") {
      this.setData({
        sexbtn_2: "primary",
        sexbtn_1: "default",
      })
      console.log("选择性别：女");
    }
  },
  formsubtim: function (e) {
    var f1 = "files[0]";
    var f2 = "files[1]";
    this.setData({
      [f1]: this.data.files_1,
      [f2]: this.data.files_2,
    })
    var formsex;
    if (this.data.sexbtn_1 == "primary" && this.data.sexbtn_2 == "default") {
      formsex = "男";
    }
    else if (this.data.sexbtn_2 == "primary" && this.data.sexbtn_1 == "default") {
      formsex = "女";
    }
    else {
      console.log("设置性别出错");
      return;
    }
    console.log("上传信息");
    console.log("姓名:" + this.data.username);
    console.log("性别:" + formsex);
    console.log("身份证号:" + this.data.idcardnumber);
    var flag = this.check();
    if (flag == 0) {
      return;
    }
    // wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
    //   filePath: files,
    //   name: 'file',
    //   formData: {
    //     'phonenumber': this.data.phonenumber,
    //     'username': this.data.username,
    //     'idcardnumber': this.data.idcardnumber
    //   },
    //   success: function (res) {
    //     var data = res.data
    //     //do something
    //   }
    // })
  },
  // validatemobile: function (mobile) {
  //   if (mobile.length == 0) {
  //     console.log("未输入手机号");
  //     wx.showModal({
  //       content: '未输入手机号',
  //       showCancel: false,
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           return 0;

  //         }
  //       }
  //     });
  //   }
  //   if (mobile.length != 11) {
  //     console.log("手机号长度有误");
  //     wx.showModal({
  //       content: '手机号长度有误',
  //       showCancel: false,
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           return 0;

  //         }
  //       }
  //     });
  //   }
  //   var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  //   if (!myreg.test(mobile)) {
  //     console.log("手机号有误");
  //     wx.showModal({
  //       content: '手机号有误',
  //       showCancel: false,
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           return 0;

  //         }
  //       }
  //     });
  //   }
  //   return true;
  // },
  check: function (e) {
    if (this.data.username == "") {
      console.log("未输入姓名");
      wx.showModal({
        content: '未输入姓名',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return 0;
          }
        }
      });
    }
    else if (this.data.idcardnumber == "") {
      console.log("未输入身份证号");
      wx.showModal({
        content: '未输入身份证号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return 0;
          }
        }
      });
    }
    else if (this.data.files_1 == "") {
      console.log("未上传身份证正面照片");
      wx.showModal({
        content: '未上传身份证正面照片',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return 0;
          }
        }
      });
    }
    else if (this.data.files_2 == "") {
      console.log("未上传身份证反面照片");
      wx.showModal({
        content: '未上传身份证反面照片',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return 0;
          }
        }
      });
    }
    else {
      return 1;
    }
  }
});