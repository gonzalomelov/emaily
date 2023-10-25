import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const createSurvey = (survey, file, history) => async (dispatch) => {
  const uploadConfig = await axios.get('/api/upload');
  
  const { key, url } = uploadConfig.data;

  await axios.put(url, file, {
    headers: {
      'Content-Type': file.type,
    }
  })

  const res = await axios.post('/api/surveys', { ...survey, imageUrl: key });
  
  // Error checking?
  
  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
}