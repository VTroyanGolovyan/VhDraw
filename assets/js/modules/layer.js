function Layer(x,y,width,height){
  this.canvas = document.createElement('canvas');
  this.canvas.width = width;
  this.canvas.height = height;
  this.ctx = this.canvas.getContext("2d");
  this.x = x;
  this.width = width;
  this.height = height;
  this.y = y;
  this.visible = true;
  this.history = new Array();
  this.now = 0;
  this.move = function(dx,dy){
    this.x += dx;
    this.y += dy;
  }
  this.save = function(){
    var savePoint = document.createElement('canvas');
    savePoint.width = this.width;
    savePoint.height = this.height;
    var saveCtx = savePoint.getContext('2d');
    saveCtx.drawImage(this.canvas,0,0);
    if (this.now == this.history.length - 1){
      if (this.history.length >= 30)
         this.history.shift();
      this.history.push(new Point(savePoint,this.x,this.y,this.width,this.height));
      this.now = this.history.length - 1;
    }else if (this.now < this.history.length - 1){
      while (this.now != this.history.length - 1)
        this.history.pop();
      if (this.history.length >= 30)
        this.history.shift();
      this.history.push(new Point(savePoint,this.x,this.y,this.width,this.height));
      this.now = this.history.length - 1;
    }else{
      this.history.push(new Point(savePoint,this.x,this.y,this.width,this.height));
      this.now = this.history.length - 1;
    }
  }
  this.restore = function(i){
    this.canvas.width = this.history[i].width;
    this.canvas.height = this.history[i].height;
    this.width = this.history[i].width;
    this.height = this.history[i].height;
    this.ctx.drawImage(this.history[i].canvas,0,0);
    this.x = this.history[i].x;
    this.y = this.history[i].y;
  }
  this.back = function(){
    if(this.now != 0){
      this.now--;
      this.restore(this.now);
    }
  }
  this.forward = function(){
    if(this.now != this.history.length-1){
      this.now++;
      this.restore(this.now);
    }
  }
  this.isVisible = function(){
    return this.visible;
  }
  this.changeVisible = function(){
    this.visible = !this.visible;
  }
  this.getCtx = function(){
    return this.ctx;
  }
  this.getView = function(){
    return this.canvas;
  }
  this.cut = function(x,y,w,h){
    var t = document.createElement('canvas');
    t.width = w;
    t.height = h;
    tctx = t.getContext('2d');
    tctx.drawImage(this.canvas,x,y,w,h,0,0,w,h);
    this.width = w;
    this.height = h;
    this.x = this.x + x;
    this.y = this.y + y;
    this.canvas = t;
    this.ctx = this.canvas.getContext("2d");
    this.save();
  }
  this.miniatura = document.createElement('canvas');
  this.minctx = this.miniatura.getContext('2d');
  this.renderMiniatura = function(){
    
  }
  this.save();
}
function Point(canvas,x,y,width,height){
   this.x = x;
   this.y = y;
   this.canvas = canvas;
   this.height = height;
   this.width = width;
}
