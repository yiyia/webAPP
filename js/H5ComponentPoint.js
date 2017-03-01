/* 散点图表组件对象 */
var H5ComponentPoint=function(name,cfg){

	var component=new H5ComponentBase(name,cfg);
	//以第一个为基准
	var base=cfg.data[0][1];
	//输出每一个point
	$.each(cfg.data,function(index,item){

		var point=$('<div class="point point_'+index+'">');
		var name=$('<div class="name">'+item[0]+'</div>');
		var per=$('<div class="per">'+item[1]+'</div>');
		name.append(per);
		point.append(name);
		var per=(item[1]/base*100)+'%';
		point.width(per).height(per);
		if(item[2]){
			point.css('background-color',item[2])
		}
		var sub=item[1]/base*150;
		if(item[3]!==undefined&&item[4]!==undefined){
			point.css({'left':(150-sub)/2,'top':(150-sub)/2});
		}
		point.data={left:item[3],top:item[4]};
		component.on('onLoad',function(){
			if(point.data.left!=undefined&&point.data.top!=undefined){
				point.animate({left:point.data.left,top:point.data.top},'slow');
			}
		})
		//准备数据，以便于将数据传入由component监听的‘onload’函数
		/*point.data={left:item[3],top:item[4]};
		component.on('onLoad',function(){
			if(point.data.left!=undefined&&point.data.top!=undefined){
				var i=10
				var time=setInterval(
						function(){
							point.css({'left':parseFloat(point.data.left)/i+'%','top':parseFloat(point.data.top)/i+'%'});
							i--;
							if(i==0){
								clearInterval(time);
							};
						}
					,40)
			}
		})*/
		component.on('onLeave',function(){
			setTimeout(function(){
				point.css({'left':(150-sub)/2,'top':(150-sub)/2});
			},1000)
		})
		/*另一种设置位置的方法
		var height=point.height();
		point.css('line-height',height/8);*/
		component.append(point);

	})
	return component;
}
