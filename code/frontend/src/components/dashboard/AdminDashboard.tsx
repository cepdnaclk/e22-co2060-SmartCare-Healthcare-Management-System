'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Trash } from 'lucide-react';

export default function AdminDashboard({ user }: { user: any }) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', password: '', specialization: '' });

  const fetchDoctors = () => {
      fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const res = await fetch('/api/doctors', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newDoctor),
          });
          if (res.ok) {
              setShowAddModal(false);
              setNewDoctor({ name: '', email: '', password: '', specialization: '' });
              fetchDoctors();
          } else {
              alert('Failed to add doctor');
          }
      } catch (err) {
          console.error(err);
      }
  };

  const handleDeleteDoctor = async (id: string) => {
      if (!confirm('Are you sure you want to delete this doctor?')) return;
      try {
          const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
          if (res.ok) fetchDoctors();
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Users className="mr-2 text-blue-600" /> Manage Doctors
          </h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Doctor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc: any) => (
                <div key={doc._id} className="border rounded-lg p-4 flex justify-between items-start">
                    <div>
                        <h4 className="font-bold">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.specialization}</p>
                        <p className="text-xs text-gray-500">{doc.email}</p>
                    </div>
                    <button onClick={() => handleDeleteDoctor(doc._id)} className="text-red-500 hover:text-red-700">
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
      </div>

      {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold mb-4">Add New Doctor</h3>
                  <form onSubmit={handleAddDoctor}>
                      <input 
                        type="text" placeholder="Name" className="w-full border p-2 rounded mb-3"
                        value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} required
                      />
                      <input 
                        type="email" placeholder="Email" className="w-full border p-2 rounded mb-3"
                        value={newDoctor.email} onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} required
                      />
                      <input 
                        type="text" placeholder="Specialization" className="w-full border p-2 rounded mb-3"
                        value={newDoctor.specialization} onChange={e => setNewDoctor({...newDoctor, specialization: e.target.value})} required
                      />
                      <input 
                        type="password" placeholder="Password" className="w-full border p-2 rounded mb-4"
                        value={newDoctor.password} onChange={e => setNewDoctor({...newDoctor, password: e.target.value})} required
                      />
                      <div className="flex justify-end space-x-3">
                          <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Doctor</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
