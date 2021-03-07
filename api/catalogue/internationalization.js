const MESSAGES = {
    fr: {
        notAuthenticated: "Vous n'êtes pas connecté",
        internalError: "Une erreur s'est produite",
        notExists: "Ce produit n'existe pas",
        forbidden: "Vous n'avez pas accès à ce produit",
        formation: {
            alreadySubscribed: "Vous avez déjà souscrit à cette formation",
        }
    },
    en: {
        notAuthenticated: "You are not authenticated",
        internalError: "An error has occured",
        notExists: "This product does not exist",
        forbidden: "You do not have access to this product",
        formation: {
            alreadySubscribed: "You already have this formation"
        }
    }
};

const getMessage = lang => MESSAGES[lang || 'fr'];

module.exports = getMessage;
