Page({
  data: {
    workplace:"",
    worktype:"",
    workertype:"",
    workerslill:"",
    area:"",
    salary:"",
    peoson:"",
    urgent_fee:""
  },
  onLoad: function (e) {
    var that = this;
    var jobitem_id;
    var boss_id;
    var flag;
    try {
      var value = wx.getStorageSync('jobitem_id')
      if (value) {
        jobitem_id=value;
      }
      that.setData({
        jobitem_id: jobitem_id
      })
      // console.log(jobitem_id)
    } catch (e) {
      console.log("订单ID获取失败")
      // Do something when catch error
    }
    try {
      var value = wx.getStorageSync('flag')
      if (value) {
        flag = value;
      }
    } catch (e) {
      console.log("flag获取失败")
      // Do something when catch error
    }
    if(flag==1){
      console.log("判断！")
      that.setData({
        style:"none"
      })
      console.log(that.data.style)
    }
    wx.request({
      url: 'http://47.94.7.71/goodskill/show_jobitem_byid.do?jsoncallback=?',
      data: {
        jobitem_id: jobitem_id
      },
      dataType: 'JSON',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        
        var data = res.data.substring(1, res.data.length-1);
       
        data = JSON.parse(data);
       console.log(data)
       console.log(data.msg.job.address);
       if (data.msg.job.decoration_type==1){
         var worktypes ="毛坯装修";
       }
       else if (data.msg.job.decoration_type == 2) {
         var worktypes = "旧房改造";
       }
       else{
         console.log("工作类别出错");
       }
        var workplaces = data.msg.job.address+"-"+data.msg.job.community;
        var skillss="";
        var i;
        for(i=0;i<data.skills.length;i++){
          if(skillss==""){
            skillss=data.skills[i].name;
            console.log(data.skills[i].name)
          }
          else{
            skillss =skillss+ "," + data.skills[i].name;
          }
        }
        console.log(skillss);
        that.setData({
          workplace: workplaces,
          worktype: worktypes,
          workertype: data.msg.jobtype.name,
          workerslill: skillss,
          area: data.msg.area,
          salary: data.msg.salary,
          peoson: data.msg.job.user.name,
          urgent_fee: data.msg.urgent_fee
        })
       
      }
    })
    wx.setNavigationBarTitle({
      title: '工作详情'
    })
  },
  //接单
  get_order: function (e) {
    var that = this;
    try {
      var value = wx.getStorageSync('GoodJob_user');
      if (value) {
        console.log("1111")
        console.log(value);
        this.setData({
          user_id: value.id,
          bean: value.beans,
          user_authenticPer: value.user_authenticPer
        })
        if (this.data.bean <= 0) {
          console.log("您的豆子不足");
          wx.showModal({
            content: '您的豆子不足，不能接单',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
          return;
        }
        if (this.data.user_authenticPer != 1) {
          console.log("未认证");
          wx.showModal({
            content: '您还未认证，不能接单',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
          return;
        }
        wx.showModal({
          title: '提示',
          content: '是否确认接单',
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              wx: wx.request({
                //url: 'http://192.168.0.117:8080/framework/add_job.do?jsoncallback=?',
                url: 'http://47.94.7.71/goodskill/add_jobitem_user.do?jsoncallback=?',
                data: {
                  user_id: that.data.user_id,
                  jobitem_id: that.data.jobitem_id
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
                  if (data.flag == 1) {
                    wx.showModal({
                      content: '你已成功接单',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.redirectTo({
                            url: '../appindex/appindex',
                          })
                          console.log('用户点击确定')
                        }
                          
                      }
                    });
                    
                    console.log("接单成功");
                  } else if(data.flag==3) {
                    wx.showModal({
                      content: '接单失败,您已接过此单',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        }
                      }
                    });
                    console.log("接单失败");

                    //  jobitem_user_id = data.jobitem_user_id;
                    //  beans = beans - 1;
                    //  localStorage.setItem("beans", beans);
                    //  document.getElementById("bean").setAttribute("value", "最大接单量：" + beans + "单");

                  }
                  //  if (data.flag == 1) {
                  //    console.log("接单成功");
                  //    wx.navigateTo({
                  //      url: '/example/show_job_list/show_job_list'
                  //    })
                  //  } else {
                  //    console.log("接单失败");
                  //  }
                }
              })

              console.log('用户点击确认')
              // that.getorderdata();
            } else {
              console.log('用户点击取消')
            }

          }
        });
      }
    } catch (e) {
      console.log("获取数据出错");
    }




  },
  boss_info:function(e){
    wx.navigateTo({
      url: '../userinfo/userinfo'
    })
  },
})