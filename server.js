var http = require('http');
var fs = require('fs');
var chat = require('./chat')

http.createServer(function (req, res) {
  switch (req.url) {
    case '/':
      sendFile('chat.html', res);
      break;
    case '/subscribe':
      chat.subscribe(req, res);
      break;
    case '/publish':
      var body = '';
      req
          .on('readable', () => {
              var data = req.read();
              if (data) body += data
              if (body.length > 1e4) {
              res.statusCode = 413;
              res.end('Your message is too big for my little chat');
            }
          })
          .on('end', () => {
            try {
              body = JSON.parse(body);
            } catch (e) {
              res.statusCode = 400;
              res.end('Very Bad Request');
              return
            }
            chat.publish(body.message);
            res.end('ok');
          });
      break;
    default:
      res.statusCode = 404;
      res.end('Not found');
  }
}).listen(3000);

function sendFile(fileName, res) {
  var fileStream = fs.createReadStream(fileName);
  fileStream
      .on('error', function () {
        res.statusCode = 500;
        res.end('Server error');
      })
      .pipe(res)
}
