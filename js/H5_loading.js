var H5_loading=function(images,firstPage){
	//背景图的加载时在dom元素渲染时才加在
	//一开始通过addPage，addComponent创建的元素被隐藏，并未渲染，所以为加载
	//我们在执行loader函数的时候创建img引入图片，立即加载并计算引用了的个数，计算比例更改#rate
    var id=this.id;
    if(this._images===undefined){//第一次载入

    	this._images=(images||[]).length;//得到所需的图片数量，_images设置为数据属性
    	this._load=0;//已加载的图片数量
    	window[id]=this;//将this绑定到window，以便处理
    	for(s in images){
    		var item=images[s];//得到图片的地址
    		var img=new Image;
    		img.onload=function(){
    			window[id].loader();//创建等图片数量的回调函数
    		}
    		img.src=item;
    	}
    	return this;

    }else{

    	this._load++;//回调函数导致自加
    	$('#rate').text(((this._loaded/this._images *100)>>0)+'%');
    	if(this._load<this._images){
    		return this;
    	}

    }
    window[id]=null;


	this.el.fullpage({
			   onLeave:function(index,nextIndex,direction){
                    $(this).find('.h5_component').trigger('onLeave')
                },
                afterLoad:function(anchorLink,index){
                    $(this).find('.h5_component').trigger('onLoad')
                }
		});
		this.el.show();
		this.page[0].find('.h5_component').trigger('onLoad');
		if(firstPage){
			$.fn.fullpage.moveTo(firstPage);
		};
}
