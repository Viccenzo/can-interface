var can = require('socketcan');
var mqtt = require('mqtt');
var cmd = require('node-cmd');

var fs = require('fs');

// System variables

var error = null;

// Can Variables -------
var discard;
var msgAvail = 0;

// 0x186455F4
var power;
var warning;
var ver_bms;

// 0x186555F4
var soc;
var current;
var vpack;

// 0x186655F4
var temp4
var temp3
var temp2
var temp1

// 0x186755F4
var temp8;
var temp7;
var temp6;
var temp5;

// 0x186955F4
var minvolt;
var maxvolt;
var mintemp;
var maxtemp;

// 0x186b55F4
var v4;
var v3;
var v2;
var v1;

// 0x186c55F4
var v8;
var v7;
var v6;
var v5;

// 0x186d55F4
var v12
var v11
var v10
var v9

// 0x186e55F4
var v16;
var v15;
var v14;
var v13;

// Json msg

var upMsg;

// Sistem Var

const custoKwhFP = 0.3;
const custoKwhP = 1.2;

// file load

var data;
/*
try{
  data = fs.readFileSync('./config.json');
  try {
    let myObj = JSON.parse(data);
    console.log("Config file loaded");
    console.dir(myObj);
    valueEnergyBuy = myObj.ValueEnergyBuy;
    valueEnergySell = myObj.ValueEnergySell;
    energyBuy = myObj.EnergyBuy;
    energySell = myObj.EnergySell;
    THINGSBOARD_HOST = myObj.ThingsboardHost;
    ACCESS_TOKEN = myObj.AccessToken;
  }
  catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
  }
}
catch(err){
  console.log("Complete config file with mqtt parameters");
  let config = '{"ValueEnergyBuy":0.14831024999999898,"ValueEnergySell":0.3625647499999992,"EnergyBuy":0,"EnergySell":0,"ThingsboardHost":"demo.thingsboard.io","AccessToken":"Change!"}';
  fs.writeFile('./config.json', config , function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}
*/
// EDP thingsboard info override
const THINGSBOARD_HOST = "demo.thingsboard.io";
const ACCESS_TOKEN = "AAh3rTnWHD5cDXJoHpDh";
let valueEnergyBuy = 0;
let valueEnergySell = 0;
let energyBuy = 0;
let energySell = 0;
// create can chanell
var channel = can.createRawChannel("can0", true);

// create mqtt client
var client = mqtt.connect('mqtt://'+THINGSBOARD_HOST,{username: ACCESS_TOKEN});

