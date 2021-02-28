const MESSAGES = {
    fr: {
        internalError: "Une erreur interne est survenue"
    },
    en: {
        internalError: "An internal error occured"
    }
};

const getMessages = (lang) => {
    if(!lang)
        lang = "fr";

    return MESSAGES[lang];
};

module.exports = getMessages;