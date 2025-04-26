// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-auth-utils'],
  css: ['~/assets/css/main.css'],
  nitro: {
    experimental: {
      websocket: true
    }
  },
  app: {
    head: {
      title: "Chat @ loff.online"
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
})