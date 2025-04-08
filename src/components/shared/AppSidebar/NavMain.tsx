'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui';
import {
  Star,
  Compass,
  NotepadText,
  LucideIcon,
  Send,
  LifeBuoy,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type UpperNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type LowerNavItem = {
  title: string;
  icon: LucideIcon;
};

const upperItems: UpperNavItem[] = [
  { title: 'Explore', url: '#', icon: Compass },
  { title: 'Your Interviews', url: '#', icon: Star },
  { title: 'Reports', url: '#', icon: NotepadText },
];

const lowerItems: LowerNavItem[] = [
  { title: 'Support', icon: LifeBuoy },
  { title: 'Feedback', icon: Send },
];

export function NavMain() {
  const router = useRouter();
  return (
    <SidebarGroup className="h-full justify-between">
      <SidebarMenu className="gap-2">
        {upperItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => {
                router.push(item.url);
              }}
              className="hover:cursor-pointer">
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu>
        {lowerItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title}>
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
