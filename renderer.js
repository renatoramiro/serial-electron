// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const serialport = require('serialport');
let portSerial;

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

if (portSerial) {
  portSerial.on('open', function () {
    console.log("Opened");
    portSerial.write('ping');
  });

  portSerial.on('error', function (err) {
    console.log("Error: " + err.message);
  });

  portSerial.on('data', function (data) {
    if (data.toString() == "Ok pong!") {
      document.getElementById('success').style.visibility = 'visible';
      document.getElementById('success').textContent = "Conexão realizada com sucesso!";
  
      document.getElementById('code').disabled = false;
      document.getElementById('saveData').disabled = false;
  
      console.log('Data Check:', data.toString());
    }
  
    if (data.toString() == "Ok saved!") {
      document.getElementById('success').style.visibility = 'visible';
      document.getElementById('success').textContent = "Código salvo com sucesso";
  
      document.getElementById('code').disabled = false;
      document.getElementById('saveData').disabled = false;
  
      console.log('Data Saved:', data.toString());
    }
  });
}

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
  
  saveData(select.value, input.value);
});

function checkPort(port) {
  portSerial = new serialport(port, { baudRate: 9600 }, function (err) {
    document.getElementById('error').style.visibility = 'visible';
    document.getElementById('error').textContent = err.message + " (" + new Date() + ")";
    return;
  });
}

function saveData(port, code) {
  console.log(portSerial);
  portSerial.write('code:' + code);
}
