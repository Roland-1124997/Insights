// https://nuxt.com/docs/api/configuration/nuxt-config

import { loopThroughChunks } from './server/utils/chunks/functions';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    "nuxt-umami",
    "nuxt-charts",
    "@vee-validate/nuxt",
    "@nuxt/a11y",
  ],
  nitro: {
    scheduledTasks: {
      '10 * * * *': ['analytics'],
      '0 12 */5 * *': ['supabase'],
      '30 23 * * 0': ['notifications']
    },
    experimental: {
      tasks: true
    },
  },

  vite: {
    build: {
      // Verhoog de waarschuwing limiet voor chunk grootte, aangezien sommige libraries (zoals elk.js) een grote footprint hebben
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            return loopThroughChunks(id);
          }
        }
      }
    }
  },

  a11y: {
    enabled: false, //disable for mobile testing
    defaultHighlight: false,
    logIssues: true,
  },

  veeValidate: {
    autoImports: true,
  },

  supabase: {
    redirect: false,
    cookiePrefix: "access-token",
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true
    },
    types: '~~/server/utils/supabase/types/database.types.ts'
  },

  umami: {
    id: process.env.UMAMI_ID,
    host: process.env.UMAMI_HOST,
    useDirective: true,
    autoTrack: true,
    enabled: true,
    proxy: "cloak",
    ignoreLocalhost: true,
    urlOptions: {
      excludeSearch: true,
      excludeHash: true
    }
  },

  runtimeConfig: {
    SaltToken: process.env.SaltToken,
    appId: process.env.GitAppId,
    privateKey: process.env.GitPrivateKey,
    clientId: process.env.GitClientID,
    clientSecret: process.env.GitClientSecret,

    email: {
      key: process.env.RESEND_API_KEY,
      sender: process.env.EMAIL_FROM_ADDRESS
    },

    UMAMI_API_KEY: process.env.UMAMI_API_KEY,
    UMAMI_HOST: process.env.UMAMI_HOST,
    UMAMI_ID: process.env.UMAMI_ID,

    IMAP_HOST: process.env.IMAP_HOST,
    IMAP_PORT: process.env.IMAP_PORT,
    IMAP_SECURE: process.env.IMAP_SECURE,
    IMAP_USER: process.env.IMAP_USER,
    IMAP_PASS: process.env.IMAP_PASS,

    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,

    whitelistedDomains: process.env.WHITELISTED_DOMAINS,
    production: process.env.NODE_ENV === 'development' ? false : true,

    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    public: {
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY
    },

  },


  routeRules: {
    '/auth/': { redirect: '/auth/login' },
    '/auth/**': { appLayout: 'auth' },
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/icons/icon_512.png' },
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  },

  icon: {
    clientBundle: {
      scan: true,
    }
  },

  pwa: {
    strategies: "injectManifest",
    registerType: 'autoUpdate',
    manifest: {
      name: "Insights",
      short_name: "Insights",
      description: "Personal dashboard application",
      orientation: "portrait",
      background_color: "#FFFFFF",
      start_url: "/",
      scope: "/",
      theme_color: "#FFFFFF",
      display: "standalone",
      display_override: ["window-controls-overlay", "standalone", "minimal-ui", "fullscreen", "browser"],
      screenshots: [
        {
          "src": "screenshots/desktop.png",
          "sizes": "2557x1414",
          "type": "image/png",
          "form_factor": "wide",
          "label": "Desktop screen showing main dashboard with various widgets and charts"
        },
        {
          "src": "screenshots/mobile.png",
          "sizes": "708x1439",
          "type": "image/png",
          "platform": "ios",
          "label": "Mobile screen showing main navigation and featured content"
        }
      ],
      icons: [
        {
          src: "icons/icon_120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          src: "icons/icon_144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/icon_152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "icons/icon_192.png",
          sizes: "192x192",
          type: "image/svg",
        },
        {
          src: "icons/icon_512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      launch_handler: {
        client_mode: ["navigate-existing", "auto"]
      }
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 60 * 60 // check for updates every hour
    }
  },
})