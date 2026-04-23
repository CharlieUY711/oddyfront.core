import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { supabase } from '../../utils/supabase/client';

export function useRequireAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/?login=true&redirect=' + encodeURIComponent(location.pathname));
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });
  }, []);

  return { loading, user };
}