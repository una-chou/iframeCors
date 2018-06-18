
var mainOrigin = "*";

// $("#fruit_type").change(function(){    
//         parent.postMessage( ("设备改变:" + $('#fruit_type').val()), mainOrigin );
// })

// (function Matrix () {
    var screen = window.screen,
        width = canvasMatrix.width = screen.width - 280,
        height = canvasMatrix.height = screen.height - 40,
        yPositions = Array(300).join(0).split("");
        ctx = canvasMatrix.getContext("2d");
    var draw = function(){
        ctx.fillStyle = "rgba(0,0,0,.05)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "green";
        ctx.font = "10pt Georgia";
        yPositions.map(function(y, i){
            var text = String.fromCharCode(1e2 + Math.random() * 330);
            x = (i * 10) + 10;
            ctx.fillText(text, x, y);
            if (y > Math.random()*1e4) {
                yPositions[i] = 0;
            } else {
                yPositions[i] = y + 10;
            }
        });
    }
    function runMatrix(){
        gameStart = setInterval(draw, 33);
    }

// })();

$("#bounceBox").click(function(){
    parent.postMessage( "爆破盒:", mainOrigin );
})

//event 参数中有 data 属性，就是父窗口发送过来的数据
window.addEventListener("message", function( event ) { 
    // 把父窗口发送过来的数据显示在子窗口中
    if ( event.data.split(":")[0] == "代码雨" ) {
        $("#btnGroups").hide();
        $("#matrix").show();
        gameStart = setInterval(draw, 33);
        setTimeout(function(){
            clearInterval(gameStart);
            $("#matrix").hide();
            $("#btnGroups").show();
        }, 6000)
    } else if ( event.data.split(":")[0] == "" ) {
        
    } 
    
}, false ); 



// 图像预览 websocket
var ws;
var lockReconnect = false;//避免重复连接

// 是否是注册返回消息时 调用, 如果注册成功 值为true 那么就不会执行重连
var flag;

// 图片
var img = "";

function createWebSocket(url) {
    flag = true;
    try {
        ws = new WebSocket(url);
        initEventHandle();
    } catch (e) {
        reconnect(url);
    }     
}

function initEventHandle() {
    ws.onclose = function (event) {
        if(flag) reconnect(wsUrl);       
    };
    ws.onerror = function (event) {
        if(flag) reconnect(wsUrl);      
    };
    ws.onopen = function () {
        //心跳检测重置
        heartCheck.reset().start();
    };
    ws.onmessage = function (event) {
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        heartCheck.reset().start();

        var data = JSON.parse(event.data);

        if(data.image !== "") img = data.image;

        if(img == ""){
            $('#image').attr('src', './images/480x270.png') ;
        }else {
            $('#image').attr('src', 'data:image/png;base64,' + img) ;
        }

    }
}

function reconnect(url) {

    var repeat = 5;  // 限制执行次数为5次
    var timer;
    if(ws.readyState == 3){
        if(lockReconnect) return;
        lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        //setTimeout(function () {
        //    createWebSocket(url);
        //    lockReconnect = false;
        //}, 500);

        timer = setInterval(function () {
            if (repeat == 0) {
                clearInterval(timer);
                flag = false;
                isInitEquip = true;
                $('#image').attr('src', './images/480x270.png');
                ws.send('{\"token\":\"\", \"code\": \"0\"}');
                ws.onclose();
                ws.close();
            } else {
                repeat--;
                createWebSocket(url);
                lockReconnect = false;
            }
        }, 500);
    }
}

    
//心跳检测
var heartCheck = {
    timeout: 1000,//1秒
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            // 0=结束，1=开始
            if (ws.readyState !== 3) {
                ws.send('{\"token\":\"' + equipTooken + '\", \"code\": \"1\"}');
            }
            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                ws.onclose();
                ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}



