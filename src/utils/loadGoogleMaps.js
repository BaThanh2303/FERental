let googleMapsPromise = null;

export const loadGoogleMapsApi = (apiKey) => {
  // If already loaded, resolve immediately
  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const existingScript = Array.from(document.getElementsByTagName('script')).find((s) =>
        (s.src || '').includes('maps.googleapis.com/maps/api/js')
      );

      const onReady = () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps failed to initialize.'));
        }
      };

      // If a script tag already exists (e.g., added in index.html), wait for it
      if (existingScript) {
        if (existingScript.getAttribute('data-loaded') === 'true' || window.google?.maps) {
          onReady();
          return;
        }
        existingScript.addEventListener('load', () => {
          existingScript.setAttribute('data-loaded', 'true');
          onReady();
        });
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps script.')));

        // Fallback polling in case load event already fired before listener
        const maxWaitMs = 5000;
        const start = Date.now();
        const poll = () => {
          if (window.google && window.google.maps) return onReady();
          if (Date.now() - start > maxWaitMs) return reject(new Error('Google Maps timed out waiting for script.'));
          requestAnimationFrame(poll);
        };
        poll();
        return;
      }

      // No existing script; attempt to inject via provided key or env
      const key = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!key) {
        reject(new Error('Missing Google Maps API key. Add script tag in index.html or set VITE_GOOGLE_MAPS_API_KEY.'));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        script.setAttribute('data-loaded', 'true');
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps failed to load.'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google Maps script.'));
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
};

export default loadGoogleMapsApi;


