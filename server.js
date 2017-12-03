const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const moment = require('moment');
const path = require('path');
const iotHubClient = require('./IoTHub/iot-hub.js');
const app = express();
var azure = require('azure-storage');


 var tableService = azure.createTableService('ocsql','DefaultEndpointsProtocol=https;AccountName=ocsql;AccountKey=0mhUBdt5OWZ6pQ9scedjiSkmmaOYa3PEzqjysB5SB2IdD8qjgEzj3GyuqEAEhySkkV74G3AJ17gkFEAKnWj3Bg==;EndpointSuffix=core.windows.net');
// tableService.createTableIfNotExists('mytable', function(error, result, response){
//     if(!error){

//     }
// });
// var entGen = azure.TableUtilities.entityGenerator;
// var task = {
//   PartitionKey: entGen.String('hometasks'),
//   RowKey: entGen.String('1'),
//   description: entGen.String('take out the trash'),
//   dueDate: entGen.DateTime(new Date(Date.UTC(2015, 6, 20))),
// };
// tableSvc.insertEntity('mytable',task, function (error, result, response) {
//   if(!error){
//     // Entity inserted
//   }
// });


app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res/*, next*/) {
  res.redirect('/');
});
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        console.log('sending data ' + data);
        client.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
};
var iotHubReader = new iotHubClient(process.env['Azure.IoT.IoTHub.ConnectionString'], process.env['Azure.IoT.IoTHub.ConsumerGroup']);
iotHubReader.startReadMessage(function (obj, date) {
  try {
    console.log(date);
    date = date || Date.now()
    wss.broadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
  } catch (err) {
    console.log(obj);
    console.error(err);
  }
});

var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
