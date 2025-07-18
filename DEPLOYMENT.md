# Deployment Guide for Real Estate Application

This guide will help you deploy your full-stack real estate application to make it live on the internet.

## Prerequisites

1. **GitHub Repository**: Your project should be pushed to GitHub
2. **MongoDB Atlas Account**: For cloud database (free tier available)
3. **Cloudinary Account**: For image uploads (free tier available)

## Step 1: Set Up MongoDB Atlas (Database)

1. **Create MongoDB Atlas Account**:
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier)

2. **Configure Database**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `realestate`

3. **Network Access**:
   - Go to Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

## Step 2: Deploy Backend to Render

1. **Go to Render.com**:
   - Sign up with your GitHub account
   - Click "New +" → "Web Service"

2. **Connect Repository**:
   - Select your real estate repository
   - Configure the service:
     - **Name**: `real-estate-backend`
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Environment Variables**:
   - Click "Environment" tab
   - Add these variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=10000
     ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the URL (e.g., `https://your-app.onrender.com`)

## Step 3: Update Frontend Configuration

1. **Update API URL**:
   - Open `frontend/src/config.js`
   - Replace `https://your-backend-url.onrender.com` with your actual backend URL

2. **Commit and Push Changes**:
   ```bash
   git add .
   git commit -m "Update API configuration for production"
   git push origin main
   ```

## Step 4: Deploy Frontend to Vercel

1. **Go to Vercel.com**:
   - Sign up with your GitHub account
   - Click "New Project"

2. **Import Repository**:
   - Select your real estate repository
   - Configure the project:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
     - **Install Command**: `npm install`

3. **Environment Variables** (if needed):
   - Add any API keys or configuration variables

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-app.vercel.app`

## Step 5: Set Up Cloudinary (Optional)

For image uploads to work in production:

1. **Create Cloudinary Account**:
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for free account

2. **Get Credentials**:
   - Go to Dashboard
   - Copy Cloud Name, API Key, and API Secret

3. **Update Frontend**:
   - Open `frontend/src/pages/Listings.js`
   - Replace `YOUR_CLOUD_NAME` with your Cloudinary cloud name
   - Replace `YOUR_UPLOAD_PRESET` with your upload preset

## Step 6: Test Your Deployment

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend**: Visit your Render URL + `/api/listings`
3. **Test Database**: Check if data is being saved to MongoDB Atlas

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Make sure your backend allows requests from your frontend domain
   - Update CORS configuration in `backend/app.js`

2. **Database Connection Issues**:
   - Check MongoDB Atlas connection string
   - Ensure network access is configured correctly

3. **Build Failures**:
   - Check if all dependencies are in `package.json`
   - Verify build commands are correct

4. **Environment Variables**:
   - Ensure all environment variables are set in Render
   - Check if variable names match your code

### Useful Commands:

```bash
# Check if backend is running
curl https://your-backend-url.onrender.com/api/listings

# Check build logs in Vercel/Render
# Go to your deployment dashboard and check logs
```

## Next Steps

1. **Custom Domain**: Add a custom domain to your Vercel deployment
2. **SSL Certificate**: Automatically handled by Vercel and Render
3. **Monitoring**: Set up monitoring and analytics
4. **Backup**: Set up automated database backups

## Support

If you encounter issues:
1. Check the deployment logs in Vercel/Render
2. Verify all environment variables are set correctly
3. Test your API endpoints individually
4. Check browser console for frontend errors

Your real estate application should now be live and accessible to users worldwide! 🎉 