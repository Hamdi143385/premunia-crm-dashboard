
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  const { user, signOut } = useAuth();

  const getInitials = (nom?: string, prenom?: string) => {
    if (!nom && !prenom) return 'U';
    return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden" />
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Bienvenue, {user?.utilisateur?.prenom || 'Utilisateur'}
            </h1>
            <p className="text-sm text-slate-500 capitalize">
              {user?.role?.nom || 'Utilisateur'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-slate-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white text-sm">
                    {getInitials(user?.utilisateur?.nom, user?.utilisateur?.prenom)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium text-slate-700">
                  {user?.utilisateur?.prenom} {user?.utilisateur?.nom}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800">
                  {user?.utilisateur?.prenom} {user?.utilisateur?.nom}
                </p>
                <p className="text-xs text-slate-500">{user?.utilisateur?.email}</p>
              </div>
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-slate-50">
                <User className="h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-slate-50">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex items-center space-x-2 hover:bg-red-50 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
