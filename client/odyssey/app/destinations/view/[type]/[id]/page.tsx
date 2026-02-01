"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DestinationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    // type will be 'poi', 'city', or 'country'
    const { type, id } = params;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!type || !id) return;

        const endpointType = type === 'poi' || type === 'place' ? 'places' : type === 'city' ? 'cities' : 'countries';

        fetch(`http://localhost:4000/api/${endpointType}/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Not Found");
                return res.json();
            })
            .then(data => setData(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [type, id]);

    if (loading) return <div className="min-h-screen bg-[#FFF5E9] flex items-center justify-center">Loading...</div>;
    if (!data) return <div className="min-h-screen bg-[#FFF5E9] flex items-center justify-center">Not Found</div>;

    const bgImage = data.name ? `https://source.unsplash.com/1600x900/?${data.name},travel` : "";

    return (
        <div className="min-h-screen bg-[#FFF5E9] font-body">
            {/* Hero */}
            <div className="relative h-[50vh] w-full">
                <img src={bgImage} className="w-full h-full object-cover brightness-75" alt={data.name} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                    <h1 className="text-5xl font-bold mb-2 shadow-sm">{data.name}</h1>
                    <p className="text-xl uppercase tracking-widest">{data.country || data.countries?.name || type}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 -mt-20 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                    <button onClick={() => router.back()} className="mb-6 text-sm text-gray-500 hover:text-black">← Back</button>

                    <div className="prose max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">About {data.name}</h2>
                        <p className="text-gray-600 leading-relaxed text-lg mb-8">
                            {data.description || data.short_desc || "No description available for this destination."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t pt-8">
                            {data.population && (
                                <div>
                                    <h3 className="font-bold text-gray-900">Population</h3>
                                    <p>{data.population.toLocaleString()}</p>
                                </div>
                            )}
                            {data.currency && (
                                <div>
                                    <h3 className="font-bold text-gray-900">Currency</h3>
                                    <p>{data.currency}</p>
                                </div>
                            )}
                            {data.continent && (
                                <div>
                                    <h3 className="font-bold text-gray-900">Continent</h3>
                                    <p>{data.continent}</p>
                                </div>
                            )}
                            {data.est_cost_per_day && (
                                <div>
                                    <h3 className="font-bold text-gray-900">Est. Cost / Day</h3>
                                    <p>${data.est_cost_per_day}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
