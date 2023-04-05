var draw = {
  state : {
    tool : "",
    dragLayer:0,
    toolName : "Pencil",
    mainColor : "rgb(66,255,0)",
    mainColorRGBA : {
      r:66,
      g:255,
      b:0,
      a:255
    },
    mute:false,
    secondColor : "white",
    view : "",
    viewctx : "",
    lineWidth : 1,
    activeLayer : 0,
    hotkeys:{
      shift:false,
      ctrl:false
    },
    area : {
      x : 0,
      y : 0,
      scale : 1,
      width : 0,
      height : 0
    },
    scrollVal:15,
    paper : "",
    deletedLayers : new Array()
  },
  mouse : "",
  eventBuff : "",
  stateBuff :{
    x:0,
    y:0
  },
  getPaper : function(){
    return this.state.paper;
  },
  getXY : function(evt){
    var rect = draw.state.view.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    var rx = Math.floor( (x/draw.state.area.scale + draw.state.area.x - draw.state.paper.getLayer(draw.state.activeLayer).x));
    var ry = Math.floor( (y/draw.state.area.scale + draw.state.area.y - draw.state.paper.getLayer(draw.state.activeLayer).y));
    return {
      x:(rx),
      y:(ry),
      viewx:(x),
      viewy:(y),
      docx:(Math.floor( (x/draw.state.area.scale + draw.state.area.x))),
      docy:(Math.floor( (y/draw.state.area.scale + draw.state.area.y)))
    }
  },
  getTouchXY : function(evt){
    var rect = draw.state.view.getBoundingClientRect();
    var x = evt.changedTouches[0].pageX - rect.left;
    var y = evt.changedTouches[0].pageY - rect.top;
    var rx = Math.floor( (x/draw.state.area.scale + draw.state.area.x - draw.state.paper.getLayer(draw.state.activeLayer).x));
    var ry = Math.floor( (y/draw.state.area.scale + draw.state.area.y - draw.state.paper.getLayer(draw.state.activeLayer).y));
    return {
      x:(rx),
      y:(ry),
      viewx:(x),
      viewy:(y),
      docx:(Math.floor( (x/draw.state.area.scale + draw.state.area.x))),
      docy:(Math.floor( (y/draw.state.area.scale + draw.state.area.y)))
    }
  },
  calcXY : function(evt){
    var rect = draw.state.view.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    var rx = Math.floor( (x/draw.state.area.scale + draw.state.area.x - draw.state.paper.getLayer(draw.state.activeLayer).x));
    var ry = Math.floor( (y/draw.state.area.scale + draw.state.area.y - draw.state.paper.getLayer(draw.state.activeLayer).y));
    return {
      x:(rx),
      y:(ry),
      viewx:(x),
      viewy:(y),
      docx:(Math.floor( (x/draw.state.area.scale + draw.stateBuff.x))),
      docy:(Math.floor( (y/draw.state.area.scale + draw.stateBuff.y)))
    }
  },
  k : 0,
  scale : function(x){
    var t = draw.calcXY(draw.eventBuff);
    if (draw.state.area.scale > 1){

      if( draw.state.paper.width/(draw.state.area.scale+x*Math.abs(draw.state.area.scale*draw.state.area.scale)) > 20 &&
          draw.state.paper.height/(draw.state.area.scale+x*Math.abs(draw.state.area.scale*draw.state.area.scale)) > 20){
              draw.state.area.scale+=x*Math.abs(draw.state.area.scale*draw.state.area.scale);
          }
    }else draw.state.area.scale+=x*Math.abs(draw.state.area.scale);

    if ((draw.state.paper.width*draw.state.area.scale < draw.state.view.width)){
        draw.state.area.x = -Math.round(Math.round((draw.state.view.width - draw.state.paper.width*draw.state.area.scale)/2)/draw.state.area.scale);
    }else{
      try{

        var dx = Math.round((draw.mouse.docx - t.docx));
        draw.state.area.x+=dx;
        draw.state.area.x = Math.round(draw.state.area.x);
        if ((draw.state.paper.width-draw.state.area.x)*draw.state.area.scale < draw.state.view.width){
           draw.state.area.x -= Math.round((draw.state.view.width/draw.state.area.scale - draw.state.paper.width+draw.state.area.x));
        }
      }catch(e){ console.log(e) }
    }
    if (draw.state.paper.height*draw.state.area.scale < draw.state.view.height){
        draw.state.area.y = -Math.round(Math.round((draw.state.view.height - draw.state.paper.height*draw.state.area.scale)/2)/draw.state.area.scale);
    }else{
      try{
        var dy = Math.round((draw.mouse.docy - t.docy));
        draw.state.area.y+=dy;
        draw.state.area.y = Math.round(draw.state.area.y);
        if ((draw.state.paper.height-draw.state.area.y)*draw.state.area.scale < draw.state.view.height){
            draw.state.area.y -= Math.round((draw.state.view.height/draw.state.area.scale  - draw.state.paper.height+draw.state.area.y));
        }
      }catch(e){ console.log(e) }
    }
     draw.mouse = t;
  },
  simpleScale : function(x){
    draw.state.area.scale+=x;
        draw.state.area.x = -Math.round(Math.round((draw.state.view.width - draw.state.paper.width*draw.state.area.scale)/2)/draw.state.area.scale);
        draw.state.area.y = -Math.round(Math.round((draw.state.view.height - draw.state.paper.height*draw.state.area.scale)/2)/draw.state.area.scale);
  },
  init : function(id){

    var w =  document.body.clientWidth;
    var h =  window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight;

    draw.state.paper = new Paper(w,h,draw.state);
    draw.state.paper.addLayer(0,0,w,h);
    draw.state.paper.getLayer(0).name = "Шаблон";
    draw.state.paper.getLayer(0).isDragable = false;
    draw.state.paper.getLayer(0).save("Белый фон");
    draw.state.activeLayer = 0;
    draw.state.paper.changeActiveLayer(1);
    draw.state.view = document.createElement("canvas");
    draw.state.view.width = w;
    if (document.body.width > 900)
      draw.state.view.height = h-80;
    else draw.state.view.height = h-45;
    draw.state.viewctx = draw.state.view.getContext("2d");

    draw.state.area.x = 0;
    draw.state.area.y = 0;
    draw.state.area.width = w;
    draw.state.area.height = h;

    draw.calcScale(draw.state.paper.width, draw.state.paper.height, draw.state.view.width, draw.state.view.height);
    draw.mouse = {
      x:0,
      y:0,
      viewx:0,
      viewy:0,
      docx:0,
      docy:0
    }
    draw.eventBuf = "";
    draw.state.tool = new Pencil(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());

    document.getElementById(id).appendChild(draw.state.view);

    draw.state.view.onmousedown = function(e){
        draw.state.tool.onmousedown(draw.getXY(e));
    }
    draw.state.view.onmousemove = function(e){
        if (document.getElementById('tool-mini')){
          let t = document.getElementById('tool-mini');
          t.style.top = (e.clientY-15)+"px";
          t.style.left = (e.clientX-25)+"px";
        }
        var t = draw.getXY(e);
        draw.mouse = t;
        draw.eventBuff = e;
        draw.stateBuff.x = draw.state.area.x;
        draw.stateBuff.y = draw.state.area.y;
        draw.state.tool.onmousemove(t);

    }
    draw.state.view.onmouseup = function(e){
        draw.state.tool.onmouseup(draw.getXY(e));
    }
    draw.state.view.onmouseout = function(e){
        draw.state.tool.onmouseout();
    }

    draw.state.view.ontouchstart = function(e){
        draw.state.tool.onmousedown(draw.getTouchXY(e));
    }
    draw.state.view.ontouchmove = function(e){
        draw.state.tool.onmousemove(draw.getTouchXY(e));
    }
    draw.state.view.ontouchend = function(e){
        draw.state.tool.onmouseup(draw.getTouchXY(e));
    }
    draw.state.view.ontouchleave = function(e){
        draw.state.tool.onmouseout();
    }
    draw.state.view.ontouchcancel = function(e){
        draw.state.tool.onmouseout();
    }

    document.body.onkeypress = function(e){
        if(e.keyCode == 39)
           draw.state.area.x-=10;
        else if(e.keyCode == 37){
           draw.state.area.x+=10;
        }else if(e.keyCode == 38){
           draw.state.area.y+=10;
        }else if(e.keyCode == 40){
           draw.state.area.y-=10;
        }else if(e.keyCode == 46){ //delete
          if (confirm("Удалить слой (Востановление ctrl+e)?"))
             draw.state.paper.deleteLayer(draw.state.activeLayer);
        }
    }

    draw.state.view.onwheel = function(e){
      if (e.deltaY > 0){
        if ((draw.state.area.scale-0.015)*draw.state.area.width > 200)
           draw.scale(-0.015);
      }else{
          draw.scale(0.015);
      }
    }

    document.body.onkeydown = function(e){
      if (e.ctrlKey && (e.which == 90 || e.keyCode == 90))
         draw.back();  //ctrl z
        else if (e.ctrlKey && (e.which == 89 || e.keyCode == 89))
         draw.forward(); //ctrl y
        else if (e.ctrlKey && (e.which == 69 || e.keyCode == 69))
          draw.restoreLayer(); //ctrl e
        else if (e.keyCode == 80 && !draw.state.mute)  //p
          draw.changeTool("Pencil");
        else if (e.keyCode == 83 && !draw.state.mute)  //s
          draw.changeTool("StrokeSquare");
        else if (e.keyCode == 70 && !draw.state.mute)  //f
            draw.changeTool("Fill");
        else if (e.keyCode == 73 && !draw.state.mute)  //i
            draw.changeTool("AddImageLayer");
        else if (e.keyCode == 76 && !draw.state.mute)  //l
            draw.changeTool("AddLayer");
        else if (e.keyCode == 72 && !draw.state.mute)  //h
            draw.changeTool("Hand");
        else if (e.keyCode == 85 && !draw.state.mute)  //u
            draw.changeTool("Cut");
        else if (e.keyCode == 74 && !draw.state.mute)  //j
            draw.changeTool("Ellips");
        else if (e.keyCode == 81 && !draw.state.mute)  //q
            draw.changeTool("Text");
        else if (e.keyCode == 71 && !draw.state.mute)  //g
            draw.changeTool("Eraser");
        else if (e.keyCode == 77 && !draw.state.mute)  //m
            draw.changeTool("Move");
        else if (e.keyCode == 78 && !draw.state.mute)  //n
            draw.changeTool("Pipette");
        else if (e.keyCode == 66 && !draw.state.mute)  //b
            draw.changeTool("Line");
        else if (e.keyCode == 87 && !draw.state.mute)  //w
            draw.changeTool("Scale");
        else if (e.keyCode == 65 && !draw.state.mute)  //a
            draw.changeTool("FillEllips");
        else if (e.keyCode == 86 && !draw.state.mute)  //v
            draw.changeTool("FillSquare");
        else if (e.keyCode == 75 && !draw.state.mute)  //k
            draw.changeTool("Triangle");
        else if (e.keyCode == 67 && !draw.state.mute)  //c
            draw.changeTool("FillTriangle");
      if (e.shiftKey)
        draw.state.hotkeys.shift = true;
    }
    document.body.onkeyup = function(e){
         draw.state.hotkeys.shift = false;
    }
    draw.render();
    draw.state.paper.renderLayersControllers("layers");
  },
  render : function(){
    try{
        draw.state.viewctx.fillStyle = "#191919";
        draw.state.viewctx.clearRect(0,0,draw.state.view.width,draw.state.view.height);
        draw.state.viewctx.fillRect(0,0,draw.state.view.width,draw.state.view.height);
        draw.state.viewctx.clearRect(-Math.floor(draw.state.area.x*draw.state.area.scale),
        -Math.floor(draw.state.area.y*draw.state.area.scale) ,Math.floor(draw.state.area.width*draw.state.area.scale),
        Math.floor(draw.state.area.height*draw.state.area.scale));
        draw.state.viewctx.drawImage(draw.state.paper.getView(),0,0,
                                 draw.state.area.width, draw.state.area.height,
                                 -Math.floor(draw.state.area.x*draw.state.area.scale),
                                 -Math.floor(draw.state.area.y*draw.state.area.scale) ,Math.floor(draw.state.area.width*draw.state.area.scale),
                                 Math.floor(draw.state.area.height*draw.state.area.scale));
        draw.state.tool.render(draw.state.viewctx);
    }catch(e){
       //console.log(e)
    }
    requestAnimationFrame(draw.render);

  },
  changeTool : function(toolName,url=''){
    close();
    document.body.style.cursor = "default";
    if (document.getElementById('fileup'))
      document.getElementById('fileup').remove();
    var arr = document.getElementsByClassName('selected')
    if (arr.length > 0){
      for (var i = 0; i < arr.length; i++){
        arr[i].classList.remove('selected');
      }
    }
    document.getElementById(toolName+'-button').classList.add('selected');
    draw.state.toolName = toolName;
    try{
      if (url == '')
         this.state.view.style.cursor = 'default';
      else this.state.view.style.cursor = 'url('+url+'), auto';
    }catch(e){
       //console.log(e)
    }
    if (toolName == "Pencil")
        draw.state.tool = new Pencil(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "StrokeSquare")
        draw.state.tool = new StrokeSquare(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "FillSquare")
        draw.state.tool = new FillSquare(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "Hand")
        draw.state.tool = new Hand(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "Triangle")
        draw.state.tool = new Triangle(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "FillTriangle")
        draw.state.tool = new FillTriangle(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "Ellips")
        draw.state.tool = new Ellips(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "FillEllips")
        draw.state.tool = new FillEllips(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "Line")
        draw.state.tool = new Line(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "AddLayer")
        draw.state.tool = new AddLayer(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "AddImageLayer")
        draw.state.tool = new AddImageLayer(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    if (toolName == "Eraser"){
        draw.state.tool = new Eraser(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    }
    if (toolName == "Pipette"){
        draw.state.tool = new Pipette(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    }
    if (toolName == "Fill"){
        draw.state.tool = new Fill(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    }
    if (toolName == "Move"){
        draw.state.tool = new Move(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    }
    if (toolName == "Cut"){
        draw.state.tool = new Cut(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    }
    if (toolName == "Text"){
        draw.state.tool = new Text(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    }
    if (toolName == "Scale"){
        draw.state.tool = new Scale(draw.state,draw.state.paper.getLayer(draw.state.activeLayer).getCtx());
    }
  },
  changeColor : function(num,type){
    if (type == 1){
      var r = document.getElementById("r").value;
      document.getElementById("r1").value = document.getElementById("r").value;
      var g = document.getElementById("g").value;
      document.getElementById("g1").value = document.getElementById("g").value;
      var b = document.getElementById("b").value;
      document.getElementById("b1").value = document.getElementById("b").value;
      draw.state.mainColor = "rgb(" + r + ","+ g +","+ b +")";
      document.getElementById("main-color").style.background = draw.state.mainColor;
    }else{
      var r = document.getElementById("r1").value;
      document.getElementById("r").value = document.getElementById("r1").value;
      var g = document.getElementById("g1").value;
      document.getElementById("g").value = document.getElementById("g1").value;
      var b = document.getElementById("b1").value;
      document.getElementById("b").value = document.getElementById("b1").value;
      draw.state.mainColor = "rgb(" + r + ","+ g +","+ b +")";
      document.getElementById("main-color").style.background = draw.state.mainColor;
    }
    draw.state.mainColorRGBA.r = r;
    draw.state.mainColorRGBA.b = b;
    draw.state.mainColorRGBA.g = g;
    draw.state.mainColorRGBA.a = 255;
  },
  changeLineWidth(){
    draw.state.lineWidth =  document.getElementById('lw').value;
  },
  loadShablone : function(url){
    var img = new Image();
    img.src = url;
    img.onload = function(){
      draw.state.paper = new Paper(this.width,this.height,draw.state);
      draw.state.paper.addLayer(0,0,this.width,this.height);
      draw.state.paper.getLayer(0).name = "Шаблон";
      draw.state.paper.getLayer(0).getCtx().drawImage(this,0,0);
      draw.state.paper.getLayer(0).save("Картинка");
      draw.state.paper.getLayer(0).isDragable = false;
      draw.state.paper.changeActiveLayer(1);
      draw.calcScale(draw.state.paper.width, draw.state.paper.height, draw.state.view.width, draw.state.view.height);
    }
  },
  back : function(){
    draw.state.paper.getLayer(draw.state.activeLayer).back();
  },
  forward : function(){
    draw.state.paper.getLayer(draw.state.activeLayer).forward();
  },
  changeColorRGB : function(r,g,b){
    draw.state.mainColorRGBA.r = r;
    draw.state.mainColorRGBA.b = b;
    draw.state.mainColorRGBA.g = g;
    draw.state.mainColorRGBA.a = 255;
    draw.state.mainColor = "rgb(" + r + ","+ g +","+ b +")";
    document.getElementById("main-color").style.background = draw.state.mainColor;
    close();
  },
  hexToRGBA : function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a:255
    } : null;
  },
  colorInput : function(){
    draw.state.mainColor = document.getElementById('color-input').value;
    draw.state.mainColorRGBA = draw.hexToRGBA(document.getElementById('color-input').value);
    draw.state.mainColor = "rgb(" +   draw.state.mainColorRGBA.r + ","+   draw.state.mainColorRGBA.g +","+   draw.state.mainColorRGBA.b +")";
    document.getElementById("main-color").style.background = draw.state.mainColor;
  },
  calcScale : function(w,h,w1,h1){
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
    draw.state.area.scale = h/t;
    draw.state.area.x = -Math.floor((w1-w)/draw.state.area.scale/2);
    draw.state.area.y = -Math.floor((h1-h)/draw.state.area.scale/2);
  },
  restoreLayer : function(){
    if (draw.state.deletedLayers.length > 0){
      draw.state.paper.restoreLayer(draw.state.deletedLayers[draw.state.deletedLayers.length-1]);
      draw.state.deletedLayers.pop();
    }
  }
}

draw.init("draw-area");
renderShablones();
function toggleFullScreen(elem) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
document.body.onresize = function(){
  var w =  document.body.clientWidth;
  var h =  document.documentElement.clientHeight|| document.body.clientHeight;
  draw.state.view.width = w;
  if (document.body.width > 900)
    draw.state.view.height = h-80;
  else draw.state.view.height = h-45;
}
setInterval(function(){
   draw.state.paper.recalcLayerMiniatures();
},6000);
function close(){
  document.getElementById('open-toolbox').checked = false;
}