function can_msg(msg){
  msgAvail = 1;
  if(msg.id == 0x186455F4){ //Power,Warning,VersaoBMS
    power = msg.data[6] | msg.data[7] << 8;
    warning = msg.data[4] | msg.data[5] << 8;
    discard = msg.data[2] | msg.data[3] << 8;
    ver_bms = msg.data[0] | msg.data[1] << 8;
    if(power & 0x8000){
      power = power | 0xffff0000;
    }
    if(power<=50 && power>=-50){
      power = 0;
    }
    power = -power;
    //console.log(power);
  }
  if(msg.id == 0x186555F4){ //SoC,Current,Current,Vpack
    soc = Math.round(msg.data[6] | msg.data[7] << 8);
    current = msg.data[4] | msg.data[5] << 8;
    discard = msg.data[2] | msg.data[3] << 8;
    vpack = (msg.data[0] | msg.data[1] << 8)/10;
    if(current & 0x8000){
      current = current | 0xffff0000;
    }
    //console.log(current);
  }
  if(msg.id == 0x186655F4){ //SoC,Current,Current,Vpack
    temp4 = msg.data[6] | msg.data[7] << 8;
    temp3 = msg.data[4] | msg.data[5] << 8;
    temp2 = msg.data[2] | msg.data[3] << 8;
    temp1 = msg.data[0] | msg.data[1] << 8;
  }
  if(msg.id == 0x186755F4){ //SoC,Current,Current,Vpack
    temp8 = msg.data[6] | msg.data[7] << 8;
    temp7 = msg.data[4] | msg.data[5] << 8;
    temp6 = msg.data[2] | msg.data[3] << 8;
    temp5 = msg.data[0] | msg.data[1] << 8;
  }
  if(msg.id == 0x186955F4){ //SoC,Current,Current,Vpack
    minvolt = (msg.data[6] | msg.data[7] << 8)/1000;
    maxvolt = (msg.data[4] | msg.data[5] << 8)/1000;
    mintemp = msg.data[2] | msg.data[3] << 8;
    maxtemp = msg.data[0] | msg.data[1] << 8;
    if(maxtemp > 2000){
      mintemp = -20;
      maxtemp = -20;
    }
  }
  if(msg.id == 0x186b55F4){ //SoC,Current,Current,Vpack
    v4 = msg.data[6] | msg.data[7] << 8;
    v3 = msg.data[4] | msg.data[5] << 8;
    v2 = msg.data[2] | msg.data[3] << 8;
    v1 = msg.data[0] | msg.data[1] << 8;
  }
  if(msg.id == 0x186c55F4){ //SoC,Current,Current,Vpack
    v8 = msg.data[6] | msg.data[7] << 8;
    v7 = msg.data[4] | msg.data[5] << 8;
    v6 = msg.data[2] | msg.data[3] << 8;
    v5 = msg.data[0] | msg.data[1] << 8;
  }
  if(msg.id == 0x186d55F4){ //SoC,Current,Current,Vpack
    v12 = msg.data[6] | msg.data[7] << 8;
    v11 = msg.data[4] | msg.data[5] << 8;
    v10 = msg.data[2] | msg.data[3] << 8;
    v9 = msg.data[0] | msg.data[1] << 8;
  }
  if(msg.id == 0x186e55F4){ //SoC,Current,Current,Vpack
    v16 = msg.data[6] | msg.data[7] << 8;
    v15 = msg.data[4] | msg.data[5] << 8;
    v14 = msg.data[2] | msg.data[3] << 8;
    v13 = msg.data[0] | msg.data[1] << 8;
  }
  //console.log(power);
  upMsg = '{"Power":' + power + ',' +
          '"SoC":' + soc + ',' +
          '"Pack Voltage":' + vpack + ',' +
          '"Min Voltage":' + minvolt + ',' +
          '"Max Voltage":' + maxvolt + ',' +
          '"Min Temperature":' + mintemp + ',' +
          '"Max Temperature":' + maxtemp + ',' +
          '"Voltage 1":' + v1 + ',' +
          '"Voltage 2":' + v2 + ',' +
          '"Voltage 3":' + v3 + ',' +
          '"Voltage 4":' + v4 + ',' +
          '"Voltage 5":' + v5 + ',' +
          '"Voltage 6":' + v6 + ',' +
          '"Voltage 7":' + v7 + ',' +
          '"Voltage 8":' + v8 + ',' +
          '"Voltage 9":' + v9 + ',' +
          '"Voltage 10":' + v10 + ',' +
          '"Voltage 11":' + v11 + ',' +
          '"Voltage 12":' + v12 + ',' +
          '"Voltage 13":' + v13 + ',' +
          '"Voltage 14":' + v14 + ',' +
          '"Voltage 15":' + v15 + ',' +
          '"Voltage 16":' + v16 + ',' +
          '"latitude": -27.430775,' +
          '"longitude": -48.441352,';
}

//client.on('connect', function () {
//});

// every 1 sec
function upStream(){
  //Price and Power algorithms
  let d = new Date();
  if (d.getHours() >= 18 && d.getHours() <= 21){
    if(power<0){
      valueEnergyBuy = valueEnergyBuy - power*custoKwhP/(1000*3600)   // 4 -> dt = 0.25s
    }else{
      valueEnergySell = valueEnergySell + power*custoKwhP/(1000*3600) // 4 -> dt = 0.25s
    }
    valor = "caro";
  }else{
    if(power<0){
      valueEnergyBuy = valueEnergyBuy - power*custoKwhFP/(1000*3600)   // 4 -> dt = 0.25s
    }else{
      valueEnergySell = valueEnergySell + power*custoKwhFP/(1000*3600) // 4 -> dt = 0.25s
    }
    valor = "barato";
  }
  // adding price to msg
  upMsg = upMsg + '"saving":' + (valueEnergySell - valueEnergyBuy) + '}';
  let myOptions = {
    ValueEnergyBuy: valueEnergyBuy,
    ValueEnergySell: valueEnergySell,
    EnergyBuy: energyBuy,
    EnergySell: energySell,
    ThingsboardHost: THINGSBOARD_HOST,
    AccessToken: ACCESS_TOKEN
  };
  // Storing persistent info
  data = JSON.stringify(myOptions);
  fs.writeFile('./config.json', data, function (err) {
    if (err) {
      console.log('There has been an error saving your configuration data.');
      console.log(err.message);
      return;
    }
    console.log('Configuration saved successfully.')
  });
  // Sending mqtt msg
  if(msgAvail!=0 && error == null){
    let d = new Date();
    //console.log(power*custoKwhP/(1000*3600));
    client.publish('v1/devices/me/telemetry',  upMsg);
    console.log(upMsg);
  }
  msgAvail = 0;
}
try{
  console.log('Connecting to: %s using access token: %s', THINGSBOARD_HOST, ACCESS_TOKEN);
}catch(err){
  error = "Mqtt conection problem";
  console.log('Verifique os parametros do mqtt');
}
// can msg listener function
channel.addListener("onMessage", function(msg){can_msg(msg)});

// Starting can channel
cmd.get('sudo ifdown can0');
cmd.get('sudo ifup can0');
cmd.get('sudo ip link set can0 up type can bitrate 125000');
channel.start();

// define periodic function
setInterval(upStream,1000);
