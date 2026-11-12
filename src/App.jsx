import { useEffect,useState } from "react";
import { Navigate,Route, Routes } from "react-router";

import { useSecretLogout } from "./lib/logoutSecret";
import { supabase } from "./lib/supabase";
import BookDetails from "./pages/BookDetails";
import Library from "./pages/Library";
import Login from "./pages/Login";


export default function App() {

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useSecretLogout();
  
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    }

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
    });

    checkSession();

    return () => subscription.unsubscribe();

  }, []);

  if (loading) return <p>Loading...</p>;

  return (

    <Routes>
      {/* default route redirects to /library */}
      <Route
        path="/"
        element={<Navigate to="/library" replace />}
      />
      {/* library route, redirects to /login if not authenticated */}
      <Route 
        path="/library" 
        element={ 
          session 
          ? <Library />
          : <Navigate to="/login" replace />
        } 
      />
      {/* book details route, redirects to /login if not authenticated */}
      <Route
        path="/library/:bookId"
        element={
          session
            ? <BookDetails />
            : <Navigate to="/login" replace />
        }
      />
      {/* login route, redirects to /library if already authenticated */}
      <Route 
        path="/login" 
        element={ 
          !session 
          ? <Login />
          : <Navigate to="/library" replace />
        } 
      />
    </Routes>
  )
}
