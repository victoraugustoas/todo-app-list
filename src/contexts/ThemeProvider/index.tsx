import React, {createContext, useContext} from 'react';
import {createTheme, Theme, ThemeOptions} from './Theme';

export const ThemeContext = createContext({} as Theme);

export const ThemeProvider: React.FC<{theme?: ThemeOptions}> = ({
  children,
  theme,
}) => {
  return (
    <ThemeContext.Provider value={createTheme(theme)}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (Object.values(context).length === 0) {
    throw new Error('useTheme cannot be used outside of a ThemeProvider');
  }
  return context;
};
