import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { stationApi, userApi, vehicleApi, rentalApi, paymentApi } from '../../services/adminService.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [counts, setCounts] = useState({ stations: 0, users: 0, vehicles: 0, rentals: 0, payments: 0 });
  const [chartType, setChartType] = useState('rentals');
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('Loading dashboard data...');
        const [s, u, v, r, p] = await Promise.all([
          stationApi.list().catch(err => { console.error('Stations API error:', err); return []; }),
          userApi.list().catch(err => { console.error('Users API error:', err); return []; }),
          vehicleApi.list().catch(err => { console.error('Vehicles API error:', err); return []; }),
          rentalApi.list().catch(err => { console.error('Rentals API error:', err); return []; }),
          paymentApi.list().catch(err => { console.error('Payments API error:', err); return []; }),
        ]);
        
        console.log('API responses:', { s, u, v, r, p });
        
        // Handle different API response structures
        const stations = Array.isArray(s) ? s : (s.stations || []);
        const users = Array.isArray(u) ? u : (u.users || []);
        const vehicles = Array.isArray(v) ? v : (v.vehicles || []);
        const rentals = Array.isArray(r) ? r : (r.rentals || []);
        const payments = Array.isArray(p) ? p : (p.payments || []);
        
        console.log('Processed data:', { stations, users, vehicles, rentals, payments });
        
        // Calculate completed rentals revenue
        const completedRentals = rentals.filter(rental => rental.status === 'COMPLETED');
        const totalRevenue = completedRentals.reduce((sum, rental) => sum + (Number(rental.totalCost) || 0), 0);
        
        console.log('Completed rentals:', completedRentals);
        console.log('Total revenue:', totalRevenue);
        
        setCounts({ 
          stations: stations.length, 
          users: users.length, 
          vehicles: vehicles.length, 
          rentals: rentals.length, 
          payments: totalRevenue // Show total revenue instead of payment count
        });

        // Coarse aggregation by date (expects rental.totalCost, payment.amount, startTime/createdAt)
        const map = new Map();
        const items = chartType === 'rentals' ? 
          completedRentals.map(x => ({ amount: x.totalCost, date: x.startTime || x.createdAt || x.startDate })) : 
          payments.map(x => ({ amount: x.amount, date: x.createdAt || x.paidAt }));
        
        console.log('Chart items:', items);
        
        for (const it of items) {
          const day = (it.date ? new Date(it.date) : new Date());
          const key = day.toISOString().slice(0,10);
          map.set(key, (map.get(key) || 0) + (Number(it.amount) || 0));
        }
        const arr = Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([date, value]) => ({ date, value }));
        console.log('Chart data:', arr);
        setData(arr);
      } catch (error) {
        console.error('Dashboard load error:', error);
      }
    };
    load();
  }, [chartType]);

  const statItems = useMemo(() => ([
    { label: 'Số trạm', value: counts.stations },
    { label: 'Số người dùng', value: counts.users },
    { label: 'Số xe', value: counts.vehicles },
    { label: 'Số thuê xe', value: counts.rentals },
    { label: 'Doanh thu (VND)', value: counts.payments.toLocaleString('vi-VN') },
  ]), [counts]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" sx={{ color: 'white' }}>Dashboard</Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
        {statItems.map((s) => (
          <Paper key={s.label} sx={{ p: 2, bgcolor: '#111', border: '1px solid #222' }}>
            <Typography sx={{ color: '#aaa' }}>{s.label}</Typography>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>{s.value}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 2, bgcolor: '#111', border: '1px solid #222' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Xu hướng doanh thu</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, v) => v && setChartType(v)}
            size="small"
          >
            <ToggleButton value="rentals">Thuê xe hoàn thành</ToggleButton>
            <ToggleButton value="payments">Thanh toán</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke="#ff0000" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}


