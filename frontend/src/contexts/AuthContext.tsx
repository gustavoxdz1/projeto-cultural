import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { clearSession, getStoredSession, saveSession, type Session, type SessionUser } from '../services/session';

type AuthContextValue = {
  isHydrated: boolean;
  session: Session | null;
  user: SessionUser | null;
  setAuthSession: (session: Session) => void;
  updateAuthUser: (user: SessionUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
    setIsHydrated(true);
  }, []);

  function setAuthSession(nextSession: Session) {
    saveSession(nextSession);
    setSession(nextSession);
  }

  function updateAuthUser(user: SessionUser) {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const nextSession = {
        ...currentSession,
        user,
      };

      saveSession(nextSession);
      return nextSession;
    });
  }

  function logout() {
    clearSession();
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isHydrated,
        session,
        user: session?.user ?? null,
        setAuthSession,
        updateAuthUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
