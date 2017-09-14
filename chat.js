var clients = [];

exports.subscribe = function (req, res) {
  clients.push(res);
    res.on('close', function () {
        clients.splice(clients.indexOf(res), 1)
    })
};

exports.publish = function (message) {
  console.log("publish '%s'", message);

  clients.forEach(function (res) {
    res.end(message);
  });

  clients = [];
}

// users
setInterval(() => {
  console.log('clients in chat: ', clients.length)
}, 3000)
