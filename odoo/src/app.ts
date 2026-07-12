import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import categoryRoutes from './routes/categoryRoutes';
import assetRoutes from './routes/assetRoutes';
import allocationRoutes from './routes/allocationRoutes';
import bookingRoutes from './routes/bookingRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import reportRoutes from './routes/reportRoutes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportRoutes);
// Teammate's routes get mounted here as their modules land, e.g.:
// app.use('/departments', departmentRoutes);
// app.use('/employees', employeeRoutes);
// app.use('/asset-categories', assetCategoryRoutes);
// app.use('/assets', assetRoutes);
// app.use('/allocations', allocationRoutes);
// app.use('/maintenance', maintenanceRoutes);
// app.use('/bookings', bookingRoutes);
// app.use('/reports', reportRoutes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/notifications', notificationRoutes);
// app.use('/ai', aiRoutes);

// Error handler must be registered last.
app.use(errorHandler);
