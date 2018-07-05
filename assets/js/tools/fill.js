function Fill(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.render = function(ctx){

  }
  this.fillPixel = function(x,y,r,g,b){
    var i=((y*this.width)+x)*4;
    var data = this.imageData.data;
    data[i] = r;
    data[i+1] = g;
    data[i+2] = b;
    data[i+3] = 255;
  }
  this.getPixel = function(x,y){
    var i=((y*this.width)+x)*4;
    var data = this.imageData.data;
    return {
       r : data[i],
       g : data[i+1],
       b : data[i+2],
       a : data[i+3]
    }
  }
  this.equals = function(p1,p2){
    if (p1.r == p2.r && p1.b == p2.b && p1.g == p2.g && p1.a == p2.a)
      return true;
    else return false;
  }
  this.fillArea = function(x,y,r,g,b){

    var start = this.getPixel(x,y);
    var a = new Array();
    var b = new Array();
    a.push({x : x,
            y : y});
    while(a.length > 0){
      for (var i = 0; i < a.length; i++){
        if (a[i].x+1 < this.width && this.equals(start, this.getPixel(a[i].x+1, a[i].y))){
          this.fillPixel(a[i].x+1, a[i].y, r, g, b);

          b.push({x : a[i].x+1,
                  y : a[i].y });
        }
        if (a[i].x-1 >= 0 && this.equals(start, this.getPixel(a[i].x-1, a[i].y))){
          this.fillPixel(a[i].x-1, a[i].y, r, g, b);
          b.push({x : a[i].x-1,
                  y : a[i].y });
        }
        if (a[i].y+1 < this.height && this.equals(start, this.getPixel(a[i].x, a[i].y+1))){
          this.fillPixel(a[i].x, a[i].y+1, r, g, b);
          b.push({x : a[i].x,
                  y : a[i].y+1 });
        }
        if (a[i].y-1 >= 0 && this.equals(start, this.getPixel(a[i].x, a[i].y-1))){
          this.fillPixel(a[i].x, a[i].y-1, r, g, b);
          b.push({x : a[i].x,
                  y : a[i].y-1 });
        }
      }
      a = b;
      b = new Array();
    }

  }
  this.startX = 0;
  this.startY = 0;
  this.width = 0;
  this.height = 0;
  this.imageData = "";
  this.onmousedown  = function(coords){
    var canvas = this.state.paper.getLayer(this.state.activeLayer).getView();
    this.imageData = this.ctx.getImageData(0,0,canvas.width,canvas.height);

    this.width = canvas.width;
    this.height = canvas.height;
    this.startX = coords.x;
    this.startY = coords.y;
  }

  this.onmousemove  = function(coords){

  }
  this.onmouseup  = function(coords){

    this.fillArea(this.startX,this.startY,0,0,0);
    this.ctx.putImageData(this.imageData,0,0);
    this.state.paper.save();
  }
  this.onmouseout = function(){

  }
}
