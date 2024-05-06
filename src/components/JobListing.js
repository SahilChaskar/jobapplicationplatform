import React, { useEffect, useState } from 'react';
import JobCard from './JobCard';

const JobListing = () => {
  const [jobListings, setJobListings] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    minExperience: '',
    companyName: '',
    location: '',
    remote: '',
    techStack: '',
    role: '',
    minBasePay: '',
  });

  useEffect(() => {
    const fetchJobs = async () => {
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
        // console.log('data', data);
        if (data && data.jdList && data.jdList.length > 0) {
          setJobListings((prevListings) => [...prevListings, ...data.jdList]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page]);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollTop + windowHeight >= scrollHeight * 0.9) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

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
      (remote === 'true' && job.isRemote) ||
      (remote === 'false' && !job.isRemote);
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
      <div className="justify-center m-4 mt-10 w-auto h-full flex p-4 border rounded-lg">
        <input
          placeholder="Minimum Experience"
          type="number"
          id="minExperience"
          name="minExperience"
          value={filters.minExperience}
          onChange={handleFilterChange}
          className="m-1 w-auto h-full flex p-2 border rounded-lg"
          min="0"
        />

        <input
          placeholder="Company Name"
          type="text"
          id="companyName"
          name="companyName"
          value={filters.companyName}
          onChange={handleFilterChange}
          className="m-1 w-auto h-full flex p-2 border rounded-lg"
        />

        <input
          placeholder="Location"
          type="text"
          id="location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="m-1 w-auto h -full flex p-2 border rounded-lg"
        />

        <select
          placeholder="Remote"
          id="remote"
          name="remote"
          value={filters.remote}
          onChange={handleFilterChange}
          className="m-1 w-auto h-full flex p-2 border rounded-lg"
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
          className="m-1 w-auto h-full flex p-2 border rounded-lg"
        />

        <input
          placeholder="Min Base Pay"
          type="number"
          id="minBasePay"
          name="minBasePay"
          value={filters.minBasePay}
          onChange={handleFilterChange}
          className="m-1 w-auto h-full flex p-2 border rounded-lg"
          min="0"
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
        {filteredJobListings.map((job, index) => (
          <JobCard key={`${job.jdUid}-${index}`} job={job} />
        ))}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default JobListing;
