function chatInit(selector) {
    //document.addEventListener('DOMContentLoaded', () => {
      if (!window.LIVE_CHAT_UI) {
        let chat = document.querySelector(selector);
        let toggles = chat.querySelectorAll('.toggle')
        let close = chat.querySelector('.close')
        
        window.setTimeout(() => {
          chat.classList.add('is-active')
        }, 1000)
        
        toggles.forEach( toggle => {
          toggle.addEventListener('click', () => {
            chat.classList.add('is-active')
          })
        })
        
        close.addEventListener('click', () => {
          chat.classList.remove('is-active')
        })
        
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                chat.classList.remove('is-active')
            }
        };
        
        window.LIVE_CHAT_UI = true
      }
    //})
  }
  

  function Assemble_Message(Name,Message,Color,IsReply){
    var DIV_CLASS = "message ";
    if(IsReply){DIV_CLASS += "reply";}
    var $MSG_DIV = $("<div>",{class:DIV_CLASS,color:Color});
    var $NAME    = $("<h1>",{style:"color:"+Color+";font-size:20px;",text:Name});
    var $MSG_TEXT = $("<p>",{class:"text",text:Message});
    $MSG_DIV.append($NAME);
    $MSG_DIV.append($MSG_TEXT);
    return $MSG_DIV;
  }

  function Get_Name(){
    return getCookie("USERNAME");
  }

  function Set_Name(Name){
    setCookie("USERNAME", Name, 365);
  }
  /** CHAAAT */
  $(function () {
    chatInit('#chat-app');
    "use strict";
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
    var myColor = false;
    var myName = true;
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
      content.html( Assemble_Message("Server","Bocsi de a böngésződ nem támogatja a csevegést a komákkal. :(","Red",true) );
      input.hide();
      return;
    }
    // open connection 
    var connection = new WebSocket('ws://' + window.location.hostname + ':1337'); //'ws://127.0.0.1:1337'
    connection.onopen = function () {
      // first we want users to enter their names
      if(Get_Name() == ""){
        input.removeAttr('disabled');
        status.text('Válassz nevet: ');
      }else{
        status.text("");
        myName = Get_Name();
        input.val(myName);
        $('#input').trigger(
          jQuery.Event( 'keydown', { keyCode: 13, which: 13 } )
        );
        input.removeAttr('disabled');
        input.prop("placeholder","Írj valamit a komáknak...");
      }
    };
    connection.onerror = function (error) {
      content.html( Assemble_Message("Server","Bocsi de valami hiba lépett fel a kapcsolattal. :( \n Próbáld újratölteni az oldalt!","Red",true) );
    };
    // most important part - incoming messages
    connection.onmessage = function (message) {
      try {
        var json = JSON.parse(message.data);
      } catch (e) {
        console.log('Invalid JSON: ', message.data);
        return;
      }
      if (json.type === 'color') { 
        myColor = json.data;
        input.removeAttr('disabled').focus();
        status.hide();
        //status.text(myName + ': ').css('color', myColor);

      } else if (json.type === 'history') { // entire message history
        // insert every single message to the chat window
        for (var i=0; i < json.data.length; i++) {
          var IsReply = false;
          if(json.data[i].author !== myName){IsReply = true;}
          content.append( Assemble_Message(json.data[i].author,json.data[i].text,json.data[i].color,IsReply) );
        }
      } else if (json.type === 'message') {
        // let the user write another message
        input.removeAttr('disabled'); 
        if(json.data.author !== myName){IsReply = true;}
        content.append( Assemble_Message(json.data.author,json.data.text,json.data.color,IsReply) );
      } else {
        console.log('Hmm..., I\'ve never seen JSON like this:', json);
      }
    };
    /**
     * Send message when user presses Enter key
     */
    var FirstInput = true;
    input.keydown(function(e) {
      if (e.keyCode === 13) {
        var msg = $(this).val();
        if (!msg) {
          return;
        }
        if(FirstInput){
          FirstInput = false;
          Set_Name(msg);
        }
        connection.send(msg);
        $(this).val('');
        input.attr('disabled', 'disabled');
        if (myName === false) {
          myName = msg;
        }
      }
    });
    setInterval(function() {
      if (connection.readyState !== 1) {
        status.text('Error');
        input.attr('disabled', 'disabled').val(
            'Unable to communicate with the WebSocket server.');
      }
    }, 3000);

  });
