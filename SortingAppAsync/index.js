const yargs = require('yargs');
const path = require('path');
const fs = require('fs');

const readdir = require('./readdirSync');
const createFinalDirectory = require('./createFinalDirectory')

const args = yargs
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .version('1.0.0')
  .alias('version', 'v')
  .example('node $0 --entry ./path1 --dist ./path2 -D')
  .option('entry', {
    alias: 'e',
    describe: "Path to the directory that has to be filtered",
    demandOption: true
  })
  .option('dist', {
    alias: 'd',
    describe: "Path to the directory where the filtered files have to be moved",
    default: './dist'
  })
  .option('delete', {
    alias: 'D',
    describe: "Should the entry directory get deleted?",
    default: false,
    boolean: true
  })
  .epilog('A console app sotring files by name based on callbacks')
  .argv;

const config = {
  entry: path.join(__dirname, args.entry),
  dist: path.join(__dirname, args.dist),
  isDelete: args.delete
};

createFinalDirectory(config.dist);
readdir(config.entry, config.dist)
  .then(r => console.log('Success'))
  .catch(e => console.log(error.message));
  


if (config.isDelete) {
  fs.rm(`${config.entry}`, { recursive: true}, () => true)
};