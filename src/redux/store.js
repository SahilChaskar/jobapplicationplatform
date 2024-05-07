import { createStore } from 'redux';
import {
  SET_JOB_LISTINGS,
  SET_PAGE,
  SET_LOADING,
  SET_FILTERS,
} from './actions';

// Defining initial state
const initialState = {
  jobListings: [],
  page: 1,
  loading: false,
  filters: {
    minExperience: '',
    companyName: '',
    location: '',
    remote: '',
    techStack: '',
    role: '',
    minBasePay: '',
  },
};

// Defining root reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_JOB_LISTINGS:
      return {
        ...state,
        jobListings: action.payload,
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return state;
  }
};

// Creating Redux store
const store = createStore(rootReducer);

export default store;