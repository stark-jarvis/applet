// miniprogram/pages/infopage/infopage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	// 页面地址传过来的 infoId
    this.setData({
	  infoId: options.infoId,
	  title: options.title
	});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	const db = wx.cloud.database({ env: 'wenwo-cloud-5cyzm' });
	const infoCon = db.collection('info_content');
	let infoId = this.data.infoId;

	// 根据 infoId 查找到当前文章内容
	infoCon
	  .where({
		_id: infoId
	  })
	  .get({
		success: (res) => {
		  this.setData({
			infoContent: res.data[0]
		  });
		}
	  })
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

  }
})
