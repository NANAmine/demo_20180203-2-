Page({
  //姓名公章评分居住地之认证公司公司地址
  data: {
    workername: "未查到信息",
    graded: "未查到信息",
    address: "未查到信息",
    company: "未查到信息",
    companyaddress: "未查到信息",
    
  },
  onLoad: function (e) {
    var boss_id;
    try {
      var value = wx.getStorageSync('boss_id')
      if (value) {
        boss_id = value;
      }
      console.log(value)
    } catch (e) {
      console.log("boss_id获取失败")
      // Do something when catch error
    }
    var that = this;
    wx.request({
      url: 'http://47.94.7.71/goodskill/get_UserMes.do?jsoncallback=?',
      data: {
        user_id: boss_id
      },
      dataType: 'JSON',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        var data = res.data.substring(1, res.data.length - 1);

        data = JSON.parse(data);

        console.log(data);
       
       //判断公司是否认证
        var company_1; var company_2;
       if(data.user.user_authenticCom == "undefined"){
         company_1=data.user.name_company;
         company_2 = data.user.address_company;
       }else{
         company_1 = "未认证";
         company_2 = "未认证";
       }
        that.setData({
          workername: data.user.name,
          graded: data.user.avgscore_worker,
          address: data.user.address_home,
          company: company_1,
          companyaddress: company_2,
        })

      }
    })
    wx.setNavigationBarTitle({
      title: '工长详情'
    })
  },
})