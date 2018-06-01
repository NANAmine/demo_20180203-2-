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
    buttont: [],
    boss_id: "1", 
    jobitem_id: "2", 
    worker_id: "3", 
    worktype_id: "4",
  },
  onLoad:function(e){
    var that=this;
      wx.setNavigationBarTitle({
        title: '评价'
      }) ;
      try {
        var value = wx.getStorageSync('evaluation');
        if (value) {
          that.setData({
            boss_id: value.boss_id,
            jobitem_id: value.jobitem_id,
            worker_id: value.worker_id,
            worktype_id:value.worktype_id,
          })
          that.getdata();
        }
      } catch (e) {
        console.log(e);
        console.log("获取数据出错");
      }
  },
  getdata:function(e){
    var that = this;
    wx: wx.request({
      url: 'http://47.94.7.71/goodskill/show_label.do?jsoncallback=?',
      data: {
        jobtype_id: this.data.worktype_id,
        authentic_status: 1,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data);
        if (data.flag == '1') {
          var i;
          for (i = 0; i < data.label.length; i++) {
            var labid = data.label[i].id;
            var labname = data.label[i].name;
            var b1 = "buttont[" + i + "].id";
            var b2 = "buttont[" + i + "].name";
            var b3 = "buttont[" + i + "].status";
            var b4 = "buttont[" + i + "].num";
            that.setData({
              [b1]: labid,
              [b2]: labname,
              [b3]: "default",
              [b4]: i
            })
          }
          console.log("获取标签成功");
        } else {
          console.log("获取标签失败");
        }
      }
    })
  },
  gettextarea: function (e) {
    //event.detail = { value, cursor }
    this.setData({
      textnumber: e.detail.value.length,
      userInput: e.detail.value
    })
  },
  changebt: function (e) {
    var str = e.target.id;
  console.log(e)
  console.log(str)
    console.log(this.data.buttont)
    var up = "buttont[" + str + "].status";
    if (this.data.buttont[str].status == "primary") {
      this.setData({
        [up]: 'default'
      })
    }
    else if (this.data.buttont[str].status == "default") {
      this.setData({
        [up]: 'primary'
      })
    }
    console.log(this.data.buttont[str].status + ":更改为" + this.data.buttont[str].status);
  },
  changeicon: function (e) {
    //if (target.id){}
    //console.log(e.target.id)
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
  formsubmit: function (e) {
    console.log("用户点击提交操作");
    
    //获取评分
    var formscore = this.data.score;
    console.log("评分为：" + formscore);
    //获取标签
    var formlabel = "";
    for (var i = 0; i < this.data.buttont.length; i++) {
      if (this.data.buttont[i].status == "primary") {
        if (formlabel == "") {
          formlabel = this.data.buttont[i].id;
        }
        else if (formlabel != "") {
          formlabel = formlabel + "_" + this.data.buttont[i].id;
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
    console.log("jobitem_user_id:" + this.data.jobitem_id + "appraiser_id:" + this.data.boss_id + " worker_id:+" + this.data.worker_id +
      "labels_id:" + formlabel +
      "context:" + formevaluation +
      "appraise_score:" + formscore, );
    // boss_id: "", jobitem_id: "", worker_id: "", worktype_id: "",
   wx: wx.request({
      url: 'http://47.94.7.71/goodskill/job_statusadd_appraise.do?jsoncallback=?',
      data: {
        jobitem_user_id:this.data.jobitem_id ,//工作id
        appraiser_id:this.data.boss_id ,//评价者id
        worker_id:this.data.worker_id,//评价对象id
        labels_id:formlabel,//标签id
        context:formevaluation,//评语id
        appraise_score:formscore,//评分
        flag:1,//标志   1：工长评价工人 2：工人评价工长
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
        } else {
          console.log("评价失败");
        }
      }
    })
  },
})