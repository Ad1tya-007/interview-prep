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
          <User />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
