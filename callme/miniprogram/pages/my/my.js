//my.js
const app = getApp()

Page({
  data: {
	isMyPage: true,
    logged: false,
	isCheckLogin: false
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return;
    }

	/**
	// 调用子组件方法
	let header = this.selectComponent('#header');
	header.headerRun('my page run headerRun.');
	// 调用子组件变量
	console.log(header.data.isMyPage);
	*/

	// 检查登录状态
	!this.data.isCheckLogin && this.checkLogin();

  },

  onShow: function() {
	// 检查登录状态
	!this.data.isCheckLogin && this.checkLogin();
  },

  // 检查登录状态
  checkLogin: function() {
	let that = this;
	if (app.globalData.logged) {
	  console.log('logged true');
	  this.setData({
		logged: true
	  })

      // 获取收藏列表
	  that.getCollectList();
	}

	this.setData({
	  isCheckLogin: true
	});
  },

  // 获取收藏列表
  getCollectList: function(e) {
	const db = wx.cloud.database({ env: 'wenwo-cloud-5cyzm' });
    const collectLists = db.collection('user_collect');
	const infoLists = db.collection('info_list');
	let that = this;

	/**
	 * 可以通过 e.detail 获取参数
	if (e) {
	  console.log(e.detail);
	}
	*/

	// openid 由子组件 header 传过来或其他页面登录后设置
	let openid = app.globalData.openid;

	// 根据openid 在收藏表查找用户收藏的 infoid
	collectLists
	  .where({
        _openid: openid
	  })
	  .limit(10).get({
	  success: (res) => {
		if (!res.data.length) return;

		// 根据 infoid 在列表表中查找列表信息
	    infoLists
		  .where({
		    _id: res.data[0].infoid
		  })
		  .get({
		    success: (res) => {
			  that.setData({
			    infoList: res.data
			  });
		    }
		  })
	    }
	});
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
