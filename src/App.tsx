import { useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/auth';
import Portfolio from '@/pages/Portfolio';
import Admin from '@/pages/Admin';

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isAdmin = route.startsWith('#/admin');

  return (
    <AuthProvider>
      {isAdmin ? <Admin /> : <Portfolio />}
    </AuthProvider>
  );
}
