'use client';

import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export default function LicensePage() {
  return (
    <LegalLayout title='License Agreement' lastUpdated='July 1, 2026'>
      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          1. License Grant
        </h2>
        <p>
          Subject to the terms and conditions of this Agreement, Meadow grants
          you a limited, non-exclusive, non-transferable, revocable license to
          download, install, and use this starter kit template for personal and
          commercial projects.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          2. Permitted Use
        </h2>
        <p>Under this license, you are permitted to:</p>
        <ul className='list-inside list-disc space-y-2 pl-4'>
          <li>
            Use the template to build end-user applications for yourself or
            clients.
          </li>
          <li>
            Modify, customize, and integrate the template code with other
            software.
          </li>
          <li>
            Deploy production builds of your derived applications to public
            servers.
          </li>
        </ul>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          3. Restrictions
        </h2>
        <p>You explicitly agree not to:</p>
        <ul className='list-inside list-disc space-y-2 pl-4'>
          <li>
            Redistribute, sell, lease, or sub-license the raw starter kit code
            or components as a standalone template.
          </li>
          <li>
            Remove or obscure any original copyright, trademark, or ownership
            notices within the source files.
          </li>
        </ul>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          4. Disclaimer of Warranty
        </h2>
        <p>
          THE CODEBASE AND DOCUMENTATION ARE PROVIDED &quot;AS IS&quot;, WITHOUT
          WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
          THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
          HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER
          IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF OR
          IN CONNECTION WITH THE CODEBASE OR THE USE OR OTHER DEALINGS IN THE
          CODEBASE.
        </p>
      </section>
    </LegalLayout>
  );
}
