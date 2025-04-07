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

type NavItem = {
  title: string;
  url?: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  { title: 'Explore', url: '#', icon: Compass },
  { title: 'Your Interviews', url: '#', icon: Star },
  { title: 'Reports', url: '#', icon: NotepadText },
  { title: 'Support', icon: LifeBuoy },
  { title: 'Feedback', icon: Send },
];

export function NavMain() {
  const router = useRouter();
  return (
    <SidebarGroup className="h-full justify-between">
      <SidebarMenu className="gap-2">
        {items.slice(0, 3).map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => {
                if (item.url) {
                  router.push(item.url);
                }
              }}
              className="hover:cursor-pointer">
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu>
        {items.slice(3).map((item) => (
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
