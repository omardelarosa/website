#!/usr/bin/env node
'use strict';

const packageJson = require('../package.json');

var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
    version: packageJson.version,
    addHelp: true,
    description: 'post management cli',
});
parser.addArgument(['-c', '--create'], {
    help: 'create post',
});
parser.addArgument(['-t', '--tags'], {
    help: 'attach tags',
    action: 'append',
});
parser.addArgument(['-d', '--debug'], {
    help: 'enables debug mode',
    action: 'storeTrue',
});

var args = parser.parseArgs();

// Makes a new instance of API
const API = require('../src/api');
new API(args);
