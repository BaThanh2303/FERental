import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { getAllStations, getVehiclesInStation } from '../api.jsx';

// Hero Section with Google Maps
export const Hero = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  

  // Hanoi coordinates - center of the map
  const HANOI_CENTER = { lat: 21.0278, lng: 105.8342 };

    // Load stations with real coordinates and vehicle counts
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        console.log('Loading stations with real coordinates from API...');
        
                          // Get stations with real coordinates first
         const stationsWithCoords = await getAllStations();
         console.log('=== RAW API RESPONSE ===');
         console.log('Stations with coordinates loaded from API:', JSON.stringify(stationsWithCoords, null, 2));
         
         if (Array.isArray(stationsWithCoords) && stationsWithCoords.length > 0) {
                      // Process stations data
            const processedStations = stationsWithCoords.map(station => {
             
                                          // Debug: Log station data structure
               console.log('Station data from API:', station);
               console.log('Station coordinates:', {
                 lat: station.lat,
                 lng: station.lng,
                 latType: typeof station.lat,
                 lngType: typeof station.lng,
                 latValue: station.lat,
                 lngValue: station.lng
               });
               
                              // Use coordinates directly from API (API uses "lat" and "lng")
               const lat = station.lat;
               const lng = station.lng;
               
               console.log(`Using coordinates from API for ${station.name}: lat=${lat}, lng=${lng}`);
               
                               return {
                  stationId: station.id, // API uses "id" not "stationId"
                  name: station.name,
                  location: station.address, // API uses "address" not "location"
                  latitude: lat,
                  longitude: lng,
                  availableBikes: station.availableBikes || 0 // Use availableBikes from API
                };
            });
           
                      setStations(processedStations);
            setError('');
            console.log(`Successfully loaded ${processedStations.length} stations with real coordinates`);
            
                         // Markers will be created in the map initialization useEffect
             // They will automatically show the correct availableBikes count
                 } else {
           console.log('No stations data or invalid format:', stationsWithCoords);
           setStations([]);
           setError('Không có dữ liệu trạm xe');
         }
      } catch (error) {
        console.error('Failed to load stations:', error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          setError('Vui lòng đăng nhập để xem danh sách trạm xe.');
        } else if (error.message.includes('Failed to fetch')) {
          setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
        } else {
          setError(`Lỗi: ${error.message}`);
        }
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && !mapInstanceRef.current && window.google && window.google.maps && window.google.maps.Map) {
        try {
          console.log('Starting Google Maps initialization...');
          
          // Always center map on Hanoi
          const center = HANOI_CENTER;
          
          // Create map instance
          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: 12, // Zoom out a bit to show more of Hanoi
            styles: [
              {
                featureType: 'all',
                elementType: 'all',
                stylers: [
                  { color: '#1a1a1a' },
                  { lightness: -20 }
                ]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                  { color: '#333333' }
                ]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [
                  { color: '#1a1a1a' }
                ]
              }
            ]
          });

          console.log('Map instance created successfully');
          mapInstanceRef.current = mapInstance;

          // After map is ready, request user location and add marker
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                const maps = window.google.maps;
                const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="11" fill="rgba(30,144,255,0.3)" />
  <circle cx="12" cy="12" r="10" fill="#1e90ff" stroke="#ffffff" stroke-width="2" />
