var can = require('socketcan');
var mqtt = require('mqtt');
var cmd = require('node-cmd');
var figlet = require('figlet');
const readline = require('readline');

var fs = require('fs');
const { resolve } = require('path');

// System variables

var error = null;

// Can Variables -------
var data = {};
data.voltage = {};
data.temp = {};

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
var t4 = -100;
var t3 = -100;
var t2 = -100;
var t1 = -100;

// 0x186755F4
var t8 = -100;
var t7 = -100;
var t6 = -100;
var t5 = -100;

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

// BMS configuration variables

var numberOfChannels;
var numberOfThermistors;
var overVoltage;
var underVoltage;
var shortCircuit;
var overCurrent;
var overTemperature;
var gainCurrentSense;
var deltaVoltage;
var lowVoltage;
var highVoltage;
var canChargeVoltage;
var chargedVoltage;
var overVoltageHisteresys;
var delayHisteresys;
var balance;

// Console read variable

var op;

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
//const THINGSBOARD_HOST = "demo.thingsboard.io";
//const ACCESS_TOKEN = "RrDCEfZ8C6W0Rt24q9eQ";
//let valueEnergyBuy = 0;
//let valueEnergySell = 0;
//let energyBuy = 0;
//let energySell = 0;


// create mqtt client
//var client = mqtt.connect('mqtt://'+THINGSBOARD_HOST,{username: ACCESS_TOKEN});


/*
try{
  console.log('Connecting to: %s using access token: %s', THINGSBOARD_HOST, ACCESS_TOKEN);
}catch(err){
  error = "Mqtt conection problem";
  console.log('Verifique os parametros do mqtt');
}
*/


// write ap function
async function menuWrite(){
  return new Promise((resolve,reject) => {
    figlet('Atlas Power', function(err, data) {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
      resolve();
    });
  })
  .then(() =>{
    console.log("*-----------------------------------------------*");
    console.log("\n");
    console.log("Welcome to Atlas Power BMS can interface CLI. Navigate through the options using your Keyboard. (Do you need help? Use --help option)");
    console.log("\n");
    console.log("*-----------------------------------------------*");
    console.log("\n");
    console.log("1 - Display BMS information");
    console.log("\n");
    console.log("2 - Send BMS configuration file");
    console.log("\n");
    console.log("3 - Create BMS configuration file");
    console.log("\n");
    resolve();
  })
  console.log("teste");
}

async function createConfigJSON(){
  console.log("teste");
  await form();
  resolve();
}

async function decision(){
  const promises = await Object.keys(myObject).map(async (k) => {
    switch (k) {
      case '1':
        op.close();
        console.log(1);
        infoDisplay();
        resolve();
      case '2':
        const secondPromise = await asyncCallNumber2()
        return secondPromise
      case '3':
        console.log(3);
        await createConfigJSON();
        resolve();

      default:
        return
    } 
  })
  const data = await Promise.all(promises)
  return data
/*
const data = await Promise.all(promises)
return data
  
  return new Promise ((resolve,reject)=>{
    op.question('Enter an option: ', (answer) => {
      // TODO: Log the answer in a database
      switch(answer){
        case "1":
          op.close();
          console.log(1);
          infoDisplay();
          resolve();
          break;
        case "2":
          console.log(2);
          resolve();
          break;
        case "3":
          console.log(3);
          await createConfigJSON();
          resolve();
          break;
      }
    });
  })  */
}



async function main() {
  op = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  console.clear();
  await menuWrite();
  await decision();
  main();
}

main();

// create can chanell
var channel = can.createRawChannel("can0", true);

