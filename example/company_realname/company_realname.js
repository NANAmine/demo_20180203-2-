Page({
  data: {
    filess:[],
    files: '',
    companyaddress:"",
    companyname: '',
    license: "",
    buttonname: "上传营业执照照片",
    imgsrc:"/example/images/company.jpg",
    sunmitshow:1,
    companyreamnameflag:"",
    disabledflag:0,
    user_id:""
  },
  comeback:function(e){
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
    var that=this;
    wx.setNavigationBarTitle({
      title: '公司实名认证'
    });
    //获取认证状态
    wx: wx.request({
      //url: 'http://192.168.0.117:8080/framework/get_UserMes.do?jsoncallback=?',
      url: 'http://47.94.7.71/goodskill/get_UserMes.do?jsoncallback=?',
      data: {
        "user_id": that.data.user_id,
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
          var user_authenticCom = data.user.user_authenticCom;
          var user_authenticPer = data.user.user_authenticPer;
          if (user_authenticPer == 2 || user_authenticPer == 0) {
            //mui.alert("先完成个人实名认证");
            wx.showModal({
              content: '先完成个人实名认证',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
            //document.getElementById("upto").setAttribute("style", "display: none;");
            that.setData({
              sunmitshow: 0
            });
            return;
          }
          if (user_authenticCom == 1) {
            that.setData({
              companyreamnameflag: "已认证",
              companyaddress: data.user.address_company,
              companyname: data.user.name_company,
              license: data.user.business_license_num,
              disabledflag: 1
            });
          } else if (user_authenticCom == 0) {
            that.setData({
              companyreamnameflag: "未认证"
            });
          } else if (user_authenticCom == 2) {
            that.setData({
              companyreamnameflag: "审核中，请耐心等侯",
              companyaddress: data.user.address_company,
              companyname: data.user.name_company,
              license: data.user.business_license_num,
              disabledflag: 1
            });
          }   
        }else{
          console.log("查询出错。flag："+data.flag)
        }
           
      }       
      });
    //获取信息，照片
  },
  gettextarea: function (e) {
    if (e.target.id == "companyname") {
      this.setData({
        companyname: e.detail.value
      })
      console.log("用户输入公司名称：" + e.detail.value);
    }
    if (e.target.id == "license") {
      this.setData({
        license: e.detail.value
      })
      console.log("用户输入营业执照号码：" + e.detail.value);
    }
    if (e.target.id == "companyaddress") {
      this.setData({
        companyaddress: e.detail.value
      })
      console.log("用户输入营业执照号码：" + e.detail.value);
    }
  },
  chooseImage: function (e) {
    if (this.data.disabledflag){
      return;
    }
    var that = this;
    that.setData({
      files: ""
    });
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        var f1="filess[0]";
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          buttonname: "更改营业执照照片",
          [f1]: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
    console.log("用户上传图片");
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.filess // 需要预览的图片http链接列表
    })

  },
  
  formSubmit: function (e) {
    console.log("上传信息");
    console.log("公司名称："+this.data.companyname);
    console.log("营业执照：" + this.data.license);
    console.log("营业执照：" + this.data.companyaddress);
    if (this.data.companyname == "") {
      console.log("未输入公司名称");
      wx.showModal({
        content: '未输入公司名称',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return;

          }
        }
      });
    }
    if (this.data.license == "") {
      console.log("未输入营业执照号码");
      wx.showModal({
        content: '未输入营业执照号码',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return;

          }
        }
      });
    }
    if (this.data.license.length!=15) {
      console.log("营业执照号码长度有误");
      wx.showModal({
        content: '营业执照号码长度有误',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return;

          }
        }
      });
    }
    if (this.data.companyaddress == "") {
      console.log("未输入公司地址");
      wx.showModal({
        content: '未输入公司地址',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return;

          }
        }
      });
    }
    if (this.data.files == "") {
      console.log("未上传营业执照照片");
      wx.showModal({
        content: '未上传营业执照照片',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return;

          }
        }
      });
    }
    // wx.uploadFile({
    //   url: 'http://47.94.7.71/goodskill/get_commitCompany.do', //
    //   filePath: files,
    //   name: 'file',
    //   formData: {
    //    "name_company":this.data.companyaddress,
    //"business_license_num":this.data.license,
    //"user_id":user_id,
   // "address_company":this.data.companyaddress,
    //   },
    //   success: function (res) {
    //     var data = res.data
    //     //do something
    //   }
    // })

  }
});