Page({
  data: {
    publishtype: "1",
    date: "",
    addFlag: true,
    showTopTips: false,
    urgent: 0,
    urgent_fee: 0,
    radioItems: [
      { name: '毛坯装修', value: '1', checked: true },
      { name: '旧房改造', value: '2' }
    ],
    radioIndex: 1,
    checkboxItems: [],
    units: ["平米", "延米"],
    unitIndex: 0,
    jobtypeIndex: 0,
    region: ['河北省', '廊坊市', '广阳区'],
    customItem: '全部',
    upaddress:"",
    uparea: "",
    upsalary: "",
    upurgen: "",
    user_id:""
  },
  textdata: function (e) {
    var timestamp =
      Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp *
      1000;
    var date = new Date(n);
    var Y =
      date.getFullYear();
    var M = (date.getMonth()
      + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate()
      < 10 ? '0' + date.getDate() :
      date.getDate();
    console.log(Y + "-" + M + "-" + D)
    this.setData({
      date: Y + "-" + M + "-" + D
    })
  },
  onLoad: function (e) {
    //设置日期选择器的起始时间
    try {
      var value = wx.getStorageSync('GoodJob_user')
      if (value) {
      
        this.setData({
          user_id: value.user.id,
        })

        this.textdata();
        console.log(this.data.date);
        var nndate = Date.parse(new Date());
        console.log(nndate);
        this.setData({
          nowdate: nndate
        })
        wx.setNavigationBarTitle({
          title: '发布工作'
        })

        this.getdata();
       
      }
    } catch (e) {
      console.log("获取数据出错");
    }
    
    try {
      var value = wx.getStorageSync('publidhtype')
      if (value) {
        this.setData({
          publishtype: value,
        })
        if (value == 2) {
          this.updatatogetdata();
        }
      }
    } catch (e) {
      console.log("获取数据出错");
    }
   
  },
  getdata:function(e0){
    var that = this;
    wx.request({
      url: 'http://47.94.7.71/goodskill/front_get_jobtypes.do?jsoncallback=?',
      dataType: 'JSON',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data.substring(2, res.data.length - 1);
        data = JSON.parse(data);
        console.log(data);
        if(data.flag==1||data.flag==undefined){
          console.log("工作数组" + data);
          that.setData({
            objectJobtypes: data.list
          })
          //工种加载成功后，初次加载技能
          var jobtype_id = data.list[0].id;
          console.log("工种id：" + jobtype_id);
          wx.request({
            url: 'http://47.94.7.71/goodskill/get_skillbyjobtype.do?jsoncallback=?',
            data: {
              id: jobtype_id
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var data = res.data.substring(1, res.data.length - 1);
              console.log("技能数组" + data);
              data = JSON.parse(data);
              if(data.flag==1||data.flag==undefined){
                that.setData({
                  checkboxItems: data.skills
                })
              }else{
                wx.showModal({
                  content: '工种技能加载失败，请稍后再试',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                });
              } 
            }
          })
        }else{
          wx.showModal({
            content: '工种加载失败，请稍后再试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      }
    })
  },
  radioChange: function (e) {
    console.log('选择工作类别：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      radioIndex: e.detail.value
    });
  },
  checkboxChange: function (e) {
    console.log('选择技能：', e.detail.value);
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  },
  bindUnitChange: function (e) {
    console.log('选择单位：', e.detail.value);
    this.setData({
      unitIndex: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('选择地址：', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindJobtypeChange: function (e) {
    console.log('选择工种：', e.detail.value);
    this.setData({
      jobtypeIndex: e.detail.value
    })
    //根据选择的工种，加载相应的技能
    var that = this;
    var objectJobtypes = this.data.objectJobtypes;
    var jobtype_id = objectJobtypes[e.detail.value].id;
    console.log("工种id：" + jobtype_id);
    wx.request({
      url: 'http://47.94.7.71/goodskill/get_skillbyjobtype.do?jsoncallback=?',
      data: {
        id: jobtype_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data.substring(1, res.data.length - 1);
        console.log(data);
        data = JSON.parse(data);
        that.setData({
          checkboxItems: data.skills
        })
        //this.data.checkboxItems[0].checked = true;
      }
    })
  },
  bindUrgentChange: function (e) {
    console.log('改变加急状态：', e.detail.value);
    if (e.detail.value) {
      this.setData({
        urgent: 1
      })
    } else {
      this.setData({
        urgent: 0
      })
    }
  },
  blurAddress: function (e) {
    var that = this;
    console.log(e.detail.value);
    length = e.detail.value.length;
    if (length == 0) {
      console.log("不能为空");
      this.setData({
        errorInfo: '不能为空',
        addFlag: true,
        communityFlag: true,
        showTopTips: true
      })
    } else if (length > 10) {
      console.log("长度不合法");
      this.setData({
        errorInfo: '长度不合法',
        addFlag: true,
        communityFlag: true,
        showTopTips: true
      })
    } else {
      console.log("合法数据");
      this.setData({
        addFlag: false,
        communityFlag: false,
        showTopTips: false
      })
    }
  },
  blurArea: function (e) {
    var that = this;
    console.log(e.detail.value);
    length = e.detail.value.length;
    if (length == 0) {
      console.log("不能为空");
      this.setData({
        errorInfo: '不能为空',
        addFlag: true,
        areaFlag: true,
        showTopTips: true
      })
    } else {
      console.log("合法数据");
      this.setData({
        addFlag: false,
        areaFlag: false,
        showTopTips: false
      })
    }
  },
  blurSalary: function (e) {
    var that = this;
    console.log(e.detail.value);
    length = e.detail.value.length;
    if (length == 0) {
      console.log("不能为空");
      this.setData({
        errorInfo: '不能为空',
        addFlag: true,
        salaryFlag: true,
        showTopTips: true
      })
      return;
    } else {
      console.log("合法数据");
      this.setData({
        addFlag: false,
        salaryFlag: false,
        showTopTips: false
      })
    }
  },
  blurUrgent: function (e) {
    var that = this;
    console.log(e.detail.value);
    length = e.detail.value.length;
    if (length == 0) {
      console.log("不能为空");
      this.setData({
        errorInfo: '不能为空',
        addFlag: true,
        urgentFlag: true,
        showTopTips: true
      })
      return;
    } else {
      console.log("合法数据");
      this.setData({
        addFlag: false,
        urgentFlag: false,
        showTopTips: false
      })
    }
  },
  check: function (skills_id, community, area, salary, urgent, urgent_fee) {



    if (skills_id == "") {
      console.log("未选择技能");
      this.setData({
        errorInfo: '未选择技能',
        addFlag: true,
        showTopTips: true
      })
      return;
    }
    else {
      console.log("合法数据");
      this.setData({
        addFlag: false,
        showTopTips: false
      })
    }
    if (community == "") {
      console.log("未填写详细地址");
      this.setData({
        errorInfo: '未填写详细地址',
        addFlag: true,
        showTopTips: true,
        communityFlag: true
      })
      return;

    }
    if (area == "") {
      console.log("未填写施工量");
      this.setData({
        errorInfo: '未填写施工量',
        addFlag: true,
        showTopTips: true,
        areaFlag: true
      })
      return;
    }
    if (salary == "") {
      console.log("未填写薪水");
      this.setData({
        errorInfo: '未填写薪水',
        addFlag: true,
        showTopTips: true,
        salaryFlag: true
      })
      return;
    }
    if (urgent == 1) {
      if (urgent_fee == "" || urgent_fee == 0) {
        console.log("未填写加急金额");
        this.setData({
          errorInfo: '未填写加急金额',
          addFlag: true,
          showTopTips: true,
          urgentFlag: true
        })

      }

    }

  },
  formSubmit: function (e) {
    //获取技能id串
    var that = this;
    console.log(e)
    var skills_id = "";
    var checkboxItems = this.data.checkboxItems;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      if (checkboxItems[i].checked == true) {
        if (skills_id == "") {
          skills_id += checkboxItems[i].id;
        }
        else {
          skills_id += "_" + checkboxItems[i].id;
        }
      }
    }
    console.log("选择的技能" + skills_id)
    if (e.detail.value.urgent_fee) {

      this.setData({
        urgent_fee: e.detail.value.urgent_fee,
        urgent: 1
      })
    }

    this.check(skills_id, e.detail.value.community, e.detail.value.area, e.detail.value.salary, this.data.urgent, this.data.urgent_fee);
    console.log("addflag:" + this.data.addFlag);
    //http://192.168.0.109:8080/framework/
    if (!this.data.addFlag) {
      console.log("数据演示开始");
      console.log(this.data.user_id);
      console.log(131001);
      console.log(e.detail.value.community);
      console.log(this.data.date);
      console.log(this.data.objectJobtypes[this.data.jobtypeIndex].id);
      console.log(skills_id);
      console.log(this.data.radioIndex+"ccc");
      console.log(e.detail.value.area);
      console.log(this.data.unitIndex + 1);
      console.log(e.detail.value.salary);
      console.log(this.data.urgent);
      console.log(this.data.urgent_fee);
      console.log("数据演示结束");
      console.log("开始发布")
      wx.showModal({
        title: '提示',
        content: '是否确认发布',
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            if(that.data.publishtype==1){
              var puburl ="http://47.94.7.71/goodskill/add_job.do?jsoncallback=?";
            }
            if (that.data.publishtype == 2) {
              var puburl = "http://47.94.7.71/goodskill/add_job.do?jsoncallback=?";
            }
            if (that.data.publishtype == 3) {
              var puburl = "http://47.94.7.71/goodskill/add_job.do?jsoncallback=?";
            }
            wx: wx.request({
              //url: 'http://192.168.0.117:8080/framework/add_job.do?jsoncallback=?',
              url: 'http://47.94.7.71/goodskill/add_job.do?jsoncallback=?',
              data: {
                "user_id": that.data.user_id,
                "area_code": 131003,
                "community_name": e.detail.value.community,
                "pre_start_date": that.data.date,
                "jobtype_id": that.data.objectJobtypes[that.data.jobtypeIndex].id,
                "skills_id": skills_id,
                "decoration_type": that.data.radioIndex,
                "area": e.detail.value.area,
                "unit": that.data.unitIndex + 1,
                "salary": e.detail.value.salary,
                "urgent_status": that.data.urgent,
                "urgent_fee": that.data.urgent_fee
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
                if (data.flag == '1') {
                  console.log("发布成功");
                  wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 3000
                  });
                  wx.navigateTo({
                    url: '/example/show_job_list/show_job_list'
                  })
                } else {
                  console.log("发布失败");
                }
              }
            })
            console.log('用户点击确认')
          } else {
            console.log('用户点击取消')
          }
        }
      });
    }
  },
  bindDateChange: function (e) {
    console.log('预计开工：', e.detail.value);
    if (this.data.date != e.detail.value) {
      this.setData({
        date: e.detail.value,
        updateFlag: 1
      })
    }
  },
  updatatogetdata:function(e){
    console.log("测试");
    try {
      var value = wx.getStorageSync('updatainformation')
      if (value) {
        console.log("获取修改数据");
        console.log(value);
        //修改表单数据
        this.setData({
          upaddress:value[0].jobitem.job.community,
          uparea: value[0].jobitem.area,
          upsalary: value[0].jobitem.salary,
          upurgen: value[0].jobitem.urgen_fee,
        })
      //修改工作类别
        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == value[0].jobitem.job.decoration;
        }
        this.setData({
          radioItems: radioItems,
          radioIndex: value[0].jobitem.job.decoration
        });
        //修改单位
        
        this.setData({
          unitIndex: value[0].jobitem.unit
        })
       

      }
    } catch (e) {
      console.log("获取数据出错");
    }
  },
  ttext: function (e) {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        page.loadCity(longitude, latitude)
      }
    })

  },
  loadCity: function (longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=您的ak&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success    
        console.log(res);
        var city = res.data.result.addressComponent.city;
        page.setData({ currentCity: city });
      },
      fail: function () {
        page.setData({ currentCity: "获取定位失败" });
      },

    })
  }
})