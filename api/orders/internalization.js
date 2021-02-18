const MESSAGES = {
    fr: {
        invalidOrderProducts: "La liste des produits de la commande est incorrecte",
        invalidOrderFirstName: "Le prénom défini est incorrect",
        invalidOrderLastName: "Le nom défini est incorrect",
        invalidOrderAddress: "L'adresse de livraison est incorrecte",
        invalidOrderProductsList: "La commande contient des produits non existants",
        outOfStock: "La commande ne peut pas être validée, certains produits ne sont plus disponibles",
        invalidAccount: "Votre adresse email n'est pas enregistrée",
        internalError: "Une erreur interne est survenue",
    },

    en: {
        invalidOrderProducts: "The order's products list is invalid",
        invalidOrderFirstName: "The first name is invalid",
        invalidOrderLastName: "The last name is invalid",
        invalidOrderAddress: "The order address is invalid",
        invalidOrderProductsList: "The order contains non existant products",
        outOfStock: "The order can't be validated, some products are not available anymore",
        invalidAccount: "The email address is not registered",
        internalError: "An internal error occured",
    }
};

const getLang = lang => MESSAGES[lang];

module.exports = getLang;
