function renderShablones(){
  document.getElementById('openToolBox').checked = false;
  var shablones = document.createElement('div');
  shablones.className = 'shablones';
  var close = document.createElement('div');
  close.onclick = function(){
    shablones.remove();
  }
  close.innerHTML = "Закрыть";
  close.className = 'closeShabloneMenu';
  var shabloneContainer = document.createElement('div');
  shabloneContainer.appendChild(close);
  shabloneContainer.className = 'containerOfShablones';
  for (var i = 0; i < 18; i++){
    let shablone = document.createElement('div');
    shablone.className = 'shablone';
    let container = document.createElement('div');

    let img = new Image();
    img.src = 'assets/shablones/' + (i+1) + '.png';
    shablone.setAttribute('data-img',img.src);
    shablone.onclick = function(){
      draw.loadShablone(this.getAttribute('data-img'));
      shablones.remove();
    }
    container.appendChild(img);
    container.className = 'imgcontainer';
    shablone.appendChild(container);
    let name = document.createElement('div');
    name.innerHTML = 'Шаблон '+(i+1);
    name.className = 'shabloneName';
    shablone.appendChild(name);
    shabloneContainer.appendChild(shablone);
  }
  shablones.appendChild(shabloneContainer);
  document.body.appendChild(shablones);
}
