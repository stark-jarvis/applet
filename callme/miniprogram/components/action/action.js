// components/action.js
import { onGetOpenid } from '../../lib/utils';
const app = getApp()

Component({
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
	},
	/**
	 * 组件的属性列表
	*/
	properties: {
		infoId: {
			type: 'String',
			value: ''
		},
		infoObj: {
			type: 'Object',
			value: {}
		}
	},

	/**
	 * 组件的初始数据
	*/
	data: {

	},

	/**
	 * 生命函数
	*/
	lifetimes: {
	  created() {
		// 组件实例刚刚被创建好, 不能调用 this.setData
		// 用于给组件 this 添加一些自定义属性字段
	  },

	  // 在组件实例进入页面节点树时执行
	  attached() {
		const db = wx.cloud.database({ env: 'wenwo-cloud-5cyzm' });
		const userCollect = db.collection('user_collect');

		this.setData({
		  db: db,
		  userCollect: userCollect
		});
	  }, 

	  detached() {
      // 在组件实例被从页面节点树移除时执行
      },
	},

	/**
	 * 组件的方法列表
	*/
	methods: {
		run() {
			this.setData({
				infoId: this.data.infoId
			})
		},

		getUserInfo: function(cb) {
		  let that = this;

		  if (this.data.logged) return;

		  onGetOpenid((res) => {
			let openid = res.result.openid;

		    that.setData({
			  isLogged: true,
			  openid: openid
		    });

			'function' === typeof cb && cb();

		    Object.assign(app.globalData, {
			  logged: true,
			  openid: openid
		    });
		  });
		},

		// 检测是否已收藏
		isCollect(infoObj, openid) {
		  let that = this;
		  let userCollect = this.data.userCollect;

		  userCollect
			.where({
			  _openid: openid,
			  infoid: infoObj._id
			})
			.get()
			.then(res => {
			  console.log(res);
			  if (res.data.length) {
				wx.showToast({
			      title: '本笔记已收藏',
				  duration: 3000
				});
			  } else {
				that.addCollect(infoObj, openid);
			  }
			})
		},

		// 收藏入库
		addCollect(infoObj, openid) {
		  let userCollect = this.data.userCollect;
		  console.log(infoObj);
		  // 增加收藏 
		  userCollect
		    .add({
			  data: 
			    {
				  openid: infoObj.openid,
				  infoid: infoObj._id
			    }
		     }).then(res => {
			  wx.showToast({
			    title: '收藏成功',
			    icon: 'success',
			    mask: true,
			    duration: 2000
			  });
			  console.log('收藏成功。');
		  })
		},

		// 收藏点击操作
		actionCollect(event) {
		  let infoObj = event.currentTarget.dataset['infoobj']
	      let openid = this.data.openid;
		  let that = this

		  if (!app.globalData.logged) {
			wx.showModal({
			  title: '提示',
			  content: '收藏前需要登录，点击确定登录并收藏。',
			  success: res => {
				if (res.confirm) {
				  that.getUserInfo(function() {
					that.isCollect(infoObj, openid);
				  });
				} else {
				  console.log('弹框后点取消')
				}
			  }
			})
		  } else {
			that.isCollect(infoObj, openid);
		  }
			/**
			wx.showModal({
				title: '提示',
				content: '被你发现了一个未完善的功能，真厉害！',
				success:function(res){
					if(res.confirm){
						console.log('弹框后点取消')
					}else{
						console.log('弹框后点取消')
					}
				}
			})
			*/
		}
	}
})
