import arcjet, { shield, detectBot } from '@arcjet/next';
import { serverEnv } from '@/config/env.server';

export const arcjetClient = arcjet({
  key: serverEnv.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE'],
    }),
  ],
});
