import { useState, useCallback, useLayoutEffect } from "react";

type ModalOptions = {
  text: string;
  onOk: () => void;
};

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const openModal = useCallback((text: string, onOk: () => void) => {
    setModalOptions({ text, onOk });
    setIsVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  useLayoutEffect(() => {
    return () => closeModal();
  }, [closeModal]);

  return {
    isVisible,
    modalOptions,
    openModal,
    closeModal,
  };
};
