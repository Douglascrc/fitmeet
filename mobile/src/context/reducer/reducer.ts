import {AuthState} from "../state/state";

export enum ActionTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

type Action = {
  type: ActionTypes;
  payload?: any;
};

export const reducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload?.token,
        user: action.payload?.user,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};
