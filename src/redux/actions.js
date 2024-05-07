// Defining action types
export const SET_JOB_LISTINGS = 'SET_JOB_LISTINGS';
export const SET_PAGE = 'SET_PAGE';
export const SET_LOADING = 'SET_LOADING';
export const SET_FILTERS = 'SET_FILTERS';

// Defining action creators
export const setJobListings = (jobListings) => ({
  type: SET_JOB_LISTINGS,
  payload: jobListings,
});

export const setPage = (page) => ({
  type: SET_PAGE,
  payload: page,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setFilters = (filters) => ({
  type: SET_FILTERS,
  payload: filters,
});