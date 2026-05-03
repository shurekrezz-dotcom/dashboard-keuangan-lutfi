import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';
import Login from './pages/Login';
import Register from './pages/Register';
import { isAuthenticated } from './lib/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type AuthScreen = 'login' | 'register';

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => isAuthenticated());
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    // Setelah register berhasil, arahkan ke halaman login
    setAuthScreen('login');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    queryClient.clear();
  };

  // Belum login → tampilkan Login atau Register
  if (!loggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        {authScreen === 'login' ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthScreen('register')}
          />
        ) : (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setAuthScreen('login')}
          />
        )}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    );
  }

  // Sudah login → tampilkan router / dashboard
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}