// Services Data
export const servicesData = [
  {
    id: 1,
    title: 'Annual Service',
    description: 'Complete annual maintenancer storage with our comprehensive service .',
    icon: '/src/assets/images/meter.png'
  },
  {
    id: 2,
    title: 'Winterization',
    description: 'Prepare your bike for winter storage with our comprehensive service.',
    icon: '/src/assets/images/fan.png'
  },
  {
    id: 3,
    title: 'Spring Maintenance',
    description: 'Get your bike ready for the riding season with spring maintenance.',
    icon: '/src/assets/images/filter.png'
  },
  {
    id: 4,
    title: 'Tire Change Service',
    description: 'Professional tire replacement and balancing service.',
    icon: '/src/assets/images/tire.png'
  },
  {
    id: 5,
    title: 'Oil Changes',
    description: 'Regular oil changes to keep your engine running smoothly.',
    icon: '/src/assets/images/oil.png'
  },
  {
    id: 6,
    title: 'Brake Inspection',
    description: 'Thorough brake system inspection and maintenance.',
    icon: '/src/assets/images/brakelogo.png'
  }
];

// Electric Motorbikes Data
export const electricBikesData = [
  {
    id: 1,
    name: 'VinFast E-Scooter S',
    image: '/src/assets/images/vinfast.jpg',
    type: 'FOR RENT',
    make: 'VinFast',
    model: 'E-Scooter S',
    year: '2024',
    battery: '2.5 kWh',
    range: '80 km',
    maxSpeed: '60 km/h',
    price: '150,000 VND/day',
    features: ['Smart Lock', 'LED Display', 'USB Charging']
  },
  {
    id: 2,
    name: 'Yadea G5',
    image: '/src/assets/images/vinfast.jpg',
    type: 'FOR RENT',
    make: 'Yadea',
    model: 'G5',
    year: '2024',
    battery: '3.2 kWh',
    range: '100 km',
    maxSpeed: '70 km/h',
    price: '180,000 VND/day',
    features: ['GPS Tracking', 'Mobile App', 'Anti-theft']
  },
  {
    id: 4,
    name: 'Segway Ninebot E200P',
    image: '/src/assets/images/vinfast.jpg',
    type: 'FOR RENT',
    make: 'Segway',
    model: 'Ninebot E200P',
    year: '2024',
    battery: '3.5 kWh',
    range: '110 km',
    maxSpeed: '75 km/h',
    price: '200,000 VND/day',
    features: ['Sport Mode', 'Regenerative Braking', 'Premium Sound']
  },
  {
    id: 5,
    name: 'Super SOCO CPx',
    image: '/src/assets/images/vinfast.jpg',
    type: 'FOR RENT',
    make: 'Super SOCO',
    model: 'CPx',
    year: '2024',
    battery: '3.0 kWh',
    range: '90 km',
    maxSpeed: '65 km/h',
    price: '170,000 VND/day',
    features: ['Classic Design', 'Comfortable Seat', 'Storage Space']
  },
  {
    id: 6,
    name: 'Yadea G5',
    image: '/src/assets/images/vinfast.jpg',
    type: 'FOR RENT',
    make: 'Yadea',
    model: 'G5',
    year: '2024',
    battery: '3.2 kWh',
    range: '100 km',
    maxSpeed: '70 km/h',
    price: '180,000 VND/day',
    features: ['GPS Tracking', 'Mobile App', 'Anti-theft']
  },
];

// Legacy Motorbikes Data (kept for backward compatibility)
export const motorbikesData = [
  {
    id: 1,
    name: 'KTM RC 390',
    make: 'KTM',
    model: 'RC 390',
    year: '2023',
    minAge: '21',
    maxSpeed: '180 km/h',
    engineType: '373cc',
    price: '$680 / Week',
    type: 'FOR RENT',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    features: ['Sport bike', 'High performance', 'Track ready']
  },
  {
    id: 2,
    name: '2022 Honda Navi',
    make: 'Honda',
    model: 'Navi',
    year: '2022',
    minAge: '18',
    maxSpeed: '120 km/h',
    engineType: '110cc',
    price: '$12,500',
    type: 'FOR SALE',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop',
    features: ['Urban cruiser', 'Easy to ride', 'Fuel efficient']
  },
  {
    id: 3,
    name: 'KTM 1290 Duke',
    make: 'KTM',
    model: '1290 Duke',
    year: '2023',
    minAge: '25',
    maxSpeed: '250 km/h',
    engineType: '1301cc',
    price: '$11,700',
    type: 'FOR SALE',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    features: ['Naked bike', 'High power', 'Street fighter']
  }
];

// Testimonials Data
export const testimonialsData = [
  {
    id: 1,
    name: 'Ryan Garcia',
    role: 'Customer',
    text: 'AutoBike provided excellent service when I needed to rent a motorcycle for my weekend trip. The bike was in perfect condition and the staff was very helpful.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Thomas Dave',
    role: 'Customer',
    text: 'I bought my first motorcycle from AutoBike and couldn\'t be happier. They helped me find the perfect bike for my needs and budget.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

// Company Info
export const companyInfo = {
  name: 'AutoEBike',
  address: '1095 Howard Street, San Francisco, USA',
  email: 'info@plazart.com',
  phone: '+1 234 567 8900',
  hours: 'Mon - Sat 9:00 - 18:00',
  description: 'The company to offer the best motorcycle rental and service. We help you find your next motorbike easily.'
};

// Social Media Links
export const socialLinks = [
  { name: 'Facebook', icon: 'Facebook', url: '#' },
  { name: 'Behance', icon: 'Behance', url: '#' },
  { name: 'LinkedIn', icon: 'LinkedIn', url: '#' },
  { name: 'Twitter', icon: 'Twitter', url: '#' }
];

// Navigation Links
export const navigationLinks = [
  'HOME PAGE',
  'ABOUT US', 
  'EVENTS',
  'CONTACT'
];

// Footer Links
export const footerLinks = {
  about: ['About Us', 'Our Services', 'Our Products', 'Our Team'],
  quickLinks: ['Accessories Shop', 'Our Services', 'Our Products', 'Our Gallery']
};

// Station data with coordinates in Hanoi
export const stationsData = [
  { 
    id: 1, 
    name: 'Ba Đình Station', 
    lat: 21.0285, 
    lng: 105.8542, 
    availableBikes: 15, 
    address: '123 Điện Biên Phủ, Ba Đình, Hà Nội' 
  },
  { 
    id: 2, 
    name: 'Hoàn Kiếm Station', 
    lat: 21.0278, 
    lng: 105.8345, 
    availableBikes: 8, 
    address: '45 Hàng Gai, Hoàn Kiếm, Hà Nội' 
  },
  { 
    id: 3, 
    name: 'Tây Hồ Station', 
    lat: 21.0458, 
    lng: 105.8250, 
    availableBikes: 12, 
    address: '78 Xuân La, Tây Hồ, Hà Nội' 
  }
];