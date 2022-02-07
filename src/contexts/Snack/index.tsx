import React, {createContext, useCallback, useContext, useState} from 'react';
import {View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import uuid from 'react-native-uuid';
import {SnackBar} from '../../components/SnackBar';
import {Snack, SnackOptions, SnackProviderProps} from './Snack';
import {SnackArea} from './SnackArea';

export interface SnackContext {
  addNotification: (snack: SnackOptions) => string;
  removeNotification: (snackID: string) => void;
}

export const SnackContext = createContext({} as SnackContext);

export const SnackProvider: React.FC<SnackProviderProps> = ({
  children,
  position = 'top',
  ...props
}) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);

  const addNotification = useCallback((snack: SnackOptions) => {
    const id = uuid.v4() as string;
    setSnacks(old => [...old, {...snack, id}]);
    return id;
  }, []);

  const removeNotification = useCallback((snackID: string) => {
    setSnacks(old => {
      const oldCopy = [...old];
      const idx = oldCopy.findIndex(snack => snack.id === snackID);
      if (idx > -1) {
        oldCopy.splice(idx, 1);
      }
      return oldCopy;
    });
  }, []);

  return (
    <SnackContext.Provider value={{addNotification, removeNotification}}>
      {position === 'top' ? (
        <SnackArea position="top">
          {snacks.map(snack => {
            return (
              <SnackBar title={snack.title} key={snack.id} type={snack.type} />
            );
          })}
        </SnackArea>
      ) : (
        <></>
      )}
      {children}
    </SnackContext.Provider>
  );
};

export const useSnack = () => {
  const context = useContext(SnackContext);
  if (Object.values(context).length === 0) {
    throw new Error('useSnack cannot be used outside of a SnackProvider');
  }
  return context;
};
