var net = require('net');
const HOST = '127.0.0.1';
const PORT = 8888;
var client = net.Socket();

client.connect(PORT, HOST, function(){
   console.log('connect success.');
   client.write('connect success.');//服务器向客户端发送消息
});

//监听服务器端发过来的数据
client.on('data', function(data){
   console.log('received: ', data.toString());
});