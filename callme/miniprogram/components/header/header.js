// components/header2.js
import { onGetOpenid } from '../../lib/utils';
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
	isIndexPage: {
	  type: 'Boolean',
	  value: false
	},
	isLogged: {
      type: 'Boolean',
	  value: false
	},
	isMyPage: {
      type: 'Boolean',
	  value: false
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.jpg',
	collectIcon: '../../images/collect-btn.jpg',
	nickName: '登录'
  },
  
  // 数据监听
  /**
  */
  observers: {
	/**
    'isLogged': function(logged) {
	  this.setData({
		logged: logged
	  })
	}
	*/
  },

  lifetimes: {
	created: () => {
	  console.log('created');
	},

    attached: () => {
	  console.log('attached');

	  /**
	  if (this.globalData.logged) {
		this.setData({
		  isLogged: true
		});
	  }
	  */
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
	  toCollect: function() {
	  let that = this;

	  if (!this.data.isLogged) { 
        wx.showModal({
		  title: '登录提示',
		  content: '收藏页面需要登录哦',
		  success:function(res){
		    if(res.confirm){
			  that.getUserInfo();
		    }else{
			  console.log('弹框后点取消')
		    }
	      }
        });
	  } else {
	    wx.switchTab({
	      url: '../my/my',
        })
      }
    },

    getUserInfo: function() {
	  let that = this;

	  if (this.data.logged) return;

	  onGetOpenid((res) => {
	    that.setData({
		 isLogged: true
	    });

	    Object.assign(app.globalData, {
		  logged: true,
		  openid: res.result.openid
		});

		// my page 调用父组件方法
	    if (this.data.isMyPage) {
		  that.triggerEvent('getCollectList', res.result.openid);
	    }

		// 用户入库
        that.addUser(res.result.openid);
	  });
	},

	getDbCollection: function(name) {
	  const db = wx.cloud.database({ env: 'wenwo-cloud-5cyzm' });
	  return db.collection(name);
	},

	// 用户入库
	addUser: function(openid) {
	  let users = this.getDbCollection('user');
	
	  // 检查用户是否已存在
	  users.where({
		openid: openid
	  }).get({
		success: (res) => {
		  if (!res.data.length) {
			users.add({
			  data: {
				openid: openid,
				date: +new Date()
			  }
			}).then(res => {
			  console.log(res);
			  console.log('新用户入库成功');
			})
		  } else {
			  console.log('用户已存在');
		  }
		}
	  })
	  
	},

	// 父组件调用子组件方法
	headerRun: function(msg) {
	  console.log(msg);
	}

  }
})
