import { ReactNode, useState } from 'react';
import { createContext, useContext } from 'react';
import { LoaderProps } from '@mantine/core';

type TLoaderContextProps = {
  isLoading: boolean;
  start: (loaderProps?: LoaderProps) => void;
  stop: () => void;
  loaderProps: LoaderProps;
};

const LoaderContext = createContext<TLoaderContextProps>(
  {} as TLoaderContextProps,
);
export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loaderProps, setLoaderProps] = useState<LoaderProps>({
    color: 'brandBlue',
    type: 'dots',
  });

  const start = (loaderProps?: LoaderProps) => {
    if (loaderProps) setLoaderProps(loaderProps);
    setIsVisible(true);
  };
  const stop = () => setIsVisible(false);

  return (
    <LoaderContext.Provider
      value={{ isLoading: isVisible, start, stop, loaderProps }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context)
    throw new Error('useContext must be used within a contextProvider');
  return context;
};
