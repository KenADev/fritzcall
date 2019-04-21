var fritzcall = require('./index.js');


fritzcall.login('fritz.box', 'password1234', 'optional username')
    .then(function () {
        return fritzcall.dial_and_hang_up('**9', 7, true); // **9 = broadcast call (Rundruf)
    })
    .then(function () {
        console.log("FRITZCALL SUCCEEDED");
    })
    .catch(function (err) {
        console.log("ERROR: " + (err.error || err));
        console.log(err);
    });
