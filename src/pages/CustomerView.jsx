export default function CustomerView() {
  const serviceHistory = [
    {
      id: 1,
      service: 'Cockroach Treatment',
      date: '2025-04-10',
      status: 'completed',
    },
    {
      id: 2,
      service: 'Termite Monitoring',
      date: '2025-06-15',
      status: 'upcoming',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Service History</h1>
      <div className="space-y-4">
        {serviceHistory.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded shadow p-4 border-l-4"
            style={{
              borderColor: item.status === 'completed' ? 'green' : '#facc15',
            }}
          >
            <p className="text-lg font-medium">{item.service}</p>
            <p className="text-sm text-gray-500">Date: {item.date}</p>
            <p
              className={`text-sm font-semibold mt-1 ${
                item.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              Status: {item.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
  