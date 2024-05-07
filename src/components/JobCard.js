import React, { useState } from 'react';
import Modal from './Modal';

const JobCard = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleShowMore = () => {
    setIsModalOpen(true);
    setModalContent(job.jobDetailsFromCompany);
  };

  // Function to limit description to a certain number of words
  const limitDescription = (description, limit) => {
    const words = description.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    } else {
      return description;
    }
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="w-auto h-full p-2 m-3 ">
      <div className="bg-white border shadow-md rounded-lg transition-transform duration-300 transform hover:scale-105">
        <div className="p-5">
          <div className="flex items-center">
            {job.logoUrl && (
              <img src={job.logoUrl} alt="Company Logo" className="w-10 h-12 mr-2" />
            )}
            <div>
              {job.companyName && (
                <h3 className="font-bold text-lg">{job.companyName}</h3>
              )}
              {job.jobRole && <p className="text-sm">{capitalizeFirstLetter(job.jobRole)}</p>}
              {job.location && (
                <p className="text-sm">{capitalizeFirstLetter(job.location)}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            {job.minJdSalary !== null && job.maxJdSalary !== null && job.salaryCurrencyCode && (
              <p className="font-bold">
                Estimated Salary: {job.minJdSalary || ''} - {job.maxJdSalary} {job.salaryCurrencyCode}
              </p>
            )}
            {job.minJdSalary === null && job.maxJdSalary !== null && job.salaryCurrencyCode && (
              <p className="font-bold">
                Estimated Salary: {job.maxJdSalary} {job.salaryCurrencyCode}
              </p>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">About Company:</h3>
            <h5 className="font-semibold">About us</h5>
            {job.jobDetailsFromCompany && (
              <p>{limitDescription(job.jobDetailsFromCompany, 99)}</p>
            )}
          </div>
          <div className="mt-4 text-center">
            <button onClick={handleShowMore} className="text-blue-500 hover:underline">
              Show More
            </button>
          </div>
          <div className="mt-4">
            {job.minExp && (
              <p
                className="text-xs"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  marginBottom: '3px',
                  color: '#8b8b8b',
                }}
              >
                Minimum Experience:{' '}
                <span className="font-bold color:'#262626'">{job.minExp} years</span>
              </p>
            )}
          </div>
          <div className="mt-4">
          <button
  className="bg-emerald-400 text-black rounded-md py-2 px-4 w-full"
  onClick={() => window.open(job.jdLink, '_blank')}
>
  ⚡ Easy Apply
</button>

          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal closeModal={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-semibold mb-4">Job Details</h2>
          <p>{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default JobCard;
