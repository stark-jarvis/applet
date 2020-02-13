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
		}

	},

	/**
	 * 组件的初始数据
	*/
	data: {

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

		actionCollect(event) {
			let infoId = event.currentTarget.dataset['infoid']
			let that = this
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
			console.log(infoId);
		}
	}
})
