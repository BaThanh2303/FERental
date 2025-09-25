import api from '../utils/axios.js';

// Generic helpers
const list = (path, params) => api.get(path, { params }).then(r => r.data);
const create = (path, data) => api.post(path, data).then(r => r.data);
const update = (path, id, data) => api.put(`${path}/${id}`, data).then(r => r.data);
const remove = (path, id) => api.delete(`${path}/${id}`).then(r => r.data);
const getOne = (path, id) => api.get(`${path}/${id}`).then(r => r.data);

// Stations
export const stationApi = {
  list: (params) => list('/stations', params),
  create: (data) => create('/stations', data),
  update: (id, data) => update('/stations', id, data),
  remove: (id) => remove('/stations', id),
};

// Users
export const userApi = {
  list: (params) => list('/users/gmail-cccd', params),
  update: (id, data) => update('/users', id, data),
  remove: (id) => remove('/users', id),
};

// Vehicles (note: create/update require station in path)
export const vehicleApi = {
  list: (params) => list('/vehicles', params),
  createAtStation: (stationId, data) => api.post(`/vehicles/station/${stationId}`, data).then(r => r.data),
  updateWithStation: (id, stationId, data) => api.put(`/vehicles/${id}/station/${stationId}`, data).then(r => r.data),
  remove: (id) => remove('/vehicles', id),
};

// Packages
export const packageApi = {
  list: (params) => list('/packages', params),
  create: (data) => create('/packages', data),
  update: (id, data) => update('/packages', id, data),
  remove: (id) => remove('/packages', id),
};

// Rentals
export const rentalApi = {
  list: (params) => list('/rentals', params),
  get: (id) => getOne('/rentals', id),
};

// Payments
export const paymentApi = {
  list: (params) => list('/payments', params),
  get: (id) => getOne('/payments', id),
};


