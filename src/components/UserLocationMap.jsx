import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { loadGoogleMapsApi } from '../utils/loadGoogleMaps';

export const UserLocationMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const stationMarkersRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stations, setStations] = useState([]);
  const [apiError, setApiError] = useState('');

  // Build a custom blue marker with a lighter blue outer ring (10% larger)
  const buildMarkerIcon = () => {
    // Base size 20px, outer 22px (10% larger)
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="11" fill="rgba(30,144,255,0.3)" />
  <circle cx="12" cy="12" r="10" fill="#1e90ff" stroke="#ffffff" stroke-width="2" />
</svg>`;
    const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    return {
      url,
      scaledSize: new window.google.maps.Size(28, 28),
      anchor: new window.google.maps.Point(14, 14),
    };
  };

  // Load stations once
  useEffect(() => {
    let cancelled = false;
    const loadStations = async () => {
      try {
        setApiError('');
        const res = await axios.get('http://localhost:8080/api/stations', { headers: { 'Accept': 'application/json' } });
        if (!cancelled) setStations(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) setApiError('Không thể tải danh sách trạm.');
      }
    };
    loadStations();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const locateAndRender = async () => {
      try {
        setLoading(true);
        setError('');

        // 1) Request user geolocation
        const position = await new Promise((resolve, reject) => {
          if (!('geolocation' in navigator)) {
            reject(new Error('Thiết bị không hỗ trợ định vị.'));
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            (err) => {
              if (err.code === 1) reject(new Error('Bạn đã từ chối quyền truy cập vị trí.'));
              else if (err.code === 2) reject(new Error('Dịch vụ định vị tạm thời không khả dụng.'));
              else if (err.code === 3) reject(new Error('Yêu cầu định vị hết thời gian.'));
              else reject(new Error('Không thể lấy vị trí của bạn.'));
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
          );
        });

        if (cancelled) return;

        const { latitude, longitude } = position.coords;

        // 2) Ensure Google Maps loaded
        const maps = await loadGoogleMapsApi();
        if (cancelled) return;

        const center = { lat: latitude, lng: longitude };

        // 3) Init or update map and marker
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new maps.Map(mapRef.current, {
            center,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
        } else {
          mapInstanceRef.current.setCenter(center);
        }

        const icon = buildMarkerIcon();
        if (!markerRef.current) {
          markerRef.current = new maps.Marker({
            position: center,
            map: mapInstanceRef.current,
            title: 'Vị trí của bạn',
            icon,
          });
        } else {
          markerRef.current.setIcon(icon);
          markerRef.current.setPosition(center);
        }

        // 5) Render station markers (default style) and clear previous
        stationMarkersRef.current.forEach((m) => m.setMap(null));
        stationMarkersRef.current = [];
        if (stations && stations.length > 0) {
          stations.forEach((s) => {
            if (typeof s.latitude === 'number' && typeof s.longitude === 'number') {
              const m = new maps.Marker({
                position: { lat: s.latitude, lng: s.longitude },
                map: mapInstanceRef.current,
                title: s.name || 'Station',
              });
              stationMarkersRef.current.push(m);
            }
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Lỗi không xác định');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    locateAndRender();

    return () => {
      cancelled = true;
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      stationMarkersRef.current.forEach((m) => m.setMap(null));
      stationMarkersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, [stations]);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mt-6">
      <div className="max-w-5xl mx-auto rounded-xl border border-gray-700 bg-[#111111] text-white">
        <div className="p-4 md:p-6">
          {loading && (<p className="text-gray-300 text-sm">Đang lấy vị trí của bạn...</p>)}
          {!loading && apiError && (<p className="text-yellow-400 text-sm">{apiError}</p>)}
          {!loading && error && (<p className="text-red-400 text-sm">{error}</p>)}
          <div ref={mapRef} className="w-full h-[360px] md:h-[480px] mt-3 rounded-lg overflow-hidden" />
          
        </div>
      </div>
    </div>
  );
};

export default UserLocationMap;


