import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tailwind from 'eslint-plugin-tailwindcss';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  tailwind.configs.recommended,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.agents/**',
  ]),
  {
    plugins: {
      tailwindcss: tailwind,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: 'app/globals.css',
      },
    },
    rules: {
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: [
            'paper-texture',
            'fade-in-up',
            'font-handwritten',
            'font-mono-custom',
            'bento-cell-img',
            'bento-cell',
            'outline-btn',
            'section-divider',
            'magnetic-btn',
            'magnetic-btn-inner',
            'floating-nav',
            'nav-link',
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
]);

export default eslintConfig;
