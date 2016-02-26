var expect = require('chai').expect;
var Buzzer = require('../../index');

var buzzer; // Capture buzzer state
var callCount = 0;

module.exports = function(suite) {
  describe('Buzzer', function() {
    it('should fail if no endpoint is passed', function(done) {
      var buzzerConfig = {};
      var didFail = false;
      try {
        buzzer = new Buzzer(buzzerConfig);
      }
      catch (e) {
        didFail = true;
      }
      finally {
        expect(didFail).to.be.true;
        done();
      }
    });
    it('should be passed an endpoint to ping', function(done) {
      var buzzerConfig = { endpoint: suite.ENDPOINT };
      buzzer = new Buzzer(buzzerConfig);
      done();
    });
    it('should have default values', function(done) {
      // Default values expect to cover 7:30AM - 1:00AM in 20min intervals
      expect(buzzer._interval).to.equal(1000 * 60 * 20);
      expect(buzzer._startHour).to.equal(7);
      expect(buzzer._startMinute).to.equal(30);
      expect(buzzer._endHour).to.equal(1);
      expect(buzzer._endMinute).to.equal(0);
      done();
    });
    it('should accept a callback to process the ping response', function(done) {
      buzzer = new Buzzer({
        endpoint: suite.ENDPOINT,
        callback: function(err, res) {
          expect(err).to.not.exist;
          expect(res.statusCode).to.equal(200);
          done();
        }
      });
      buzzer.buzz();
    });
    it('should not successfully ping a non-existent endpoint', function(done) {
      buzzer = new Buzzer({
        endpoint: 'localhost:8912',
        callback: function(err, res) {
          expect(err).to.exist;
          expect(err.syscall).to.equal('connect');
          expect(err.code).to.equal('ECONNREFUSED');
          done();
        }
      });
      buzzer.buzz();
    });
    it('should activate manually (upon invoking activate method)', function(done) {
      var now = new Date();
      buzzer = new Buzzer({
        interval: 200,
        startHour: now.getHours(),
        startMinute: now.getMinutes() + (now.getSeconds >= 59 ? 1 : 0),
        startSecond: now.getSeconds() + 1,
        endpoint: suite.ENDPOINT,
        callback: function(err, res) {
          expect(res.statusCode).to.equal(200);
          if (++callCount === 5) {
            // buzzer.deactivate();
            done();
          }
        }
      });
      buzzer.activate();
    });
    it('should deactivate upon invoking deactivate method', function(done) {
      var count = callCount;

      // Verify buzzer schedule still up
      setTimeout(function(){
        expect(callCount).to.be.above(count);
        buzzer.deactivate();
        deactivatedCount = callCount;
        // Verify buzzer schedule deactivated
        setTimeout(function() {
          expect(deactivatedCount - callCount).to.be.at.most(1);
          done();
        }, 400);
      }, 400);
    });
  });
};
