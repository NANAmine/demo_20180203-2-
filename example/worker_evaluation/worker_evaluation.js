Page({
  data: {
    textnumber: 0,
    userInput: '',
    score: 3,
    icont: [{ id: 1, name: 'success' },
    { id: 2, name: 'success' },
    { id: 3, name: 'success' },
    { id: 4, name: 'circle' },
    { id: 5, name: 'circle' },],
    button: [{ id: '', name: '',status:'',num:''}]
  },
  gettextarea: function (e) {
    this.setData({
      textnumber: e.detail.value.length,
      userInput: e.detail.value
    })
  },
  changebt: function (e) {
    var num = e.currentTarget.dataset.num;
    var up = "button[" + num + "].status";
    if (this.data.button[num].status == "primary") {
      this.setData({
        [up]: 'default'
      })
    }
    else if (this.data.button[num].status == "default") {
      this.setData({
        [up]: 'primary'
      })
    }
    console.log(this.data.button[num].id + ":更改为" + this.data.button[num].status);
  },
  changeicon: function (e) {
    var i;
    for (i = 0; i < 5; i++) {
      if (i < e.target.id) {
        var up = "icont[" + i + "].name";
        this.setData({
          [up]: 'success'
        })
      }
      if (i >= e.target.id) {
        var up = "icont[" + i + "].name";
        this.setData({
          [up]: 'circle'
        })
      }
    }
    this.setData({
      score: e.target.id
    })
    console.log("用户评分为：" + this.data.score);
  },
  onLoad:function(){
    console.log("评价页面载入")
    var that = this
    var jobitem_user_id, boss_id, user_id;
    try {
      var value = wx.getStorageSync('GoodJob_user')
      if (value) {
        that.setData({
          user_id: value.id
        })
      }
      console.log("用户ID：")
      console.log(that.data.user_id)

    } catch (e) {
      console.log("user_id获取失败")
    }
    try {
      var value = wx.getStorageSync('jobitem_user_id')
      if (value) {
        that.setData({
          jobitem_user_id: value
        })
      }
      console.log("订单ID：")
      console.log(that.data.jobitem_user_id)
    } catch (e) {
      console.log("订单ID获取失败")
      // Do something when catch error
    }
    try {
      var value = wx.getStorageSync('boss_id')
      if (value) {
        that.setData({
          boss_id: value
        })
        console.log("bossID")
        console.log(that.data.boss_id)
      }
    } catch (e) {
      console.log("工长ID获取失败")
      // Do something when catch error
    }
    wx.setNavigationBarTitle({
      title: '评价'
    });
    var that=this
    wx: wx.request({
      url: 'http://47.94.7.71/goodskill/show_label.do?jsoncallback=?',
      data: {
        jobtype_id:0,
        authentic_status:2,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data); 
        if (data.flag == 0) {
          console.log("标签查询失败！");
          return;
        }else if (data.flag == '1') {
           var skilllength = data.label.length;
           for(var i=0;i<skilllength;i++){
             var id = data.label[i].id
             var ids = "button[" + i + "].id"
             var name = data.label[i].name
             var names = "button[" + i + "].name"
             var status = "button[" + i + "].status"
             var num = "button[" + i + "].num"
             that.setData({
               [ids]:id,
               [names]:name,
               [status]:'default', //primary
               [num]:i //primary
             }) }
          console.log("获取标签成功");
        } else {
          console.log("获取标签失败");
        }
      }
    })

  },
  formsubmit: function (e) {
    var that=this;
    console.log("用户点击提交操作");
    //获取评分
    var formscore = this.data.score;
    console.log("评分为：" + formscore);
    //获取标签
    var formlabel = "";
    for (var i = 0; i < this.data.button.length; i++) {
      if (this.data.button[i].status == "primary") {
        if (formlabel == "") {
          formlabel = this.data.button[i].id;
        }
        else if (formlabel != "") {
          formlabel = formlabel + "_" + this.data.button[i].id;
        }
      }
    }
    if (formlabel==""){
      //标签为空
     // return;
    }
    console.log("评价标签为：" + formlabel);
    //获取评价
    var formevaluation = this.data.userInput;
    if (formevaluation==""){
      //评价为空
    }
    console.log("评级语为" + formevaluation);
    wx: wx.request({
      url: 'http://47.94.7.71/goodskill/add_appraise.do?jsoncallback=?',
      data: {
        appraiser_id: that.data.user_id,
        jobitem_user_id: that.data.jobitem_user_id,
        appraiseobject_id: that.data.boss_id,
        appraise_score: formscore,
        labels_id: formlabel,
        context: formevaluation,
        flag:2
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data); 
        if (data.flag == '1') {
          console.log("评价成功");
          wx.navigateBack({
            delta: 1
          })
        } else {
          console.log("评价失败");
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
 
})