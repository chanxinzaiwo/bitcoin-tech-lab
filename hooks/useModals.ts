import { useReducer, useCallback } from 'react';

export type ModalType = 'shortcuts' | 'learningPath' | 'glossary' | 'achievements';

interface ModalState {
  shortcuts: boolean;
  learningPath: boolean;
  glossary: boolean;
  achievements: boolean;
}

type ModalAction =
  | { type: 'OPEN'; modal: ModalType }
  | { type: 'CLOSE'; modal: ModalType }
  | { type: 'TOGGLE'; modal: ModalType }
  | { type: 'CLOSE_ALL' };

const initialState: ModalState = {
  shortcuts: false,
  learningPath: false,
  glossary: false,
  achievements: false,
};

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, [action.modal]: true };
    case 'CLOSE':
      return { ...state, [action.modal]: false };
    case 'TOGGLE':
      return { ...state, [action.modal]: !state[action.modal] };
    case 'CLOSE_ALL':
      return initialState;
    default:
      return state;
  }
}

export interface UseModalsReturn {
  modals: ModalState;
  open: (modal: ModalType) => void;
  close: (modal: ModalType) => void;
  toggle: (modal: ModalType) => void;
  closeAll: () => void;
}

export function useModals(): UseModalsReturn {
  const [modals, dispatch] = useReducer(modalReducer, initialState);

  const open = useCallback((modal: ModalType) => {
    dispatch({ type: 'OPEN', modal });
  }, []);

  const close = useCallback((modal: ModalType) => {
    dispatch({ type: 'CLOSE', modal });
  }, []);

  const toggle = useCallback((modal: ModalType) => {
    dispatch({ type: 'TOGGLE', modal });
  }, []);

  const closeAll = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL' });
  }, []);

  return { modals, open, close, toggle, closeAll };
}
