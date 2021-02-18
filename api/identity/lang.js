const MESSAGES = {
    fr: {
        internalError: "Une erreur interne est survenue",
    },

    en: {
        internalError: "An internal error occured",
    }
};

const getLang = lang => MESSAGES[lang];

module.exports = getLang;
