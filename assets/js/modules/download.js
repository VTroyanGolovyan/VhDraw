function renderDownload(){
  var close = document.createElement('div');
  close.onclick = function(){
    download.remove();
  }
  var closeImg = new Image();
  closeImg.src = 'assets/icon/close-modal.png';
  close.appendChild(closeImg);
  close.className = 'close-download';

  document.getElementById('open-toolbox').checked = false;
  var download = document.createElement("div");
  download.className = 'dark-mask';
  var select = document.createElement("div");
  select.innerHTML = 'Выберите формат';
  select.className = 'select-format';

  var png = document.createElement('div');
  png.className = 'download-item';
  png.innerHTML = "Картинка png";
  png.onclick = function(){
    draw.getPaper().download('image/png','png');
  }

  var jpeg = document.createElement('div');
  jpeg.innerHTML = "Картинка jpeg";
  jpeg.className = 'download-item';
  jpeg.onclick = function(){
    draw.getPaper().download('image/jpeg','jpeg');
  }

  var post =  document.createElement('div');
  post.innerHTML = "Сохранить в профиль";
  post.className = 'download-item';
  post.onclick = function(){
    var image = draw.getPaper().getImageDataUrl();

    var xhr = new XMLHttpRequest();
    xhr.open("POST","../ajax/upload_scketch.php",true);

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4){
         window.open(xhr.responseText,'_blank');
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('image='+image);
  }

  var container = document.createElement("div");
  container.className = 'download-container';
  download.appendChild(close);
  container.appendChild(select);
  container.appendChild(post);
  container.appendChild(png);
  container.appendChild(jpeg);
  download.appendChild(container);

  document.body.appendChild(download);
}
