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

describe('shakespeare', function(){
    it('is defined', function(){
      shakespeare.should.be.a('function');
    });

});
