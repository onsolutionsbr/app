import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function ProfessionalDashboard() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Professional Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Coming soon content */}
            <div className="col-span-full bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
                <p className="mt-2 text-gray-600">
                  Professional dashboard features are under development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfessionalDashboard;