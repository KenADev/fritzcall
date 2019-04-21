var fritzcall = require('./index.js');


fritzcall.login('fritz.box', '1234')
    .then(function () {
        return fritzcall.dial_and_hang_up('**9', 7, true);
    })
    .then(function () {
        console.log("FRITZCALL SUCCEEDED");
    })
    .catch(function (err) {
        console.log("ERROR: " + (err.error || err));
        console.log(err);
    });