/*
const cliWrite = 
  new Promise((resolve,reject) => {
    figlet('Atlas Power', function(err, data) {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data);
      resolve();
    });
  })
  .then(() =>{
    console.log("*-----------------------------------------------*");
    console.log("\n");
    console.log("Welcome to Atlas Power BMS can interface CLI. Navigate through the options using your Keyboard. (Do you need help? Use --help option)");
    console.log("\n");
    console.log("*-----------------------------------------------*");
    console.log("\n");
    console.log("1 - Display BMS information");
    console.log("\n");
    console.log("2 - Send BMS configuration file");
    console.log("\n");
    console.log("3 - Create BMS configuration file");
    console.log("\n");
    resolve();
  })
  .then(() =>{
    op.question('Enter an option: ', (answer) => {
      // TODO: Log the answer in a database
      switch(answer){
        case "1":
          op.close();
          console.log(1);
          infoDisplay();
          break;
        case "2":
          console.log(2);
          break;
        case "3":
          console.log(3);
          createConfigJSON();
          break;
      }
    });
  });



*/

// Variable input declaration 

const question1 = () => {
  return new Promise((resolve, reject) => {
    op.question('Number of cells in series: ', (answer) => {
      numberOfChannels = answer;
      //console.log(`Number in series: ${answer}`)
      resolve();
    })
  })
}
const question2 = () => {
  return new Promise((resolve, reject) => {
    op.question('Number of termistors: ', (answer) => {
      numberOfThermistors = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question3 = () => {
  return new Promise((resolve, reject) => {
    op.question('Over Voltage: ', (answer) => {
      overVoltage = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question4 = () => {
  return new Promise((resolve, reject) => {
    op.question('Under Voltage: ', (answer) => {
      underVoltage = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question5 = () => {
  return new Promise((resolve, reject) => {
    op.question('Short circuit current: ', (answer) => {
      shortCircuit = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question6 = () => {
  return new Promise((resolve, reject) => {
    op.question('Over current:  ', (answer) => {
      overCurrent = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question7 = () => {
  return new Promise((resolve, reject) => {
    op.question('Over temperature: ', (answer) => {
      overTemperature = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question8 = () => {
  return new Promise((resolve, reject) => {
    op.question('Current sensor gain: ', (answer) => {
      gainCurrentSense = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question9 = () => {
  return new Promise((resolve, reject) => {
    op.question('Max balance delta voltage: ', (answer) => {
      deltaVoltage = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question10 = () => {
  return new Promise((resolve, reject) => {
    op.question('Low voltage: ', (answer) => {
      lowVoltage = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question11 = () => {
  return new Promise((resolve, reject) => {
    op.question('High voltage: ', (answer) => {
      highVoltage = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question12 = () => {
  return new Promise((resolve, reject) => {
    op.question('Charge voltage enable: ', (answer) => {
      canChargeVoltage = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question13 = () => {
  return new Promise((resolve, reject) => {
    op.question('Charged voltage: ', (answer) => {
      chargedVoltage = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question14 = () => {
  return new Promise((resolve, reject) => {
    op.question('Over voltage histeresys ', (answer) => {
      overVoltageHisteresys = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question15 = () => {
  return new Promise((resolve, reject) => {
    op.question('Delay histeresys: ', (answer) => {
      delayHisteresys = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}
const question16 = () => {
  return new Promise((resolve, reject) => {
    op.question('Balance: ', (answer) => {
      balance = answer;
      //console.log(`Number of Thermistor: ${answer}`)
      resolve();
    })
  })
}

async function form(){
  await question1();
  await question2();
  await question3();
  await question4();
  await question5();
  await question6();
  await question7();
  await question8();
  await question9();
  await question10();
  await question11();
  await question12();
  await question13();
  await question14();
  await question15();
  await question16();
  resolve();
}

function infoDisplay(){

  // create can chanell
  var channel = can.createRawChannel("can0", true);

  // can msg listener function
  channel.addListener("onMessage", function(msg){can_msg(msg)});

  // Starting can channel
  const caninit = 
    new Promise((resolve,reject) => {
      //console.log("Closing any can instance");
      cmd.get('sudo ifdown can0');
      resolve();
    })
    .then(() =>{
      //console.log("Initializing can periferic");
      cmd.get('sudo ifup can0');
      resolve();
    })
    .then(() =>{
      //console.log("Configuring can interface");
      cmd.get('sudo ip link set can0 up type can bitrate 125000');
      resolve();
    })
    .then(() =>{
      //console.log("Starting can Channel");
      channel.start();
      resolve();
    })

  // define periodic function
  console.log("Starting program");
  let timeOut = setInterval(upStream,1000);

}

// Function Definitions:

// every 1 sec 
function upStream(){
  //console.table(data);
  console.clear();
  console.log("Press Enter to exit\/Precione Enter para sair.")
  console.table(data.main);
  console.table(data.temp);
  console.table(data.voltage);
  //console.log(upMsg);
  //let d = new Date();
  /*if(msgAvail!=0 && error == null){
    let d = new Date();
    client.publish('v1/devices/me/telemetry',  upMsg);
    
  }*/
  msgAvail = 0;
}

function can_msg(msg){
  msgAvail = 1;
  can4 = msg.data[6] | msg.data[7] << 8;
  can3 = msg.data[4] | msg.data[5] << 8;
  can2 = msg.data[2] | msg.data[3] << 8;
  can1 = msg.data[0] | msg.data[1] << 8;
  if(msg.id == 0x186455F4){ //Power,Warning,VersaoBMS
    power = can4;
    warning = can3;
    discard = can2;
    ver_bms = can1;
    if(power & 0x8000){
      power = power | 0xffff0000;
    }
    if(power<=50 && power>=-50){
      power = 0;
    }
    power = -power;
    data.main = {...data.main, power,warning,ver_bms}
    //mesma coisaque o de cima
    //data["power"] = power;
    //data["warning"] = warning;
    //data["ver_bms"] = ver_bms;
    //console.log(power);
  }
  if(msg.id == 0x186555F4){ //SoC,Current,Current,Vpack
    soc = Math.round(can4);
    current = can3;
    discard = can2;
    vpack = (can1)/10;
    if(current & 0x8000){
      current = current | 0xffff0000;
    }
    data.main = {...data.main, soc,current,vpack}
  }
  if(msg.id == 0x186955F4){ //SoC,Current,Current,Vpack
    minvolt = (can4)/1000;
    maxvolt = (can3)/1000;
    mintemp = can2;
    maxtemp = can1;
    if(maxtemp > 2000){
      mintemp = -20;
      maxtemp = -20;
    }
    data.main = {...data.main, minvolt,maxvolt,mintemp,maxtemp}
  }
  // Temperatures s1
  if(msg.id == 0x18AC55F4){
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s1 = {...data.temp.s1,t1,t2,t3,t4};
  }
  if(msg.id == 0x18AD55F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s1 = {...data.temp.s1,t5,t6,t7,t8};
  }
  // Temperatures s2
  if(msg.id == 0x18AE55F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s2 = {...data.temp.s2,t1,t2,t3,t4};
  }
  if(msg.id == 0x18AF55F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s2 = {...data.temp.s2,t5,t6,t7,t8};
  }
  // Temperatures s3
  if(msg.id == 0x18B055F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s3 = {...data.temp.s3,t1,t2,t3,t4};
  }
  if(msg.id == 0x18B155F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s3 = {...data.temp.s3,t5,t6,t7,t8};
  }// Temperatures s4
  if(msg.id == 0x18B255F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s4 = {...data.temp.s4,t1,t2,t3,t4};
  }
  if(msg.id == 0x18B355F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s4 = {...data.temp.s4,t5,t6,t7,t8};
  }
  // Temperatures s5
  if(msg.id == 0x18B455F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s5 = {...data.temp.s5,t1,t2,t3,t4};
  }
  if(msg.id == 0x18B555F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s5 = {...data.temp.s5,t5,t6,t7,t8};
  }
  // Temperatures s6
  if(msg.id == 0x18B655F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s6 = {...data.temp.s6,t1,t2,t3,t4};
  }
  if(msg.id == 0x18B755F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s6 = {...data.temp.s6,t5,t6,t7,t8};
  }
  // Temperatures s7
  if(msg.id == 0x18B855F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s7 = {...data.temp.s7,t1,t2,t3,t4};
  }
  if(msg.id == 0x18B955F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s7 = {...data.temp.s7,t5,t6,t7,t8};
  }
  // Temperatures s8
  if(msg.id == 0x18BA55F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s8 = {...data.temp.s8,t1,t2,t3,t4};
  }
  if(msg.id == 0x18BB55F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s8 = {...data.temp.s8,t5,t6,t7,t8};
  }
  // Temperatures s9
  if(msg.id == 0x18BC55F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s9 = {...data.temp.s9,t1,t2,t3,t4};
  }
  if(msg.id == 0x18BD55F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s9 = {...data.temp.s9,t5,t6,t7,t8};
  }
  // Temperatures s10
  if(msg.id == 0x18BE55F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s10 = {...data.temp.s10,t1,t2,t3,t4};
  }
  if(msg.id == 0x18BF55F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s10 = {...data.temp.s10,t5,t6,t7,t8};
  }
  // Temperatures s11
  if(msg.id == 0x18C055F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s11 = {...data.temp.s11,t1,t2,t3,t4};
  }
  if(msg.id == 0x18C155F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s11 = {...data.temp.s11,t5,t6,t7,t8};
  }
  // Temperatures s12
  if(msg.id == 0x18C255F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s12 = {...data.temp.s12,t1,t2,t3,t4};
  }
  if(msg.id == 0x18C355F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s12 = {...data.temp.s12,t5,t6,t7,t8};
  }
  // Temperatures s13
  if(msg.id == 0x18C455F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s13 = {...data.temp.s13,t1,t2,t3,t4};
  }
  if(msg.id == 0x18C555F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s13 = {...data.temp.s13,t5,t6,t7,t8};
  }
  // Temperatures s14
  if(msg.id == 0x18C655F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s14 = {...data.temp.s14,t1,t2,t3,t4};
  }
  if(msg.id == 0x18C755F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s14 = {...data.temp.s14,t5,t6,t7,t8};
  }
  // Temperatures s15
  if(msg.id == 0x18C855F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s15 = {...data.temp.s15,t1,t2,t3,t4};
  }
  if(msg.id == 0x18C955F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s15 = {...data.temp.s15,t5,t6,t7,t8};
  }
  // Temperatures s16
  if(msg.id == 0x18CA55F4){ 
    t4 = can4;
    t3 = can3;
    t2 = can2;
    t1 = can1;
    data.temp.s16 = {...data.temp.s16,t1,t2,t3,t4};
  }
  if(msg.id == 0x18CB55F4){ 
    t8 = can4;
    t7 = can3;
    t6 = can2;
    t5 = can1;
    data.temp.s16 = {...data.temp.s16,t5,t6,t7,t8};
  }
  // Voltages s1 **** Terminar de mudar os endereços ***
  if(msg.id == 0x186B55F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s1 = {...data.voltage.s1,v1,v2,v3,v4};
  }
  if(msg.id == 0x186C55F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s1 = {...data.voltage.s1,v5,v6,v7,v8};
  }
  if(msg.id == 0x186D55F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s1 = {...data.voltage.s1,v9,v10,v11,v12};
  }
  if(msg.id == 0x186E55F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s1 = {...data.voltage.s1,v13,v14,v15,v16};
  }
  // Voltages s2
  if(msg.id == 0x186F55F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s2 = {...data.voltage.s2,v1,v2,v3,v4};
  }
  if(msg.id == 0x187055F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s2 = {...data.voltage.s2,v5,v6,v7,v8};
  }
  if(msg.id == 0x187155F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s2 = {...data.voltage.s2,v9,v10,v11,v12};
  }
  if(msg.id == 0x187255F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s2 = {...data.voltage.s2,v13,v14,v15,v16};
  }
  // Voltages s3
  if(msg.id == 0x187355F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s3 = {...data.voltage.s3,v1,v2,v3,v4};
  }
  if(msg.id == 0x187455F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s3 = {...data.voltage.s3,v5,v6,v7,v8};
  }
  if(msg.id == 0x187555F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s3 = {...data.voltage.s3,v9,v10,v11,v12};
  }
  if(msg.id == 0x187655F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s3 = {...data.voltage.s3,v13,v14,v15,v16};
  }
  // Voltages s4
  if(msg.id == 0x187755F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s4 = {...data.voltage.s4,v1,v2,v3,v4};
  }
  if(msg.id == 0x187855F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s4 = {...data.voltage.s4,v5,v6,v7,v8};
  }
  if(msg.id == 0x187955F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s4 = {...data.voltage.s4,v9,v10,v11,v12};
  }
  if(msg.id == 0x187A55F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s4 = {...data.voltage.s4,v13,v14,v15,v16};
  }
  // Voltages s5
  if(msg.id == 0x187B55F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s5 = {...data.voltage.s5,v1,v2,v3,v4};
  }
  if(msg.id == 0x187C55F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s5 = {...data.voltage.s5,v5,v6,v7,v8};
  }
  if(msg.id == 0x187D55F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s5 = {...data.voltage.s5,v9,v10,v11,v12};
  }
  if(msg.id == 0x187E55F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s5 = {...data.voltage.s5,v13,v14,v15,v16};
  }
  // Voltages s6
  if(msg.id == 0x187F55F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s6 = {...data.voltage.s6,v1,v2,v3,v4};
  }
  if(msg.id == 0x188055F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s6 = {...data.voltage.s6,v5,v6,v7,v8};
  }
  if(msg.id == 0x188155F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s6 = {...data.voltage.s6,v9,v10,v11,v12};
  }
  if(msg.id == 0x188255F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s6 = {...data.voltage.s6,v13,v14,v15,v16};
  }
  // Voltages s7
  if(msg.id == 0x188355F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s7 = {...data.voltage.s7,v1,v2,v3,v4};
  }
  if(msg.id == 0x188455F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s7 = {...data.voltage.s7,v5,v6,v7,v8};
  }
  if(msg.id == 0x188555F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s7 = {...data.voltage.s7,v9,v10,v11,v12};
  }
  if(msg.id == 0x188655F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s7 = {...data.voltage.s7,v13,v14,v15,v16};
  }
  // Voltages s8
  if(msg.id == 0x188755F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s8 = {...data.voltage.s8,v1,v2,v3,v4};
  }
  if(msg.id == 0x188855F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s8 = {...data.voltage.s8,v5,v6,v7,v8};
  }
  if(msg.id == 0x188955F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s8 = {...data.voltage.s8,v9,v10,v11,v12};
  }
  if(msg.id == 0x188A55F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s8 = {...data.voltage.s8,v13,v14,v15,v16};
  }
  // Voltages s9
  if(msg.id == 0x188B55F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s9 = {...data.voltage.s9,v1,v2,v3,v4};
  }
  if(msg.id == 0x188C55F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s9 = {...data.voltage.s9,v5,v6,v7,v8};
  }
  if(msg.id == 0x188D55F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s9 = {...data.voltage.s9,v9,v10,v11,v12};
  }
  if(msg.id == 0x188E55F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s9 = {...data.voltage.s9,v13,v14,v15,v16};
  }
  // Voltages s10
  if(msg.id == 0x188F55F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s10 = {...data.voltage.s10,v1,v2,v3,v4};
  }
  if(msg.id == 0x189055F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s10 = {...data.voltage.s10,v5,v6,v7,v8};
  }
  if(msg.id == 0x189155F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s10 = {...data.voltage.s10,v9,v10,v11,v12};
  }
  if(msg.id == 0x189255F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s10 = {...data.voltage.s10,v13,v14,v15,v16};
  }
  // Voltages s11
  if(msg.id == 0x189355F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s11 = {...data.voltage.s11,v1,v2,v3,v4};
  }
  if(msg.id == 0x189455F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s11 = {...data.voltage.s11,v5,v6,v7,v8};
  }
  if(msg.id == 0x189555F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s11 = {...data.voltage.s11,v9,v10,v11,v12};
  }
  if(msg.id == 0x189655F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s11 = {...data.voltage.s11,v13,v14,v15,v16};
  }
  // Voltages s12
  if(msg.id == 0x189755F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s12 = {...data.voltage.s12,v1,v2,v3,v4};
  }
  if(msg.id == 0x189855F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s12 = {...data.voltage.s12,v5,v6,v7,v8};
  }
  if(msg.id == 0x189955F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s2 = {...data.voltage.s2,v9,v10,v11,v12};
  }
  if(msg.id == 0x189A55F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s12 = {...data.voltage.s12,v13,v14,v15,v16};
  }
  // Voltages s13
  if(msg.id == 0x189B55F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s13 = {...data.voltage.s13,v1,v2,v3,v4};
  }
  if(msg.id == 0x189C55F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s13 = {...data.voltage.s13,v5,v6,v7,v8};
  }
  if(msg.id == 0x189D55F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s13 = {...data.voltage.s13,v9,v10,v11,v12};
  }
  if(msg.id == 0x189E55F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s13 = {...data.voltage.s13,v13,v14,v15,v16};
  }
  // Voltages s14
  if(msg.id == 0x189F55F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s14 = {...data.voltage.s14,v1,v2,v3,v4};
  }
  if(msg.id == 0x18A055F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s14 = {...data.voltage.s14,v5,v6,v7,v8};
  }
  if(msg.id == 0x18A155F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s14 = {...data.voltage.s14,v9,v10,v11,v12};
  }
  if(msg.id == 0x18A255F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s14 = {...data.voltage.s14,v13,v14,v15,v16};
  }
  // Voltages s15
  if(msg.id == 0x18A355F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s15 = {...data.voltage.s15,v1,v2,v3,v4};
  }
  if(msg.id == 0x18A455F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s15 = {...data.voltage.s15,v5,v6,v7,v8};
  }
  if(msg.id == 0x18A555F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s15 = {...data.voltage.s15,v9,v10,v11,v12};
  }
  if(msg.id == 0x18A655F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s2s15 = {...data.voltage.s15,v13,v14,v15,v16};
  }
  // Voltages s16
  if(msg.id == 0x18A755F4){ //SoC,Current,Current,Vpack
    v4 = can4;
    v3 = can3;
    v2 = can2;
    v1 = can1;
    data.voltage.s16 = {...data.voltage.s16,v1,v2,v3,v4};
  }
  if(msg.id == 0x18A855F4){ //SoC,Current,Current,Vpack
    v8 = can4;
    v7 = can3;
    v6 = can2;
    v5 = can1;
    data.voltage.s16 = {...data.voltage.s16,v5,v6,v7,v8};
  }
  if(msg.id == 0x18A955F4){ //SoC,Current,Current,Vpack
    v12 = can4;
    v11 = can3;
    v10 = can2;
    v9 = can1;
    data.voltage.s16 = {...data.voltage.s16,v9,v10,v11,v12};
  }
  if(msg.id == 0x18AA55F4){ //SoC,Current,Current,Vpack
    v16 = can4;
    v15 = can3;
    v14 = can2;
    v13 = can1;
    data.voltage.s16 = {...data.voltage.s16,v13,v14,v15,v16};
  }

  /*
  //Just for web visualization propouse, will not be here in the future;
  upMsg = '{"Power":' + power + ',' +
          '"SoC":' + soc + ',' +
          '"Pack Voltage":' + vpack + ',' +
          '"Min Voltage":' + minvolt + ',' +
          '"Max Voltage":' + maxvolt + ',' +
          '"Min Temperature":' + mintemp + ',' +
          '"Max Temperature":' + maxtemp + ',' +
          '"Temp 1":' + t1 + ',' +
          '"Temp 2":' + t2 + ',' +
          '"Temp 3":' + t3 + ',' +
          '"Temp 4":' + t4 + ',' +
          '"Temp 5":' + t5 + ',' +
          '"Temp 6":' + t6 + ',' +
          '"Temp 7":' + t7 + ',' +
          '"Temp 8":' + t8 + ',' +
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
          '"longitude": -48.441352}'; */
}
