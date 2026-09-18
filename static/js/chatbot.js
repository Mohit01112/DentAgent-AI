const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");
const sendButton = document.getElementById("sendButton");
const typingIndicator = document.getElementById("typingIndicator");
const clearChatButton = document.getElementById("clearChatButton");


// ------------------------------------------------------------
// Scroll
// ------------------------------------------------------------

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


// ------------------------------------------------------------
// Escape HTML
// ------------------------------------------------------------

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// ------------------------------------------------------------
// Add User Message
// ------------------------------------------------------------

function addUserMessage(text) {

    const wrapper = document.createElement("div");

    wrapper.className = "chat-message user";

    wrapper.innerHTML = `
        <div class="message-content">

            <span class="sender">
                You
            </span>

            <div class="user-bubble">
                ${escapeHTML(text)}
            </div>

        </div>

        <div class="message-avatar user">
            You
        </div>
    `;

    messagesContainer.appendChild(wrapper);

    scrollToBottom();
}


// ------------------------------------------------------------
// Add Assistant Message
// ------------------------------------------------------------

// ------------------------------------------------------------
// Add Assistant Message
// ------------------------------------------------------------

function formatAssistantMessage(text) {
    // 1. Split text into individual lines to filter out tables cleanly
    const lines = text.split("\n");
    const cleanedLines = [];

    for (let line of lines) {
        const trimmed = line.trim();
        // Skip markdown table header, separators, and rows (lines containing multiple |)
        if (trimmed.startsWith("|") || trimmed.endsWith("|") || (trimmed.match(/\|/g) || []).length > 1) {
            continue;
        }
        cleanedLines.push(line);
    }

    let joinedText = cleanedLines.join("\n");
    let formatted = escapeHTML(joinedText);

    // Remove Markdown bold
    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    // Convert numbered lists
    formatted = formatted.replace(
        /(?:^|\n)(\d+)\.\s+(.*)/g,
        "<br>$1. $2"
    );

    // Convert bullet points
    formatted = formatted.replace(
        /(?:^|\n)\\?\*\s+(.*)/g,
        "<br>• $1"
    );

    // Line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
}


function addAssistantMessage(text) {

    const wrapper = document.createElement("div");

    wrapper.className = "chat-message";

    wrapper.innerHTML = `
        <div class="message-avatar">
            ✦
        </div>

        <div class="message-content">

            <span class="sender">
                DentalAI
            </span>

            <div class="assistant-bubble dynamic">
                ${formatAssistantMessage(text)}
            </div>

        </div>
    `;

    messagesContainer.appendChild(wrapper);

    scrollToBottom();
}

// ------------------------------------------------------------
// Typing indicator
// ------------------------------------------------------------

function showTyping() {
    typingIndicator.classList.add("visible");
    scrollToBottom();
}


function hideTyping() {
    typingIndicator.classList.remove("visible");
}


// ------------------------------------------------------------
// Send Message
// ------------------------------------------------------------

async function sendMessage(message) {

    if (!message || !message.trim()) {
        return;
    }

    const cleanMessage = message.trim();

    addUserMessage(cleanMessage);

    messageInput.value = "";

    autoResize();

    sendButton.disabled = true;

    showTyping();

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: cleanMessage
            })

        });


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "Something went wrong."
            );

        }


        hideTyping();

        addAssistantMessage(data.response);


    } catch (error) {

        hideTyping();

        addAssistantMessage(
            "I'm sorry, something went wrong while processing your request. Please try again."
        );

        console.error("Chat error:", error);

    } finally {

        sendButton.disabled = false;

        messageInput.focus();

    }
}


// ------------------------------------------------------------
// Form submit
// ------------------------------------------------------------

chatForm.addEventListener("submit", function(event) {

    event.preventDefault();

    sendMessage(messageInput.value);

});


// ------------------------------------------------------------
// Enter to send
// Shift + Enter = new line
// ------------------------------------------------------------

messageInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        chatForm.requestSubmit();

    }

});


// ------------------------------------------------------------
// Auto resize textarea
// ------------------------------------------------------------

function autoResize() {

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 110) + "px";

}


messageInput.addEventListener("input", autoResize);


// ------------------------------------------------------------
// Quick actions
// ------------------------------------------------------------

document.querySelectorAll("[data-message]").forEach(button => {

    button.addEventListener("click", function() {

        const message = this.dataset.message;

        sendMessage(message);

    });

});


// ------------------------------------------------------------
// Clear chat
// ------------------------------------------------------------

clearChatButton.addEventListener("click", async function() {

    const confirmed = confirm(
        "Clear your current conversation?"
    );

    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            "/api/clear-chat",
            {
                method: "POST"
            }
        );


        const data = await response.json();


        if (!data.success) {
            throw new Error("Unable to clear chat.");
        }


        messagesContainer.innerHTML = `

            <div class="welcome-message">

                <div class="assistant-avatar">
                    ✦
                </div>

                <div class="welcome-content">

                    <span class="sender">
                        DentalAI
                    </span>

                    <div class="assistant-bubble">

                        <p>
                            Conversation cleared. 👋
                        </p>

                        <p>
                            How can I help you with your dental
                            appointment?
                        </p>

                        <span class="bubble-time">
                            Just now
                        </span>

                    </div>

                </div>

            </div>

        `;

        scrollToBottom();


    } catch (error) {

        console.error("Clear chat error:", error);

    }

});


// ------------------------------------------------------------
// Initial focus
// ------------------------------------------------------------

messageInput.focus();