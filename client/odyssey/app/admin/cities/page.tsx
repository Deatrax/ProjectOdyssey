"use client";

import React, { useEffect, useState } from "react";

export default function CitiesListPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/cities")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
            setCities(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading cities...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Cities</h1>
      
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Name</th>
              <th className="p-4 font-semibold text-gray-700">Slug</th>
              <th className="p-4 font-semibold text-gray-700">Population</th> 
              <th className="p-4 font-semibold text-gray-700">Coords</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{city.name}</td>
                <td className="p-4 text-gray-600 font-mono text-sm">{city.slug}</td>
                <td className="p-4 text-gray-600">{city.population?.toLocaleString() || "-"}</td>
                <td className="p-4 text-gray-500 text-xs">
                    {city.latitude?.toFixed(2)}, {city.longitude?.toFixed(2)}
                </td>
              </tr>
            ))}
            {cities.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No cities found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
