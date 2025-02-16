import solidJs from '@astrojs/solid-js'
import starlight from '@astrojs/starlight'
import { defineConfig, passthroughImageService } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://sammccord.github.io',
  base: '/solid-pixi',
  image: {
    service: passthroughImageService()
  },
  integrations: [
    starlight({
      title: 'Solid Pixi',
      social: {
        github: 'https://github.com/sammccord/solid-pixi'
      },
      sidebar: [
        {
          label: 'Guides',
          autogenerate: {
            directory: 'reference'
          }
        },
        {
          label: 'Examples',
          autogenerate: {
            directory: 'guides'
          }
        }
      ]
    }),
    solidJs()
  ]
})
