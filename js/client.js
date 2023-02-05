var connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity",
    "timeout": 10000,
    "transports": ["websocket"]
};

this.socket = io.connect('http://localhost:8000', connectionOptions);

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container-inner")
var audio_receive = new Audio('receive.mp3');
var audio_send = new Audio('send.mp3');



const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML += '<span class="message-inner"></span>';
    let firstChild = messageElement.firstElementChild; 
    firstChild.innerText = message;
 
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    messageContainer.append(messageElement);

    if(position == 'left'){
        audio_receive.play();
    }
    if(position == 'right'){
        audio_send.play();
    }
}



const Name = prompt("Enter your name to join");
socket.emit('new-user-joined', Name);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ' ';
})
socket.on('user-joined', Name => {
    append(`${Name} joined the chat`, 'right')
})
socket.on('receive', data => {
    append(`${data.Name}: ${data.message}`, 'left')
})
socket.on('left', Name => {
    append(`${Name} left the chat`, 'left')
})