import { SIGNIN_USER, SIGNOUT_USER, UPDATE_USER } from "../constants/ActionTypes";

export const userSignIn = (user) => {
  return {
    type: SIGNIN_USER,
    payload: user,
  };
};

export const userSignOut = (token) => {
  return {
    type: SIGNOUT_USER,
    payload: token,
  };
};

export const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    payload: user,
  };
};