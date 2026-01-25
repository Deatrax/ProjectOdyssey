"use client";

import React, { useState, useEffect } from "react";
import WikiFetcher from "./WikiFetcher";

export default function DistrictInputForm() {
  const [countries, setCountries] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    country_id: "",
    population: "",
    google_place_id: "",
    latitude: "",
    longitude: ""
  });
  const [status, setStatus] = useState<"IDLE" | "SAVING" | "SUCCESS" | "ERROR">("IDLE");

  // Fetch countries for dropdown
  useEffect(() => {
    fetch("http://localhost:4000/api/admin/countries")
        .then(res => res.json())
        .then(data => {
            if (data.success) setCountries(data.data);
        })
        .catch(err => console.error("Failed to load countries", err));
  }, []);

  const handleWikiFetch = (data: any) => {
    setFormData(prev => ({
      ...prev,
      name: data.title,
      slug: data.title.toLowerCase().replace(/ /g, "-"),
      description: data.extract,
      latitude: data.coordinates?.lat || "",
      longitude: data.coordinates?.lon || ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("SAVING");
    try {
      const res = await fetch("http://localhost:4000/api/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("SUCCESS");
    } catch (err) {
      console.error(err);
      setStatus("ERROR");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <WikiFetcher onFetch={handleWikiFetch} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">District Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Parent Country</label>
             <select 
                name="country_id" 
                value={formData.country_id} 
                onChange={handleChange} 
                className="w-full p-3 border rounded-lg bg-white"
                required
             >
                <option value="">Select a Country...</option>
                {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
             </select>
          </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
            <input name="slug" value={formData.slug} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg h-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Google Place ID</label>
                 <input name="google_place_id" value={formData.google_place_id} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
             <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
                 <input name="latitude" value={formData.latitude} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
             <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
                 <input name="longitude" value={formData.longitude} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
        </div>

        <button 
          type="submit" 
          disabled={status === "SAVING"}
          className="w-full bg-gray-900 text-white p-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-lg"
        >
          {status === "SAVING" ? "Saving District..." : "Save District"}
        </button>

        {status === "SUCCESS" && <p className="text-green-600 font-bold text-center mt-4">✅ District Saved Successfully!</p>}
        {status === "ERROR" && <p className="text-red-600 font-bold text-center mt-4">❌ Error Saving District</p>}
      </form>
    </div>
  );
}
