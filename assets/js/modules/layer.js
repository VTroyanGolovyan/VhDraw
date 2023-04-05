function Layer(x,y,width,height,type = 0,name = ""){
  this.canvas = document.createElement('canvas');
  this.name = name;
  this.type = type;

  this.miniaturaF = true;
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
  this.isDragable = true;
  this.color = "#000000";
  if (type == 1){
    this.textcanvas = document.createElement('canvas');
    this.textcanvas.width = width;
    this.textcanvas.height = height;
    this.textctx = this.textcanvas.getContext("2d");
  }
  this.move = function(dx,dy){
    this.x += dx;
    this.y += dy;
  }
  this.changeColor = function(color,state){
    if (this.type == 1){
      this.textcanvas.width = this.textcanvas.width;
      var size = Math.round(this.textcanvas.width*1.5/this.name.length);
      this.color = color;
      this.textctx.fillStyle = color;
      this.textctx.font = size + "px Georgia";
      this.textctx.textBaseline = "top";
      this.textctx.fillText(this.name,0,0,this.textcanvas.width);
      this.canvas.width = this.canvas.width;
      this.ctx.drawImage(this.textcanvas,0,0,this.textcanvas.width,this.textcanvas.height,0,0,this.canvas.width,this.canvas.height);
      state.paper.save("Цвет текста");
    }
  }
  this.scale = function(width,height){
    var scaled = document.createElement('canvas');
    scaled.width = width;
    scaled.height = height;
    var scaledctx = scaled.getContext('2d');
    scaledctx.drawImage(this.canvas,0,0,this.width,this.height,0,0,width,height);
    this.canvas = scaled;
    this.ctx = scaledctx;
    this.width = width;
    this.height = height;
  }
  this.save = function(name=""){
    var savePoint = document.createElement('canvas');
    savePoint.width = this.width;
    savePoint.height = this.height;
    var saveCtx = savePoint.getContext('2d');
    saveCtx.drawImage(this.canvas,0,0);
    if (this.now == this.history.length - 1){
      if (this.history.length >= 61)
         this.history.shift();
      this.history.push(new Point(savePoint,this.x,this.y,this.width,this.height,name));
      this.now = this.history.length - 1;
    }else if (this.now < this.history.length - 1){
      while (this.now != this.history.length - 1)
        this.history.pop();
      if (this.history.length >= 61)
        this.history.shift();
      this.history.push(new Point(savePoint,this.x,this.y,this.width,this.height,name));
      this.now = this.history.length - 1;
    }else{
      this.history.push(new Point(savePoint,this.x,this.y,this.width,this.height,name));
      this.now = this.history.length - 1;
    }
    this.renderMiniatura(this.canvas.width,this.canvas.height,this.miniatura.width,this.miniatura.height);
    this.renderHistory(document.getElementById("history-list"));
  }
  this.restore = function(i){
    this.canvas.width = this.history[i].width;
    this.canvas.height = this.history[i].height;
    this.width = this.history[i].width;
    this.height = this.history[i].height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.drawImage(this.history[i].canvas,0,0);
    this.x = this.history[i].x;
    this.y = this.history[i].y;
  }
  this.back = function(){
    if(this.now != 0){
      this.now--;
      this.restore(this.now);
    }
    this.renderMiniatura(this.canvas.width,this.canvas.height,this.miniatura.width,this.miniatura.height);
    this.renderHistory(document.getElementById("history-list"));
  }
  this.forward = function(){
    if(this.now != this.history.length-1){
      this.now++;
      this.restore(this.now);
    }
    this.renderMiniatura(this.canvas.width,this.canvas.height,this.miniatura.width,this.miniatura.height);
    this.renderHistory(document.getElementById("history-list"));
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
    this.save("Ножницы");
  }
  this.miniatura = document.createElement('canvas');
  this.miniatura.width = parseInt(document.getElementById('layers').offsetWidth)-35 ;
  this.miniatura.height = Math.floor(this.miniatura.width*0.5);
  this.minctx = this.miniatura.getContext('2d');
  this.renderMiniatura = function(w,h,w1,h1){
    var t = h;
    if (w > w1){
      let tw = w;
      w = w1;
      h = h*w1/tw;
    }

    if (h > h1){
      let th = h;
      h = h1;
      w = w*h1/th;
    }
    var s = h/t;
    var x = -Math.floor((w1-w)/2);
    var y = -Math.floor((h1-h)/2);
    w = Math.floor(w);
    h = Math.floor(h);
    this.miniatura.width = this.miniatura.width;
    this.minctx.fillStyle = '#191919';
    this.minctx.fillRect(0,0,this.miniatura.width,this.miniatura.height);
    this.minctx.clearRect(-x,-y,w,h);
    this.minctx.drawImage(this.canvas,0,0,this.canvas.width,this.canvas.height,-x,-y,w,h);
  }
  this.getMiniatura = function(){
    return this.miniatura;
  }
    this.recalcMiniatura = function(){
    this.miniatura = document.createElement('canvas');
    this.miniatura.width = parseInt(document.getElementById('layers').offsetWidth)-35 ;
    this.miniatura.height = Math.floor(this.miniatura.width*0.5);
    this.minctx = this.miniatura.getContext('2d');
    this.renderMiniatura(this.canvas.width,this.canvas.height,this.miniatura.width,this.miniatura.height);
  }
  this.renderHistory = function(container){
    container.innerHTML = '';
    var layerName = document.createElement("div");
    layerName.innerHTML = "Журнал";
    layerName.className = 'history-name';
    container.appendChild(layerName);
    var t = this;
    for (var i = this.history.length-1; i >= 0 ; i--){
      let historyItem = document.createElement('div');

      historyItem.innerHTML = this.history[i].name;
      container.appendChild(historyItem);
      historyItem.setAttribute("data-id",i);
      if (i == t.now)
         historyItem.className = "history-item active-item";
      else historyItem.className = "history-item";
      historyItem.onclick = function(){
         t.now = this.getAttribute("data-id");
         t.restore(t.now);
         t.renderHistory(document.getElementById("history-list"));
      }
    }
  }
  this.save("Cлой создан");
}
function Point(canvas,x,y,width,height,name){
   this.x = x;
   this.y = y;
   this.canvas = canvas;
   this.height = height;
   this.width = width;
   this.name = name;
}
