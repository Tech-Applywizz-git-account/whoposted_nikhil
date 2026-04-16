# Whoposted Jobs Dashboard 

A comprehensive Next.js application for analyzing job postings, tracking recruiters, and managing outreach strategies. Powered by Supabase, this dashboard provides real-time insights into who is posting jobs, enabling targeted engagement for administrators and clients.

## 🚀 Key Features

### 🔐 Advanced Authentication (Email-less)
- **Zero-Email Password Recovery**: A custom-built, secure flow that handles password resets entirely within the application using encrypted internal tokens. No external emails are sent, preserving domain integrity.
- **Silent User Provisioning**: Administrators can generate user accounts and set roles without triggering default Supabase invitation emails.
- **Role-Based Access Control (RBAC)**: secure environments for `whopost_admin` (full access) and `whopost_client` (view-only/restricted).

### 📊 Real-Time Analytics
- **Overview Dashboard**: Instant visibility into total jobs, active companies, and top-performing recruiters.
- **Granular Analysis**:
  - **Role Analysis**: Deep dive into specific job titles and their posting frequency.
  - **Company Intelligence**: Track which organizations are hiring most aggressively.
  - **Recruiter Tracking**: Identify specific individuals ("Posters") to connect with directly.
- **Interactive Visualizations**: Dynamic charts and trends powered by Recharts.

### 🛠️ High-Performance Data Engine
- **Massive Dataset Handling**: Optimized to query and visualize over **400,000+ job records** in real-time.
- **Live Database Connection**: Direct integration with Supabase for up-to-the-second data accuracy.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Glassmorphism UI
- **Backend & Database**: Supabase (PostgreSQL), Supabase Auth
- **Security**: AES-256-GCM Session Encryption, Server-Side Middleware
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── app/
│   ├── api/            # Server-side API routes (Admin, Auth, Analytics)
│   ├── admin-controls/ # User management & invite system
│   ├── auth/           # Login, Forgot Password, Set Password pages
│   ├── company-analysis/ # Company-specific data views
│   ├── role-analysis/  # Job role analytics
│   └── overview/       # Main dashboard landing
├── components/         # Reusable UI components & Charts
├── contexts/           # Global Auth & Dashboard state
└── lib/                # Utilities: Supabase client, Encryption, Email helpers
```

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SESSION_SECRET=your_32_byte_secret_key
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```
   Access the dashboard at [http://localhost:3000](http://localhost:3000).

## � Data Insights

The application connects to the `daily_linkedin_jobs_report` table, providing insights on:
- **Total Jobs Analyzed**: 402,000+
- **Sponsorship & Visa Data**: Tracking H1B and sponsorship availability.
- **Top Companies**: Analysis of major tech employers (e.g., Amazon, Google).
- **Recruiter Profiles**: Direct links to poster profiles for outreach.

## 📝 Usage

1. **Login**: Use your provided credentials (or the email-less reset flow if you forgot).
2. **Navigate**: Use the sidebar to switch between Overview, Domains, and Companies.
3. **Filter**: Use the date pickers and search bars to narrow down specific job opportunities.
4. **Admin**: If authorized, use the Admin Controls to manage other users.

## 📄 License

Internal Project - All Rights Reserved.
