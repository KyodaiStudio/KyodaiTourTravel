# Kyodai Tour & Travel

A modern tour and travel booking website built with Next.js, TypeScript, and Neon Database.

## Features

### Client Features
- 🏠 **Homepage** with featured packages and destinations
- 🔍 **Package Search & Filter** by category, destination, and price
- 📱 **Responsive Design** for all devices
- 👤 **User Authentication** (login/register)
- 🎫 **Tour Booking** with form validation
- 📊 **User Dashboard** with booking history and profile management
- 🧾 **Invoice Generation** and viewing
- ⭐ **Package Reviews** and ratings

### Admin Features
- 🔐 **Admin Authentication** with secure login
- 📈 **Dashboard** with statistics and analytics
- 📦 **Package Management** (CRUD operations)
- 🌍 **Destination Management** (CRUD operations)
- 📋 **Booking Management** with status updates
- 👥 **User Management** and booking oversight

### Technical Features
- ⚡ **Next.js 14** with App Router
- 🎨 **Tailwind CSS** for styling
- 🗄️ **Neon Database** (PostgreSQL)
- 🔒 **Secure Authentication** with bcrypt
- 📱 **Mobile-First Design**
- 🚀 **Production Ready** with Docker support

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Neon (PostgreSQL)
- **Authentication**: Custom JWT-based auth
- **Deployment**: Docker, PM2, Nginx

## Quick Start

### Prerequisites
- Node.js 18+
- Neon Database account
- Git

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd kyodai-tour-travel
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Setup environment variables**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your database URL:
\`\`\`env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

4. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

5. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## Default Admin Credentials

- **Email**: admin@kyodai.com
- **Password**: kyodai123

## Database Schema

The application automatically creates the following tables:
- `admin_users` - Admin user accounts
- `clients` - Client user accounts  
- `categories` - Tour package categories
- `destinations` - Travel destinations
- `tour_packages` - Tour packages with details
- `bookings` - Customer bookings
- `reviews` - Package reviews
- `admin_sessions` & `client_sessions` - Authentication sessions

## API Routes

### Public Routes
- `GET /api/packages` - Get all packages
- `GET /api/packages/[id]` - Get package details
- `POST /api/bookings` - Create booking
- `POST /api/auth/login` - Client login
- `POST /api/auth/register` - Client registration

### Admin Routes (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/packages` - Manage packages
- `POST /api/admin/packages` - Create package
- `PUT /api/admin/packages/[id]` - Update package
- `DELETE /api/admin/packages/[id]` - Delete package
- `GET /api/admin/destinations` - Manage destinations
- `POST /api/admin/destinations` - Create destination
- `PUT /api/admin/destinations/[id]` - Update destination
- `DELETE /api/admin/destinations/[id]` - Delete destination

## Deployment

### VPS Deployment

1. **Upload files to your VPS**
\`\`\`bash
scp -r . user@your-server:/var/www/kyodai-tour
\`\`\`

2. **Run deployment script**
\`\`\`bash
chmod +x deploy.sh
./deploy.sh
\`\`\`

3. **Configure environment**
\`\`\`bash
nano /var/www/kyodai-tour/.env.local
\`\`\`

4. **Start application**
\`\`\`bash
pm2 start ecosystem.config.js
pm2 save
\`\`\`

### Docker Deployment

1. **Build and run with Docker Compose**
\`\`\`bash
docker-compose up -d
\`\`\`

2. **Or build manually**
\`\`\`bash
docker build -t kyodai-tour .
docker run -p 3000:3000 --env-file .env.local kyodai-tour
\`\`\`

## Project Structure

\`\`\`
kyodai-tour-travel/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── booking/           # Booking pages
│   ├── dashboard/         # User dashboard
│   └── packages/          # Package pages
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── db.ts             # Database connection
│   └── types.ts          # TypeScript types
├── public/               # Static assets
├── scripts/              # Database scripts
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker build file
├── deploy.sh            # Deployment script
└── nginx.conf           # Nginx configuration
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@kyodai.com or create an issue in this repository.

---

**Kyodai Tour & Travel** - Your gateway to amazing adventures! 🌍✈️
