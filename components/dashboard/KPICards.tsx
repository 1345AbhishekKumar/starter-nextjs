import React from 'react';
import { Users, FileText, Compass, Activity, ArrowUpRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: string;
  icon: React.ReactNode;
}

function KPICard({ title, value, subtext, trend, icon }: KPICardProps) {
  return (
    <div className='bento-cell flex min-h-[160px] flex-col justify-between p-6'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='font-mono-custom text-[10px] tracking-widest text-[#525252]/60 uppercase'>
            {title}
          </p>
          <p className='font-handwritten mt-2 text-4xl leading-tight font-normal text-[#111111]'>
            {value}
          </p>
        </div>
        <div className='flex size-9 items-center justify-center rounded-full bg-[#6e9c4e]/10 text-[#6e9c4e]'>
          {icon}
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between border-t border-[#111111]/5 pt-3'>
        <span className='font-mono-custom text-[9px] tracking-wider text-[#525252]/80 uppercase'>
          {subtext}
        </span>
        {trend && (
          <span className='flex items-center gap-0.5 rounded bg-[#ECFDF5] px-1.5 py-0.5 text-[9px] font-medium text-[#009966]'>
            {trend}
            <ArrowUpRight size={10} />
          </span>
        )}
      </div>
    </div>
  );
}

export function KPICards() {
  const cards = [
    {
      title: 'Active Sessions',
      value: '1,280',
      subtext: 'Growth this week',
      trend: '+12%',
      icon: <Activity size={16} />,
    },
    {
      title: 'New Users',
      value: '142',
      subtext: 'Joined flock',
      trend: '+8%',
      icon: <Users size={16} />,
    },
    {
      title: 'Creative Drafts',
      value: '4',
      subtext: '2 pending reviews',
      trend: '+4%',
      icon: <FileText size={16} />,
    },
    {
      title: 'Active Journals',
      value: '1',
      subtext: 'nature-logs',
      trend: 'active',
      icon: <Compass size={16} />,
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card) => (
        <KPICard
          key={card.title}
          title={card.title}
          value={card.value}
          subtext={card.subtext}
          trend={card.trend}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
