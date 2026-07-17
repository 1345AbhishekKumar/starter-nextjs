import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { Navbar1 } from '@/components/sections/navbar-1';

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className='relative flex min-h-screen flex-col'>
      <div className='paper-texture'></div>
      <Navbar1 />
      <HeroSection />
    </div>
  );
}
