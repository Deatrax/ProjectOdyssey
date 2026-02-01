"use client";

import React, { useState, useEffect } from "react";
import WikiFetcher from "./WikiFetcher";

export default function PlaceForm({ initialData = null, onSuccess }: { initialData?: any, onSuccess?: () => void }) {
    const [countries, setCountries] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        country_id: "",
        city_id: "",
        google_place_id: "",
        latitude: "",
        longitude: "",
        macro_category: "Urban", // Default
        address: "",
        website: "",
        phone_number: "",
        email: "",
        amenities: "", // Comma separated
        opening_hours: "", // JSON string or simple text
        visit_duration_min: "60"
    });

    const [status, setStatus] = useState<"IDLE" | "SAVING" | "SUCCESS" | "ERROR">("IDLE");
    const [errorMessage, setErrorMessage] = useState("");

    // Initialize with data if provided (Edit Mode)
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                country_id: initialData.country_id || "",
                city_id: initialData.city_id || "",
                google_place_id: initialData.google_place_id || "",
                latitude: initialData.latitude || "",
                longitude: initialData.longitude || "",
                macro_category: initialData.macro_category || "Urban",
                address: initialData.address || "",
                website: initialData.website || "",
                phone_number: initialData.phone_number || "",
                email: initialData.email || "",
                amenities: initialData.amenities ? initialData.amenities.join(", ") : "",
                opening_hours: initialData.opening_hours ? JSON.stringify(initialData.opening_hours, null, 2) : "",
                visit_duration_min: initialData.visit_duration_min || "60"
            });
        }
    }, [initialData]);

    // Load Countries
    useEffect(() => {
        fetch("http://localhost:4000/api/admin/countries")
            .then(res => res.json())
            .then(data => { if (data.success) setCountries(data.data); })
            .catch(err => console.error(err));
    }, []);

    // Load Cities when Country changes
    useEffect(() => {
        if (formData.country_id) {
            fetch(`http://localhost:4000/api/admin/cities?country_id=${formData.country_id}`)
                .then(res => res.json())
                .then(data => { if (data.success) setCities(data.data); })
                .catch(err => console.error(err));
        } else {
            setCities([]);
        }
    }, [formData.country_id]);

    const handleWikiFetch = (data: any) => {
        setFormData(prev => ({
            ...prev,
            name: data.title,
            description: data.extract,
            latitude: data.coordinates?.lat || prev.latitude,
            longitude: data.coordinates?.lon || prev.longitude
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("SAVING");

        // Prepare Payload
        const payload: any = {
            ...formData,
            latitude: formData.latitude === "" ? null : formData.latitude,
            longitude: formData.longitude === "" ? null : formData.longitude,
            amenities: formData.amenities.split(",").map(s => s.trim()).filter(Boolean),
            visit_duration_min: parseInt(formData.visit_duration_min) || 60
        };

        // Try to parse JSON fields safely
        try {
            if (formData.opening_hours) {
                payload.opening_hours = JSON.parse(formData.opening_hours);
            } else {
                payload.opening_hours = null;
            }
        } catch (e) {
            // If invalid JSON, just save as a simple object wrapper
            payload.opening_hours = { raw: formData.opening_hours };
        }

        try {
            const url = initialData
                ? `http://localhost:4000/api/admin/places/${initialData.place_id}`
                : "http://localhost:4000/api/admin/places";

            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save");
            }
            setStatus("SUCCESS");
            setErrorMessage("");
            if (onSuccess) onSuccess();
        } catch (err: any) {
            console.error(err);
            setStatus("ERROR");
            setErrorMessage(err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            {!initialData && <WikiFetcher onFetch={handleWikiFetch} />}

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">

                {/* Hierarchy Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                        <select
                            name="country_id"
                            value={formData.country_id}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white"
                            required
                        >
                            <option value="">Select Country...</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">District (City)</label>
                        <select
                            name="city_id"
                            value={formData.city_id}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-white"
                            required
                            disabled={!formData.country_id}
                        >
                            <option value="">Select District...</option>
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Place Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Macro Category</label>
                        <select name="macro_category" value={formData.macro_category} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                            <option value="Urban">Urban</option>
                            <option value="Nature">Nature</option>
                            <option value="History">History</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg h-32" />
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                        <input name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    </div>
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

                {/* Extended Details */}
                <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                    <h3 className="font-bold text-gray-800">Extended Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                            <input name="website" value={formData.website} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                            <input name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Amenities (comma separated)</label>
                        <input name="amenities" value={formData.amenities} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="Wifi, Parking, Pool..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Opening Hours (JSON or Text)</label>
                            <textarea name="opening_hours" value={formData.opening_hours} onChange={handleChange} className="w-full p-3 border rounded-lg h-24 font-mono text-sm" placeholder='{"Mon": "9-5"}' />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Visit Duration (min)</label>
                            <input type="number" name="visit_duration_min" value={formData.visit_duration_min} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={status === "SAVING"}
                        className="flex-1 bg-gray-900 text-white p-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-lg"
                    >
                        {status === "SAVING" ? "Saving..." : (initialData ? "Update Place" : "Create Place")}
                    </button>
                    {onSuccess && (
                        <button
                            type="button"
                            onClick={onSuccess}
                            className="px-6 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {status === "SUCCESS" && <p className="text-green-600 font-bold text-center mt-4">✅ Place Saved Successfully!</p>}
                {status === "ERROR" && <p className="text-red-600 font-bold text-center mt-4">❌ {errorMessage}</p>}
            </form>
        </div>
    );
}
