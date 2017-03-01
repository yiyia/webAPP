/* 雷达图组件对象 */
var H5ComponentRadar=function(naem,cfg){

	var component=new H5ComponentBase(name,cfg);

	var w=cfg.width;
	var h=cfg.height;
	var r=w/2;
	var step=cfg.data.length;

	//背景图层1；
	var cns=document.createElement('canvas');
	var ctx=cns.getContext('2d');
	cns.width=w;
	cns.height=h;

	//已知圆心坐标（a,b），半径r,角度deg;
	//rad=(2*Math.PI/360)*(360/step);
	//x=a+Math.sin(rad)*r;
	//y=b+Math.cos(rad)*r;

	//绘制网格背景
	var isBlue=false;
	for(let s=10;s>0;s--)
	{
		ctx.beginPath();
		for(let i=0;i<step;i++){

			var rad=(2*Math.PI/360)*(360/step)*i;
			var x=r+Math.sin(rad)*r*(s/10);
			var y=r+Math.cos(rad)*r*(s/10);
			ctx.lineTo(x,y);
		}
		ctx.closePath();
		ctx.fillStyle=(isBlue=!isBlue)?'#99c0ff':'#f1f9ff';
		ctx.fill();
		ctx.stroke();
	}
	//绘制伞骨
	ctx.beginPath()
	for(let i=0;i<step;i++)
	{
		var rad=(2*Math.PI/360)*(360/step)*i;
		var x=r+Math.sin(rad)*r;
		var y=r+Math.cos(rad)*r;
		ctx.moveTo(r,r);
		ctx.lineTo(x,y);
		//绘制项目名字
		var text=$('<div class=text>');
		text.text(cfg.data[i][0]);
		text.css('transition','all 1s '+i*0.1+'s');
		if(x>w/2){
			text.css('left',x/2)
		}else{
			text.css('right',(w-x)/2)
		}
		if(y>h/2){
			text.css('top',y/2)
		}else{
			text.css('bottom',(h-y)/2);
		}
		if(cfg.data[i][2]){
			text.css('color',cfg.data[i][2]);
		}
		component.append(text);
	}
	ctx.strokeStyle='#e0e0e0';
	ctx.stroke();

	//数据层的开发
	//数据层2
	var cns1=document.createElement('canvas');
	var ctx1=cns1.getContext('2d');
	cns1.width=w;
	cns1.height=h;

	ctx1.strokeStyle='#f00';
	var draw=function(per){

		if(per>=1){
			component.find('.text').css('opacity',1);
		}
		if(per<=1){
			component.find('.text').css('opacity',0);
		}
		ctx1.clearRect(0,0,w,h);

		//绘制数据线
		ctx1.fillStyle='rgba(255,136,120,0.2)';
		for(let i=0;i<step;i++){
			var rad=(2*Math.PI/360)*(360/step)*i;
			var rate=cfg.data[i][1];
			var x=r+Math.sin(rad)*r*rate*per;
			var y=r+Math.cos(rad)*r*rate*per;
			ctx1.lineTo(x,y);
		}
		ctx1.closePath();
		ctx1.stroke();
		ctx1.fill();

		//绘制数据点
		ctx1.fillStyle="#ff7070";
		for(let i=0;i<step;i++){
			var rad=(2*Math.PI/360)*(360/step)*i;
			var rate=cfg.data[i][1];
			var x=r+Math.sin(rad)*r*rate*per;
			var y=r+Math.cos(rad)*r*rate*per;
			ctx1.beginPath()
			ctx1.arc(x,y,5,0,2*Math.PI);
			ctx1.closePath();
			ctx1.fill();
		}
		
	}

	//生长动画
	component.on('onLoad',function(){
		var per=0;
		for(i=0;i<100;i++){
			setTimeout(function(){
				per+=0.01;
				draw(per);
				
			},i*10);
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
	component.append(cns).append(cns1);

	return component;
}
