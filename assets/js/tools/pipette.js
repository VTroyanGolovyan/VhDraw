function Pipette(state, ctx){
  this.active = false;
  this.ctx = ctx;
  this.state = state;
  this.render = function(ctx){

  }
  this.data = "";
  this.onmousedown  = function(coords){
    this.data = this.ctx.getImageData(coords.x,coords.y,1,1).data;
    var r = this.data[0];
    var g = this.data[1];
    var b = this.data[2];
    document.getElementById("r1").value = r;
    document.getElementById("g1").value = g;
    document.getElementById("b1").value = b;
    document.getElementById("r").value = r;
    document.getElementById("g").value = g;
    document.getElementById("b").value = b;
    document.getElementById("mainColor").style.background = "rgb("+r+","+g+","+b+")";
  }

  this.onmousemove  = function(coords){

  }
  this.onmouseup  = function(coords){

  }
  this.onmouseout = function(){

  }
}
