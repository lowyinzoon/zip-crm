import { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateServiceReportPDF } from '../utils/generateServiceReportPDF';
import { saveAs } from 'file-saver';

export default function TechnicianView() {
  const [jobs, setJobs] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const jobsRef = collection(db, 'jobs');

  // Load jobs from Firestore
  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(jobsRef);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched jobs from Firestore:", list);
      setJobs(list);
    };
    fetchJobs();
  }, []);

  // Update job status in Firestore
  const updateJobStatus = async (jobId, status) => {
    const jobDoc = doc(db, 'jobs', jobId);
    await updateDoc(jobDoc, { status });
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status } : job
      )
    );
  };

  // Handle marking job as done
  const handleMarkAsDone = async (job) => {
    try {
      // 1. Update Firestore job status to "completed"
      await updateJobStatus(job.id, 'completed');

      // 2. Generate and download PDF
      const pdfBlob = await generateServiceReportPDF({
        ...job,
        reportId: job.id,
        date: new Date().toLocaleDateString(),
        timeIn: new Date().toLocaleTimeString(),
        timeOut: new Date().toLocaleTimeString(),
      });
      saveAs(pdfBlob, `ServiceReport-${job.id}.pdf`);

      // 3. Upload PDF to Firebase Storage
      const pdfRef = ref(storage, `service_reports/${job.id}_report.pdf`);
      await uploadBytes(pdfRef, pdfBlob);
      const pdfUrl = await getDownloadURL(pdfRef);

      // 4. Update job with PDF URL
      const jobDoc = doc(db, 'jobs', job.id);
      await updateDoc(jobDoc, { 
        reportPDF: pdfUrl,
        completedAt: new Date().toISOString()
      });

      // Update local state
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { 
            ...j, 
            reportPDF: pdfUrl,
            completedAt: new Date().toISOString()
          } : j
        )
      );
    } catch (error) {
      console.error('Error marking job as done:', error);
      alert('Error generating report. Please try again.');
    }
  };

  // Upload photo + update Firestore
  const handlePhotoUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingId(id);
    const storageRef = ref(storage, `job_photos/${id}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const jobDoc = doc(db, 'jobs', id);
    await updateDoc(jobDoc, { photoURL: url });

    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, photoURL: url } : job))
    );
    setUploadingId(null);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">📋 Technician Job List</h1>
      {jobs.map((job) => (
        <div key={job.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-base">{job.customer}</h2>
          <p className="text-sm text-gray-600">{job.address}</p>
          <p className="text-sm mt-1"><strong>Service:</strong> {job.service}</p>
          <p className="text-sm"><strong>Time:</strong> {job.time}</p>
          <p className={`text-sm mt-1 ${job.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
            <strong>Status:</strong> {job.status}
          </p>

          {job.status === 'pending' && (
            <button
              onClick={() => handleMarkAsDone(job)}
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>✅</span>
              <span>Mark as Done</span>
            </button>
          )}

          {job.reportPDF && (
            <a
              href={job.reportPDF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>View Report</span>
            </a>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Job Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e, job.id)}
              className="text-sm w-full"
              disabled={uploadingId === job.id}
            />
            {uploadingId === job.id && (
              <p className="text-xs text-blue-500 mt-1">Uploading...</p>
            )}
            {job.photoURL && (
              <div className="mt-2">
                <img src={job.photoURL} alt="Job" className="w-full h-auto rounded shadow" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 