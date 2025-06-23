'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui';
import { Star, NotepadText, LucideIcon, Send, LifeBuoy } from 'lucide-react';
import { useRouter } from 'next/navigation';

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const upperItems: NavItem[] = [
  { title: 'Your Interviews', url: '/interviews', icon: Star },
  { title: 'Reports', url: '/reports', icon: NotepadText },
];

const lowerItems: NavItem[] = [
  { title: 'Support', url: '/support', icon: LifeBuoy },
  { title: 'Feedback', url: '/feedback', icon: Send },
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
    </SidebarGroup>
  );
}
