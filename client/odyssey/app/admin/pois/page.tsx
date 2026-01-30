"use client";

import React, { useEffect, useState } from "react";

export default function POIsListPage() {
  const [pois, setPois] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchPois = (query = "") => {
    setLoading(true);
    fetch(`http://localhost:4000/api/admin/pois?search=${encodeURIComponent(query)}&limit=50`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
            setPois(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPois();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPois(search);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage POIs</h1>

      <div className="mb-6 flex gap-2 max-w-lg">
        <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search POIs by name..." 
            className="flex-1 p-3 border rounded-lg"
        />
         <button 
           onClick={() => fetchPois(search)}
           className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition"
         >
           Search
         </button>
      </div>
      
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Name</th>
              <th className="p-4 font-semibold text-gray-700">City / District</th>
              <th className="p-4 font-semibold text-gray-700">Country</th>
              <th className="p-4 font-semibold text-gray-700">Category</th>
            </tr>
          </thead>
          <tbody>
            {pois.map((poi) => (
              <tr key={poi.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{poi.name}</td>
                <td className="p-4 text-gray-600">{poi.cities?.name || "-"}</td>
                <td className="p-4 text-gray-600">{poi.countries?.name || "-"}</td>
                 <td className="p-4 text-gray-600">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{poi.category || "general"}</span>
                 </td>
              </tr>
            ))}
             {pois.length === 0 && !loading && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No POIs found matching your search.</td>
                </tr>
            )}
             {loading && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-gray-500 text-sm text-center">Showing top 50 results. Use search to find specific items.</p>
    </div>
  );
}
