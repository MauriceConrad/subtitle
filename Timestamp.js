class Timestamp {
  constructor(str) {

    const strMatch = str.match(/([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{3})/);

    [ this.hours, this.minutes, this.seconds, this.frames ] = strMatch.slice(1).map(Number);
  }
  get date() {
    return new Date(0, 0, 1, this.hours + 1, this.minutes, this.seconds, this.frames);
  }
  get str() {
    return this.hours + ":" + this.minutes + ":" + this.seconds + "," + this.frames;
  }
}

module.exports = Timestamp;
