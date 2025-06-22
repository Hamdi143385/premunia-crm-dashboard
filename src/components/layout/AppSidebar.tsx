
import { 
  Users, 
  FileText, 
  MessageSquare, 
  CheckSquare, 
  Target, 
  Megaphone, 
  Upload, 
  LayoutDashboard,
  Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

export function AppSidebar() {
  const { userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      roles: ['admin', 'gestionnaire', 'conseiller']
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: Users,
      roles: ['admin', 'gestionnaire', 'conseiller']
    },
    {
      title: "Propositions",
      url: "/propositions",
      icon: FileText,
      roles: ['admin', 'gestionnaire', 'conseiller']
    },
    {
      title: "Contrats",
      url: "/contrats",
      icon: MessageSquare,
      roles: ['admin', 'gestionnaire', 'conseiller']
    },
    {
      title: "Tâches",
      url: "/taches",
      icon: CheckSquare,
      roles: ['admin', 'gestionnaire', 'conseiller']
    },
    {
      title: "Équipes",
      url: "/equipes",
      icon: Building2,
      roles: ['admin', 'gestionnaire']
    },
    {
      title: "Objectifs",
      url: "/objectifs",
      icon: Target,
      roles: ['admin', 'gestionnaire']
    },
    {
      title: "Campagnes",
      url: "/campagnes",
      icon: Megaphone,
      roles: ['admin']
    },
    {
      title: "Import",
      url: "/import",
      icon: Upload,
      roles: ['admin']
    },
  ];

  const filteredItems = menuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Premunia</h2>
            <p className="text-xs text-slate-500">CRM</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.url)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 ${
                      location.pathname === item.url 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-slate-600'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
