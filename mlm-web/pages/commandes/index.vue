<template>
  <div>
    <mlm-title title="Historique de mes commandes" />

    <div class="bg-white">
      <div class="my-3 py-3 px-2 border">
        <input type="search" v-model="search" placeholder="Rechercher" class="border border-white px-3 py-1" />
        <button><i class="fas fa-search ml-3"></i></button>
      </div>

      <div class="mt-3 flex border-b">
        <div class="py-3 px-4 flex">
          <span class="mr-3 mt-1">Page 1 sur 3</span>
          <div class="flex justify-center">
            <button class="border w-8 text-center">1</button>
            <button class="border w-8 text-center">2</button>
            <button class="border w-8 text-center">3</button>
          </div>
        </div>
        <div class="py-3 px-4">
          Afficher
          <input type="number" class="border p-1 ml-2 w-16" value="20" />
        </div>
        <div class="py-3 px-2">
          Statut de livraison
          <select class="border p-1 ">
            <option value="ALL">Toutes les commandes</option>
            <option value="EXPEDITION">En préparation</option>
            <option value="DELIVERY">En cours d'acheminement</option>
            <option value="DELIVERED">Livrées</option>
          </select>
        </div>
      </div>

      <div class="">
        <table class="w-full">
          <thead class="py-3 bg-gray-300">
            <th class="py-3">#</th>
            <th><input type="checkbox" /></th>
            <th>Commande</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Prix</th>
            <th></th>
          </thead>
          <tbody>
            <tr
              v-for="(o, i) in orders"
              :key="i"
              class="text-center py-3 px-1 border-t cursor-pointer"
              :class="{ 'bg-gray-100': i % 2 === 0 }"
              v-if="o.numOrder.toLowerCase().includes(search)"
            >
              <td class="w-1/12 py-3">{{ i + 1 }}</td>
              <td class="w-1/12"><input type="checkbox" /></td>
              <td class="w-2/12 text-blue-700 font-semibold">{{ o.numOrder }}</td>
              <td class="w-2/12">{{ o.date }}</td>
              <td class="w-2/12 font-semibold">{{ o.status }}</td>
              <td class="w-1/12 font-semibold">{{ o.price }} €</td>
              <td class="w-auto">
                <button class="font-semibold border border-black px-2 py-1 mr-3 rounded"><i class="fas fa-eye mr-2"></i>Voir</button>
                <button class="bg-black text-white font-semibold border border-black px-2 py-1 rounded"><i class="fas fa-file-alt mr-2"></i>Facture</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import MlmTitle from "../../components/general/mlm-title";
export default {
  components: {MlmTitle},
  head: () => ({
    title: "Commandes",
  }),
  data: () => ({
    search: ""
  }),
  computed: {
    orders: () => ([
      { id: 1, numOrder: "20201218MR1", date: "18 Dec 2020", status: "EXPEDITION", price: 250 },
      { id: 2, numOrder: "20201218MR2", date: "14 Dec 2020", status: "EXPEDITION", price: 250 },
      { id: 3, numOrder: "20201218MR3", date: "10 Dec 2020", status: "DELIVERY", price: 250 },
      { id: 4, numOrder: "20201218MR4", date: "8 Dec 2020", status: "DELIVERED", price: 250 },
      { id: 5, numOrder: "20201218MR5", date: "5 Dec 2020", status: "DELIVERED", price: 250 },
      { id: 6, numOrder: "20201218MR6", date: "1 Dec 2020", status: "DELIVERED", price: 250 },

    ])
  }
}
</script>
