
  $(document).ready(function(){

          $(".icon-speech").click(function(){
              console.log("hello")
            $(".chat-container").show("slow");

          });

      $("#close").click(function(){

           $(".chat-logo").show("fast");
           $(".chat-container").hide("slow");
         });
    $('.send_message').click(function (e) {
        console.log("inside send_message")
        console.log("Ashok")
        msg = getMessageText();
        if(msg){
        showUserMessage(msg);
        sayToBot(msg);
    $('.message_input').val('');}
});

        $("#msg_input").keypress(function(e) {
            console.log(e.which)

            if(e.which == 13) {
                 console.log("inside send_message")
        console.log("Ashok")
        msg = getMessageText();
        if(msg){
        showUserMessage(msg);
        sayToBot(msg);
             $('.message_input').val('');}
            }
        });


  })


BotMessage = function (arg) {
    console.log("In BotMessage")
    this.text = arg.text[0]["text"], this.message_side = arg.message_side;
    console.log(this.text);
    if(arg.text[0]["buttons"]!=null){ //check buttons
        this.buttons = arg.text[0]["buttons"];
        console.log("Response has Buttons");
    } else {
        this.buttons = null;
        console.log("No buttons");
    }
    console.log(arg.text)
    if(arg.text[0]["attachment"]!=null){ //check attachments
        this.attachment = arg.text[0]["attachment"];
        console.log("Response has attachment");
    } else {
        this.attachment = null;
        console.log("No attachment");
    }

    this.draw = function (_this) {
        return function () {
            var $botMessage;
            $botMessage = $($('#admin_message_block').clone().html());
            if(_this.attachment!=null)
            {
              console.log(_this.attachment.length)
              if(_this.attachment.length>10)
              {
                for(index = 0; index < _this.attachment.length; index++)
                {
                    if(index%2==0){
                    buttonHtml = '<button style="margin-top:5px;text-transform:capitalize" class="tag col" id=btn'+index+' onclick=\'sendButtonResponse("'+_this.attachment[index]+'")\' >'+_this.attachment[index]+'</button> ';
                    $botMessage.addClass(_this.message_side).find('.buttons').append(buttonHtml);
                    }
                    else
                    {
                      buttonHtml = '<button style="margin-top:5px;text-transform:capitalize" class="tag col-6" id=btn'+index+' onclick=\'sendButtonResponse("'+_this.attachment[index]+'")\' >'+_this.attachment[index]+'</button> ';
                    $botMessage.addClass(_this.message_side).find('.buttons').append(buttonHtml);
                    }
                    $botMessage.addClass(_this.message_side).find('.text').html(addBr("Can you select the process name ?"));
                }
              }
              else
              {
                mylist =_this.attachment;
                table = buildHtmlTable(mylist); // top 5 results
                console.log(table);
                $botMessage.find('#tablehere').append(table);
              }
            }
            else if(_this.buttons!=null) { // response buttons (w/ payload) + (to add icon feature)
                for(var i=0; i< this.buttons.length; i++) {
                    var btn = this.buttons[i];
                      buttonHtml = '<button style="margin-top:5px;text-transform:capitalize" class="tag col" id=btn'+i+' onclick=\'sendButtonResponse("'+btn.payload+'")\' >'+btn.title+'</button> ';
                      $botMessage.addClass(_this.message_side).find('.buttons').append(buttonHtml);
                      $botMessage.addClass(_this.message_side).find('.text').html(addBr(_this.text));
                }
            }
            else // normal text response
            {
                $botMessage.find('.box1').html(addBr(_this.text));
            }
            $('.messages').append($botMessage);
            return setTimeout(function () {
                return $botMessage.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
};

getMessageText = function () {
            console.log("In getMessageText")
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };



function showUserMessage(msg){
        console.log("In showUserMessage")
        $messages = $('.messages');
        message = new Message({
            text: msg,
            message_side: 'right'
        });
        message.draw();
         $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        $('#msg_input').val('');
}

function addBr(text){
    console.log(text);
    return text.replace(/\\n/g, "<br />");
    // return text.split("\n").join("\\<br />");

}

var Message;
Message = function (arg) {
    console.log('inside Message');
    console.log(arg);
    table_title = arg;
    this.text = arg.text, this.message_side = arg.message_side;
    this.draw = function (_this) {
        return function () {
            var $message;
            //$message = $($('.message_template').clone().html());  //
//user_message_block
            $message = $($('#user_message_block').clone().html());

            //$message.addClass(_this.message_side).find('.text').html(addBr(_this.text));
            $message.find('.box1').html(addBr(_this.text));
            $('.messages').append($message);
            return setTimeout(function () {

                return $message.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
};
function sayToBot(text){ //for default messages to be sent to action server
    console.log("In sayToBot")
    console.log(text)
    var rawText = "test market"
    document.getElementById("msg_input").placeholder = "Type your messages here..."
    $.get("/chat", { msg: rawText }).done(function(jsondata, status){
                if(jsondata["status"]=="success"){
                    response=jsondata["response"];
                    if(response){
                        console.log(response);
                        showBotMessage(response);
                    }
                }
            });
}


function showBotMessage(msg){
        console.log("In showBotMessage")
        console.log(msg.length)
        for(i=0;i<msg.length;i++)
        {
          console.log([msg[i]])
          message = new BotMessage({
               text: [msg[i]],
               message_side: 'left'
          });
          message.draw();
          $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        }
}
