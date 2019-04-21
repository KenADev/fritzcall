/***
 * FRITZCALL NODE.JS MODULE
 * by KenADev
 * https://github.com/KenADev/fritzcall/
 *
 */

var request = require('request');
var querystring = require('querystring');
const crypto = require('crypto');


var fritzcall =
    {
        data:
            {
                sid: null,
                userAgent: "fritzcall client nodejs",
                hostname: '',
                username: false,
                password: ''


            },

        /**
         * Login and store session id.
         * This must be called before any other method!
         *
         * @param hostname Fritz!Box hostname or ip-address
         * @param password
         * @param username (optional)
         * @returns {Promise<any>}
         */
        login: function (hostname, password, username = false) {
            var that = this;

            that.hostname = hostname;
            that.username = username;
            that.password = password;

            return new Promise(function (resolve, reject) {

                that.__getAndSolveChallenge()
                    .then(function (login_token) {

                        var request_url = "http://" + that.data.hostname + "/login_sid.lua";
                        var http_header = {
                            "User-Agent": that.data.userAgent,
                            "Content-Type": "application/x-www-form-urlencoded"
                        };

                        var formdata = {'response': login_token};
                        if(that.data.username != false)
                            formdata.username = that.data.username;

                        var formbody = querystring.stringify(formdata);
                        request.post({url: request_url, headers: http_header, body: formbody},
                            function (error, response, body) {
                                var neterr = that.__handle_network_errors(error, response);
                                if (neterr !== false)
                                    return reject(neterr);

                                //console.log(body);

                                //search for <SID> Tag & extract

                                const regex = /<SID>(.*)<\/SID>/i;
                                var m = regex.exec(body);
                                if (m === null)
                                    return reject({
                                        error: "No SID-Tag found!",
                                        details: body
                                    });
                                var SID = m[1];

                                //check if SID 000000 (challenge failed)
                                const regex2 = /^([0]+)$/i;
                                var z = regex2.exec(SID);
                                if (z !== null)
                                    reject({
                                        error: "Login failed! Challenge response rejected!",
                                        details: body
                                    });

                                that.data.sid = SID;
                                //console.log(SID);

                                return resolve(SID);
                            });


                    })
                    .catch(function (error) {
                        return reject(error);

                    });


            });
        },



        /**
         * Dial a number and hang up after a certain period of time.
         *
         * This method is especially useful to signal smarthone notifications
         * by ringing all Fritz!Box connected phones. (dial **9)
         *
         * @param phonenumber intern or extern
         * @param call_duration seconds until hanging up
         * @param verbose display log messages (optional)
         * @returns {Promise<any>}
         */
        dial_and_hang_up: function (phonenumber, call_duration=10, verbose=false) {
            var that = this;
            return new Promise(function (resolve, reject) {

                if(verbose) console.log("CALLING " + phonenumber + " ...");
                that.dial(phonenumber)
                    .then(function (result) {

                        if(verbose) console.log("HANGING UP IN " + call_duration + " SECONDS ...");
                        setTimeout(function () {

                            that.hang_up()
                                .then(function () {
                                    if(verbose) console.log("HUNG UP!");
                                    return resolve(true)
                                })
                                .catch(function (err) {
                                    return reject(err);
                                })


                        }, call_duration * 1000);

                    })
                    .catch(function (err) {
                        return reject(err);
                    })


            });
        },




        /**
         * Places a call to a specific phone number.
         * This method uses Fritz!Box's phone dialer functionality. ("Waehlhilfe")
         *
         * The Fritz!Box calls the specified number and waits for the callee to pick up their phone.
         * As soon as the callee picks up his phone, he is put on hold and
         * all Fritz!Box connected phones start to ring.
         * When the caller picks up a Fritz!Box connected phone, callee and caller will be connected.
         *
         * @param phonenumber intern, extern or false (= hang up)
         * @returns {Promise<any>}
         */
        dial: function (phonenumber) {
            var that = this;
            return new Promise(function (resolve, reject) {

                if (that.data.sid === null)
                    return reject({error: 'Not logged in! (sid=null)', details: null});

                var request_url = "http://" + that.data.hostname
                    + "/fon_num/fonbook_list.lua?"
                    + (
                        (phonenumber === false || phonenumber === null) ?
                            "hang_up=" : ("dial=" + encodeURIComponent(phonenumber))
                    )
                    + "&sid=" + that.data.sid;

                var http_header = {
                    "User-Agent": that.data.userAgent,
                };

                request.get({url: request_url, headers: http_header},
                    function (error, response, body) {
                        var neterr = that.__handle_network_errors(error, response);
                        if (neterr !== false)
                            return reject(neterr);

                        const regex_l = /logout/i;

                        if ((regex_l.exec(body)) !== null)
                            return reject({error: 'Session rejected! Please login!', details: body});

                        return resolve(true);

                    });
            });
        },

        /**
         * Ends a call.
         * @returns {*|Promise<any>}
         */
        hang_up: function () {
            return this.dial(false);
        },

        /**
         * Connect to Fritz!Box, get challenge token and generate login token.
         * @param hostname
         * @param password
         * @returns {Promise<any>}
         */
        __getAndSolveChallenge: function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                var request_url = "http://" + that.data.hostname + "/login_sid.lua";

                var http_header = {
                    "User-Agent": that.data.userAgent
                };

                request.get({url: request_url, headers: http_header},
                    function (error, response, body) {
                        var neterr = that.__handle_network_errors(error, response)
                        if (neterr !== false)
                            return reject(neterr);

                        //console.log(body);

                        //search for <Challenge> Tag & extract

                        const regex = /<Challenge>(.*)<\/Challenge>/i;
                        var m = regex.exec(body);
                        if (m === null)
                            return reject({
                                error: "No Challenge-Tag found!",
                                details: body
                            });
                        var challenge = m[1];


                        // build login challenge token
                        var rawtoken = challenge + "-" + that.data.password;
                        //console.log(rawtoken);
                        var utf16le_token = that.__encodeUTF16LE(rawtoken);
                        var md5_token = crypto.createHash('md5').update(utf16le_token).digest("hex");
                        var login_token = challenge + "-" + md5_token;
                        //console.log(login_token);

                        return resolve(login_token);
                    });
            });
        },


        /**
         * Handle common network errors, used by request
         * @param error
         * @param statusCode
         * @returns error {error: "text", details: {*}}
         * @private
         */
        __handle_network_errors: function (error, response)//returns errobj of false
        {
            if (error)
                return {
                    error: "Network Error",
                    details: error
                };
            if (typeof response === 'undefined' || typeof response.statusCode === 'undefined')
                return {
                    error: "Unknown Network Error",
                    details: null
                };
            if (response.statusCode != 200)
                return {
                    error: "Network Error, Server responded with Status " + response.statusCode,
                    details: response.statusCode
                };
            return false;
        },

        /**
         * Encodes a given string to UTF-16LE.
         * SOURCE: https://stackoverflow.com/a/24391376/3582578
         * This is part of the challenge to login to the Fritz!Box
         * @param str
         * @returns {string} as UTF-16LE
         * @private
         */
        __encodeUTF16LE: function encodeUTF16LE(str) {
            //
            var out, i, len, c;
            var char2, char3;

            out = "";
            len = str.length;
            i = 0;
            while (i < len) {
                c = str.charCodeAt(i++);
                switch (c >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        // 0xxxxxxx
                        out += str.charAt(i - 1);
                        break;
                    case 12:
                    case 13:
                        // 110x xxxx   10xx xxxx
                        char2 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                        out += str.charAt(i - 1);
                        break;
                    case 14:
                        // 1110 xxxx  10xx xxxx  10xx xxxx
                        char2 = str.charCodeAt(i++);
                        char3 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                        break;
                }
            }

            var byteArray = new Uint8Array(out.length * 2);
            for (var i = 0; i < out.length; i++) {
                byteArray[i * 2] = out.charCodeAt(i); // & 0xff;
                byteArray[i * 2 + 1] = out.charCodeAt(i) >> 8; // & 0xff;
            }

            return String.fromCharCode.apply(String, byteArray);
        }


    }
;

module.exports = fritzcall;