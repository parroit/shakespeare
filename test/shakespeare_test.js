/*
 * shakespeare
 * https://github.com/parroit/shakespeare
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var shakespeare = require('../lib/shakespeare.js');

describe('shakespeare', function() {
    this.timeout(20000);

    //jshint loopfunc:true
    it('is defined', function() {
        shakespeare.should.be.a('function');
    });

    it('expect a generator', function(done) {
        var actor1 = shakespeare(function * (box) {
            var msg;
            do {
                
                switch ((msg = yield box.receive()).type) {
                    case 'hello':
                        //setTimeout(function() {
                        msg.reply('hello to you, ' + msg.name);
                        //}, 1000);

                        break;
                    case 'goodbye':
                        msg.reply('see you soon, ' + msg.name);
                        var leaveIn = 10;
                        var leaving = setInterval(function() {
                            actor2.send({
                                type: 'leaving',
                                remaining: leaveIn
                            });

                            if (leaveIn === 0) {
                                clearInterval(leaving);
                                actor2.send({
                                    type: 'left'
                                }).then(function(reply){
                                    console.log(reply);
                                });
                            }
                            
                            leaveIn--;

                        }, 100);
                        break;
                    case 'end':
                        break;
                    default:
                        throw new Error('Uknown msg type: ' + msg.type);
                }
                console.log(msg.type + ' ' + msg.name);
            } while (msg.type !== 'end');
            console.log('actor1 exit');
        },'actor1');

        var actor2 = shakespeare(function * (box) {
            var result1 = yield actor1.send({
                type: 'hello',
                name: 'Ugo'
            });

            console.log(result1);

            var result2 = yield actor1.send({
                type: 'goodbye',
                name: 'Gina'
            });

            console.log(result2);

            var msg;
            do {
                //console.log('actor2 receive');
                switch ((msg = yield box.receive()).type) {
                    case 'leaving':
                        console.log('actor1 will leave in %s seconds' , msg.remaining);
                        break;
                    case 'left':
                        msg.reply('ok, end');
                        actor1.send({type:'end'});
                        console.log('actor1 has left');
                        done();
                        break;
                    
                    default:
                        throw new Error('Uknown msg type: ' + msg.type);
                }
                console.log('actor2 %j',msg);
            } while (msg.type !== 'left');
            console.log('actor2 exit');
        },'actor2');


        actor1.run();
        actor2.run();


    });

});
