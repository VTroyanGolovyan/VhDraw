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

  this.save = function(){
    var savePoint = document.createElement('canvas');
    savePoint.width = this.width;
    savePoint.height = this.height;
    var saveCtx = savePoint.getContext('2d');
    saveCtx.drawImage(this.canvas,0,0);
    if (this.now == this.history.length - 1){
      if (this.history.length >= 30)
         this.history.shift();
      this.history.push(savePoint);
      this.now = this.history.length - 1;
    }else if (this.now < this.history.length - 1){
      while (this.now != this.history.length - 1)
        this.history.pop();
      if (this.history.length >= 30)
        this.history.shift();
      this.history.push(savePoint);
      this.now = this.history.length - 1;
    }else{
      this.history.push(savePoint);
      this.now = this.history.length - 1;
    }
  }
  this.restore = function(i){
    this.canvas.width = this.canvas.width;
    this.ctx.drawImage(this.history[i],0,0);
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
  this.save();
}
