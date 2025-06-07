import { createContext, useContext, useState, ReactNode, useRef } from 'react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  iconUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const recentMessages = useRef<Set<string>>(new Set()); // ✅ Track recent messages globally

  const addNotification = ({ title, message, iconUrl }: Omit<Notification, 'id'>) => {
    // ✅ If already shown, skip it
    if (recentMessages.current.has(message)) return;

    const id = Date.now();
    const newNotification: Notification = { id, title, message, iconUrl };

    // Add to list and remember it
    setNotifications((prev) => [...prev, newNotification]);
    recentMessages.current.add(message);

    // Remove after 5s from both UI and recentMessages
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      recentMessages.current.delete(message); // ✅ Allow it again in the future
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
