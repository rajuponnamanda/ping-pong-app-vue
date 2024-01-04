import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

interface MyCoverageOptions {
  reporter: ('cobertura' | 'text')[]
  exclude: string[]
  include: string[]
  directory: string
  cobertura: {
    file: string
  }
}
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        reporter: ['cobertura', 'text'],
        exclude: ['node_modules/**'],
        include: ['src/**'],
        directory: 'coverage', // add the directory property
        cobertura: {
          file: 'cobertura-coverage.xml'
        }
      } as MyCoverageOptions // cast the coverage object to your custom type
    }
  })
)
