# SMRU Hostel Care - Supabase Backend Integration Setup

## 🚀 Quick Setup Guide (10 minutes)

Your SMRU Hostel Care project is now ready to connect with Supabase! Follow these steps to enable full-stack functionality:

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization
4. Set project name: `smru-hostel-care`
5. Set database password (save it securely!)
6. Select region closest to your users
7. Click "Create new project"

### Step 2: Setup Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase_schema.sql` from your project
4. Click **Run** to create all tables and functions

### Step 3: Configure Authentication

1. In Supabase dashboard, go to **Authentication > Settings**
2. Under "Site URL", add your domain (for local development: `http://localhost:3000`)
3. Under "Redirect URLs", add:
   - `http://localhost:3000` (for development)
   - Your production domain (when deployed)
4. Enable email confirmations if desired

### Step 4: Get API Keys

1. In Supabase dashboard, go to **Settings > API**
2. Copy these values:
   - **Project URL** (starts with https://)
   - **Project API Key** (anon, public key)

### Step 5: Update Your Project

1. Open `supabase-config.js` in your project
2. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

3. Paste your actual Supabase URL and anon key

### Step 6: Test the Connection

1. Open your project in a browser
2. Try registering a new student account
3. Submit a test complaint
4. Check your Supabase dashboard > **Table Editor** to see the data

## 🔄 What's Now Integrated

### Authentication
- **Student Registration**: Creates user profiles in Supabase
- **Student Login**: Authenticates against Supabase users
- **Staff Login**: Role-based authentication with Supabase
- **Session Management**: Automatic session restoration
- **Secure Logout**: Proper Supabase session cleanup

### Complaint Management
- **Submit Complaints**: Stored in Supabase with local fallback
- **Real-time Updates**: Live synchronization across devices
- **Data Sync**: Merges local and Supabase data seamlessly
- **Offline Support**: Works offline, syncs when back online

### Real-time Features
- **Live Notifications**: Instant updates when complaint status changes
- **Multi-device Sync**: Changes appear across all logged-in devices
- **Automatic Refresh**: Dashboard updates without page reload

## 📊 Database Tables Created

The setup creates these tables in your Supabase project:

- `profiles` - User profiles (students, staff, admins)
- `complaints` - Complaint records with full lifecycle tracking
- `complaint_status_history` - Timeline of complaint status changes
- `notifications` - In-app notification system
- `announcements` - System-wide announcements

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Staff can only access complaints in their department
- Admins have full access
- Secure authentication with email verification

## 🚀 Production Deployment

When deploying to production:

1. Update the Site URL and Redirect URLs in Supabase Auth settings
2. Replace the Supabase URL in `supabase-config.js` (no code changes needed!)
3. Enable email confirmations for production security
4. Set up custom SMTP for branded emails (optional)

## 🆘 Troubleshooting

### "Failed to connect to Supabase"
- Check your internet connection
- Verify the SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check browser console for detailed error messages

### Authentication not working
- Verify your Supabase project has the auth schema set up
- Check that Site URL matches your current domain
- Ensure the anon key has the correct permissions

### Data not appearing
- Confirm the database schema was created successfully
- Check Supabase dashboard > Table Editor for data
- Verify Row Level Security policies are not blocking access

## 🔄 Fallback Behavior

Your app is designed to work seamlessly:
- **Online**: Uses Supabase for real-time data and authentication
- **Offline**: Falls back to local storage automatically
- **Mixed**: Syncs local and remote data when connection restored

## 🎯 Next Steps

Once connected, you can:
1. Invite staff members to create their accounts
2. Customize the complaint categories in `app.js`
3. Add custom notification rules
4. Set up automated email alerts (using Supabase Edge Functions)
5. Deploy to production with your custom domain

---

**Need Help?** Check the browser console for detailed error messages, or verify your Supabase project settings match the requirements above.

**🎉 That's it!** Your SMRU Hostel Care system now has a professional database backend with real-time features!