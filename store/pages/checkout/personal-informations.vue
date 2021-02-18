<i18n lang="yaml">
  fr:
    title: "Personnelles informations"
    email: "Entrez l'adresse email"
    firstName: "Prénom"
    lastName: "Nom"
    address: "Adresse"
    postalCode: "Code postal"
    city: "Ville"
    country: "Pays"
    creditCard: "Numéro de carte bancaire"
    nameOnCard: "Nom sur la carte"
    expirationDate: "Date d'expiration"
    securityCode: "Code de sécurité"
    cardInformations: "Informations bancaires"
    pay: "Procéder au paiement"
    correctAddress: "En cochant cette case, je confirme que j'ai saisi la bonne adresse"
    saveCard: "Enregistrer ma carte pour les prochains achats"
    savePersonalInformations: "Enregistrer"
    confirmAddressCorrect: "Veuillez confirmer que l'adresse est bien correcte"

  en:
    title: "Personal informations"
    email: "Enter the email address"
    firstName: "First name"
    lastName: "Surname"
    address: "Address"
    postalCode: "Postal code"
    city: "City"
    country: "Country"
    creditCard: "Credit card"
    nameOnCard: "Name on the card"
    expirationDate: "Expiration date"
    securityCode: "Security code"
    cardInformations: "Card informations"
    pay: "Proceed to payment"
    correctAddress: "By checking this box, I confirm that the address typed is correct"
    saveCard: "Remember my card for next purchases"
    savePersonalInformations: "Save"
    confirmAddressCorrect: "Please confirm that the address entered is correct"
</i18n>

<template>
  <as-loading v-if="$apollo.loading || loading" />
  <div v-else>
    <div class="flex gap-x-8">
      <div class="flex-1 py-6 pl-10">
        <div class="mb-6" v-if="error">
          <t-alert variant="danger" :show="error != null">{{ error }}</t-alert>
        </div>

        <div v-if="showPersonalInformations || !user">
          <div>
            <label :class="labelClass">{{ $t('email') }}</label>
            <t-input type="email" v-model="informations.email" />
          </div>
          <div class="mt-5 flex gap-x-3">
            <div class="flex-1">
              <label :class="labelClass">{{ $t('firstName') }}</label>
              <t-input v-model="informations.firstName" />
            </div>
            <div class="flex-1">
              <label :class="labelClass">{{ $t('lastName') }}</label>
              <t-input v-model="informations.lastName" />
            </div>
          </div>
          <div class="my-3">
            <label :class="labelClass">{{ $t('address') }}</label>
            <t-input v-model="address.address" />
          </div>
          <div class="my-3 flex gap-x-3">
            <div class="flex-1">
              <label :class="labelClass">{{ $t('postalCode') }}</label>
              <t-input type="number" v-model="address.postalCode" />
            </div>
            <div class="flex-1">
              <label :class="labelClass">{{ $t('city') }}</label>
              <t-input v-model="address.city" />
            </div>
            <div class="flex-1">
              <label :class="labelClass">{{ $t('country') }}</label>
              <t-input v-model="address.country" :enabled="false" />
            </div>
          </div>
          <p class="mt-4 mb-8 text-xs">
            <label class="flex items-center">
              <t-toggle variant="success" @click="addressConfirmed = !addressConfirmed" />
              <span class="ml-3">{{ $t('correctAddress') }}</span>
            </label>
          </p>
          <div class="flex justify-end my-5">
            <t-button
              variant="black"
              @click="handleSavePersonalData"
            >{{ $t('savePersonalInformations') }}</t-button>
          </div>
        </div>
        <as-checkout-personal-information-resume
          :address="user.address" :email="user.email"
          :first-name="user.firstName" :last-name="user.lastName"
          :on-update="handleInformationChange"
          v-else
        />

        <div class="mt-10">
          <h1 class="text-lg">{{ $t('cardInformations') }}</h1>
          <hr class="my-4" />
          <div class="mb-3">
            <label :class="labelClass">{{ $t('creditCard') }}</label>
            <t-input pattern="^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$" />
          </div>
          <div class="mb-3">
            <label :class="labelClass">{{ $t('nameOnCard') }}</label>
            <t-input />
          </div>
          <div class="flex items-center gap-x-3 mb-3">
            <div class="flex-1">
              <label :class="labelClass">{{ $t('expirationDate') }}</label>
              <t-input placeholder="mm/yyyy" :maxlength="7" pattern="[0-9][1-9]/2[0-9]{3}" />
            </div>
            <div class="flex-1">
              <label :class="labelClass">{{ $t('securityCode') }}</label>
              <t-input :maxlength="3" pattern="[0-9]{3}" />
            </div>
          </div>
        </div>

        <div class="mt-5 flex justify-end items-center">
          <t-button variant="black" @click="createOrder">{{ $t('pay') }}</t-button>
        </div>
      </div>
      <div class="flex-1 py-6 pr-10 border-l">
        <cart-resume />
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import CartResume from "../../components/cart/cart-resume";
import AsCheckoutPersonalInformationResume from "../../components/as-checkout-personal-information-resume";
import AsLoading from "../../components/as-loading";

