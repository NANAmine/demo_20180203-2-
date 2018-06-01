Page({
  data: {
    files: [],
    userInput:'',
    textnumber:0,
    upimgpath:"",
    jobitem_id:"",

  },
  onLoad:function(e){
    var that=this;
    wx.setNavigationBarTitle({
      title: '返工'
    });
    try {
      var value = wx.getStorageSync('jobitem_id');
      if (value) {
        that.setData({
         jobitem_id: value
        })
        that.getdata();
      }
    } catch (e) {
      console.log(e);
      console.log("获取数据出错");
    }
  },
  deleteimg:function(e){
    //var f1="files[0]"
    this.setData({
      files:[]
    });
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        if (that.data.files.length==2){
          wx.showModal({
            content: '上传图片数量达到上限',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        
          return;

        }
        // files.push({
        //   name: "uploadkey" + index,
        //   path: p
        // });
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  gettextarea: function (e) {
    //event.detail = { value, cursor }
   // console.log("f"+);
    this.setData({
      textnumber: e.detail.value.length,
      userInput: e.detail.value
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
    console.log("当前显示图片的http链接"+e.currentTarget.id);
    console.log("需要预览的图片http链接列表" + this.data.files)
  },
  formSubmit: function (e) {
    var that=this
    console.log("返工原因："+this.data.userInput);
    if (this.data.files.length == "0") {
      console.log("未上传返工照片");
      wx.showModal({
        content: '未上传返工照片',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return;

          }
        }
      });
    }
    else if (this.data.userInput==""){
      console.log("返工原因未填写");
      wx.showModal({
        content: '未填写返工原因',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return;

          }
        }
      });
    }
    
    //rework
    console.log(that.data.files[0])
      wx.uploadFile({
        url: 'http://47.94.7.71/goodskill/end_request_rework.do?jsoncallback=?', 
        filePath: that.data.files[0],  
        name: 'img_url',
        formData: {
          "memo": that.data.userInput,
          "jobitem_user_id":that.data.jobitem_id
        },
        success: function (res) {
          var data = res.data
          console.log(data)
          if(data=='{"flag":"1"}'){
          wx.reLaunch({
            url: '../get_order/get_order'
          })
          } else if (data =='{"flag":"0"}'){
            console.log(data)
            console.log("返工上传失败！")
          }else{
            console.log("上传失败")
          }
          //do something
        }
      })
    
  }
});