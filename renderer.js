// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const serialport = require('serialport')
const createTable = require('data-table')

serialport.list((err, ports) => {
  console.log('ports', ports);
  
  if (err) {
    document.getElementById('error').textContent = err.message
    return
  } else {
    document.getElementById('error').textContent = ''
  }

  if (ports.length === 0) {
    document.getElementById('error').textContent = 'No ports discovered'
  }

  var select = document.getElementById('selectPort');

  for (const index in ports) {
    var option = document.createElement('option');
    option.setAttribute('value', ports[index].comName);
    option.appendChild(document.createTextNode(ports[index].comName));
    select.appendChild(option);
  }


});

function checkPort(port) {
  var port = new SerialPort(port, { autoOpen: false });
 
  port.open(function (err) {
    if (err) {
      return console.log('Error opening port: ', err.message);
    }
  
    // Because there's no callback to write, write errors will be emitted on the port:
    port.write('main screen turn on');

    port.on('readable', function () {
      console.log('Data:', port.read());
    });
  });

}
