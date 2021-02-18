const MESSAGES = {
  fr: {
      incorrectEmail: "L'adresse email est incorrecte",
      incorrectAccessCode: "Le code d'accès est incorrect",
      incorrectCity: "Le nom de la ville est incorrect",
      incorrectFirstName: "Le prénom est incorrect",
      incorrectLastName: "Le nom est incorrect",
      incorrectPostalCode: "Le code postal est incorrect",
      incorrectCountry: "Le nom du pays est incorrect",
      incorrectAddress: "L'adresse est incorrecte",
      incorrectPassword: "Le mot de passe doit contenir 8 caractères",
      incorrectSiret: "Le numéro siret doit contenir 14 caractères",
      accessCodeNotFound: "Le code d'accès n'a pas été trouvé",
      accessCodeNotActive: "Le code d'accès n'est pas actif",
      invalidPassword: "Le mot de passe est incorrect",
      inactiveCustomer: "Votre compte est inactif pour le moment, veuillez valider votre adresse email",
      waitingForValidationCustomer: "Votre compte est en attente de validation, veuillez patientez encore. Nous vous enverons un mail lorsqu'il sera validé",
      blockedCustomer: "Votre compte a été bloqué, veuillez contacter notre service client pour en savoir plus",
      deletedCustomer: "Ce compte a été supprimé, veuillez contacter notre service client pour avoir accès au compte",
      internalError: "Une erreur interne est survenue, désolé!",
      customerDoesNotExist: "Cet utilisateur n'existe pas",
      notAuthenticated: "Vous n'êtes pas connecté",
      invalidData: "Les informations ne sont pas correctes",
  },
  en: {
      incorrectEmail: "The email address is not correct",
      incorrectAccessCode: "The access code is invalid",
      incorrectCity: "Incorrect city name",
      incorrectFirstName: "The first name is incorrect",
      incorrectLastName: "The last name is incorrect",
      incorrectPostalCode: "Incorrect postal code",
      incorrectCountry: "Incorrect country name",
      incorrectAddress: "Incorrect address",
      incorrectPassword: "The password should contains at least 8 characters",
      incorrectSiret: "The siret should contains at least 14 characters",
      accessCodeNotFound: "The access code has not been found",
      accessCodeNotActive: "The access code is not active",
      invalidPassword: "The password is invalid",
      inactiveCustomer: "Your account is inactive, please confirm your email",
      waitingForValidationCustomer: "Your account is being validated by our team, please wait, you will receive an email when it will be validated",
      blockedCustomer: "Your account has been blocked, please contact our customer service to get more information",
      deletedCustomer: "Your account has been deleted, please contact our customer service if you want to access it",
      internalError: "An internal error just occured, sorry!",
      customerDoesNotExist: "This user does not exist",
      notAuthenticated: "You are not authenticated",
      invalidData: "The data sent is not valid",
  }
};

const getMessages = (lang) => {
    if(!lang)
        lang = "fr";

    return MESSAGES[lang];
};

module.exports = getMessages;
