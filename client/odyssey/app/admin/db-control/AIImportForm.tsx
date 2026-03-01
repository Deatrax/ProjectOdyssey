"use client";

import React, { useState, useEffect } from "react";
import { Send, Loader2, Sparkles, Plus, Check } from "lucide-react";

type Item = {
  id: string;
  name: string;
  category?: string;
  visitDurationMin?: number;
  description?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
};

export default function AIImportForm() {
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingPlaceId, setSavingPlaceId] = useState<string | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<Set<string>>(new Set());

  // Load Countries
  useEffect(() => {
    fetch("http://localhost:4000/api/admin/countries")
      .then(res => res.json())
      .then(data => { if (data.success) setCountries(data.data); })
      .catch(err => console.error(err));
  }, []);

  // Load Cities when Country changes
  useEffect(() => {
    if (selectedCountry) {
      fetch(`http://localhost:4000/api/admin/cities?country_id=${selectedCountry}`)
        .then(res => res.json())
        .then(data => { if (data.success) setCities(data.data); })
        .catch(err => console.error(err));
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!selectedCountry || !selectedCity) {
      alert("Please select a Country and City first before asking the AI.");
      return;
    }

    const cityObj = cities.find(c => c.id === selectedCity);
    const cityName = cityObj ? cityObj.name : "";

    // Append context quietly
    const userPrompt = `I am looking for places in ${cityName}. ${chatInput}`;
    
    const userMsg = { id: Date.now().toString(), text: chatInput, sender: "user" };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";

    // Build simple conversation history
    const recentMessages = chatMessages.slice(-10);
    const tempConversationHistory = recentMessages.map(msg => ({
      message: msg.text,
      role: msg.sender === "user" ? "user" : "ai",
      created_at: new Date().toISOString()
    }));

    try {
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({
          message: userPrompt,
          collections: [],
          itinerary: [],
          conversationHistory: tempConversationHistory
        })
      });

      if (!res.ok) throw new Error("API returned " + res.status);

      const data = await res.json();
      
      let aiCards: Item[] = [];
      if (data.cards) {
        aiCards = data.cards.map((c: any, cIdx: number) => ({
          ...c,
          id: c.id || `ai-card-${Date.now()}-${cIdx}`,
          name: c.name || c.place || "Unnamed"
        }));
      }

      const aiMessage = data.message || data.reply || "Here are some results.";
      setChatMessages(prev => [...prev, { 
        id: Date.now().toString() + "ai", 
        text: aiMessage, 
        sender: "ai", 
        cards: aiCards 
      }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { id: "err", text: "Error connecting to AI.", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDb = async (card: Item) => {
    if (!selectedCountry || !selectedCity) {
      alert("Missing country or city selection.");
      return;
    }

    setSavingPlaceId(card.id);

    const payload = {
        name: card.name,
        short_desc: card.description ? card.description.substring(0, 300) : "",
        country_id: selectedCountry,
        city_id: selectedCity,
        google_place_id: card.placeId || "",
        latitude: card.lat || null,
        longitude: card.lng || null,
        macro_category: "Urban",
        primary_category: card.category || "",
        secondary_category: "",
        address: "",
        neighborhood: "",
        website: "",
        phone_number: "",
        email: "",
        amenities: [],
        tags: [],
        opening_hours: null,
        entry_fee: null,
        accessibility: null,
        visit_duration_min: card.visitDurationMin || 60,
        est_cost_per_day: null,
        source: "AI Bulk Import",
        verified: false
    };

    try {
        const res = await fetch("http://localhost:4000/api/admin/places", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save place");
        
        setSavedPlaces(prev => new Set(prev).add(card.id));
    } catch (err: any) {
        console.error("Save error:", err);
        alert("Failed to save: " + err.message);
    } finally {
        setSavingPlaceId(null);
    }
  };

  return (
    <div className="flex flex-col h-[700px]">
        {/* Context Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Country</label>
                <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                    <option value="">Select Country...</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target District (City)</label>
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    disabled={!selectedCountry}
                >
                    <option value="">Select District...</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatMessages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                        <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                        <p>Ask the AI for places. For example:</p>
                        <p className="italic mt-1 text-sm">"Find me 5 popular museums in this city"</p>
                        <p className="italic text-sm">"Give me some hidden gems here"</p>
                    </div>
                )}
                
                {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl p-4 text-sm shadow-sm ${
                            msg.sender === "user" ? "bg-gray-900 text-white rounded-tr-sm" : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                        }`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            
                            {/* Process Cards */}
                            {msg.cards && msg.cards.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {msg.cards.map((card: Item) => (
                                        <div key={card.id} className="bg-white border border-gray-100 rounded-lg p-3 flex justify-between items-start shadow-sm hover:shadow relative text-gray-900">
                                            <div className="flex-1 pr-4 min-w-0">
                                                <h4 className="font-bold truncate text-sm">{card.name}</h4>
                                                {card.category && <p className="text-xs text-gray-500 mt-0.5">{card.category}</p>}
                                                {card.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{card.description}</p>}
                                            </div>
                                            
                                            <button
                                                onClick={() => handleSaveToDb(card)}
                                                disabled={savedPlaces.has(card.id) || savingPlaceId === card.id || !selectedCity}
                                                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 flex-shrink-0 ${
                                                    savedPlaces.has(card.id) 
                                                        ? "bg-green-100 text-green-700" 
                                                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                                                }`}
                                            >
                                                {savingPlaceId === card.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : savedPlaces.has(card.id) ? (
                                                    <><Check className="w-4 h-4" /> Saved</>
                                                ) : (
                                                    <><Plus className="w-4 h-4" /> Save to DB</>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 rounded-tl-sm flex items-center gap-2 text-sm text-gray-500 shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="relative flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all px-2">
                    <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="E.g., Find 5 trending restaurants..."
                        disabled={loading || !selectedCity}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-3 outline-none disabled:opacity-50"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !chatInput.trim() || !selectedCity} 
                        className="p-2 bg-blue-600 text-white rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:bg-gray-400 hover:bg-blue-700"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}
