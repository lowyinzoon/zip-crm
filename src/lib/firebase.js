import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../config/firebase';

// Job Management Functions
export const getJobsForTechnician = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const jobsRef = collection(db, 'jobs');
    const q = query(
      jobsRef,
      where('status', '==', 'pending'),
      where('assignedTo', '==', currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const updateJobStatus = async (jobId, status, reportURL = null) => {
  try {
    const jobRef = doc(db, 'Jobs', jobId);

    const updateData = {
      status: status,
      updatedAt: new Date()
    };

    if (reportURL) {
      updateData.reportURL = reportURL;
    }

    await updateDoc(jobRef, updateData);
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};

// Storage Functions
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const uploadPDF = async (pdfBlob, jobId) => {
  try {
    const path = `reports/${jobId}/service-report.pdf`;
    return await uploadFile(pdfBlob, path);
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
}; 