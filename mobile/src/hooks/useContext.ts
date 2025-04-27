import {useContext} from 'react';
import {AppContext} from '../context/AppState';

export default function useAppContext() {
  return useContext(AppContext);
}
