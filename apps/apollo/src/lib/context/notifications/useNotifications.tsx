import { createContext, useContext, ReactNode } from 'react';
import {
  showNotification,
  updateNotification,
  hideNotification,
} from '@mantine/notifications';
import CustomIcon from '@/components/icons/CustomIcons';

type NotificationOptions = {
  id?: string;
  title?: string;
  message: string | ReactNode;
  type?: 'success' | 'error' | 'info';
  autoClose?: number;
};

type NotificationContextType = {
  notify: (options: NotificationOptions) => void;
  update: (id: string, options: NotificationOptions) => void;
  close: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const notify = ({
    id,
    title,
    message,
    type = 'info',
    autoClose = 3000,
  }: NotificationOptions) => {
    showNotification({
      id,
      title,
      message,
      autoClose,
      color: type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue',
      withBorder:true,
      icon:
        type === 'success' ? (
          <CustomIcon
            src="MaterialIcon"
            name="MdCheckCircle"
            style={{ height: '20px', width: '20px' }}
          />
        ) : type === 'error' ? (
          <CustomIcon src="MaterialIcon" name="MdClose" />
        ) : (
          <CustomIcon src="MaterialIcon" name="MdCheckCircleOutline" />
        ),
    });
  };

  const update = (
    id: string,
    { title, message, type = 'info', autoClose = 3000 }: NotificationOptions,
  ) => {
    updateNotification({
      id,
      title,
      message,
      autoClose,
      color: type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue',
      withBorder:true,
      icon:
        type === 'success' ? (
          <CustomIcon
            src="MaterialIcon"
            name="MdCheckCircle"
            style={{ height: '20px', width: '20px' }}
          />
        ) : type === 'error' ? (
          <CustomIcon src="MaterialIcon" name="MdClose" />
        ) : (
          <CustomIcon src="MaterialIcon" name="MdCheckCircleOutline" />
        ),
    });
  };

  const close = (id: string) => {
    hideNotification(id);
  };

  return (
    <NotificationContext.Provider value={{ notify, update, close }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  return context;
};
