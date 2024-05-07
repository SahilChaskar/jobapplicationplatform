import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import JobListing from './components/JobListing';

function App() {
  return (
    <Provider store={store}>
      <JobListing />
    </Provider>
  );
}

export default App;