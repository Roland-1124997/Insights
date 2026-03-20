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
      '*/10 * * * *': ['analytics'],
      '0 1 1 */1 *': ['revalidate-imap-cache'],
      '0 12 */5 * *': ['supabase'],
      '30 22 * * 0': ['notifications']
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

    security: {
      key: process.env.SECURITY_KEY,
      header: process.env.SECURITY_HEADER,
      encryptSecret: process.env.SECURITY_ENCRYPT_SECRET,
      encryptAlgorithm: process.env.SECURITY_ENCRYPT_ALGORITHM
    },

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
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      securityKey: process.env.SECURITY_KEY,
    },

  },

  routeRules: {
    '/statistieken/': { redirect: '/' },
    '/auth/': { redirect: '/auth/login' },
    '/auth/**': { appLayout: 'auth' },
  },

  app: {
    head: {
      title: 'Insights - Personal Dashboard',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/icons/icon_192-blue.png', sizes: '192x192' },
        { rel: 'apple-touch-icon', href: '/icons/icon_192-blue.png', sizes: '192x192' },
        // Landscape splash screens
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_17_Pro_Max__iPhone_16_Pro_Max_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_17_Pro__iPhone_17__iPhone_16_Pro_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_Air_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_17e__iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/iPhone_11__iPhone_XR_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", href: "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/13__iPad_Pro_M4_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/12.9__iPad_Pro_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/11__iPad_Pro_M4_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/10.9__iPad_Air_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/10.5__iPad_Air_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/10.2__iPad_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", href: "/splash_screens/8.3__iPad_Mini_landscape.png" },
        // Portrait splash screens
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_17_Pro_Max__iPhone_16_Pro_Max_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_17_Pro__iPhone_17__iPhone_16_Pro_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_Air_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_17e__iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/iPhone_11__iPhone_XR_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", href: "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/13__iPad_Pro_M4_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/12.9__iPad_Pro_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/11__iPad_Pro_M4_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/10.9__iPad_Air_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/10.5__iPad_Air_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/10.2__iPad_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png" },
        { rel: 'apple-touch-startup-image', media: "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", href: "/splash_screens/8.3__iPad_Mini_portrait.png" },
        // Preconnect and font loading for improved performance
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: "" },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Livvic:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,900&display=swap' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
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
      lang: "nl-NL",
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
          src: "icons/icon_120-blue.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          src: "icons/icon_144-blue.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/icon_152-blue.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "icons/icon_192-blue.png",
          sizes: "192x192",
          type: "image/svg",
        },
        {
          src: "icons/icon_512-blue.png",
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