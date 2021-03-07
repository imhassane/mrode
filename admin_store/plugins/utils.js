function getDateDiff(dateOne, dateTwo) {
  const dateOneObj = new Date(dateOne);
  const dateTwoObj = new Date(dateTwo);
  const milliseconds = Math.abs(dateTwoObj - dateOneObj);
  const hours = milliseconds / 36e5;

  return Math.round(hours)
};

function renderStatus(st) {
  if(st === 'WAITING') return "En attente";
  else if(st === 'ACCEPTED') return "Acceptée";
  else if (st === 'PREPARATION') return "En cours";
  else if (st === 'PREPARATION_DONE') return 'Terminée';
}

function pad(num) {
  return ("0"+num).slice(-2);
}
function formatSecondsToTime(secs) {
  let minutes = Math.floor(secs / 60);
  secs = secs%60;
  let hours = Math.floor(minutes/60)
  minutes = minutes%60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}

const functions = { getDateDiff, renderStatus, formatSecondsToTime, };

export default (_, inject) => {
  inject('utils', functions);
}
