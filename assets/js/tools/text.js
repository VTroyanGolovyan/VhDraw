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
  buttonOk.onclick = function(){
    cont.remove();
    state.mute = false;
  }
  this.text = "";
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
     this.startX = coords.x;
     this.startY = coords.y;
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
     if (coords.x > this.startX){
       x = this.startX;
       width = coords.x - this.startX;
     }else{
       x = coords.x;
       width = this.startX -  coords.x;
     }
     if (coords.y > this.startY){
       y = this.startY;
       height = coords.y - this.startY;
     }else{
       y = coords.y;
       height = this.startY -  coords.docy;
     }
    this.ctx.fillStyle = state.mainColor;
    var size = Math.floor(width/this.text.length*1.5)
    this.ctx.font = size + "px Georgia";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(this.text,x,y,width);
    this.state.paper.save("Текст");
  }
  this.onmouseout = function(){
     this.active = false;
  }
}
