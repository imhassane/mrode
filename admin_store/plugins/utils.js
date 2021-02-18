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

const functions = { getDateDiff, renderStatus };

export default (_, inject) => {
  inject('utils', functions);
}
