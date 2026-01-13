jQuery(document).ready(function($)
{
    // Chatbox aç/kapa düğmesi oluştur
    $('body').append('<button id="chatai-toggle-btn">💬</button>');
    $('body').append(`
        <div id="chatai-widget">
            <div id="chatai-widget-header">ChatAI</div>
            <div id="chatai-widget-messages"></div>
            <div id="chatai-widget-input">
                <input type="text" id="chatai-input" placeholder="Mesajınızı yazın..."/>
                <button id="chatai-send">Gönder</button>
            </div>
        </div>
    `);

    // Aç/kapa
    $('#chatai-toggle-btn, #chatai-widget-header').on('click', function()
    {
        $('#chatai-widget').toggle();
    });

    // Mesaj gönderme
    $('#chatai-send').on('click', function()
    {
        let msg = $('#chatai-input').val();
        if(msg.trim() === '') return;

        $('#chatai-widget-messages').append('<div><b>Sen:</b> '+msg+'</div>');
        $('#chatai-input').val('');

        // API çağrısı (şimdilik test endpoint)
        fetch('/wp-json/chatai/v1/test')
            .then(res => res.json())
            .then(data => {
                $('#chatai-widget-messages').append('<div><b>ChatAI:</b> '+data.message+'</div>');
                $('#chatai-widget-messages').scrollTop($('#chatai-widget-messages')[0].scrollHeight);
            });
    });

    // Enter tuşu ile gönder
    $('#chatai-input').keypress(function(e)
    {
        if(e.which == 13) $('#chatai-send').click();
    });
});
