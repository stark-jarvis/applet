//index.js

const app = getApp()

// 在调用云开发各 API 前，需先调用初始化方法 init 一次（全局只需一次，多次调用时只有第一次生效）
wx.cloud.init({ });

Page({
  data: {
	/**
	county: '',
	todayWeather: '',
    avatarUrl: '../../images/user-unlogin.jpg',
	nickName: '登录',
	*/
	isIndexPage: true,
    userInfo: {},
	logged: false
  },

  onLoad: function() {
	let that = this;
	
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
	/**
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
			console.log('getSetting');
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
				nickName: res.userInfo.nickName
              })
            }
          })
        } else {
		  wx.openSetting({
			success: e => {
			  console.log(e);
			}
		  });
		}
      }
    });
	*/
	
	// 获取列表
	this.getInfoList();

	/** 获取经纬度
	  wx.getLocation({
	    type: 'wgs84',
	    success (res) {
		  const latitude = res.latitude
		  const longitude = res.longitude
		  const speed = res.speed
		  const accuracy = res.accuracy

		  console.log(latitude);
		  console.log(longitude);

		  // 根据经纬度获取城市名称
		  that.getCity(latitude, longitude);
	    }
	  });
	*/
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
	if (app.globalData.logged) {
	  this.setData({
		logged: true
	  })
	}
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

  // 获取 info list 
  getInfoList: function() {
	const db = wx.cloud.database({
	  env: 'wenwo-cloud-5cyzm'
	});
    const infoList = db.collection('info_list');
	//const $ = db.command.aggregate;
	const _ = db.command;

	infoList
	  .where({
		tags: _.in(['home'])
	  })
	  .limit(10)
	  .get()
	  .then(res => {
		//console.log(res.data);
		this.setData({
		  infoList: res.data
		})
	  });
  },

  // 登录

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
		  /**
        console.log('province: ' + province);
        console.log('city: ' + city);
        console.log('county: ' + county);
		  */

		that.setData({ 
			//city: city,
			county: county
		});
		// 根据城市名称获取天气
		that.getWeather(province, city, county);
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
		//weather_type: 'observe|forecast_24h',
		weather_type: 'forecast_24h',
		province: province,
		city: city,
		county: county
		/**
		province: '广东省',
		city: '肇庆市',
		county: '封开县'
		*/
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
		let forecast = res.data.data.forecast_24h[1];
		that.setData({
          todayWeather: forecast.day_weather + ' ' + forecast.min_degree + '/' + forecast.max_degree
		});
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
  },

  // 获取用户信息 button 回调
  /**
  onGetUserInfo: function(e) {
	  console.log(e);
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
		nickName: e.detail.userInfo.nickName,
		//nickName: '',
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  */

  /**
  getUserInfo: function() {
	let that = this;
	if (this.data.logged) return;
	
	onGetOpenid((res) => {
	  that.setData({
		logged: true
	  });

	  Object.assign(app.globalData, {
		logged: true,
		openid: res.result.openid
	  });
	});
	

	wx.getSetting({
      success: (res) => {
		console.log(res.authSetting['scope.userInfo']);
		if (!res.authSetting['scope.userInfo']) {
		  wx.openSetting({
			success: (res) => {
			  console.log(res);
			}
		  })
		}
      }
	});

	wx.getUserInfo({
	  success: (res) => {
		  console.log(res);
		that.setData({
		  logged: true,
		  nickName: res.userInfo.nickName,
		  //nickName: '',
		  avatarUrl: res.userInfo.avatarUrl,
		  userInfo: res.userInfo
		});
	  },
	  fail: (e) => {
		console.log(`fail`);
		console.log(e);
	  }
	})
  }
  */

})
