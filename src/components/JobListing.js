import React, { useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import JobCard from './JobCard'; 
import { setJobListings, setPage, setLoading, setFilters } from '../redux/actions';

const JobListing = ({
  jobListings,
  page,
  loading,
  filters,
  setJobListings,
  setPage,
  setLoading,
  setFilters,
}) => {
  const observerRef = useRef(null);

  // Function to fetch jobs data from the API
  const fetchJobs = useCallback(async () => {
    setLoading(true); 
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify({
      limit: 10,
      offset: (page - 1) * 10,
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body,
    };
    try {
      const response = await fetch(
        'https://api.weekday.technology/adhoc/getSampleJdJSON',
        requestOptions
      );
      const data = await response.json(); 
      // console.log(data); 
      if (data && data.jdList && data.jdList.length > 0) {
        setJobListings([...jobListings, ...data.jdList]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error); 
      setLoading(false);
    }
  }, [page, jobListings, setJobListings, setLoading]);

  // useEffect hook to observe element intersection and trigger fetchJobs
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchJobs();
        }
      },
      { threshold: 1 }
    );

    const observerElement = observerRef.current;

    if (observerElement) {
      observer.observe(observerElement); // Starting observing the element
    }

    return () => {
      if (observerElement) {
        observer.unobserve(observerElement); // Stopping observing the element
      }
    };
  }, [setPage, fetchJobs]);

  // Function to handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Filtering job listings based on filter criteria
  const filteredJobListings = jobListings.filter((job) => {
    const {
      minExperience,
      companyName,
      location,
      remote,
      role,
      minBasePay,
    } = filters;

    const matchesMinExperience =
      !minExperience || job.minExp >= parseInt(minExperience);
    const matchesCompanyName =
      !companyName ||
      job.companyName.toLowerCase().includes(companyName.toLowerCase());
    const matchesLocation =
      !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesRemote =
      remote === '' || remote === 'all' ||
      (remote === 'true' && job.location.toLowerCase() === 'remote') ||
      (remote === 'false' && job.location.toLowerCase() !== 'remote');
    const matchesRole =
      !role || job.jobRole.toLowerCase().includes(role.toLowerCase());
    const matchesMinBasePay =
      !minBasePay || job.minJdSalary >= parseInt(minBasePay);

    return (
      matchesMinExperience &&
      matchesCompanyName &&
      matchesLocation &&
      matchesRemote &&
      matchesRole &&
      matchesMinBasePay
    );
  });

  // useEffect to handle edge case when no jobs match the filters and loading is true
  useEffect(() => {
    if (filteredJobListings.length === 0 && loading) {
      setLoading(false);
    }
  }, [filteredJobListings, loading, setLoading]);

  // Function to clear filters
  const clearFilters = () => {
    setFilters({
      minExperience: '',
      companyName: '',
      location: '',
      remote: '',
      techStack: '',
      role: '',
      minBasePay: '',
    });
  };

  return (
    <div>
      <div className="justify-center m-4 mt-10 w-full sm:w-auto h-full flex flex-wrap p-4 border rounded-lg">
        <input
          placeholder="Minimum Experience"
          type="number"
          id="minExperience"
          name="minExperience"
          value={filters.minExperience}
          onChange={handleFilterChange}
          className="m-1 w-full sm:w-auto h-full flex p-2 border rounded-lg"
          min="0"
        />

        <input
          placeholder="Company Name"
          type="text"
          id="companyName"
          name="companyName"
          value={filters.companyName}
          onChange={handleFilterChange}
          className="m-1 w-full sm:w-auto h-full flex p-2 border rounded-lg"
        />

        <input
          placeholder="Location"
          type="text"
          id="location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="m-1 w-full sm:w-auto h-full flex p-2 border rounded-lg"
        />

        <select
          placeholder="Remote"
          id="remote"
          name="remote"
          value={filters.remote}
          onChange={handleFilterChange}
          className="m-1 w-full sm:w-auto h-full flex p-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="true">Remote</option>
          <option value="false">On-site</option>
        </select>

        <input
          placeholder="Role"
          type="text"
          id="role"
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="m-1 w-full sm:w-auto h-full flex p-2 border rounded-lg"
        />

        <input
          placeholder="Min Base Pay"
          type="number"
          id="minBasePay"
          name="minBasePay"
          value={filters.minBasePay}
          onChange={handleFilterChange}
          className="m-1 w-full sm:w-auto h-full flex p-2 border rounded-lg"
          min="0"
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredJobListings.length === 0 && !loading ? (
          <p className="text-center text-gray-600">No jobs match the filters.</p>
        ) : (
          filteredJobListings.map((job, index) => (
            <JobCard key={`${job.jdUid}-${index}`} job={job} />
          ))
        )}
        {loading && <p>Loading...</p>}
        <div ref={observerRef} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  jobListings: state.jobListings,
  page: state.page,
  loading: state.loading,
  filters: state.filters,
});

const mapDispatchToProps = {
  setJobListings,
  setPage,
  setLoading,
  setFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobListing);
