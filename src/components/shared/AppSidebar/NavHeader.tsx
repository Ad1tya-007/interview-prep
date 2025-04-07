import { SidebarMenuItem } from '@/components/ui/sidebar';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { SidebarMenu } from '@/components/ui/sidebar';
import { MessageCircleCode } from 'lucide-react';

export default function NavHeader() {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a href="#">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <MessageCircleCode className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">InterviewPrep</span>
                <span className="truncate text-xs">Prep Smarter</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
