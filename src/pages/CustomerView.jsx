import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useUser } from '../UserContext';

export default function CustomerView() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useUser();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }

        const q = query(
          collection(db, 'jobs'),
          where('customerId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Service History</h1>
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No service history available.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="border p-4 mb-4 rounded">
              <div><strong>{job.service}</strong> on {job.date}</div>
              <div>Status: {job.status}</div>
              
              {job.reportURL ? (
                <a
                  href={job.reportURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-2 block"
                >
                  Download Service Report
                </a>
              ) : (
                <div className="text-gray-400 mt-2">Service report not available yet</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  