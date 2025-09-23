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
      const [s, u, v, r, p] = await Promise.all([
        stationApi.list(),
        userApi.list(),
        vehicleApi.list(),
        rentalApi.list(),
        paymentApi.list(),
      ]);
      setCounts({ stations: s.length, users: u.length, vehicles: v.length, rentals: r.length, payments: p.length });

      // Coarse aggregation by date (expects rental.totalCost, payment.amount, createdAt)
      const map = new Map();
      const items = chartType === 'rentals' ? r.map(x => ({ amount: x.totalCost, date: x.createdAt || x.startDate })) : p.map(x => ({ amount: x.amount, date: x.createdAt || x.paidAt }));
      for (const it of items) {
        const day = (it.date ? new Date(it.date) : new Date());
        const key = day.toISOString().slice(0,10);
        map.set(key, (map.get(key) || 0) + (Number(it.amount) || 0));
      }
      const arr = Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([date, value]) => ({ date, value }));
      setData(arr);
    };
    load();
  }, [chartType]);

  const statItems = useMemo(() => ([
    { label: 'Stations', value: counts.stations },
    { label: 'Users', value: counts.users },
    { label: 'Vehicles', value: counts.vehicles },
    { label: 'Rentals', value: counts.rentals },
    { label: 'Payments', value: counts.payments },
  ]), [counts]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          <Typography variant="h6">Revenue Trend</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, v) => v && setChartType(v)}
            size="small"
          >
            <ToggleButton value="rentals">Rentals</ToggleButton>
            <ToggleButton value="payments">Payments</ToggleButton>
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


