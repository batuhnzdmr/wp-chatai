document.addEventListener('DOMContentLoaded', function()
{    
    // Elements
    const elements = {
        launcher: document.getElementById('toggle-chat-box'),
        window: document.getElementById('chat-box'),
        closeBtn: document.querySelector('.chat-close-button'),
        // Form
        leadForm: document.getElementById('chat-lead-form'),
        startBtn: document.getElementById('chat-start-button'),
        nameInput: document.getElementById('lead-name'),
        emailInput: document.getElementById('lead-email'),
        // Sohbet
        msgWrapper: document.getElementById('chat-message-wrapper'),
        msgBox: document.getElementById('chat-message-box'),
        inputBox: document.querySelector('.chat-input-box'),
        input: document.getElementById('chat-input'),
        sendBtn: document.getElementById('chat-submit-button'),
        // Scroll
        scrollBtn: document.getElementById('chat-scroll-down-button'),
        badge: document.getElementById('chat-new-message-badge')
    };

    // Avatar
    const botAvatarURL = "http://wordpress.batuhnzdmr.me/wp-content/uploads/2026/01/AI.png";
    const userAvatarURL = "http://wordpress.batuhnzdmr.me/wp-content/uploads/2026/01/HUMAN.png";

    // Toggle Chat Box
    function toggleChat()
    {
        const isVisible = elements.window.style.display === 'flex';
        elements.window.style.display = isVisible ? 'none' : 'flex';
        elements.launcher.style.display = isVisible ? 'flex' : 'none';
        
        if(!isVisible && localStorage.getItem('chatai_user_info'))
        {
            scrollToBottom(true);
        }
    }
    elements.launcher.addEventListener('click', toggleChat);
    elements.closeBtn.addEventListener('click', toggleChat);

    // Check Form
    if(localStorage.getItem('chatai_user_info'))
    {
        showChatInterface();
    }

    elements.startBtn.addEventListener('click', function()
    {
        const name = elements.nameInput.value.trim();
        const email = elements.emailInput.value.trim();

        if(name && email)
        {
            const userInfo = { name: name, email: email };
            localStorage.setItem('chatai_user_info', JSON.stringify(userInfo));
            
            showChatInterface();
            
            if(elements.msgBox.children.length === 0)
            {
                addMessage(`Merhaba ${name}! Size nasıl yardımcı olabilirim?`, 'bot');
            }
        } else {
            alert("Lütfen isim ve e-posta alanlarını doldurun.");
        }
    });

    function showChatInterface()
    {
        elements.leadForm.style.display = 'none';
        elements.msgWrapper.style.display = 'flex';
        elements.inputBox.style.display = 'flex';
    }

    // Add message
    function addMessage(text, sender)
    {
        // Check sender
        const isUser = sender === 'user';
        
        // Line
        const row = document.createElement('div');
        row.className = `message-row ${isUser ? 'user-row' : 'bot-row'}`;

        // Avatar
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.style.backgroundImage = `url('${isUser ? userAvatarURL : botAvatarURL}')`;

        // Ballon
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerText = text;

        row.appendChild(avatar);
        row.appendChild(bubble);
        elements.msgBox.appendChild(row);

        // Scroll system
        if(isUser || isNearBottom())
        {
            scrollToBottom(true);
        } else {
            showUnreadBadge();
        }
    }

    // Scroll & New Message
    function isNearBottom()
    {
        const threshold = 100;
        const position = elements.msgBox.scrollTop + elements.msgBox.clientHeight;
        const height = elements.msgBox.scrollHeight;
        return position >= height - threshold;
    }

    function scrollToBottom(force = false)
    {
        elements.msgBox.scrollTo({
            top: elements.msgBox.scrollHeight,
            behavior: 'smooth'
        });
        hideUnreadBadge();
    }

    function showUnreadBadge()
    {
        elements.scrollBtn.classList.remove('hidden');
        elements.badge.style.display = 'block';
    }

    function hideUnreadBadge()
    {
        elements.badge.style.display = 'none';
    }

    elements.msgBox.addEventListener('scroll', function()
    {
        if(isNearBottom())
        {
            elements.scrollBtn.classList.add('hidden');
            hideUnreadBadge();
        } else {
            elements.scrollBtn.classList.remove('hidden');
        }
    });

    elements.scrollBtn.addEventListener('click', () => scrollToBottom(true));


    // Message Sent
    function handleSend()
    {
        const text = elements.input.value.trim();
        if(!text) return;

        addMessage(text, 'user');
        elements.input.value = '';

        // API Test
        fetch('/wp-json/chatai/v1/test')
            .then(res => res.json())
            .then(data => {
                addMessage(data.message, 'bot');
            })
            .catch(err => {
                addMessage("Bağlantı hatası!", 'bot');
            });
    }

    elements.sendBtn.addEventListener('click', handleSend);
    elements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

});