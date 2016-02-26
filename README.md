# Buzzer
Pings given URL(s) for a given duration and interval. 

- **Heroku**: This is particularly useful for cheap hosting on Heroku, just open up a free-tier dyno, have another host run the buzzer against the dyno's ip, and you're set to have that dyno up for the maximum amount of time allowed (18 hours)

## Configuration
- **endpoint**: Endpoint to be pinged by buzzer instance
- **interval**: Interval (in milliseconds) between pings 
  - Defaults to 20 minutes (1000 * 60 * 20 ms)
- **startHour**: The hour the buzzing window starts (out of 23)
  - Defaults to 7 
- **startMinute**: The minute the buzzing window starts (out of 59)
  - Defaults to 30
- **startSecond**: The second the buzzing window starts (out of 59)
  - Defaults to 0
- **endHour**: The hour the buzzing window ends (out of 23)
  - Defaults to 1 
- **endMinute**: The minute the buzzing window ends (out of 59)
  - Defaults to 0
- **endSecond**: The second the buzzing window ends (out of 59)
  - Defaults to 0
- **callback**: Callback to be triggered on every ping
  - Parameters: `(error, response)`

#### Example Config
```
import Buzzer from 'buzzer';
const buzzerConfig = {
  endpoint: 'http://my-free-dyno.herokuapp.com',
  interval: 1000 * 60 * 25,
  startHour: 6,
  startMinute: 0,
  endHour: 11,
  endMinute: 30,
  callback: (err, res) { 
    if (err) {
      console.error('ERROR:', err);
    }
    else {
      console.log('PINGING', buzzerConfig.endpoint, ':', res );
    }
  }
};
const buzzer = new Buzzer(buzzerConfig);
buzzer.activate();
```

## Basic Example
On a separate host, add a buzzer (or multiple) to maintain your free dyno(s). This example uses the default values to open a buzzing window from 7:30AM to 1AM

```
import express from 'express';
import Buzzer from 'buzzer';
const app = express();

const buzzer = new Buzzer({
  endpoint: 'http://my-free-dyno.herokuapp.com'
});
buzzer.activate();

app.get('*', function(req, res) {
  return res.sendStatus(200);
});
app.set('port', 8001);
app.listen(app.get('port'), function() {
  console.log('Listening on port %d', app.get('port'));
});

```

## Installation
`npm install --save buzzer`

## Contribute
There is literally nothing special you need to do to get this up and running and contribute. Clone it down, install the dependencies, and go.
