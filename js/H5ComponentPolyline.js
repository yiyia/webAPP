/* 柱图组件对象 */
var H5ComponentPolyline=function(name,cfg){

	var component=new H5ComponentBase(name,cfg);

	//计算画布长宽
	var w=cfg.width;
	var h=cfg.height;
	//绘制背景网格
	var cns=document.createElement('canvas');
	var ctx=cns.getContext('2d');
	cns.width=w;
	cns.height=h;
	//水平网格线 10份
	var step=10;
	ctx.beginPath();
	ctx.lineWidth=2;
	ctx.strokeStyle="#708090";
	for(let i=0;i<step+1;i++){
		let y=(h/step)*i;
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
	}
	//绘制垂直网格线
	var text_w=w/step>>0; 
	var step=cfg.data.length+1;
	for(let i=0;i<step+1;i++){
		let x=(w/step)*i;
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);
		if(cfg.data[i]){
		 	var text=$('<div class="text">');
			text.text(cfg.data[i][0]);
			text.css({
			 	'width':text_w,
			 	'left':x/2+text_w/4,
			 	'opacity':0
			});
			component.append(text);
		 }
	}
	ctx.closePath();
	ctx.stroke();
	component.append(cns);

	//动画背景层
	var cns1=document.createElement('canvas');
	var ctx1=cns1.getContext('2d');
	cns1.width=w;
	cns1.height=h;

	var draw=function(per){

		ctx1.clearRect(0,0,w,h);
		if(per>=1){
			$('.text').css('opacity',1);
		}else{
			$('.text').css('opacity',0);
		}
		//第二个画布
		//画折线
		ctx1.beginPath();
		ctx1.lineWidth=3;
		ctx1.strokeStyle="#F5DEB3";
		$.each(cfg.data,function(index,item){
			x=(w/step)*(index+1);
			y=h-item[1]*h*per;
			ctx1.lineTo(x,y);
		})
		ctx1.stroke();

		//绘制阴影
		ctx1.fillStyle='rgba(255,136,120,0.2)';
		ctx1.lineTo(x,h);
		ctx1.lineTo(w/step,h);
		ctx1.fill();
		ctx1.closePath();
		
		//绘制数据值
		ctx1.beginPath();
		ctx1.lineWidth=3;
		$.each(cfg.data,function(index,item){
			x=(w/step)*(index+1);
			y=h-item[1]*h*per;
			ctx1.moveTo(x,y);
			ctx1.fillStyle=item[2]?item[2]:'#595959';
			ctx1.fillText((item[1]*100)+'%',x-10,y-10);
		})
		//绘制数据圆
		ctx1.strokeStyle="#F08080";
		$.each(cfg.data,function(index,item){
			x=(w/step)*(index+1);
			y=h-(item[1]*h*per);
			ctx1.moveTo(x,y);
			ctx1.arc(x,y,5,0,2*Math.PI)
		})
		ctx1.stroke();
		ctx1.closePath();
		component.append(cns).append(cns1);
	}
	//生长动画
	component.on('onLoad',function(){
		var per=0;
		for(i=0;i<100;i++){
			setTimeout(function(){
				per+=0.01;
				draw(per);
				
			},i*10+200);
		}
	})
	component.on('onLeave',function(){
		var per=1;
		for(i=0;i<100;i++){
			setTimeout(function(){
				per-=0.01;
				draw(per);

			},10);
		}
	})

	return component;
}
