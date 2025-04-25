import {
  SidebarTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';

export function AppSidebarTrigger() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger className="fixed top-5 right-5 z-10" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Sidebar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default AppSidebarTrigger;
