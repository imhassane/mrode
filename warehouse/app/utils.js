export function getDateDiff(dateOne, dateTwo) {
    const dateOneObj = new Date(dateOne);
    const dateTwoObj = new Date(dateTwo);
    const milliseconds = Math.abs(dateTwoObj - dateOneObj);
    const hours = milliseconds / 36e5;

    return Math.round(hours)
};

export const renderOrder = status => {
    if(status === 'ACCEPTED') return "A traiter";
    else if(status === 'PREPARATION') return "En préparation";
    else if(status === 'PREPARATION_DONE') return "Préparation terminée";
    else if(status === 'DISPATCHED') return "Expédiée";
    else return "Statut non défini";
};