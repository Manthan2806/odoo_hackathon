import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/auth', authRoutes);

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