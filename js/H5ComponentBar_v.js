/* 垂直柱图组件对象 */
var H5ComponentBar_v=function(name,cfg){
	var component=new H5ComponentBase(name,cfg);
	$.each(cfg.data,function(index,item){

		var line=$('<div class="line">');
		var name=$('<div class="name">');
		var rate=$('<div class="rate">');
		var per=$('<div class="per">');

		var height=item[1]*300;
		rate.html('<div class="bg"></div>');
		rate.css('height',height);
		name.text(item[0]);
		per.text(height+'%');
		line.append(per).append(rate).append(name);;
		component.append(line);
	})
	return component;
}
