import React from 'react';
import { FileText, UserPlus, Sparkles, CreditCard } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  details?: string;
  icon: React.ReactNode;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    title: 'New draft "Quiet Rain" sowed',
    timestamp: '10m ago',
    details: 'Reflections on cozy winter coffee and rainfall.',
    icon: <FileText size={14} />,
  },
  {
    id: '2',
    title: 'Creator Olivia Vance joined the flock',
    timestamp: '2h ago',
    details: 'New member profile established in the community space.',
    icon: <UserPlus size={14} />,
  },
  {
    id: '3',
    title: 'Work "Wildflowers under Dawn" updated',
    timestamp: '5h ago',
    details: 'Nature category journal entry expanded and structured.',
    icon: <Sparkles size={14} />,
  },
  {
    id: '4',
    title: 'Supporter subscription activated',
    timestamp: '1d ago',
    details: 'Upgraded user tier to Premium Pro Meadow Plan.',
    icon: <CreditCard size={14} />,
  },
];

export function ActivityFeed() {
  return (
    <div className='bento-cell flex h-full min-h-[300px] flex-col justify-between p-6'>
      <div>
        <p className='font-mono-custom text-[10px] tracking-widest text-[#525252]/60 uppercase'>
          Recent Activity
        </p>
        <h3 className='mt-1 mb-6 text-base font-semibold text-[#111111]'>
          Meadow Stream
        </h3>

        {/* Timeline List */}
        <div className='relative space-y-6 pl-6 before:absolute before:inset-y-2 before:left-[11px] before:w-[1px] before:bg-[#111111]/10'>
          {mockActivities.map((act) => (
            <div key={act.id} className='group relative'>
              {/* Timeline marker */}
              <div className='absolute top-1.5 left-[-23px] flex size-[15px] items-center justify-center rounded-full border border-white bg-[#f9f8f6] text-[#6e9c4e] transition-all group-hover:bg-[#6e9c4e] group-hover:text-white'>
                <div className='size-1.5 rounded-full bg-[#6e9c4e] group-hover:bg-white' />
              </div>

              {/* Content box */}
              <div className='flex flex-col gap-1'>
                <div className='flex items-center justify-between gap-4'>
                  <span className='flex items-center gap-1.5 text-xs leading-tight font-semibold text-[#111111]'>
                    <span className='text-[#525252]/70'>{act.icon}</span>
                    {act.title}
                  </span>
                  <span className='font-mono-custom text-[9px] tracking-wider whitespace-nowrap text-[#525252]/50 uppercase'>
                    {act.timestamp}
                  </span>
                </div>
                {act.details && (
                  <p className='font-mono-custom pl-5 text-[11px] leading-relaxed text-[#525252]/80'>
                    {act.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-6 flex items-center justify-between border-t border-[#111111]/5 pt-3'>
        <span className='font-mono-custom text-[9px] tracking-wider text-[#525252]/60 uppercase'>
          Stream Status
        </span>
        <span className='font-mono-custom flex items-center gap-1 text-[10px] font-semibold text-[#6e9c4e]'>
          <span className='inline-block size-1.5 animate-pulse rounded-full bg-[#6e9c4e]' />
          Live updates online
        </span>
      </div>
    </div>
  );
}
