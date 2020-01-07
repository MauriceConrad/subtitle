/*
  Example:

  $ node . --source <sourceFile> --output <outputFile> --delay 00:00:01,000 --length 00:07:00,000

*/

const commandLineArgs = require('command-line-args');
const fs = require('fs');

const Timestamp = require('./Timestamp');


const srt = require('./srt');


const optionDefinitions = [
  {
    name: 'source',
    alias: 's',
    type: String,
    defaultOption: true
  },
  {
    name: 'output',
    alias: 'o',
    type: String
  },
  {
    name: 'delay',
    alias: 'd',
    type: String
  },
  {
    name: 'length',
    alias: 'l',
    type: String
  }
];

const options = commandLineArgs(optionDefinitions);

const orgArguments = Object.assign({}, options);
const positive = orgArguments.delay.search("-") == -1;

options.delay = new Timestamp(options.delay);
options.length = new Timestamp(options.length);

fs.readFile(options.source, "utf8", function(err, contents) {
  if (err) return console.error(err);
  var subtitles = srt.parse(contents);

  //const lastTime = subtitles[subtitles.length - 1].to;



  for (let subtitle of subtitles) {
    subtitle.from = addDelayTimestamp(subtitle.from, options.delay, positive);
    subtitle.to = addDelayTimestamp(subtitle.to, options.delay, positive);

    if (subtitle.from.getTime() < new Date(0, 0, 1, 1, 0, 0, 0).getTime()) {
      subtitle.from = new Date(0, 0, 1, 1, 0, 0, 100);
    }

    if (subtitle.to.getTime() > options.length.date.getTime()) {
      subtitle.to = options.length.date;
    }

  }

  subtitles = subtitles.filter(function(subtitle) {
    return subtitle.to.getTime() > new Date(0, 0, 1, 1, 0, 0, 0).getTime();
  }).filter(function(subtitle) {
    return subtitle.to.getTime() < options.length.date.getTime();
  });

  const str = srt.stringify(subtitles);

  console.log(str);


  fs.writeFile(options.output, str, function(err) {
    if (err) return console.error(err);
  });
});

function addDelayTimestamp(timestamp, delay, positive = false) {
  const stamp = timestamp.getTime();

  var time;

  if (positive) {
    time = stamp + (delay.hours * 60 * 60 * 1000) + (delay.minutes * 60 * 1000) + (delay.seconds * 1000) + (delay.frames);
  }
  else {
    time = stamp - (delay.hours * 60 * 60 * 1000) - (delay.minutes * 60 * 1000) - (delay.seconds * 1000) - (delay.frames);
  }

  return new Date(time);
}

//console.log(options.delay);
