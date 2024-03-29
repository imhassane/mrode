export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'store',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" },
    ],
    script: [
      { src: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/js/all.min.js", defer: "defer" }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    './plugins/vue-tailwind.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-i18n',
    '@nuxtjs/auth-next',
    '@nuxtjs/apollo'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  apollo: {
    clientConfigs: {
      default: "~/apollo/default.js",
    }
  },

  i18n: {
    defaultLocale: 'fr',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true,  // recommended
    },
    locales: ['en', 'fr'],
    vueI18nLoader: true,
    lazy: true
  },

  serverMiddleware: [
    '~/api/index.js',
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
