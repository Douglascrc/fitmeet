export interface AuthState {
  token: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  user: any;
}

export const initialState: AuthState = {
  token: "",
  isAuthenticated: false,
  login: (_email: string, _password: string) => {},
  logout: () => {},
  user: null,
};
