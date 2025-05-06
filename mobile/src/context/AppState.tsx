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
          auth_api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token.password}`;
          user_api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token.password}`;
          activities_api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token.password}`;

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
    console.log("LOGIN: Iniciando processo", email);
    try {
      console.log("LOGIN: Enviando requisição para /sign-in");
      const respAuth = await auth_api.post("/sign-in", {email, password});

      console.log("LOGIN: Resposta recebida", respAuth.status);
      console.log(
        "LOGIN: Dados da resposta",
        JSON.stringify(respAuth.data, null, 2),
      );

      const responseData: any = respAuth.data;

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

      console.log("LOGIN: Armazenando dados", user.name);
      await storageAuthData(responseData.token, user);

      console.log("LOGIN: Atualizando estado");
      dispatch({
        type: ActionTypes.LOGIN,
        payload: {token: responseData.token, user},
      });

      console.log("LOGIN: Configurando headers");
      auth_api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${responseData.token}`;
      user_api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${responseData.token}`;
      activities_api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${responseData.token}`;

      console.log("LOGIN: Processo concluído com sucesso");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      const typedError = error as any;
      if (typedError.response) {
        console.error("Status:", typedError.response.status);
        console.error("Data:", typedError.response.data);
      }
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