const CREATE_CUSTOMER = gql`
    mutation (
        $email: String!, $firstName: String!, $lastName: String!, $postalCode: String!,
        $city: String!, $country: String!, $address: String!
    ) {
        createCustomerWithAddress(
            email: $email, address: $address, city: $city,
            country: $country, postalCode: $postalCode,
            firstName: $firstName, lastName: $lastName
        ) { id, firstName, lastName, email }
    }
`;

const CREATE_ORDER = gql`
    mutation (
        $customerId: ID!, $firstName: String!, $lastName: String!,
        $address: String!, $products: [OrderProductInput]!
    ) {
        createOrder(
            customerId: $customerId, firstName: $firstName, lastName: $lastName,
            address: $address, products: $products
        ) { id, num, price }
    }
`;

export default {
  components: {AsLoading, AsCheckoutPersonalInformationResume, CartResume},
  head() {
    return {
      title: this.$t("title"),
    };
  },
  data: () => ({
    informations: { email: "", firstName: "", lastName: "" },
    address: { address: "", postalCode: "", city: "", country: "" },
    creditCard: { cardNumber: "", nameOnCard: "", cvc: "", expirationDate: "" },
    addressConfirmed: false,
    error: null, success: false,
    showPersonalInformations: true,
    loading: false,
  }),
  computed: {
    labelClass: () => "block text-sm mb-2",
    user() {
      return this.$store.state.user;
    },
    cart() {
      return this.$store.state.cart.cart;
    }
  },
  methods: {
    async handleSavePersonalData() {
      if(!this.addressConfirmed) {
        this.error = this.$t('confirmAddressCorrect');
        return;
      }
      try {
        const variables = {
          ...this.informations,
          ...this.address
        };

        const { data: { createCustomerWithAddress } } = await this.$apollo.mutate({
          mutation: CREATE_CUSTOMER,
          variables,
        });

        await this.$axios.$post('/api/save-customer', {
          id: createCustomerWithAddress.id,
          ...this.informations,
          address: this.address,
        });

        const { data } = await this.$axios.$get("/api/get-customer");
        await this.$store.commit('setUser', data);

        this.showPersonalInformations = false;
      } catch (err) {
        this.success = false;
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.error = err.message;
      }
    },
    async handleInformationChange() {
      try {
        await this.$axios.$post("/api/remove-customer");
        await this.$store.commit('setUser', null);
        this.addressConfirmed = false;
        this.showPersonalInformations = true;
      } catch {}
    },

    async createOrder() {
      if(!this.user) {
        return;
      }

      this.loading = true;
      const user = this.user;
      const address = `${user.address.address}, ${user.address.postalCode}, ${user.address.city}, ${user.address.country}`;

      const variables = {
        customerId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        address,
        products: this.cart.items.map(i => ({
          id: i.id, optionId: i.optionId, quantity: parseInt(i.quantity)
        }))
      };

      try {
        const { data: { createOrder } } = await this.$apollo.mutate({
          mutation: CREATE_ORDER,
          variables,
        });

        // On vide le panier.
        await this.$store.dispatch('cart/removeCart');

        // Redirection vers la page de confirmation.
        await this.$router.push(`/checkout/order-created?id=${createOrder.id}&num=${createOrder.num}`);

      } catch (err) {
        if(err.graphQLErrors && err.graphQLErrors.length)
          this.error = err.graphQLErrors[0].message;
        else
          this.err = err.message;
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    let data = this.user;

    if(data) {
      this.informations = {
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
      };

      this.address = data.address || {};
      this.showPersonalInformations = false;
    }
  }
}
</script>
