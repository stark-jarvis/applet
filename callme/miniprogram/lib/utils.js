/*
 * utils - v1.0 (2020-02-17T15:59:53+0800)
 */

/**
 * 获取用户 openid
 */
function onGetOpenid(cb) {
// 调用云函数
	wx.cloud.callFunction({
	  name: 'login',
	  data: {},
	  success: res => {
		console.log('[云函数] [login] user openid: ', res.result.openid)
		if ('function' === typeof cb) {
		  cb(res);
		}
		//app.globalData.openid = res.result.openid
		//console.log(res);
		/**
		wx.navigateTo({
		  url: '../userConsole/userConsole',
		})
		*/
	  },
	  fail: err => {
		console.error('[云函数] [login] 调用失败', err)
		wx.navigateTo({
		  url: '../deployFunctions/deployFunctions',
		})
	  }
	})
}

export {
  onGetOpenid
};

