import UserModel from "@/models/user-model";
import { activities_api, auth_api, user_api } from "@/services/api-service";
import { createContext, useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router";

interface AuthContextModel extends UserModel {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextModel);

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [userData, setUserData] = useState<UserModel>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const data: UserModel = JSON.parse(localStorage.getItem("@Auth.Data") || "{}");
    if (data.id) {
      setIsAuthenticated(true);
      setUserData(data);
    }
  }, []);

  const Login = useCallback(async (email: string, password: string) => {
    const respAuth = await auth_api.post("/sign-in", { email, password });

    if (respAuth instanceof Error) {
      return respAuth.message;
    }

    localStorage.setItem("@Auth.Token", respAuth.data.token);

    user_api.defaults.headers.common.Authorization = `Bearer ${respAuth.data.token}`;
    activities_api.defaults.headers.common.Authorization = `Bearer ${respAuth.data.token}`;

    localStorage.setItem("@Auth.Data", JSON.stringify(respAuth.data));
    setUserData(respAuth.data);
    setIsAuthenticated(true);
  }, []);

  const Logout = useCallback(() => {
    localStorage.removeItem("@Auth.Data");
    setUserData(undefined);
    setIsAuthenticated(false);
    return <Navigate to="/" />;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        ...userData,
        login: Login,
        logout: Logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
