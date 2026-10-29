
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
    div.textContent = String(text ?? "");
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
            <span class="sender">You</span>
            <div class="user-bubble">${escapeHTML(text)}</div>
        </div>
        <div class="message-avatar user">You</div>
    `;

    messagesContainer.appendChild(wrapper);
    scrollToBottom();
}

// ------------------------------------------------------------
// Format Assistant Message
// ------------------------------------------------------------

function formatAssistantMessage(text) {
    let formatted = escapeHTML(text);

    // Keep appointment details while formatting Markdown tables.
    formatted = formatted.split("\n").map(line => {
        const trimmed = line.trim();

        // Remove only Markdown table separator rows.
        if (/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed)) {
            return "";
        }

        // Display table cells as readable text.
        if (trimmed.includes("|")) {
            const cells = trimmed
                .replace(/^\|/, "")
                .replace(/\|$/, "")
                .split("|")
                .map(cell => cell.trim())
                .filter(Boolean);

            return cells.join("  •  ");
        }

        return line;
    }).join("\n");

    // Format bold text.
    formatted = formatted.replace(
        /\*\*(.+?)\*\*/g,
        "<strong>$1</strong>"
    );

    // Format bullet points.
    formatted = formatted.replace(
        /(^|\n)\s*[-*]\s+/g,
        "$1• "
    );

    // Preserve line breaks.
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
}

// ------------------------------------------------------------
// Add Assistant Message
// ------------------------------------------------------------

function addAssistantMessage(text) {
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message";

    wrapper.innerHTML = `
        <div class="message-avatar">✦</div>
        <div class="message-content">
            <span class="sender">DentalAI</span>
            <div class="assistant-bubble dynamic">
                ${formatAssistantMessage(text)}
            </div>
        </div>
    `;

    messagesContainer.appendChild(wrapper);
    scrollToBottom();
}

// ------------------------------------------------------------
// Typing Indicator
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
    if (
        typeof message !== "string" ||
        !message.trim() ||
        sendButton.disabled
    ) {
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

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
            throw new Error(
                data.error || `Request failed (${response.status}).`
            );
        }

        addAssistantMessage(
            data.response || "I couldn't generate a response."
        );

    } catch (error) {
        console.error("Chat error:", error);

        addAssistantMessage(
            "I'm sorry, something went wrong while processing your request. Please try again."
        );

    } finally {
        hideTyping();
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// ------------------------------------------------------------
// Form Submit
// ------------------------------------------------------------

chatForm.addEventListener("submit", function(event) {
    event.preventDefault();
    sendMessage(messageInput.value);
});

// ------------------------------------------------------------
// Enter to Send; Shift + Enter for New Line
// ------------------------------------------------------------

messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});

// ------------------------------------------------------------
// Auto Resize Textarea
// ------------------------------------------------------------

function autoResize() {
    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 110) + "px";
}

messageInput.addEventListener("input", autoResize);

// ------------------------------------------------------------
// Quick Actions
// ------------------------------------------------------------

document.querySelectorAll("[data-message]").forEach(button => {
    button.addEventListener("click", function() {
        sendMessage(this.dataset.message || "");
    });
});

// ------------------------------------------------------------
// Clear Chat
// ------------------------------------------------------------

clearChatButton.addEventListener("click", async function() {
    const confirmed = confirm(
        "Clear your current conversation?"
    );

    if (!confirmed) {
        return;
    }

    clearChatButton.disabled = true;

    try {
        const response = await fetch("/api/clear-chat", {
            method: "POST"
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
            throw new Error(
                data.error || "Unable to clear chat."
            );
        }

        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="assistant-avatar">✦</div>

                <div class="welcome-content">
                    <span class="sender">DentalAI</span>

                    <div class="assistant-bubble">
                        <p>Conversation cleared. 👋</p>

                        <p>
                            How can I help you with your dental appointment?
                        </p>

                        <span class="bubble-time">Just now</span>
                    </div>
                </div>
            </div>
        `;

        messageInput.value = "";
        autoResize();
        scrollToBottom();

    } catch (error) {
        console.error("Clear chat error:", error);

        addAssistantMessage(
            "I couldn't clear the conversation. Please try again."
        );

    } finally {
        clearChatButton.disabled = false;
    }
});

// ------------------------------------------------------------
// Initial Setup
// ------------------------------------------------------------

autoResize();
messageInput.focus();
