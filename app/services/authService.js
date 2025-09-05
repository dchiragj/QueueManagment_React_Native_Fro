/* eslint-disable prettier/prettier */
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {
  clearAuthData,
  clearAuthResponseMsg,
  setAuthLoader,
  setAuthResponseError,
  setCurrentUser
} from '../actions/authActions';
import { clearProfileData } from '../actions/profileActions';
import { getBaseUrl } from '../global/Environment';
import { isEmail, getAPIResponseError } from '../global/Helpers';
import { saveToken, clearToken } from '../utils/authTokenHelpers';
import { verificationcode, verifyEmailApi } from './apiService';
const baseUrl = getBaseUrl();

/**
 * @desc Login - Get User Token
 * @param {*} obj Data Obj
 */
export const login = (obj) => async (dispatch) => {
  try {``
    alert(`apiUrl: ${baseUrl}/auth/login`);
    dispatch(clearAuthResponseMsg());
    if (!obj) {
      dispatchAuthError('username', 'Email is Required', dispatch);
      return;
    } else if (!obj.username) {
      dispatchAuthError('username', 'Email is Required', dispatch);
      return;
    } else if (isEmail(obj.username) === false) {
      dispatchAuthError('username', 'Invalid email', dispatch);
      return;
    } else if (!obj.password) {
      dispatchAuthError('password', 'Password is Required', dispatch);
      return;
    }
    dispatch(setAuthLoader(true));
    console.log("testtt-1");
    
  const response = await axios.post(`${baseUrl}/auth/login`, obj);
console.log(response,"ressssss");
console.log("tstttt-2");

    const { data } = response.data;
      console.log("data------>",data);
    dispatch(setLoginToken(data));
    return true;
  } catch (e) {
    console.error(e);
    
    console.log("error", e);

    alert(`apiErr: ${e}`);
    dispatchAuthError('error', getAPIResponseError(e) || 'Unable to login please try again', dispatch);
    return false;
  } finally {
    dispatch(setAuthLoader(false));
  }
};

/**
 * @desc Signup - signup user and set login information after successfuly signup
 * @param {*} obj Data Obj
 */
export const signup = (obj) => async (dispatch) => {
  try {
    alert(`apiUrl: ${baseUrl}/auth/signup`);
    dispatch(clearAuthResponseMsg());
    if (!obj) {
      dispatchAuthError('role', 'Select role', dispatch);
      return;
    } else if (!obj.role) {
      dispatchAuthError('role', 'Select role', dispatch);
      return;
    } else if (!obj.firstName) {
      dispatchAuthError('firstname', 'First Name is Required', dispatch);
      return;
    } else if (!obj.lastName) {
      dispatchAuthError('lastname', 'Last Name is Required', dispatch);
      return;
    } else if (!obj.email) {
      dispatchAuthError('email', 'Email is Required', dispatch);
      return;
    } else if (isEmail(obj.email) === false) {
      dispatchAuthError('email', 'Invalid email', dispatch);
      return;
    } else if (!obj.mobileNumber) {
      dispatchAuthError('mobileNumber', 'Mobile number is Required', dispatch);
      return;
    } else if (!obj.password) {
      dispatchAuthError('password', 'Password is Required', dispatch);
      return;
    } else if (!obj.confirmPassword) {
      dispatchAuthError('confirmPassword', 'Confirm password is Required', dispatch);
      return;
    } else if (obj.password !== obj.confirmPassword) {
      dispatchAuthError('confirmPassword', 'Password and confirm password not matched', dispatch);
      return;
    } else if (!obj.role) {
      dispatchAuthError('role', 'Select role', dispatch);
      return;
    }
    dispatch(setAuthLoader(true));
    const response = await axios.post(`${baseUrl}/auth/signup`, obj);
    const { data } = response.data;
    dispatch(setLoginToken(data));
    return true;
  } catch (e) {
    alert(`apiErr-signup: ${e}`);
    dispatchAuthError('error', getAPIResponseError(e) || 'Unable to signup, please try again', dispatch);
    return false;
  } finally {
    dispatch(setAuthLoader(false));
  }
};

/**
 * @desc set login token and set user
 */
export const setLoginToken = (data) => async (dispatch) => {
  // save auth deteils and set token in header for request
  await saveToken(data);
  // Decode token to get user data
  const decoded = jwt_decode(data.token);
  
  // Set current user
  dispatch(setCurrentUser(decoded));
};

/**
 * @desc Log user out
 * @param source for analytics
 */
export const logout = () => async (dispatch) => {
  /**
   * Remove token from localStorage
   * Remove auth header for future requests
   * Set current user to {} which will set isAuthenticated to false
   */
  clearToken();
  dispatch(clearAuthData());
  dispatch(clearProfileData());
  //clear user for analytics

  //clear reducer data
};

export const verifyEmail = (code) => async (dispatch) => {
  try {
    dispatch(clearAuthResponseMsg());

    if (code.length !== 6) {
      dispatchAuthError('code', 'Enter valid 6 digit code.', dispatch);
      return false;
    }

    dispatch(setAuthLoader(true));

    // 👇 This automatically attaches the token via interceptor
    const data = await verifyEmailApi(code);

    alert(JSON.stringify(data),"data");
    return true;
  } catch (e) {
    alert(`apiErr-verifyemail: ${e.message}`);
    dispatchAuthError(
      'error',
      e.message || 'Unable to verify, please try again',
      dispatch
    );
    return false;
  } finally {
    dispatch(setAuthLoader(false));
  }
};

export const verificationCode = () => async (dispatch) => {
  try {
    alert(`apiUrl: ${baseUrl}/auth/verification-code`);
    dispatch(clearAuthResponseMsg());
    dispatch(setAuthLoader(true));
    // const response = await axios.post(`${baseUrl}/auth/verification-code`);
    const data = await verificationcode(code);
        alert(JSON.stringify(data),"data");
    return true;
  } catch (e) {
    alert(`apiErr-verificationcode: ${e}`);
    dispatchAuthError('error', getAPIResponseError(e) || 'Unable to signup, please try again', dispatch);
    return false;
  } finally {
    dispatch(setAuthLoader(false));
  }
};

function dispatchAuthError(field, msg, dispatch) {
  dispatch(setAuthResponseError({ field, msg }));
}
