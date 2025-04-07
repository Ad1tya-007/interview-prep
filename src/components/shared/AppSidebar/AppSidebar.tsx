'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui';

import { User } from './User';
import NavHeader from './NavHeader';
import { NavMain } from './NavMain';

const fake_user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://github.com/shadcn.png',
};

export default function AppSidebar() {
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <NavHeader />
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
        </SidebarContent>
        <SidebarFooter>
          <User user={fake_user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
