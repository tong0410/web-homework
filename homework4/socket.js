var net = require('net');
const PORT = 8888;
const HOST = '127.0.0.1';


var inline = function(socket){
    socket.on('data', function dataHandler(data) {//data是客户端发送给服务器的数据
    console.log(socket.remoteAddress, socket.remotePort, 'send', data.toString());
    socket.write('server received\n');
  });

    //连接断开
    socket.on('close', function(){
    console.log(socket.remoteAddress, socket.remotePort, 'no connection');
    })
};

var start = net.createServer(inline);

start.listen(PORT, HOST);
console.log('tcp server running on tcp://', HOST, ':', PORT);