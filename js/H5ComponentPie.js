/* 饼图组件对象 */
var H5ComponentPie=function(name,cfg){

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
	var cns=document.createElement('canvas');
	var ctx=cns.getContext('2d');
	cns.width=w;
	cns.height=h;
	$(cns).css('zIndex',2);
	component.append(cns);
	//定义颜色以及起始角度
	var colors=['null','#48D1CC','#F08080','#F4A460','#FFCC33','#66FF99','#9900FF'];
	var start=1.5*Math.PI;//设置开始的位置
	var end=0;
	var all=2*Math.PI;

	//绘制圆弧
	$.each(cfg.data,function(index,item){

		ctx.beginPath();
		ctx.fillStyle=item[2]?item[2]:colors[index];
		item[2]?null:item.push(colors[index]);
		ctx.lineWidth=1;
		end=start+item[1]*all;
		ctx.moveTo(r,r);
		ctx.arc(r,r,r,start,end);
		ctx.fill();
		ctx.stroke();
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
			text.css('right',(w-x)/2+5)
		}
		if(y>h/2){
			text.css('top',y/2)
		}else{
			text.css('bottom',(h-y)/2+15);
		}
		if(cfg.data[index][2]){
			text.css('color',cfg.data[index][2]);
		}

		//text.css('transition','all .1s '+index*0.5+'s');
		text.append(rate);
		component.append(text);
		
	})

	//加入一个蒙版层
	var cns1=document.createElement('canvas');
	var ctx1=cns1.getContext('2d');
	cns1.width=w;
	cns1.height=h;
	$(cns1).css('zIndex',3)
	component.append(cns1);

	//绘制一个蒙版
	ctx1.beginPath();
	ctx1.fillStyle='#FFFFF0';
	ctx1.lineWidth=1;
	ctx1.moveTo(r,r);
	ctx1.arc(r,r,r,0,2*Math.PI);
	ctx1.fill();
 
	var draw=function(per,isLeave){
		if(per>=1){
			H5ComponentPie.sort(component.find('.text'));
			component.find('.text').css('opacity',1);
		};
		if(isLeave){
			component.find('.text').css('opacity',0);
		}
		component.find('.text');
		ctx1.clearRect(0,0,w,h);
		ctx1.beginPath();
		ctx1.fillStyle='#FFFFF0';
		ctx1.lineWidth=1;
		ctx1.moveTo(r,r);
		if(per<=0){
			ctx1.arc(r,r,r,0,2*Math.PI,true);
		}else{
			ctx1.arc(r,r,r,start,start+2*Math.PI*per,true);
		}
		ctx1.fill();
	}

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
//文本重排
H5ComponentPie.sort=function(list){
	//相交检测
	var compare=function(domA,domB){

		//domA的投影
		var offsetA=$(domA).offset();
		var shadowA_x=[offsetA.left,$(domA).width()+offsetA.left];
		var shadowA_y=[offsetA.top,$(domA).width()+offsetA.top];
		//domB的投影
		var offsetB=$(domB).offset();
		var shadowB_x=[offsetB.top,$(domB).width()+offsetB.top];
		var shadowB_y=[offsetB.top,$(domB).width()+offsetB.top];
		//检测x
		var intersect_x=(shadowA_x[0]>shadowB_x[0]&&shadowA_x[0]<shadowB_x[1])||(shadowA_x[1]>shadowB_x[0]&&shadowA_x[1]<shadowB_x[1]);
		//检测y
		var intersect_y=(shadowA_y[0]>shadowB_y[0]&&shadowA_y[0]<shadowB_y[1])||(shadowA_y[1]>shadowB_y[0]&&shadowA_y[1]<shadowB_y[1]);
		if(intersect_y==true){
			$(domA).css('left',(parseInt($(domA).offset().left)-50)/2);
			debugger
		}
		return intersect_y&&intersect_x;
	}
	//错开重排
	var reset=function(domA,domB){
		$(domA).css('top',$(domA).offset().top+$(domB).height());
	}

	$.each(list,function(index,item){
		if(list[index+1]){
			if(compare(item,list[index+1])){
				reset(item,list[index+1]);
			}
		}
	})
}







