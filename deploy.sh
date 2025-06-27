#!/bin/bash

# Kyodai Tour & Travel Deployment Script
echo "🚀 Starting Kyodai Tour & Travel deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Docker (optional)
echo "📦 Installing Docker..."
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/kyodai-tour
sudo chown -R $USER:$USER /var/www/kyodai-tour

# Copy application files (assuming they're in current directory)
echo "📋 Copying application files..."
cp -r . /var/www/kyodai-tour/
cd /var/www/kyodai-tour

# Install dependencies
echo "📦 Installing application dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Setup environment variables
echo "⚙️ Setting up environment variables..."
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOL
DATABASE_URL="your-neon-database-url-here"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
EOL
    echo "⚠️  Please edit .env.local with your actual database URL and domain"
fi

# Setup PM2 ecosystem
echo "⚙️ Setting up PM2 configuration..."
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'kyodai-tour',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/kyodai-tour',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/kyodai-tour-error.log',
    out_file: '/var/log/pm2/kyodai-tour-out.log',
    log_file: '/var/log/pm2/kyodai-tour.log',
    time: true
  }]
}
EOL

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Setup Nginx configuration
echo "⚙️ Setting up Nginx configuration..."
sudo tee /etc/nginx/sites-available/kyodai-tour << EOL
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration (you need to add your SSL certificates)
    # ssl_certificate /etc/nginx/ssl/cert.pem;
    # ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # For now, comment out SSL and use HTTP only
    listen 80;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Static files
    location /_next/static {
        alias /var/www/kyodai-tour/.next/static;
        expires 365d;
        access_log off;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOL

# Enable site
sudo ln -sf /etc/nginx/sites-available/kyodai-tour /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start services
echo "🚀 Starting services..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit /var/www/kyodai-tour/.env.local with your database URL"
echo "2. Update Nginx configuration with your domain name"
echo "3. Add SSL certificates for HTTPS"
echo "4. Restart services: pm2 restart kyodai-tour && sudo systemctl restart nginx"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: pm2 logs kyodai-tour"
echo "- Restart app: pm2 restart kyodai-tour"
echo "- Check status: pm2 status"
echo "- Nginx logs: sudo tail -f /var/log/nginx/error.log"
