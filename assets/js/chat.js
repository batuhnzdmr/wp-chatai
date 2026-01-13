document.addEventListener('DOMContentLoaded', function()
{
    
    // --- 1. Değişkenleri Tanımla ---
    const chatButton = document.getElementById('toggle-chat-box');
    const chatWindow = document.getElementById('chat-box');
    const closeButton = document.querySelector('.chat-close-button');
    const sendButton = document.getElementById('chat-submit-button');
    const chatInput = document.getElementById('chat-input');
    const messageArea = document.getElementById('chat-message-box');

    // --- 2. Açma / Kapama Fonksiyonu ---
    function toggleChat() {
        if (chatWindow.style.display === 'flex') {
            chatWindow.style.display = 'none';
            chatButton.style.display = 'flex';
        } else {
            chatWindow.style.display = 'flex';
            chatButton.style.display = 'none';
        }
    }

    // Olay Dinleyicileri (Click Events)
    chatButton.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', toggleChat);

    // --- 3. Mesaj Gönderme Fonksiyonu (SENİN MANTIĞIN BURADA) ---
    function sendMessage() {
        const messageText = chatInput.value.trim();
        
        if (messageText === "") return;

        // A) Kullanıcının mesajını ekrana bas
        addMessageToUI(messageText, 'user-message');
        
        // Inputu temizle
        chatInput.value = "";
        scrollToBottom();

        // B) Backend'e Bağlan (Senin Fetch Kodunun Vanilla JS Hali)
        // Not: Gerçek senaryoda burası POST isteği olmalı ve mesajı göndermeli.
        // Şimdilik senin test endpoint'ine GET atıyoruz.
        
        fetch('/wp-json/chatai/v1/test') 
            .then(response => response.json())
            .then(data => {
                // API'den gelen cevabı ekrana bas
                addMessageToUI(data.message, 'bot-message');
                scrollToBottom();
            })
            .catch(error => {
                console.error('Hata:', error);
                addMessageToUI("Bir hata oluştu, bağlantı kurulamadı.", 'bot-message');
            });
    }

    // --- 4. Yardımcı Fonksiyonlar ---
    
    // Ekrana mesaj kutusu ekler
    function addMessageToUI(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        msgDiv.innerText = text; // Güvenlik için innerHTML yerine innerText
        messageArea.appendChild(msgDiv);
    }

    // Sohbeti en aşağı kaydırır
    function scrollToBottom() {
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // --- 5. Tıklama ve Enter Tuşu Tanımları ---
    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

});