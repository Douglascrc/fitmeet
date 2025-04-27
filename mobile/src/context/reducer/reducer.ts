import {AppContext} from '../AppState';

export enum ActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Action = {
  type: ActionTypes;
  payload?: any;
};

export const reducer = (state: AppContext, action: Action) => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload?.token,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};
