function Text(state, ctx){
  this.lastUpdate = new Date().getTime();
  this.f = true;

  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.startX = 0;
  this.startY = 0;
  this.startvX = 0;
  this.startvY = 0;
  this.x = 0;
  this.y = 0;
  state.mute = true;
  var cont = document.createElement('div');
  var select = document.createElement("div");
  select.innerHTML = 'Введите текст';
  select.className = 'select-format';
  cont.className = 'dark-mask';
  var textInput = document.createElement("div");
  textInput.className = 'download-container';
  var input = document.createElement('input');
  input.className = 'text-input';
  textInput.appendChild(select);
  cont.appendChild(textInput);
  textInput.appendChild(input);
  var buttonOk = document.createElement('div');
  buttonOk.className = 'select-format';
  buttonOk.innerHTML = 'OK';
  textInput.appendChild(buttonOk);
  this.text = "";
  var t = this;
  buttonOk.onclick = function(){
    cont.remove();
    state.mute = false;
    if (t.text != ""){
      var width = Math.round(state.paper.width*0.4);
      var size = Math.round(width/t.text.length)*1.5;
      var height = size+5;
      state.toolName = "Scale";
      state.paper.addLayer(Math.round((state.paper.width-width)/2),Math.round((state.paper.height-height)/2),width,height,1);
      var l = state.paper.getLayer(state.activeLayer);
      l.name = t.text;
      l.miniaturaF = false;
      l.color = state.mainColor;
      state.paper.renderLayersControllers('layers');
      var ctx = l.getCtx();
      ctx.strokeStyle = state.mainColor;
      ctx.lineWidth = state.lineWidth;
      var d = Math.floor(state.lineWidth/2);
     // ctx.strokeRect(d,d,l.width-2*d,l.height-2*d);

     ctx.fillStyle = state.mainColor;

     ctx.font = size + "px Georgia";
     ctx.textBaseline = "top";
     ctx.fillText(t.text,0,0,width);
     state.paper.save("Текст");
    }
  }

  input.setAttribute('type','text');
  cont.setAttribute('id','fileup');

  document.body.appendChild(cont);
  input.click();
  var t = this;
  input.oninput = function(){
     t.text   = this.value;


  }

  this.render = function(ctx){
    if (this.active){
      var x,y,width,height;
      if (this.x > this.startvX){
        x = this.startvX;
        width = this.x - this.startvX;
      }else{
        x = this.x;
        width = this.startvX -  this.x;
      }
      if (this.y > this.startvY){
        y = this.startvY;
        height = this.y - this.startvY;
      }else{
        y = this.y;
        height = this.startvY -  this.y;
      }
      ctx.fillStyle = state.mainColor;
      var size = Math.floor(width/this.text.length*1.5)
      ctx.font = size + "px Georgia";
      ctx.textBaseline = "top";
      ctx.fillText(this.text,x,y,width);
    }
  }
  this.onmousedown  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     this.ctx.lineWidth = state.lineWidth;
     this.active = true;
     this.startX = coords.docx;
     this.startY = coords.docy;
     this.x = coords.viewx;
     this.y = coords.viewy;
     this.startvX = coords.viewx;
     this.startvY = coords.viewy;
  }
  this.onmousemove  = function(coords){
     this.ctx.strokeStyle = state.mainColor;
     if (this.active){
       this.x = coords.viewx;
       this.y = coords.viewy;
     }
  }
  this.onmouseup  = function(coords){
     this.ctx.fillStyle = state.mainColor;
     this.active = false;
     var x,y,width,height;
     var t = false;
     if (coords.docx > this.startX){
       x = this.startX;
       width = coords.docx - this.startX;
     }else{
       x = coords.docx;
       width = this.startX -  coords.docx;
     }
     if (coords.docy > this.startY){
       y = this.startY;
       height = coords.docy - this.startY;
       t = true;
     }else{
       y = coords.docy;
       height = this.startY -  coords.docy;
     }
     if(width > 0 && height > 0){
       this.state.toolName = "Scale";
         var size = Math.floor(width/this.text.length*1.5)
         if (height < size+10)
           height = size+10;
       this.state.paper.addLayer(x,y,width,height,1);
       var l = this.state.paper.getLayer(this.state.activeLayer);
       l.name = 'Текст';
       var ctx = l.getCtx();
       ctx.strokeStyle = state.mainColor;
       ctx.lineWidth = state.lineWidth;
       var d = Math.floor(state.lineWidth/2);
      // ctx.strokeRect(d,d,l.width-2*d,l.height-2*d);

      ctx.fillStyle = state.mainColor;

      ctx.font = size + "px Georgia";
      ctx.textBaseline = "top";
      ctx.fillText(this.text,0,0,width);
      state.paper.save("Текст");
    }
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
