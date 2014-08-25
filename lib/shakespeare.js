/*
 * shakespeare
 * https://github.com/parroit/shakespeare
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var co = require('co');

function Actor(fn, name) {
    this.gn = co(fn);
    this.name = name;
    this.receiver = {};
    this.queue = [];
}

Actor.prototype._waitMessage = function() {
    var _this = this;
    var name = this.name;

    this.receiver.receive = function() {
        if (_this.queue.length) {
            return new Promise(function(resolve, reject) {
                resolve(_this.queue.pop());
            });
        }

        return new Promise(function(resolve, reject) {
            _this._received = function(msg) {
                _this._received = null;
                //console.log('%s receive %j', this.name, msg);
                resolve(msg);
            };
        });
    };
};

Actor.prototype.run = function() {
    this._waitMessage();

    this.gn(this.receiver);

    //console.log('%s running', this.name);
};

Actor.prototype.send = function(msg) {


    var name = this.name;
    var _this = this;

    if (!this._received) {
        //console.log('%s received %j while busy!!', name, msg);
        this.queue.unshift(msg);
    } else {
        _this._received(msg);
        _this._waitMessage();
    }
    
    return new Promise(function(resolve, reject) {
        msg.reply = function(msgRepl) {
            //console.log('%s replied %j to %js', name, msgRepl, msg);
            resolve(msgRepl);
        };
    });


};

module.exports = function shakespeare(fn, name) {
    return new Actor(fn, name);
};
