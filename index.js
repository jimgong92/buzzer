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
  this._startSecond = config.startSecond || 0;
  this._endHour = config.endHour || 1;
  this._endMinute = config.endMinute || 0;
  this._endSecond = config.endSecond || 0;
  this._endpoint = config.endpoint;
  this._callback = config.callback;
  this._buzzSchedule = null;
  if (!this._endpoint) {
    throw new Error('No endpoint specified');
  }
}

Buzzer.prototype = {
  buzz: function() {
    var requestCB = function(err, res) {
      if (this._callback !== undefined) {
        this._callback(err, res);
      }
    }.bind(this);
    request
      .get(this._endpoint)
      .end(requestCB);
  },
  _activateStartRule: function() {
    var startRule = new schedule.RecurrenceRule();
    startRule.hour = this._startHour;
    startRule.minute = this._startMinute;
    startRule.second = this._startSecond;
    this._startJ = schedule.scheduleJob(startRule, function() {
      this.buzz();
      this._buzzSchedule = setInterval(this.buzz.bind(this), this._interval);
    }.bind(this));
  },
  _activateEndRule: function() {
    var endRule = new schedule.RecurrenceRule();
    endRule.hour = this._endHour;
    endRule.minute = this._endMinute;
    endRule.second = this._endSecond;
    this._endJ = schedule.scheduleJob(endRule, this._deactivateBuzzSchedule.bind(this));
  },
  _deactivateBuzzSchedule: function() {
    clearInterval(this._buzzSchedule);
    this._buzzSchedule = null;
  },
  activate: function() {
    this._activateStartRule();
    this._activateEndRule();
  },
  deactivate: function() {
    this._deactivateBuzzSchedule();
    this._startJ.cancel();
    this._endJ.cancel();
  }
};

module.exports = Buzzer;
