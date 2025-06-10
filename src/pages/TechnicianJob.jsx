import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { getJobsForTechnician, updateJobStatus } from '../lib/firebase';
import { generateServiceReportPDF } from '../utils/generateServiceReportPDF';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

const TechnicianJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const technicianJobs = await getJobsForTechnician();
        setJobs(technicianJobs);
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleMarkAsDone = async (job) => {
    try {
      // 1. Update Firestore status
      await updateJobStatus(job.id, 'completed');

      // 2. Generate PDF blob
      const pdfBlob = await generateServiceReportPDF(job);

      // 3. Upload to Firebase Storage
      const fileRef = ref(storage, `reports/ServiceReport-${job.id}.pdf`);
      await uploadBytes(fileRef, pdfBlob);

      // 4. Get URL and save to Firestore
      const downloadURL = await getDownloadURL(fileRef);
      await updateJobStatus(job.id, 'completed', downloadURL);

      // 5. Update local state
      setJobs(jobs.map(j => 
        j.id === job.id ? { ...j, status: 'completed', pdfUrl: downloadURL } : j
      ));

      alert(`Report uploaded and linked for Job ID: ${job.id}`);
    } catch (err) {
      console.error('Error completing job:', err);
      alert('Failed to complete the job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Technician Job List</h1>
      {jobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending jobs available
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{job.customer}</h3>
                  <p className="text-gray-600">{job.service}</p>
                  <p className="text-sm text-gray-500">
                    Scheduled: {new Date(job.time).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  onClick={() => handleMarkAsDone(job)}
                  disabled={job.status === 'completed'}
                  className="flex-1"
                >
                  {job.status === 'completed' ? 'Completed' : 'Mark as Done'}
                </Button>
                {job.status === 'completed' && job.pdfUrl && (
                  <Button
                    onClick={() => window.open(job.pdfUrl, '_blank')}
                    variant="secondary"
                    className="flex-1"
                  >
                    View Report
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianJob; 