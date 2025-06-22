
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/layout/AppSidebar";
import { AppHeader } from "./components/layout/AppHeader";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import ContactDetail from "./pages/ContactDetail";
import Propositions from "./pages/Propositions";
import Contrats from "./pages/Contrats";
import Taches from "./pages/Taches";
import Objectifs from "./pages/Objectifs";
import Campagnes from "./pages/Campagnes";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/contacts" element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              } />
              <Route path="/propositions" element={
                <ProtectedRoute>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Propositions</h1>
                    <p className="text-slate-600">Cette section est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/contrats" element={
                <ProtectedRoute>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Contrats</h1>
                    <p className="text-slate-600">Cette section est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/taches" element={
                <ProtectedRoute>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Tâches</h1>
                    <p className="text-slate-600">Cette section est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/equipes" element={
                <ProtectedRoute allowedRoles={['admin', 'gestionnaire']}>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Équipes</h1>
                    <p className="text-slate-600">Cette section est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/objectifs" element={
                <ProtectedRoute allowedRoles={['admin', 'gestionnaire']}>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Objectifs</h1>
                    <p className="text-slate-600">Cette section est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/campagnes" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Campagnes</h1>
                    <p className="text-slate-600">Cette section est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/import" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Import</h1>
                    <p className="text-slate-600">Cette section est en cours de développement.</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
