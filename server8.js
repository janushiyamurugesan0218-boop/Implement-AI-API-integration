// Replace the text below with your actual Gemini API key from Google AI Studio
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const messageText = inputElement.value.trim();

    if (messageText === '') return;

    // 1. Display the user's message
    appendMessage(messageText, 'user-message');
    inputElement.value = ''; // Reset input area

    // 2. Add visual loading indicator
    const loadingIndicator = showLoadingIndicator();

    try {
        // 3. Make the API Call to Gemini
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: messageText }]
                }]
            })
        });

        const data = await response.json();
        
        // Remove loading state
        loadingIndicator.remove();

        // 4. Extract and display AI response text
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            appendMessage(aiReply, 'bot-message');
        } else {
            appendMessage("Sorry, I couldn't process that response format.", 'bot-message');
        }

    } catch (error) {
        loadingIndicator.remove();
        console.error("API Error:", error);
        appendMessage("Oops! Something went wrong trying to reach the AI. Check your API key or network connection.", 'bot-message');
    }
}

function appendMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    
    messageDiv.classList.add('message', className);
    messageDiv.innerText = text;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll view to bottom
}

function showLoadingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('typing-indicator');
    
    indicatorDiv.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;
    
    chatBox.appendChild(indicatorDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return indicatorDiv;
}