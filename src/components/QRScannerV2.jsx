import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { QrCodeScanner, Close, Upload, CameraAlt } from '@mui/icons-material';
import QrScanner from 'qr-scanner';

export default function QRScannerV2({ onScan, onClose, title = "Quét QR Code" }) {
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    console.log('File upload triggered:', event.target.files);
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.type, 'Size:', file.size);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      
      setProcessingImage(true);
      setError('');
      
      console.log('Starting QR scan with qr-scanner...');
      
      // Use qr-scanner to scan the image
      QrScanner.scanImage(file, { 
        returnDetailedScanResult: true,
        maxScansPerSecond: 5,
        highlightScanRegion: true,
        highlightCodeOutline: true
      })
        .then(result => {
          setProcessingImage(false);
          console.log('QR Code detected with qr-scanner:', result);
          console.log('QR Data:', result.data);
          onScan(result.data);
        })
        .catch(err => {
          setProcessingImage(false);
          console.error('QR Scanner error:', err);
          console.error('Error details:', err.message);
          
          // Try alternative approach with jsQR
          console.log('Trying alternative approach with jsQR...');
          tryAlternativeQRScan(file);
        });
    } else {
      console.log('No file selected');
    }
  };

  const tryAlternativeQRScan = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          console.log('Image loaded, trying jsQR...');
          
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Try jsQR
          import('jsqr').then(jsQR => {
            const code = jsQR.default(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              console.log('QR Code detected with jsQR:', code.data);
              onScan(code.data);
            } else {
              console.log('No QR code found with jsQR either');
              setError('Không thể đọc QR code từ ảnh. Vui lòng thử ảnh khác hoặc sử dụng nút demo.');
            }
          }).catch(jsQRErr => {
            console.error('jsQR error:', jsQRErr);
            setError('Không thể đọc QR code từ ảnh. Vui lòng thử ảnh khác hoặc sử dụng nút demo.');
          });
          
        } catch (error) {
          console.error('Alternative scan error:', error);
          setError('Không thể đọc QR code từ ảnh. Vui lòng thử ảnh khác hoặc sử dụng nút demo.');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    console.log('Upload button clicked');
    if (fileInputRef.current) {
      console.log('Triggering file input click');
      fileInputRef.current.click();
    } else {
      console.error('File input ref not found');
      setError('Lỗi: Không tìm thấy file input');
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      bgcolor: '#000', 
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        bgcolor: '#111',
        borderBottom: '1px solid #333'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          {title}
        </Typography>
        <Button 
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <Close />
        </Button>
      </Box>

      {/* Mode Toggle */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2, 
        p: 2,
        bgcolor: '#111',
        borderBottom: '1px solid #333'
      }}>
        <Button
          variant={!uploadMode ? "contained" : "outlined"}
          onClick={() => setUploadMode(false)}
          startIcon={<CameraAlt />}
          sx={{
            bgcolor: !uploadMode ? '#ff0000' : 'transparent',
            color: 'white',
            borderColor: 'white',
            '&:hover': { 
              bgcolor: !uploadMode ? '#cc0000' : 'rgba(255,255,255,0.1)',
              borderColor: '#ff0000'
            }
          }}
        >
          Camera
        </Button>
        <Button
          variant={uploadMode ? "contained" : "outlined"}
          onClick={() => setUploadMode(true)}
          startIcon={<Upload />}
          sx={{
            bgcolor: uploadMode ? '#ff0000' : 'transparent',
            color: 'white',
            borderColor: 'white',
            '&:hover': { 
              bgcolor: uploadMode ? '#cc0000' : 'rgba(255,255,255,0.1)',
              borderColor: '#ff0000'
            }
          }}
        >
          Upload Ảnh
        </Button>
      </Box>

      {/* Scanner Area */}
      <Box sx={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {uploadMode ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 2
          }}>
            <Upload sx={{ fontSize: 80, color: '#ff0000' }} />
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
              Upload ảnh QR code
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', textAlign: 'center', px: 2 }}>
              Sử dụng qr-scanner library để đọc QR code
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={handleUploadClick}
                disabled={processingImage}
                sx={{
                  bgcolor: '#ff0000',
                  '&:hover': { bgcolor: '#cc0000' },
                  '&:disabled': { bgcolor: '#666' }
                }}
              >
                {processingImage ? (
                  <>
                    <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                    Đang đọc QR...
                  </>
                ) : (
                  'Chọn ảnh QR'
                )}
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    console.log('Demo VEHICLE_1 clicked');
                    onScan('VEHICLE_1');
                  }}
                  sx={{
                    borderColor: '#ff0000',
                    color: '#ff0000',
                    '&:hover': { 
                      borderColor: '#cc0000', 
                      color: '#cc0000',
                      bgcolor: 'rgba(255,0,0,0.1)'
                    }
                  }}
                >
                  Demo Xe
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    console.log('Demo STATION_2 clicked');
                    onScan('STATION_2');
                  }}
                  sx={{
                    borderColor: '#2196f3',
                    color: '#2196f3',
                    '&:hover': { 
                      borderColor: '#1976d2', 
                      color: '#1976d2',
                      bgcolor: 'rgba(33,150,243,0.1)'
                    }
                  }}
                >
                  Demo Trạm
                </Button>
              </Box>
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </Box>
        ) : (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 2
          }}>
            <QrCodeScanner sx={{ fontSize: 80, color: '#ff0000' }} />
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
              Camera mode chưa được implement
            </Typography>
            <Button
              variant="contained"
              onClick={() => setUploadMode(true)}
              sx={{
                bgcolor: '#ff0000',
                '&:hover': { bgcolor: '#cc0000' }
              }}
            >
              Chuyển sang Upload Ảnh
            </Button>
          </Box>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              m: 2, 
              bgcolor: 'rgba(244,67,54,0.1)', 
              color: '#f44336' 
            }}
          >
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
