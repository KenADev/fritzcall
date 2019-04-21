# FritzCall - Fritz!Box Phone Dialer (Wählhilfe)
**FritzCall** is designed to be a simple promise-based **Node.js** module to 
**automatically dial phone numbers** using your **Fritz!Box**.

[![npm package](https://nodei.co/npm/fritzcall.png?downloads=true&downloadRank=true&stars=false)](https://nodei.co/npm/fritzcall/)

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

fritzcall.login('fritz.box', 'password1234', 'username' /*optional*/)
    .then(function () {
        return fritzcall.call('0123456789');
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

fritzcall.login('fritz.box', 'password1234', 'username' /*optional*/)
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

## Compatibility
FritzCall has been developed using a Fritz!Box Fon WLAN 7390 @ Fritz!OS 06.85.  

If you can access these two URLs on your Fritz!Box, chances are good that FritzCall will work on your Fritz!Box:  
* http://fritz.box/login_sid.lua
* http://fritz.box/fon_num/fonbook_list.lua  

## Documentation
Please refer to [index.js](https://github.com/KenADev/fritzcall/blob/master/index.js) for JavaDoc style comments. 

## Disclaimer, Warnings & License
### Warning
FritzCall is able to place phone calls to **any** phone number (internal and *external*), even fee-based numbers and Fritz!Box special codes. You will be liable to any charges or damages.   
Always make sure to validate your input data and use common security practices.

### License
The MIT License (MIT)

Copyright (c) 2013-2017 Petka Antonov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

### Disclaimer
FRITZCALL AND IT'S AUTHOR ARE IN NO WAY ASSOCIATED OR ENDORSED WITH AVM COMPUTERSYSTEME VERTRIEBS GMBH OR FRITZ!BOX PRODUCTS.  

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
