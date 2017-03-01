/* 环图组件对象 */
var H5ComponentRing=function(name,cfg){

	var component=new H5ComponentBase(name,cfg);
	var w=cfg.width;
	var h=cfg.height;
	var r=w/2;

	//背景层
	var cns=document.createElement('canvas');
	var ctx=cns.getContext('2d');
	cns.width=w;
	cns.height=h;
	$(cns).css('zIndex',1);
	component.append(cns);
	//绘制背景
	ctx.beginPath();
	ctx.fillStyle='#eee';
	ctx.lineWidth=1;
	ctx.moveTo(r,r);
	ctx.arc(r,r,r,0,2*Math.PI);
	ctx.fill();

	//数据层
	var cns1=document.createElement('canvas');
	var ctx1=cns.getContext('2d');
	cns1.width=w;
	cns1.height=h;
	$(cns1).css('zIndex',2);
	component.append(cns1);
	//定义颜色以及起始角度
	var colors=['null','#48D1CC','#F08080','#F4A460','#F4A460','#FFCC33','#66FF99','#9900FF'];
	var start=1.5*Math.PI;//设置开始的位置
	var end=0;
	var all=2*Math.PI;
	//绘制圆弧
	$.each(cfg.data,function(index,item){

		ctx1.beginPath();
		ctx1.fillStyle=item[2]?item[2]:colors[index];
		item[2]?null:item.push(colors[index]);
		ctx1.lineWidth=1;
		end=start+item[1]*all;
		ctx1.moveTo(r,r);
		ctx1.arc(r,r,r,start,end);
		ctx1.fill();
		ctx1.stroke();
		start=end;
		//绘制文本
		var text=$('<div class="text">');
		text.text(item[0]);
		var rate=$('<div class="rate">');
		rate.text(item[1]*100+'%');
		var x=r+Math.sin(.5*Math.PI-start)*r;
		var y=r+Math.cos(.5*Math.PI-start)*r;
		
		if(x>w/2){
			text.css('left',x/2)
		}else{
			text.css('right',(w-x)/2+18)
		}
		if(y>h/2){
			text.css('top',y/2)
		}else{
			text.css('bottom',(h-y)/2+10);
		}
		if(cfg.data[index][2]){
			text.css('color',cfg.data[index][2]);
		}

		text.css('transition','all .1s '+index*0.5+'s');
		text.append(rate);
		component.append(text);
		
	})

	//加入一个蒙版层-动画层
	var cns2=document.createElement('canvas');
	var ctx2=cns1.getContext('2d');
	cns2.width=w;
	cns2.height=h;
	$(cns2).css('zIndex',3)
	component.append(cns2);
	//绘制一个蒙版
	ctx2.beginPath();
	ctx2.fillStyle='#FFFFF0';
	ctx2.lineWidth=1;
	ctx2.moveTo(r,r);
	ctx2.arc(r,r,r,0,2*Math.PI);
	ctx2.fill();
	var draw=function(per,isLeave){
		if(per>=0.1){
			component.find('.text').css('opacity',1);
		};
		if(isLeave){
			component.find('.text').css('opacity',0);
		}
		component.find('.text');
		ctx2.clearRect(0,0,w,h);
		ctx2.beginPath();
		ctx2.fillStyle='#FFFFF0';
		ctx2.lineWidth=1;
		ctx2.moveTo(r,r);
		if(per<=0){
			ctx2.arc(r,r,r,0,2*Math.PI,true);
		}else{
			ctx2.arc(r,r,r,start,start+2*Math.PI*per,true);
		}
		ctx2.fill();
	}

	//遮罩层
	var cns3=document.createElement('canvas');
	var ctx3=cns3.getContext('2d');
	cns3.width=w;
	cns3.height=h;
	$(cns3).css('zIndex',4);
	component.append(cns3);
	//绘制遮罩
	ctx3.beginPath();
	ctx3.fillStyle='#FFFFF0';
	ctx3.lineWidth=1;
	ctx3.moveTo(r,r);
	ctx3.arc(r,r,0.8*r,0,2*Math.PI);
	ctx3.fill();
	component.append(cns3);

	//生长动画
	component.on('onLoad',function(){
		var per=0;
		for(i=0;i<100;i++){
			setTimeout(function(){
				per+=0.01;
				draw(per);
				
			},i*10+500);
		}
	})
	component.on('onLeave',function(){
		var per=1;
		for(i=0;i<100;i++){
			setTimeout(function(){
				per-=0.01;
				draw(per,true);
			},i*10);
		}
	})
	return component;
}









