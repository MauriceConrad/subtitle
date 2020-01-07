const Timestamp = require('./Timestamp');

module.exports = {
  parse(str) {

    const texts = str.split(/\r\n?[0-9]{1,}\r?\n/).map(function(descriptor) {

      const lines = descriptor.split("\n").map(line => {
        return line.replace(/\r/g, "");
      });

      const timeStr = lines.find(line => line.search(/[0-9]{1,}:[0-9]{1,}:[0-9]{1,},[0-9]{3}\s*-->\s*[0-9]{1,}:[0-9]{1,}:[0-9]{1,},[0-9]{3}/) > -1);

      const text = lines[lines.indexOf(timeStr) + 1];

      if (timeStr) {


        const timeMatch = timeStr.match(/([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}).*([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})/)

        const time = {
          from: new Timestamp(timeMatch[1]),
          to: new Timestamp(timeMatch[2])
        };

        return {
          from: new Date(0, 0, 1, time.from.hours + 1, time.from.minutes, time.from.seconds, time.from.frames),
          to: new Date(0, 0, 1, time.to.hours + 1, time.to.minutes, time.to.seconds, time.to.frames),
          text: text
        };



      }



    }).filter(subtitle => subtitle);

    return texts;
  },
  stringify(subtitles) {

    return subtitles.map(function(subtitle, index) {
      return (index + 1) + "\n" +
             new String(subtitle.from.getHours() - 1).padStart(2, "0") + ":" + new String(subtitle.from.getMinutes()).padStart(2, "0") + ":" + new String(subtitle.from.getSeconds()).padStart(2, "0") + "," + new String(subtitle.from.getMilliseconds()).padStart(3, "0") +
             " --> " +
             new String(subtitle.to.getHours() - 1).padStart(2, "0") + ":" + new String(subtitle.to.getMinutes()).padStart(2, "0") + ":" + new String(subtitle.to.getSeconds()).padStart(2, "0") + "," + new String(subtitle.to.getMilliseconds()).padStart(3, "0") + "\n" +
             subtitle.text
    }).join("\n\n");
  }
}
