//index.js
const app = getApp()

wx.cloud.init({ });

Page({
  data: {
  },

  onLoad: function() {
	let that = this;
	
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

	const db = wx.cloud.database({
	  env: 'wenwo-cloud-5cyzm'
	});
    const infoList = db.collection('info_list');
	infoList.limit(10).get({
	  success: (res) => {
		  console.log(res);
		this.setData({
		  infoList: res.data
		});
	  }
	});
	

	  wx.getLocation({
	    type: 'wgs84',
	    success (res) {
		  const latitude = res.latitude
		  const longitude = res.longitude
		  const speed = res.speed
		  const accuracy = res.accuracy

		  console.log(latitude);
		  console.log(longitude);

		  //that.getCity(latitude, longitude);
	    }
	  });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  //根据经纬度获取城市
  getCity: function (latitude, longitude) {
    var that = this;
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=EFHBZ-WQG6U-WEMVB-4N3DG-KSMGT-5WB2G',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
		let province = res.data.result.address_component.province;
        let city = res.data.result.address_component.city;
		let county = res.data.result.address_component.district;
        console.log('province: ' + province);
        console.log('city: ' + city);
        console.log('county: ' + county);
        //把市去掉，下一个接口地址没有模糊处理
        //that.setData({ city: city });
		//that.getWeather(city);
      }
    })
  },

  //根据城市获取天气信息
  getWeather: function (province, city, county) {
    var that = this;
    wx.request({
      url: 'https://wis.qq.com/weather/common',
	  data: {
		source: 'xw',
		weather_type: 'observe|alarm',
		province: '广东省',
		city: '肇庆市',
		county: '封开县'
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
		  /**
        var future = res.data.data.forecast;
        //移除掉数组中当天的天气信息
        var todayInfo = future.shift();
        var today = res.data.data;
        today.todayInfo = todayInfo;
        that.setData({ today: today, future: future });
		  */
      },
    })
  }

})
