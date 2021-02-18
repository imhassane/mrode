<template>
  <div class="relative" v-if="catalog">
    <div class="pb-2 border-b">
      <button
        class="px-2 py-1 text-white font-semibold bg-black border-black border"
        @click="$router.back()"><i class="fas fa-arrow-left mr-2"></i>Retour</button>
    </div>
    <mlm-catalogue-resume
      :id="catalog.id" :title="catalog.title"
      :description="catalog.description" :cover="catalog.cover"
    />
    <div class="border-b">
      <mlm-catalogue-best-sellers :products="catalog.bestSellers" />
    </div>

    <div>
      <mlm-catalogue-products :products="catalog.products" />
    </div>
  </div>
  <div v-else>
    Aucun catalogue
  </div>
</template>

<script>
import MlmCatalogueBestSellers from "../../../components/shop/mlm-catalogue-best-sellers";
import MlmCatalogueResume from "../../../components/shop/mlm-catalogue-resume";
import MlmCatalogueProducts from "../../../components/shop/mlm-catalogue-products";
export default {
  components: {MlmCatalogueProducts, MlmCatalogueResume, MlmCatalogueBestSellers},
  head: () => ({
    title: "Catalogue"
  }),
  computed: {
    catalog: () => ({
      id: 1,
      title: "Parfums",
      description: "Notre collection de parfums créés à partir de fleurs aux parfums uniques pour vous donner un produit d'une qualité supérieure",
      cover: "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?cs=srgb&dl=pexels-valeria-boltneva-1961795.jpg&fm=jpg",
      bestSellers: [
        {
          id: 1,
          name: "Bleu de channel",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 120,
          cover: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        },
        {
          id: 2,
          name: "Coco noir de Channel",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 150,
          cover: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
        },
        {
          id: 3,
          name: "Del Este",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 60,
          cover: "https://images.unsplash.com/photo-1515688594390-b649af70d282?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=695&q=80"
        },
        {
          id: 4,
          name: "Bathroom cleaner",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 70,
          cover: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
        },
      ],
      products: [
        {
          id: 1,
          name: "Bleu de channel",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 120,
          cover: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
        },
        {
          id: 2,
          name: "Coco noir de Channel",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 150,
          cover: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
        },
        {
          id: 3,
          name: "Del Este",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 60,
          cover: "https://images.unsplash.com/photo-1515688594390-b649af70d282?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=695&q=80"
        },
        {
          id: 4,
          name: "Dids",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 70,
          cover: "https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
          id: 5,
          name: "Dolce Gabbanna",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 150,
          cover: "https://images.pexels.com/photos/264870/pexels-photo-264870.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
          id: 6,
          name: "Escada",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 150,
          cover: "https://images.pexels.com/photos/724635/pexels-photo-724635.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
          id: 7,
          name: "Narciso",
          description: "Sauvage est un acte de création inspiré des grands espaces. Un ciel bleu ozone qui domine un désert minéral chauffé à blanc. Une composition franche pour un homme authentique et vrai.",
          price: 150,
          cover: "https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
      ]
    })
  }
}
</script>
