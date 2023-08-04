class Chatbox {
    constructor() {
        this.args = {
            // open the chatbox button function
            openButton: document.querySelector('.chatbox__button'),

            // open the chatbox UI
            chatBox: document.querySelector('.chatbox__support'),

            // send questions button to chatbot
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = []; // to store messages 
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        // listen to open / close chatbot event
        openButton.addEventListener('click', () => this.toggleState(chatBox));

        //
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        // listen if user click enter
        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    // this function toggle the view of the chatbot
    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box 
        if (this.state) {
            chatbox.classList.add('chatbox--active')
        }
        else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    // function to be triggered when the user click send 
    onSendButton(chatbox) {
        // get text from user 
        var textField = chatbox.querySelector('input');
        let text1 = textField.value 

        // return if empty
        if (text1 === "") {
            return;
        }

        // message is a key, needs to be the same as the one in 
        let msg1 = { name: "User", message: text1 }

        // push message into messenger array 
        this.messages.push(msg1);

        // send POST request to the end point
        // http://127.0.0.1:5000/predict
        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST', 
            body: JSON.stringify({message:text1}), 
            mode: 'cors',    // to integrate the chatbot to outside website 
            headers: {
                'Content-Type': 'application/json'
            }, 
        })
        .then(r => r.json())
        .then(r => {
            // push the chatbot response 
            let msg2 = { name: "Saai", message: r.answer };
            this.messages.push(msg2);

            // trigger update the chatbot UI
            this.updateChatText(chatbox);
            textField.value = '';
            
            // error handling
        }).catch((error) => {
            console.error('Error:, error');
            this.updateChatText(chatbox);
            textField.value = ''
        });
    }

    // updates the chatbot UI conversation 
    updateChatText(chatbox) {
        var html = '';

        // going through each messages 
        this.messages.slice().reverse().forEach(function(item, index) {
            // check if it's out chatbot
            if (item.name === "Saai") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            // if it's the user
            else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        })

        // modify the chatbox view
        const chatMessage = chatbox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();