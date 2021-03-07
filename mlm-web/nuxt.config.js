export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'server',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'mlm-web',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet',
        href: "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
        crossorigin:"anonumous",
        integrity: "sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    './plugins/api.js',
    './plugins/auth.js',
    { src: './plugins/vue-tour.js', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/vuetify'
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
    'cookie-universal-nuxt',
    '@nuxtjs/cloudinary',
    '@nuxtjs/apollo',
    '@nuxtjs/auth-next'
  ],

  serverMiddleware: [
    "~/api/index.js"
  ],

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

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {}
  },

  colorMode: {
    classSuffix: ''
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: false
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
        }
      },
      google: {
        scheme: 'oauth2',
        endpoints: {
          authorization: "",
          token: "",
          userInfo: "",
          logout: ""
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: 'token',
        grantType: 'authorization_code',
        accessType: undefined,
        redirectUri: undefined,
        logoutRedirectUri: undefined,
        clientId: '967465075436-flqr8d3jjb9saeaku7rliojhk32nr4r3.apps.googleusercontent.com',
        scope: ['openid', 'profile', 'email'],
        state: 'UNIQUE_AND_NON_GUESSABLE',
      }
    },
    redirect: {
      login: '/comptes/connexion',
      logout: '/',
      callback: '/comptes/connexion',
      home: '/'
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  cloudinary: {
    cloudName: "mrode-developpers"
  },

  apollo: {
    clientConfigs: {
      default: "~/apollo/default.js",
    }
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  env: {
    REGISTER_STEP_1: "JrlP4ilBUuMyb8C",
    GOOGLE_AUTH_CLIENT_ID: "967465075436-flqr8d3jjb9saeaku7rliojhk32nr4r3.apps.googleusercontent.com",
    GOOGLE_AUTH_ACCESS_CODE: "q5S6W-GJqoI2zz5CaMuqUCNy",
    API_URL: "http://localhost:4000"
  }
}
