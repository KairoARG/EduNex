const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

// API configuration
const API_KEY = "AIzaSyBnz2EbvRFdgHgMuwF-ElzetyiypP-8U3E"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const createChatLi = (message, className) => {
// Create a chat <li> element with passed message and className
const chatLi = document.createElement("li");
chatLi.classList.add("chat", className);
let chatContent = className === "outgoing" 
    ? `<p></p>` 
    : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
chatLi.innerHTML = chatContent;
chatLi.querySelector("p").textContent = message;
return chatLi; // return chat <li> element
}

const generateResponse = async (chatElement) => {
const messageElement = chatElement.querySelector("p");

// Request options for API call
const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
    contents: [{
        role: "user",
        parts: [{ text: userMessage }]
    }]
    }),
};

try {
    // Fetch response from API
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    console.log('API Response:', data); // Log the response

    // Handle API response
    if (data && data.candidates && data.candidates.length > 0) {
    messageElement.textContent = data.candidates[0].content.parts[0].text.trim();
    } else {
    messageElement.classList.add("error");
    messageElement.textContent = "Sorry, I couldn't understand that.";
    }
} catch (error) {
    console.error('Error:', error); // Log the error
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again.";
}

// Scroll to bottom of chatbox
chatbox.scrollTo(0, chatbox.scrollHeight);
}

const handleUserMessage = () => {
userMessage = chatInput.value.trim();
if (!userMessage) return; // If the message is empty, return

// Create and append user's message to chatbox
const outgoingChatLi = createChatLi(userMessage, "outgoing");
chatbox.appendChild(outgoingChatLi);
chatInput.value = "";

// Generate and display chatbot's response
const incomingChatLi = createChatLi("", "incoming");
chatbox.appendChild(incomingChatLi);
generateResponse(incomingChatLi);
}

sendChatBtn.addEventListener("click", handleUserMessage);
chatInput.addEventListener("keypress", (e) => {
if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleUserMessage();
}
});

chatbotToggler.addEventListener("click", () => {
document.body.classList.toggle("show-chatbot");
});

closeBtn.addEventListener("click", () => {
document.body.classList.remove("show-chatbot");
});