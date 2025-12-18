import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierPlugin from 'eslint-plugin-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Flat config não aceita "extends: ['prettier']". Registramos o plugin manualmente.
    plugins: { prettier: prettierPlugin },
  },
  {
    rules: {
      'no-console': 'error', // impede o uso de console.log, console.error, etc.
      //'no-alert': 'error', // impede o uso de alert, confirm, etc.
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
