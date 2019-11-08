//remember username and chanel
if ( !localStorage.getItem('username') ){
  var name = prompt("Please enter your name:");
  while (name == null || name == "") {
    name = prompt("Please enter your name:");
  }
  localStorage.setItem('chat', 'Principal');
  localStorage.setItem('username', name);
}
document.addEventListener('DOMContentLoaded', () => {

  // Get username and chat
  document.getElementById("name").innerHTML = localStorage.getItem('username');
  document.querySelector('.chanel-name').innerHTML = localStorage.getItem('chat');
  load_page(localStorage.getItem('chat'));
  // Functions
  document.querySelector('.add').onclick = function() {
    if (document.querySelector('.create-chanel').style.display == "block")
      document.querySelector('.create-chanel').style.display = "None";
   else
      document.querySelector('.create-chanel').style.display = "block";

    return false;
  };

  document.querySelector('.emoji').onclick = function() {
    if (document.querySelector('.emoji-box').style.display == "block")
      document.querySelector('.emoji-box').style.display = "None";
   else
      document.querySelector('.emoji-box').style.display = "block";

    return false;
  };

    document.querySelectorAll('.chanel').forEach(link => {
    link.onclick = () => {
        const page = link.dataset.chanel;
        localStorage.setItem('chat', page);
        var chat = localStorage.getItem('chat');
        document.querySelector('.chanel-name').innerHTML = page;
        load_page(page);
        return false;
        };
      });

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
      document.querySelector('#new-message').onsubmit = () => {
        var uname = localStorage.getItem('username');
        var message = document.querySelector('#send-message').value;
        var chanel = localStorage.getItem('chat');
        var data = {
                    'username': uname,
                    'message': message,
                    'chanel': chanel
                  };
        socket.emit('submit message', data);
      };
    });
    socket.on('anunce message', data => {
      if (data.cha == localStorage.getItem('chat')) {
        const uname = document.createElement('h4');
        uname.className = 'username';
        const mess = document.createElement('p');
        mess.className = 'message';
        const date = document.createElement('p');
        date.className = 'time-right';

        uname.innerHTML = data.unama;
        mess.innerHTML = data.me;
        date.innerHTML = data.da;

        var box = document.createElement('div');
        box.className = 'msg'
        box.append(uname);
        box.append(mess);
        box.append(date);

        document.querySelector('.contein').append(box);
        document.querySelector('#send-message').value = '';
      }
      return false;
    });
});

function load_page(name){
  var container = document.querySelector('.contein')
  container.innerHTML = '';
  const request = new XMLHttpRequest();
  request.open('GET', '/' + name)
  request.onload = () => {
    var data = request.responseText;
    data = '{ "chat" :' + data + '}'
    data = JSON.parse(data);
    //alert(data.chat.length);
    //console.log(data);
    var cont = document.createElement('div');
    cont.className = 'chat-box';
    for (var i = 0; i < data.chat.length; i++) {
      const uname = document.createElement('h4');
      uname.className = 'username';
      const mess = document.createElement('p');
      mess.className = 'message';
      const date = document.createElement('p');
      date.className = 'time-right';

      uname.innerHTML = data.chat[i].unama;
      mess.innerHTML = data.chat[i].me;
      date.innerHTML = data.chat[i].da;

      var box = document.createElement('div');
      box.className = 'msg'
      box.append(uname);
      box.append(mess);
      box.append(date);
      container.innerHTML = '';
      cont.append(box);
    }

    container.appendChild( cont );
    };
  request.send();
}

function add(icon) {

  var text = document.querySelector('#send-message').value + '<span class="icon-pacman"  ><span/>';
  document.querySelector('#send-message').value = text;
}
