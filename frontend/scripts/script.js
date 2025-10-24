// Simple Chat Widget for TechCorp Solutions
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.apiEndpoint = 'http://localhost:8000/chat';
        this.authUsername = "server";
        this.authPassword = "server";
        this.isLoading = false;
        
        this.initializeElements();
        this.attachEventListeners();
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.setLoading(true);

        try {
            // Show typing indicator
            this.showTypingIndicator();

            // Make API request
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${this.authUsername}:${this.authPassword}`)}`
                },
                body: JSON.stringify({
                    message: message,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(data.response || data.message || data.output ||'Sorry, I couldn\'t process your request.', 'bot');

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
        } finally {
            this.setLoading(false);
        }
    }

    initializeElements() {
        this.chatWidget = document.getElementById('chatWidget');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatClose = document.getElementById('chatClose');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
    }

    attachEventListeners() {
        // Toggle chat
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.openChat();
        } else {
            this.closeChat();
        }
    }

    openChat() {
        this.chatContainer.classList.add('active');
        this.chatToggle.style.display = 'none';
        this.messageInput.focus();
    }

    closeChat() {
        this.chatContainer.classList.remove('active');
        this.chatToggle.style.display = 'flex';
        this.isOpen = false;
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = content;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Typing...';
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        this.messageInput.disabled = loading;
        
        if (loading) {
            this.sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        } else {
            this.sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Contact form handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.attachEventListeners();
        }
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        this.showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        this.form.reset();
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
    new ContactForm();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);