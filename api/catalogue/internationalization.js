const MESSAGES = {
    fr: {
        notAuthenticated: "Vous n'êtes pas connecté",
        internalError: "Une erreur s'est produite",
    },
    en: {
        notAuthenticated: "You are not authenticated",
        internalError: "An error has occured",
    }
};

const getMessage = lang => MESSAGES[lang || 'fr'];

module.exports = getMessage;
