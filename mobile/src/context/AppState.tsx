import {createContext, useCallback, useEffect, useReducer} from "react";
import {ActionTypes, reducer} from "./reducer/reducer";
import {initialState} from "./state/state";
import {AuthState} from "./state/state";
import Keychain from "react-native-keychain";
import {activities_api, auth_api, user_api} from "../services/api";

export const AppContext = createContext<AuthState>(initialState);

type AppProviderProps = {
  children: React.ReactNode;
};

const TOKEN_STORAGE_KEY = "com.reactexample.token";
const USER_STORAGE_KEY = "com.reactexample.user";

export const AppStateProvider = ({children}: AppProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await Keychain.getGenericPassword({
          service: TOKEN_STORAGE_KEY,
        });
        const user = await Keychain.getGenericPassword({
          service: USER_STORAGE_KEY,
        });

        if (token && user) {
          dispatch({
            type: ActionTypes.LOGIN,
            payload: {token: token.password, user: JSON.parse(user.password)},
          });
        } else {
          dispatch({type: ActionTypes.LOGOUT, payload: null});
        }
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  async function storageAuthData(token: string, user: any) {
    const a = await Keychain.setGenericPassword("token", token, {
      service: TOKEN_STORAGE_KEY,
    });
    const b = await Keychain.setGenericPassword("user", JSON.stringify(user), {
      service: USER_STORAGE_KEY,
    });
  }

  async function removeAuthData() {
    await Keychain.resetGenericPassword({service: TOKEN_STORAGE_KEY});
    await Keychain.resetGenericPassword({service: USER_STORAGE_KEY});
  }

  const login = useCallback(async (email: string, password: string) => {
    try {
      const respAuth = await auth_api.post("/sign-in", {email, password});

      if (respAuth instanceof Error) {
        return respAuth.message;
      }
      const responseData: any = respAuth.data;
      console.log(responseData);
      const user = {
        id: responseData.id,
        name: responseData.name,
        email: responseData.email,
        cpf: responseData.cpf,
        avatar: responseData.avatar,
        xp: responseData.xp,
        level: responseData.level,
        achievements: responseData.achievements,
      };
      await storageAuthData(responseData.token, user);
      dispatch({
        type: ActionTypes.LOGIN,
        payload: {token: responseData.token, user},
      });

      auth_api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${responseData.token}`;
      user_api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${responseData.token}`;
      activities_api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${responseData.token}`;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
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
