import { createContext, FC, useCallback, useContext, useMemo, useState } from 'react';

interface IModalsProvider {
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
  isOpen: (name: string) => boolean;
  closeAll: () => void;
}

const ModalsContext = createContext<IModalsProvider>({} as IModalsProvider);

const ModalProvider: FC = ({ children }) => {
  const [queue, setQueue] = useState<string[]>([]);

  const openModal = useCallback(
    (name: string) => {
      if (!queue.includes(name)) {
        setQueue([...queue, name]);
      }
    },
    [queue],
  );

  const closeModal = useCallback(
    (name: string) => {
      const newQueue = queue.filter((q) => q !== name);
      setQueue(newQueue);
    },
    [queue],
  );

  const isOpen = useCallback(
    (name: string) => {
      return queue.includes(name);
    },
    [queue],
  );

  const closeAll = useCallback(() => {
    setQueue([]);
  }, []);

  const values = useMemo(
    () => ({ isOpen, closeModal, openModal, closeAll }),
    [closeAll, closeModal, isOpen, openModal],
  );

  return <ModalsContext.Provider value={values}>{children}</ModalsContext.Provider>;
};

export const useModal = () => {
  return useContext(ModalsContext);
};

export default ModalProvider;
