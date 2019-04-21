# FritzCall - Fritz!Box Phone Dialer (Wählhilfe)
**FritzCall** is designed to be a simple promise-based **Node.js** module to 
**automatically dial phone numbers** using your **Fritz!Box**.

## Phone Dialer (Wählhilfe)
FritzCall is able to call a specified phone number and wait for the callee to pick up.  
As soon as the callee picks up his phone, he is put on hold and
all Fritz!Box connected phones start to ring.  
When the caller picks up a Fritz!Box connected phone, callee and caller are being connected.

## Examples
### Dial a Phone Number
This example will dial a phone number as described above.  
It is possible to dial internal and external phone numbers.
```javascript
var fritzcall = require('fritzcall');

fritzcall.login('fritz.box', '1234', 'username' /*optional*/)
    .then(function () {
        return fritzcall.call('**9');
    })
    .then(function () {
        //success
    })
    .catch(function (err) {
        //error
    });
```

### Broadcast Calls
Broadcast calls are especially useful to signal **smarthome notifications** by ringing all Fritz!Box connected phones.  
The dial_and_hang_up() method will call a phone number (**9 for broadcast calls), 
wait a certian period of time, and eventually hang up.
```javascript
var fritzcall = require('fritzcall');

fritzcall.login('fritz.box', '1234', 'username' /*optional*/)
    .then(function () {
        
        return fritzcall.dial_and_hang_up('**9', 7, true);
    })
    .then(function () {
       //success
    })
    .catch(function (err) {
       //error
    });
```
### Hang Up
This method will cancel an ongoing dialing attempt.
```javascript
fritzcall.hang_up()
    .then(function () {
        //success
    })
    .catch(function (err) {
        //error
    });
```
## Documentation
Please refer to [index.js](https://github.com/KenADev/fritzcall/blob/master/index.js) for JavaDoc style documentation comments. 

## Compatibility
FritzCall has been developed using a Fritz!Box Fon WLAN 7390 @ Fritz!OS 06.85. 
 
If you can access these two URLs on your Fritz!Box, chances are good FritzCall will work on your Fritz!Box:  
* http://fritz.box/login_sid.lua
* http://fritz.box/fon_num/fonbook_list.lua  

## Disclaimer and Warnings
### Warning
FritzCall is able to place phone calls to **any** phone number (internal and *external*), even fee-based numbers and Fritz!Box special codes. You will be liable to any charges.   
Always make sure to validate your input data and use common security practices.

### Disclaimer
FritzCall is in no way associated or endorsed with AVM Computersysteme Vertriebs GmbH or Fritz!Box products.  
This repository contains as-is, use at your own risk software. Functionality is not guaranteed.
