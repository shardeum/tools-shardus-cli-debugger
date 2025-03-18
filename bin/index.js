#!/usr/bin/env node

const prog = require('caporal')
const register = require('../src/commands')

prog.bin('shardus-debug').name('Shardus Debug').version('1.0.0')

for (const command in register) {
  register[command](prog)
}

prog.parse(process.argv)
