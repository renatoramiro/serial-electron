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

document.getElementById('selectPort').addEventListener('change', function () {
  document.getElementById('code').disabled = true;
  document.getElementById('saveData').disabled = true;
});

document.getElementById("checkPort").addEventListener('click', function() {
  var select = document.getElementById('selectPort');
  document.getElementById('error').style.visibility = 'hidden';
  document.getElementById('success').style.visibility = 'hidden';
  checkPort(select.value);
});

document.getElementById("saveData").addEventListener('click', function() {
  document.getElementById('error').style.visibility = 'hidden';
  document.getElementById('success').style.visibility = 'hidden';

  var select = document.getElementById('selectPort');
  var input = document.getElementById('code');
  console.log(select.value, code.value);
  
  saveData(select.value, input.value);
});

function checkPort(port) {
  var port = new serialport(port, { autoOpen: false });
 
  port.open(function (err) {
    if (err) {
      document.getElementById('error').style.visibility = 'visible';
      document.getElementById('error').textContent = err.message + " (" + new Date() + ")";
      return;
    }
  
    // Because there's no callback to write, write errors will be emitted on the port:
    port.write('ping');

    port.on('readable', function () {
      if (port.read() == "Ok pong!") {
        document.getElementById('success').style.visibility = 'visible';
        document.getElementById('success').textContent = "Conexão realizada com sucesso!";

        document.getElementById('code').disabled = false;
        document.getElementById('saveData').disabled = false;
      }
      console.log('Data Check:', port.read());
    });
  });
}

function saveData(port, code) {
  var port = new serialport(port, { autoOpen: false });
 
  port.open(function (err) {
    if (err) {
      document.getElementById('error').style.visibility = 'visible';
      document.getElementById('error').textContent = err.message + " (" + new Date() + ")";

      document.getElementById('code').value = "";

      document.getElementById('code').disabled = true;
      document.getElementById('saveData').disabled = true;

      return;
    }
  
    // Because there's no callback to write, write errors will be emitted on the port:
    port.write('code:' + code);

    port.on('readable', function () {
      if (port.read() == "Ok saved!") {
        document.getElementById('success').style.visibility = 'visible';
        document.getElementById('success').textContent = "Código salvo com sucesso";

        document.getElementById('code').disabled = false;
        document.getElementById('saveData').disabled = false;
      }
      console.log('Data Saved:', port.read());
    });
  });

}
