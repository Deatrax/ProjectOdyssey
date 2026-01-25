"use client";

import React, { useState } from "react";
import CountryInputForm from "./CountryInputForm";
import DistrictInputForm from "./DistrictInputForm";
import POIForm from "./POIForm";

type EntityType = "COUNTRY" | "DISTRICT" | "POI";

export default function DbControlPage() {
  const [selectedType, setSelectedType] = useState<EntityType>("COUNTRY");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Database Control</h1>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">Entry Type:</span>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as EntityType)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#F19E39] focus:outline-none bg-white font-medium"
          >
            <option value="COUNTRY">Country</option>
            <option value="DISTRICT">District (City)</option>
            <option value="POI">Point of Interest (POI)</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {selectedType === "COUNTRY" && <CountryInputForm />}
        {selectedType === "DISTRICT" && <DistrictInputForm />}
        {selectedType === "POI" && <POIForm />}
      </div>
    </div>
  );
}
