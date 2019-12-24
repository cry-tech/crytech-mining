var target_date = new Date().getTime() + (1000 * 3600 * 48); // set the countdown date
var days, hours, minutes, seconds; // variables for time units

var countdownD = document.getElementById("Days");
var countdownH = document.getElementById("Hours");
var countdownM = document.getElementById("Minutes");
var countdownS = document.getElementById("Seconds"); // get tag element

getCountdown();

setInterval(function () { getCountdown(); }, 1000);

function getCountdown() {

  // find the amount of "seconds" between now and target
  var current_date = new Date().getTime();
  var seconds_left = (target_date - current_date) / 1000;

  days = pad(parseInt(seconds_left / 86400));
  seconds_left = seconds_left % 86400;

  hours = pad(parseInt(seconds_left / 3600));
  seconds_left = seconds_left % 3600;

  minutes = pad(parseInt(seconds_left / 60));
  seconds = pad(parseInt(seconds_left % 60));

  // format countdown string + set tag value
  if (!countdownD)
    return;
  countdownD.innerHTML = days;
  countdownH.innerHTML = hours;
  countdownM.innerHTML = minutes;
  countdownS.innerHTML = seconds;
}

function pad(n) {
  return (n < 10 ? '0' : '') + n;
}