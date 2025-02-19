import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  sector: string;
  problemType: string;
  description: string;
  urgency: 'Urgente' | 'Médio' | 'Moderado';
  status: 'Pendente' | 'Em Andamento' | 'Finalizado';
  createdAt: string;
  updatedAt: string;
  solution?: string;
  cost?: number;
  startTime?: string;
  endTime?: string;
  history: {
    timestamp: string;
    description: string;
  }[];
}

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  getTicketsByUser: (userId: string) => Ticket[];
  getAllTickets: () => Ticket[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  const createTicket = (
    ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>
  ) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Pendente',
      history: [
        {
          timestamp: new Date().toISOString(),
          description: 'Chamado criado',
        },
      ],
    };

    setTickets((prev) => [...prev, newTicket]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          const updatedTicket = {
            ...ticket,
            ...updates,
            updatedAt: new Date().toISOString(),
            history: [
              ...ticket.history,
              {
                timestamp: new Date().toISOString(),
                description: `Status atualizado para: ${updates.status || ticket.status}`,
              },
            ],
          };
          return updatedTicket;
        }
        return ticket;
      })
    );
  };

  const getTicketsByUser = (userId: string) => {
    return tickets.filter((ticket) => ticket.userId === userId);
  };

  const getAllTickets = () => tickets;

  return (
    <TicketContext.Provider
      value={{ tickets, createTicket, updateTicket, getTicketsByUser, getAllTickets }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}