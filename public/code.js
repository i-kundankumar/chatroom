(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  app.querySelector(".join-screen").addEventListener("click", function () {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
      return;
    }

    socket.emit("newuser", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        message: message,
      });
      socket.emit("chat", {
        username: uname,
        message: message,
      });
      app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });
    
    socket.on("update", function (update) {
        renderMessage("update", update);
    });
    
    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let messageElement = document.createElement("div");
      messageElement.className = "message my-message";
      messageElement.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.message}</div>
            </div>`;
      messageContainer.appendChild(messageElement);
    } else if(type == "other") {
      let messageElement = document.createElement("div");
      messageElement.className = "message other-message";
      messageElement.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.message}</div>
            </div>`;
      messageContainer.appendChild(messageElement);
    } else {
      let messageElement = document.createElement("div");
      messageElement.className = "message update";
      messageElement.innerHTML = `
            <div>
                <div class="text">${message}</div>
            </div>`;
      messageContainer.appendChild(messageElement);
      }
      
      messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
