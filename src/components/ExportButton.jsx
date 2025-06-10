import React from 'react';
import { utils, writeFile } from 'xlsx';

const ExportButton = ({ jobs }) => {
  const handleExport = () => {
    if (!jobs || jobs.length === 0) return;

    const data = jobs.map(job => ({
      Date: job.date || '',
      Technician: job.technician || 'Unknown',
      Customer: job.customer || '',
      Service: job.service || '',
      Time: job.time || '',
      'Customer Address': job.address || '',
      Photo: job.photoURL ? 'yes' : 'no',
      Status: job.status || 'pending'
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Daily Log');

    const fileName = `tech-log-${new Date().toISOString().slice(0, 10)}.xlsx`;
    writeFile(workbook, fileName);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
    >
      📅 Export to Excel
    </button>
  );
};

export default ExportButton; 