</svg>`;
                const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
                const icon = {
                  url,
                  scaledSize: new maps.Size(28, 28),
                  anchor: new maps.Point(14, 14),
                };
                // Clear previous if any
                if (userMarkerRef.current) {
                  userMarkerRef.current.setMap(null);
                  userMarkerRef.current = null;
                }
                userMarkerRef.current = new maps.Marker({
                  position: { lat: latitude, lng: longitude },
                  map: mapInstance,
                  title: 'Vị trí của bạn',
                  icon,
                });
              },
              () => {
                // Silently ignore if user denies; keep stations only
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
          }

                     // Add station markers only if we have stations from API
           if (stations.length > 0) {
                           stations.forEach((station) => {
                console.log('Adding marker for station:', station);
                
                                 // Validate coordinates before creating marker
                 const lat = parseFloat(station.latitude);
                 const lng = parseFloat(station.longitude);
                 
                 if (isNaN(lat) || isNaN(lng)) {
                   console.error(`Skipping station ${station.name} - invalid coordinates:`, {
                      latitude: station.latitude,
                      longitude: station.longitude,
                      latType: typeof station.latitude,
                      lngType: typeof station.longitude,
                      parsedLat: lat,
                      parsedLng: lng
                    });
                   return; // Skip this station
                 }
                 
                 console.log(`Valid coordinates for ${station.name}: lat=${lat}, lng=${lng}`);
                
                                 // Create simple marker without number
                 const markerContent = document.createElement('div');
                 markerContent.innerHTML = `
                   <div style="
                     width: 30px;
                     height: 30px;
                     background: #ff0000;
                     border: 3px solid white;
                     border-radius: 50%;
                     cursor: pointer;
                     box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                   ">
                   </div>
                 `;

                // Create advanced marker (with fallback to regular marker)
                let marker;
                try {
                  if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                    marker = new window.google.maps.marker.AdvancedMarkerElement({
                      position: { lat: lat, lng: lng },
                      map: mapInstance,
                      title: station.name,
                      content: markerContent
                    });
                  } else {
                    throw new Error('AdvancedMarkerElement not available');
                  }
                } catch (error) {
                  // Fallback to regular marker if AdvancedMarkerElement not available
                  console.log('AdvancedMarkerElement not available, using regular marker:', error.message);
                                     marker = new window.google.maps.Marker({
                     position: { lat: lat, lng: lng },
                     map: mapInstance,
                     title: station.name,
                     icon: {
                       path: window.google.maps.SymbolPath.CIRCLE,
                       scale: 15,
                       fillColor: '#ff0000',
                       fillOpacity: 1,
                       strokeColor: 'white',
                       strokeWeight: 3
                     }
                   });
                }

              // Add click event to marker
              marker.addListener('click', () => {
                handleStationClick(station);
              });
              
              
            });

            console.log('All markers added successfully');
          } else {
            console.log('No stations to display on map');
          }

        } catch (error) {
          console.error('Error initializing Google Maps:', error);
          showFallbackMap();
        }
      } else if (mapRef.current && !mapInstanceRef.current) {
        // Try to load Google Maps manually
        console.log('Google Maps not loaded, trying manual load...');
        loadGoogleMapsManually();
      }
    };

    // Manual Google Maps loader
    const loadGoogleMapsManually = () => {
      if (window.google && window.google.maps && window.google.maps.Map) {
        console.log('Google Maps already loaded manually');
        setTimeout(() => initMap(), 100);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgge3N3fzjSiXW4PENIe_YA5QTfdFQE44&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded, waiting for API to be ready...');
        setTimeout(() => {
          if (window.google && window.google.maps && window.google.maps.Map) {
            console.log('Google Maps API ready, initializing map...');
            setTimeout(() => initMap(), 100);
          } else {
            console.error('Google Maps API still not ready after script load');
            showFallbackMap();
          }
        }, 1000);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps manually');
        showFallbackMap();
      };

      document.head.appendChild(script);
    };

    // Show fallback map
    const showFallbackMap = () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            background: #1a1a1a;
            color: white;
            font-family: Consolas, monospace;
            text-align: center;
            padding: 20px;
          ">
            <h3 style="color: #ff0000; margin-bottom: 20px;">Map Loading Error</h3>
            <p style="margin-bottom: 15px;">Google Maps failed to load</p>
            <button onclick="window.location.reload()" style="
              background: #ff0000;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-family: Consolas, monospace;
            ">Retry</button>
          </div>
        `;
      }
    };

    // Wait for DOM to be ready
    const timer = setTimeout(initMap, 100);
    
    // Fallback timeout
    const fallbackTimer = setTimeout(() => {
      if ((!window.google || !window.google.maps || !window.google.maps.Map) && mapRef.current && !mapInstanceRef.current) {
        console.log('Google Maps timeout, showing fallback map');
        showFallbackMap();
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
    };
  }, [stations]);

         

  const handleStationClick = async (station) => {
    console.log('Station clicked:', station);
    setSelectedStation(station);
    setSelectedVehicleIndex(0); // Reset vehicle index when selecting new station
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: station.latitude, lng: station.longitude });
      mapInstanceRef.current.setZoom(16);
    }

    try {
      // Load vehicles data for this station
      const vehicles = await getVehiclesInStation(station.stationId);
      console.log(`Vehicles in station ${station.name}:`, vehicles);
      
      // Update station with vehicles data
      setSelectedStation(prev => ({
        ...prev,
        vehicles: vehicles || []
      }));
      
      console.log(`Loaded ${vehicles ? vehicles.length : 0} vehicles for ${station.name}`);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
      // Still show station info even if vehicles fail to load
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        position: 'relative',
        height: '90vh',
        bgcolor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Consolas, monospace',
        width: '100%'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#ff0000', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#ccc' }}>
            Đang tải dữ liệu trạm xe...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'relative',
      height: '90vh',
      bgcolor: '#000000',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'Consolas, monospace',
      width: '100%'
    }}>
      {/* Error Alert */}
      {error && (
        <Box sx={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          zIndex: 1000,
          maxWidth: 400
        }}>
          <Alert 
            severity="warning" 
            sx={{ 
              bgcolor: 'rgba(255,152,0,0.1)', 
              color: '#ff9800',
              border: '1px solid #ff9800'
            }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Google Maps Section - Full Width */}
      <Box sx={{ 
        width: '100%',
        height: '100%',
        minHeight: '500px',
        borderRadius: 0,
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Google Maps Container */}
        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 0,
            backgroundColor: '#1a1a1a'
          }}
        />
        
                 {/* Station Info Overlay */}
         {selectedStation && (
                       <Box sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 1000,
              maxWidth: 400,
              maxHeight: '80vh',
              overflow: 'hidden'
            }}>
             <Box sx={{
               bgcolor: '#111111',
               border: '2px solid #ff0000',
               borderRadius: 2,
               p: 3,
               color: 'white'
             }}>
               <Typography variant="h6" component="div" sx={{ color: '#ff0000', mb: 2, fontFamily: 'Consolas, monospace' }}>
                 {selectedStation.name}
               </Typography>
               
               <Typography variant="body2" component="div" sx={{ color: '#cccccc', mb: 2, fontFamily: 'Consolas, monospace' }}>
                 <strong>Address:</strong> {selectedStation.location || 'Không có địa chỉ'}
               </Typography>

                               {/* Vehicles List */}
                {selectedStation.vehicles && selectedStation.vehicles.length > 0 ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#ff0000', mb: 1, fontFamily: 'Consolas, monospace' }}>
                      Available Vehicles ({selectedStation.vehicles.length})
                    </Typography>
                    
                    {/* Vehicle Slider */}
                    <Box sx={{ 
                      maxHeight: '300px', 
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        transition: 'transform 0.3s ease',
                        transform: `translateY(-${selectedVehicleIndex * 120}px)`
                      }}>
                        {selectedStation.vehicles.map((vehicle) => (
                          <Box key={vehicle.vehicleId} sx={{ 
                            border: '1px solid #333', 
                            borderRadius: 1, 
                            p: 1.5, 
                            bgcolor: '#1a1a1a',
                            minHeight: '110px',
                            display: 'flex',
                            gap: 1
                          }}>
                            {/* Vehicle Image */}
                            {vehicle.imageUrl && (
                              <Box sx={{
                                width: '80px',
                                height: '80px',
                                borderRadius: 1,
                                overflow: 'hidden',
                                flexShrink: 0
                              }}>
                                <img 
                                  src={vehicle.imageUrl} 
                                  alt={vehicle.code}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </Box>
                            )}
                            
                            {/* Vehicle Info */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ color: '#ff0000', fontFamily: 'Consolas, monospace', fontWeight: 'bold', mb: 0.5 }}>
                                {vehicle.code} - {vehicle.type}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#ccc', fontSize: '12px', fontFamily: 'Consolas, monospace', mb: 0.5 }}>
                                <strong>Battery:</strong> {vehicle.batteryLevel}%
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#ccc', fontSize: '12px', fontFamily: 'Consolas, monospace', mb: 0.5 }}>
                                <strong>Status:</strong> {vehicle.status}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#ccc', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>
                                <strong>License:</strong> {vehicle.licensePlate}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      
                      {/* Navigation Buttons */}
                      {selectedStation.vehicles.length > 1 && (
                        <>
                          <Button
                            onClick={() => setSelectedVehicleIndex(prev => Math.max(0, prev - 1))}
                            disabled={selectedVehicleIndex === 0}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              minWidth: '40px',
                              width: '40px',
                              height: '30px',
                              bgcolor: '#ff0000',
                              color: 'white',
                              borderRadius: '20px 20px 0 0',
                              '&:hover': { bgcolor: '#cc0000' },
                              '&:disabled': { bgcolor: '#666', color: '#999' }
                            }}
                          >
                            ↑
                          </Button>
                          
                          <Button
                            onClick={() => setSelectedVehicleIndex(prev => Math.min(selectedStation.vehicles.length - 1, prev + 1))}
                            disabled={selectedVehicleIndex === selectedStation.vehicles.length - 1}
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              minWidth: '40px',
                              width: '40px',
                              height: '30px',
                              bgcolor: '#ff0000',
                              color: 'white',
                              borderRadius: '0 0 20px 20px',
                              '&:hover': { bgcolor: '#cc0000' },
                              '&:disabled': { bgcolor: '#666', color: '#999' }
                            }}
                          >
                            ↓
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: '#999', mb: 2, fontFamily: 'Consolas, monospace' }}>
                    No vehicles available in this station
                  </Typography>
                )}

               <Button
                 variant="outlined"
                 onClick={() => setSelectedStation(null)}
                 sx={{
                   borderColor: '#ff0000',
                   color: '#ff0000',
                   fontFamily: 'Consolas, monospace',
                   '&:hover': { borderColor: '#cc0000', bgcolor: 'rgba(255,0,0,0.1)' }
                 }}
               >
                 Close
               </Button>
             </Box>
           </Box>
         )}

        {/* No Stations Message */}
        {!loading && stations.length === 0 && !error && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            textAlign: 'center',
            bgcolor: 'rgba(0,0,0,0.8)',
            p: 3,
            borderRadius: 2,
            border: '1px solid #333'
          }}>
            <Typography variant="h6" component="div" sx={{ color: '#ff0000', mb: 2, fontFamily: 'Consolas, monospace' }}>
              Không có trạm xe nào
            </Typography>
            <Typography variant="body2" component="div" sx={{ color: '#ccc', mb: 2, fontFamily: 'Consolas, monospace' }}>
              Vui lòng đăng nhập để xem danh sách trạm xe
            </Typography>
            <Typography variant="body2" component="div" sx={{ color: '#999', fontSize: '12px', fontFamily: 'Consolas, monospace' }}>
              Account test: user2@example.com / 123456
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
