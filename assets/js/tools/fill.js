function Fill(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.render = function(ctx){

  }
  this.startX = 0;
  this.startY = 0;
  this.width = 0;
  this.height = 0;
  this.imageData = "";
  this.onmousedown  = function(coords){
    var canvas = this.state.paper.getLayer(this.state.activeLayer).getView();

    this.width = canvas.width;
    this.height = canvas.height;
    this.startX = coords.x;
    this.startY = coords.y;

    floodFill(coords.x,coords.y,this.state.mainColorRGBA,this.ctx,this.width,this.height,0);


  }

  this.onmousemove  = function(coords){

  }
  this.onmouseup  = function(coords){
    this.state.paper.save("Заливка");
  }
  this.onmouseout = function(){

  }
}

function floodFill(x, y, fillcolor, ctx, width, height, inclination) {
	var img = ctx.getImageData(0,0,width,height); //получили информацию о пикселях
	var data = img.data;
	var length = data.length;
	var Q = [];
	var i = (x+y*width)*4;
	var e = i, w = i, me, mw, w2 = width*4;
	var targetcolor = [data[i],data[i+1],data[i+2],data[i+3]];

	if(!pixelCompare(i,targetcolor,fillcolor,data,length,inclination)) { return false; }
	Q.push(i);
	while(Q.length) {
		i = Q.pop();
		if(pixelCompareAndSet(i,targetcolor,fillcolor,data,length,inclination)) {
			e = i;
			w = i;
			mw = parseInt(i/w2)*w2; //left bound
			me = mw+w2;	//right bound
			while(mw<(w-=4) && pixelCompareAndSet(w,targetcolor,fillcolor,data,length,inclination)); //go left until edge hit
			while(me>(e+=4) && pixelCompareAndSet(e,targetcolor,fillcolor,data,length,inclination)); //go right until edge hit
			for(var j=w+4;j<e;j+=4){
				if(j-w2>=0 		&& pixelCompare(j-w2,targetcolor,fillcolor,data,length,inclination))
          Q.push(j-w2); //queue y-1
				if(j+w2<length	&& pixelCompare(j+w2,targetcolor,fillcolor,data,length,inclination))
          Q.push(j+w2); //queue y+1
			}
		}
	}
	ctx.putImageData(img,0,0);
}

function pixelCompare(i,targetcolor,fillcolor,data,length,inclination) {
	if (i<0||i>=length) return false; //out of bounds
	if (data[i+3]===0)  return true;  //surface is invisible

	if (
		(targetcolor[3] === fillcolor.a) &&
		(targetcolor[0] === fillcolor.r) &&
		(targetcolor[1] === fillcolor.g) &&
		(targetcolor[2] === fillcolor.b)
	) return false; //target is same as fill

	if (
		(targetcolor[3] === data[i+3]) &&
		(targetcolor[0] === data[i]  ) &&
		(targetcolor[1] === data[i+1]) &&
		(targetcolor[2] === data[i+2])
	) return true; //target matches surface

	if (
		Math.abs(targetcolor[3] - data[i+3]) <= (inclination) &&
		Math.abs(targetcolor[0] - data[i]  ) <= inclination &&
		Math.abs(targetcolor[1] - data[i+1]) <= inclination &&
		Math.abs(targetcolor[2] - data[i+2]) <= inclination
	) return true; //target to surface within tolerance

	return false; //no match
}

function pixelCompareAndSet(i,targetcolor,fillcolor,data,length,inclination) {
	if(pixelCompare(i,targetcolor,fillcolor,data,length,inclination)) {
		//fill the color
		data[i] 	 = fillcolor.r;
		data[i+1] = fillcolor.g;
		data[i+2] = fillcolor.b;
		data[i+3] = fillcolor.a;
		return true;
	}
	return false;
}
