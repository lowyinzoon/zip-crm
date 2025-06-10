import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExportButton from '../components/ExportButton';

const AdminReport = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, 'jobs'), where('customerId', '==', currentCustomerId));
      const querySnapshot = await getDocs(q);
      const allJobs = querySnapshot.docs.map(doc => doc.data());
      setJobs(allJobs);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
    const filtered = jobs.filter(job => {
      const matchDate = job.date === formattedDate;
      const matchStatus = statusFilter === 'All' || job.status === statusFilter;
      const matchTech = techFilter === 'All' || job.technician === techFilter;
      return matchDate && matchStatus && matchTech;
    });
    setFilteredJobs(filtered);
  }, [jobs, selectedDate, statusFilter, techFilter]);

  const uniqueTechs = [...new Set(jobs.map(job => job.technician))];

  const summary = {
    total: filteredJobs.length,
    completed: filteredJobs.filter(j => j.status === 'completed').length,
    pending: filteredJobs.filter(j => j.status === 'pending').length,
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📋 Technician Daily Log ({dayjs(selectedDate).format('YYYY-MM-DD')})</h2>
        <ExportButton jobs={filteredJobs} />
      </div>

      {/* Summary Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">🗓 {dayjs(selectedDate).format('YYYY-MM-DD')} Summary:</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block font-semibold">📅 Select Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">⚙️ Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option>All</option>
            <option>pending</option>
            <option>completed</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">🧍 Technician</label>
          <select
            value={techFilter}
            onChange={e => setTechFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option>All</option>
            {uniqueTechs.map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-lg">🧾 Summary:</h3>
        <ul className="ml-4">
          <li>Total Jobs: {summary.total}</li>
          <li>Completed: {summary.completed}</li>
          <li>Pending: {summary.pending}</li>
        </ul>
      </div>

      {filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        filteredJobs.map((job, idx) => (
          <div key={idx} className="border p-3 rounded mb-2">
            <strong>{job.technician}</strong> — {job.service} at {job.time}
            <div className="text-sm text-gray-500">Status: {job.status}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminReport; 