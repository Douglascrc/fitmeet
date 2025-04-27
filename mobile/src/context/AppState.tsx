import {createContext, useCallback, useReducer} from 'react';
import {ActionTypes, reducer} from './reducer/reducer';
import {initialState} from './state/state';

export type AppContext = {
  token: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};

export const AppContext = createContext<AppContext>(initialState);

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({children}: AppProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback((authToken: string) => {
    dispatch({
      type: ActionTypes.LOGIN,
      payload: {token: authToken},
    });
  }, []);

  const logout = useCallback(() => {
    dispatch({type: ActionTypes.LOGOUT});
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}>
      {children}
    </AppContext.Provider>
  );
};
