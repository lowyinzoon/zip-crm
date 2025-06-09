import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminJobHistory() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, 'jobs'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(data.filter(job => job.status === 'completed'));
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">📊 Job History</h1>
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No completed jobs yet.</p>
      ) : (
        jobs.map(job => (
          <div key={job.id} className="bg-white rounded shadow p-4 mb-4">
            <h2 className="font-semibold text-lg">{job.customer}</h2>
            <p className="text-sm text-gray-600">{job.address}</p>
            <p><strong>Service:</strong> {job.service}</p>
            <p><strong>Time:</strong> {job.time}</p>
            <p className="text-green-600 font-semibold">✅ Completed</p>
            {job.photoURL && (
              <img src={job.photoURL} alt="Job" className="w-full max-w-xs mt-3 rounded shadow" />
            )}
          </div>
        ))
      )}
    </div>
  );
} 