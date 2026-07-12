// Open src/app.ts
import categoryRoutes from './routes/categoryRoutes';
import assetRoutes from './routes/assetRoutes';

// ... existing middleware setups (like app.use(express.json())) ...

// Mount your new operational modules
app.use('/api/categories', categoryRoutes);
app.use('/api/assets', assetRoutes);