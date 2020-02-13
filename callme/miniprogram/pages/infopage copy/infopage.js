/* info Page */
const app = getApp();

import phoneList from './phoneList';
//console.log(phoneList);

Page({
	data: {
		title: '名雅&荟珑湾业主常用电话',
		photoList: phoneList,
		cmImg: '../../images/logo-icon.png'
	},

	onLoad: function(options) {
		console.log(options.infoId);
	},

	makePhone: function(res) {
		let dataset = res.currentTarget.dataset;
		wx.makePhoneCall({
			phoneNumber: dataset.phoneNumber
		});
	},

	phoneTouchStart: function(e) {
		this.setData({
			_num: e.currentTarget.dataset.num
		});
	},

	phoneTouchEnd: function() {
		setTimeout(() => {
			this.setData({
				_num: '1000'
			});
		}, 5000);
	}

});
