mui.init();
(function($){
	$.ready(function(){
		
		//图片自动轮播
		var slider=mui('#slider');
		slider.slider({
			interval:2000
		});
		
		//循环初始化所有下拉刷新、上啦加载
		var refreshContent=document.querySelectorAll('refreshConteainer');
		$.each(refreshContent,function(index,item){
			$(item).pullToRefresh({
				down: {
					callback: function() {
					var self = this;
					setTimeout(function() {
						self.endPullDownToRefresh();
					}, 1000);
				}
			},
			up: {
				callback: function() {
					var self = this;
					setTimeout(function() {
						console.log('up')
						self.endPullUpToRefresh();
					}, 1000);
				}
				}
			});
		});
	});
	
})(mui);




/*mui.init({
	pullRefresh:{
		container:'#refreshConteainer',
		down:{
			height:50,
			auto:true,
			contentdown:'下拉可以刷新',
			contentover:'释放立即刷新',
			contentrefresh:'正在刷新',
			callback:pullfreshFunction
		},
		up:{
			contentrefresh: '正在加载...',
			callback: pullupRefresh
			}
	}
	
	
});

*//*function pullfreshFunction(){
	console.log('下拉刷新')
	mui('#refreshConteainer').pullRefresh().endPulldownToRefresh();
}

function pullupRefresh(){
	console.log('上拉加载')
	mui('#refreshConteainer').pullRefresh().endPullupToRefresh();
}*/







