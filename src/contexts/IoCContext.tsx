import {interfaces} from 'inversify';
import React, {createContext, useContext} from 'react';
import container from '../ioc';

export interface IIoCContext {
  serviceContainer: interfaces.Container;
}

const IoCContext = createContext<IIoCContext>({} as IIoCContext);

const IoCProvider: React.FC = ({children}) => {
  return (
    <IoCContext.Provider value={{serviceContainer: container}}>
      {children}
    </IoCContext.Provider>
  );
};

const useIoCContext = (): IIoCContext => {
  const context = useContext(IoCContext);
  if (!Object.keys(context).length) {
    throw new Error(
      'useIoCContext deve ser utilizado dentro de um IoCProvider',
    );
  }
  return context;
};

export {useIoCContext, IoCProvider};
