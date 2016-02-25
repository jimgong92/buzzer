var schedule = require('node-schedule');
var request = require('superagent');

/**
 * Buzzer Config
 * - interval (number as ms) - default to 20 minutes
 * - startHour (date) - default to 7am
 * - startMinute (date) - default to 30
 * - endHour (date) - default to 12am
 * - endMinute (date) - default to 40
 * - endpoint (string)
 * - callback (fn) - OPTIONAL to be invoked when the ping comes back
 *                 - Takes in error and response 
 */
function Buzzer(config) {
  this._interval = config.interval || (1000 * 60 * 20);
  this._startHour = config.startHour || 7;
  this._startMinute = config.startMinute || 30;
  this._endHour = config.endHour || 1;
  this._endMinute = config.endMinute || 00;
  this._endpoint = config.endpoint;
  this._buzzSchedule = null;
  if (!this._endpoint) {
    throw new Error('No endpoint specified');
  }
}

Buzzer.prototype = {
  buzz: function() {
    request
      .get(this._endpoint)
      .end(function(err, res) {
        if (this._callback !== undefined) {
          this._callback(err, res);
        }
      });
  },
  activate: function() {
    var rule = new schedule.RecurrenceRule();
    rule.hour = this._startHour;
    rule.minute = this._startMinute;
    var j = schedule.scheduleJob(rule, function() {
      this.buzz();
      this._buzzSchedule = setInterval(this.buzz, this._interval);
    });
  },
  deactivate: function() {
    var rule = new schedule.RecurrenceRule();
    rule.hour = this._endHour;
    rule.minute = this._endMinute;
    var j = schedule.scheduleJob(rule, function() {
      clearInterval(this._buzzSchedule);
      this._buzzSchedule = null;
    });
  }
};

module.exports = Buzzer;
