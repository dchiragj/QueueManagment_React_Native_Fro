import axios from 'axios';
import { getAPIResponseError } from '../global/Helpers';
import { getBaseUrl } from '../global/Environment';
import {
  setProfile,
  setProfileLoader,
  setProfileResponseError,
  clearProfileResponseMsg
} from '../actions/profileActions';
const baseUrl = getBaseUrl();

export const updateUserProfile = (obj) => async (dispatch) => {
  try {
    dispatch(clearProfileResponseMsg());
    if (!obj) {
      dispatchAuthError('firstname', 'First Name is Required', dispatch);
      return false;
    } else if (!obj.firstName) {
      dispatchAuthError('firstname', 'First Name is Required', dispatch);
      return false;
    } else if (!obj.lastName) {
      dispatchAuthError('lastname', 'Last Name is Required', dispatch);
      return false;
    } else if (!obj.address) {
      dispatchAuthError('lastname', 'Address is Required', dispatch);
      return false;
    } else if (!obj.gender) {
      dispatchAuthError('gender', 'Gender is Required', dispatch);
      return false;
    }
    dispatch(setProfileLoader(true));
    const response = await axios.post(`${baseUrl}/user/profile`, obj);
    const { data } = response.data;
    dispatch(setProfile(data));
    return true;
  } catch (e) {
    dispatchAuthError('error', getAPIResponseError(e) || 'Unable to signup, please try again', dispatch);
    return false;
  } finally {
    dispatch(setProfileLoader(false));
  }
};

export const getUserProfile = () => async (dispatch) => {
  try {
    dispatch(clearProfileResponseMsg());
    dispatch(setProfileLoader(true));
    const response = await axios.get(`${baseUrl}/user/me`);
    const { data } = response.data;
    dispatch(setProfile(data));
    return true;
  } catch (e) {
    dispatchAuthError('error', getAPIResponseError(e) || 'Unable to get user, please try again', dispatch);
    return false;
  } finally {
    dispatch(setProfileLoader(false));
  }
};

function dispatchAuthError(field, msg, dispatch) {
  dispatch(setProfileResponseError({ field, msg }));
}
