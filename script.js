//拖动窗口
function makeDraggable(element) {
  var isDragging = false;
  var previousMousePosition = { x: 0, y: 0 };
  var mouseOffset = { x: 0, y: 0 };

  element.addEventListener('mousedown', function(event) {
    isDragging = true;
    var rect = element.getBoundingClientRect();
    mouseOffset.x = event.clientX - rect.left;
    mouseOffset.y = event.clientY - rect.top;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener('mousemove', function(event) {
    if (!isDragging) return;
    event.preventDefault(); // 阻止默认的鼠标事件
    var newRight = window.innerWidth - (event.clientX - mouseOffset.x) - element.offsetWidth;
    var newBottom = window.innerHeight - (event.clientY - mouseOffset.y) - element.offsetHeight;
    if (newRight < 0) newRight = 0;
    if (newRight > window.innerWidth - element.offsetWidth) newRight = window.innerWidth - element.offsetWidth;
    if (newBottom < 0) newBottom = 0;
    if (newBottom > window.innerHeight - element.offsetHeight) newBottom = window.innerHeight - element.offsetHeight;
    element.style.right = newRight + 'px';
    element.style.bottom = newBottom + 'px';
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener('mouseup', function(event) {
    isDragging = false;
  });
}
  
  makeDraggable(document.getElementById('chatbot'));
  makeDraggable(document.getElementById('ball'));

//切换
var isDraggingBall = false;

document.getElementById('ball').addEventListener('mousedown', function() {
  isDraggingBall = false;
});

document.getElementById('ball').addEventListener('mousemove', function() {
  isDraggingBall = true;
});

document.getElementById('ball').addEventListener('click', function() {
  if (isDraggingBall) return;
  var ball = document.getElementById('ball');
  var chatbot = document.getElementById('chatbot');
  chatbot.style.right = ball.style.right;
  chatbot.style.bottom = ball.style.bottom;
  chatbot.style.display = 'flex';
  ball.style.display = 'none';
});

document.getElementById('close').addEventListener('click', function() {
  var ball = document.getElementById('ball');
  var chatbot = document.getElementById('chatbot');
  ball.style.right = chatbot.style.right;
  ball.style.bottom = chatbot.style.bottom;
  chatbot.style.display = 'none';
  ball.style.display = 'flex';
});

makeDraggable(document.getElementById('chatbot'));
makeDraggable(document.getElementById('ball'));

//发送消息
document.getElementById('send').addEventListener('click', function() {
  var input = document.getElementById('input');
  var messages = document.getElementById('upper-part');
  if (input.value.trim() !== '') {
    var userMessage = document.createElement('div');
    userMessage.textContent = input.value;
    userMessage.className = 'bubble';
    messages.appendChild(userMessage);
    messages.scrollTop = messages.scrollHeight; 
    input.value = '';
    // 发送消息给dify
    sendMessageToDify(userMessage.textContent).then(function(response) {
      var difyMessage = document.createElement('div');
      difyMessage.textContent = response;
      difyMessage.className = 'bubble bubble-left';
      messages.appendChild(difyMessage);
      messages.scrollTop = messages.scrollHeight;
    });
  }
});

// function sendMessageToDify(message) {
//   // 这个函数应该发送消息给dify，并返回一个Promise，这个Promise在收到dify的回复时解析
//   // 这里只是一个示例，你需要根据你的实际情况来实现这个函数
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       resolve('这是dify的回复');
//     }, 1000);
//   });
// }
function sendMessageToDify(message) {
  return new Promise(function(resolve, reject) {
    fetch('https://api.dify.ai/v1/completion-messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer {YOUR_API_KEY}',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: {"text": message}, response_mode: "blocking", user: "user"})
    })
    .then(response => response.json())
    .then(data => {
      if (data.answer) {
        resolve(data.answer);
      } else {
        reject('Failed to get reply from dify');
      }
    })
    .catch(error => {
      reject(error);
    });
  });
}