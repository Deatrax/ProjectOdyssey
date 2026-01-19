"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
  Pin,
  InfoWindow
} from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

type MapComponentProps = {
  items: any[]; // items from left-column itinerary
  onClose?: () => void;
};

function Directions({ items }: { items: any[] }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || items.length < 2) {
      console.log("Directions: Not enough valid items or services not ready", { 
        itemsCount: items.length, 
        hasDirectionsService: !!directionsService,
        hasDirectionsRenderer: !!directionsRenderer
      });
      return;
    }

    // Filter valid locations
    const validItems = items.filter(item => item.placeId || item.name);
    console.log("Directions: Valid items for routing", validItems);
    
    if (validItems.length < 2) {
      console.log("Directions: Not enough valid items after filtering");
      return;
    }

    try {
      const origin = validItems[0].placeId ? { placeId: validItems[0].placeId } : { query: validItems[0].name };
      const destination = validItems[validItems.length - 1].placeId 
        ? { placeId: validItems[validItems.length - 1].placeId } 
        : { query: validItems[validItems.length - 1].name };
      
      const waypoints = validItems.slice(1, -1).map(item => ({
        location: item.placeId ? { placeId: item.placeId } : { query: item.name },
        stopover: true
      }));

      console.log("Directions: Making route request", { origin, destination, waypointsCount: waypoints.length });

      directionsService.route({
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING
      }).then(response => {
        console.log("Directions: Route received successfully", response);
        directionsRenderer.setDirections(response);
      }).catch(err => {
        console.error("Directions request failed", err);
      });
    } catch (err) {
      console.error("Directions: Error during route setup", err);
    }

    return () => {
      directionsRenderer.setMap(null); // Cleanup
    };
  }, [directionsService, directionsRenderer, items]);

  return null;
}

export default function MapComponent({ items, onClose }: MapComponentProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Filter items that have at least a name
  const validItems = useMemo(() => items.filter(i => i.name), [items]);
  
  // Calculate center (fallback if no items)
  const defaultCenter = { lat: 48.8566, lng: 2.3522 }; // Paris

  console.log("MapComponent Debug:", {
    itemsCount: items.length,
    validItemsCount: validItems.length,
    validItems: validItems
  });

  if (!items || items.length === 0) {
    return (
      <div className="w-full h-full relative flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Places to See Route</h2>
          <p className="text-gray-600">
            Add places to your itinerary on the left to see the route on the map
          </p>
        </div>
      </div>
    );
  }

  if (validItems.length === 0) {
    return (
      <div className="w-full h-full relative flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Your Route...</h2>
          <p className="text-gray-600">
            Processing your places...
          </p>
        </div>
      </div>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
     return <div className="p-4 text-red-500">Error: Google Maps API Key is missing.</div>;
  }

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Header / Close Button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg font-bold hover:bg-gray-100"
        >
          Close Map
        </button>
      </div>

      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={12}
          mapId="DEMO_MAP_ID" // Required for AdvancedMarker
          className="w-full h-full"
          fullscreenControl={false}
        >
           {/* Render Markers */}
           {validItems.map((item, index) => (
             <AdvancedMarkerWithRef
               key={item.id || index}
               item={item}
               index={index}
               onClick={() => setSelectedItem(item)}
             />
           ))}

           {/* Render Route */}
           <Directions items={validItems} />

           {/* Info Window */}
           {selectedItem && (
             <InfoWindow
               position={null} // AdvancedMarker handles position usually, but we need coordinates. 
               // Issue: If we use placeId, we don't have lat/lng immediately for InfoWindow anchor unless we geocode or use the marker anchor.
               // Workaround: simpler approach is to rely on marker click. 
               // Actually, InfoWindow in this library is tricky with just PlaceID.
               // Let's skip InfoWindow for V1 or try to anchor it to the marker if possible.
               // BETTER: Just show a card at the bottom of the screen?
               // Let's try standard InfoWindow if we have lat/lng? We might not.
               // For now, let's just log or show a simple overlay.
               onCloseClick={() => setSelectedItem(null)}
             >
               <div className="p-2">
                 <h3 className="font-bold">{selectedItem.name}</h3>
                 <p className="text-xs text-gray-500">{selectedItem.category}</p>
                 {selectedItem.visitDurationMin && (
                    <p className="text-xs">⏱ {selectedItem.visitDurationMin} min</p>
                 )}
               </div>
             </InfoWindow>
           )}
        </Map>
      </APIProvider>
    </div>
  );
}

// Separate component to handle Marker logic and geocoding if needed? 
// Actually, AdvancedMarker requires position {lat, lng}.
// If we only have PlaceID, we might need to fetch details or let DirectionsRenderer handle it.
// BUT, to show custom markers for ALL items (not just route points), we need positions.
// DirectionsRenderer shows markers by default, but we suppressed them to show custom ones?
// WAIT: DirectionsRenderer is easiest for V1. It handles PlaceIDs automatically.
// Let's UN-suppress markers in DirectionsRenderer for V1 if we only have PlaceIDs.
// However, the user wants "Interactivity".
// Strategy: 
// 1. Use DirectionsRenderer to show the route AND markers (easiest for PlaceID).
// 2. If we want custom markers, we'd need Geocoding Service to convert PlaceID -> LatLng.
// Let's stick to DirectionsRenderer markers for now, but maybe try to add click listeners?
// Actually, let's refine this:
// If we use DirectionsRenderer, it will put A, B, C markers. That is mostly sufficient for "Sequence".
// We can just rely on DirectionsRenderer for the visual map.

function AdvancedMarkerWithRef({ item, index, onClick }: any) {
    // If we don't have lat/lng, we can't render AdvancedMarker easily without looking it up.
    // We will skip rendering manual markers if we don't have coordinates, 
    // and rely on DirectionsRenderer to show the points.
    // IF the item has lat/lng (e.g. from Clustering/Database), we show it.
    
    // Check if we have standard lat/lng (some AI responses might fake it or database has it)
    // The `places` table has `location` (PostGIS), need to see if it's passed to frontend.
    // If not, we rely on DirectionsRenderer.
    
    if (item.lat && item.lng) {
        return (
            <AdvancedMarker position={{ lat: item.lat, lng: item.lng }} onClick={onClick}>
                <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
            </AdvancedMarker>
        );
    }
    return null;
}
