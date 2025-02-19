import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários mockados para teste
const MOCK_USERS = [
  {
    id: '1',
    email: 'ti@terris.com.br',
    password: 'ti@753',
    name: 'Administrador',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'dados@terris.com.br',
    password: 'dados@159',
    name: 'Mailon',
    role: 'user' as const,
  },
  {
    id: '3',
    email: 'financeiro@terris.com.br',
    password: 'financeiro@159',
    name: 'Francieli',
    role: 'user' as const,
  },
  {
    id: '4',
    email: 'compras@terris.com.br',
    password: 'compras@159',
    name: 'Kely',
    role: 'user' as const,
  },
  {
    id: '5',
    email: 'qualidade@terris.com.br',
    password: 'qualidade@159',
    name: 'Michele',
    role: 'user' as const,
  },
  {
    id: '6',
    email: 'producao@terris.com.br',
    password: 'producao@159',
    name: 'Joanes',
    role: 'user' as const,
  },
  {
    id: '7',
    email: 'engenharia1@terris.com.br',
    password: 'engenharia1@159',
    name: 'Marcos',
    role: 'user' as const,
  },
  {
    id: '8',
    email: 'engenahriadeproduto@terris.com.br',
    password: 'engenhariadeproduto@159',
    name: 'Mateus',
    role: 'user' as const,
  },
  {
    id: '9',
    email: 'engenahria3@terris.com.br',
    password: 'engenharia3@159',
    name: 'Cristian',
    role: 'user' as const,
  },
  {
    id: '10',
    email: 'comercial1@terris.com.br',
    password: 'comercial1@159',
    name: 'Paulo',
    role: 'user' as const,
  },
  {
    id: '11',
    email: 'marketing@terris.com.br',
    password: 'marketing@159',
    name: 'Italo',
    role: 'user' as const,
  },
  {
    id: '12',
    email: 'pos.vendas1@terris.com.br',
    password: 'posvendas1@159',
    name: 'Danieli',
    role: 'user' as const,
  },
  {
    id: '13',
    email: 'pos.vendas2@terris.com.br',
    password: 'posvendas2@159',
    name: 'Vinicius',
    role: 'user' as const,
  },
  {
    id: '14',
    email: 'estoque@terris.com.br',
    password: 'estoque@159',
    name: 'Denis',
    role: 'user' as const,
  },
  {
    id: '15',
    email: 'terris@terris.com.br',
    password: 'terris@753',
    name: 'Josimar',
    role: 'user' as const,
  },
  {
    id: '15',
    email: 'comercial@terris.com.br',
    password: 'comercial@753',
    name: 'Sidney',
    role: 'user' as const,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Credenciais inválidas');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
