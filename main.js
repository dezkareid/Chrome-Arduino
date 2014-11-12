const serial = chrome.serial;
serial.getDevices(getPorts);
var conectionID = -1;
var recognition ;

function getPorts(ports) {
  // get drop-down port selector
  var dropDown = document.querySelector('#port_list');
  // clear existing options
  dropDown.innerHTML = "";
  // add new options
  ports.forEach(function (port) {
    var displayName = port["displayName"] + "("+port.path+")";
    if (!displayName) displayName = port.path;
    
    var newOption = document.createElement("option");
    newOption.text = displayName;
    newOption.value = port.path;
    dropDown.appendChild(newOption);
  });
}

document.querySelector('#connect_button').addEventListener('click',conecta);

function conecta(){
	 // get the device to connect to
  var dropDown = document.querySelector('#port_list');
  var devicePath = dropDown.options[dropDown.selectedIndex].value;
  // connect
  console.log("Connecting to "+devicePath);
    serial.connect(devicePath, asignaID);
    escucha();
}

function asignaID (connectionInfo) {
	 if (!connectionInfo) {
    console.log("Connection failed.");
    return;
  }
  conectionID = connectionInfo.connectionId;
}

var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
};

/* Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. */
var str2ab = function(str) {
  var encodedString = unescape(encodeURIComponent(str));
  var bytes = new Uint8Array(encodedString.length);
  for (var i = 0; i < encodedString.length; ++i) {
    bytes[i] = encodedString.charCodeAt(i);
  }
  return bytes.buffer;
};

function envia (msg) {
	serial.send(conectionID, str2ab(msg), function() {});
}





function escucha () {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.onresult = function (event) {

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
          
      	  if(event.results[i][0].transcript.trim()=="encender"){
      	  	envia("e");
      	  }else{

      	  if(event.results[i][0].transcript.trim()=="apagar"){
      	  	envia("a");
      	  }

      	  }
      	  console.log(event.results[i][0].transcript.trim());
      }
    }
  }

  recognition.onend = function() { console.log("Termine"); };
  recognition.start();

}
