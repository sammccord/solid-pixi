import solidJs from '@astrojs/solid-js'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
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
            directory: 'guides'
          }
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference'
          }
        }
      ]
    }),
    solidJs()
  ]
})
