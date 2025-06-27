import { neon } from "@neondatabase/serverless"

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_XaA3EGNnB0Zg@ep-billowing-dawn-a12w5vk6-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set. Please check your .env.local file.")
}

export const sql = neon(databaseUrl)

let migrated = false

export async function ensureDb() {
  if (migrated) return
  migrated = true

  try {
    // ADMIN USERS
    await sql`CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // CLIENT USERS
    await sql`CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // CATEGORIES
    await sql`CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // DESTINATIONS
    await sql`CREATE TABLE IF NOT EXISTS destinations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // TOUR PACKAGES
    await sql`CREATE TABLE IF NOT EXISTS tour_packages (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      duration_days INTEGER NOT NULL,
      max_participants INTEGER NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      destination_id INTEGER REFERENCES destinations(id),
      image_url TEXT,
      itinerary TEXT,
      includes TEXT,
      excludes TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // BOOKINGS
    await sql`CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES clients(id),
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      tour_package_id INTEGER REFERENCES tour_packages(id),
      departure_date DATE NOT NULL,
      participants INTEGER NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      payment_status VARCHAR(50) DEFAULT 'pending',
      booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      invoice_number VARCHAR(100) UNIQUE
    );`

    // REVIEWS
    await sql`CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      tour_package_id INTEGER REFERENCES tour_packages(id),
      client_id INTEGER REFERENCES clients(id),
      customer_name VARCHAR(255) NOT NULL,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // ADMIN SESSIONS
    await sql`CREATE TABLE IF NOT EXISTS admin_sessions (
      id SERIAL PRIMARY KEY,
      admin_id INTEGER REFERENCES admin_users(id),
      session_token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // CLIENT SESSIONS
    await sql`CREATE TABLE IF NOT EXISTS client_sessions (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES clients(id),
      session_token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // Insert default admin user (password: kyodai123)
    await sql`INSERT INTO admin_users (email, password, name) 
      VALUES ('admin@kyodai.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Kyodai')
      ON CONFLICT (email) DO NOTHING;`

    // Insert sample data only if tables are empty
    const categoriesCount = await sql`SELECT COUNT(*) as count FROM categories;`
    if (Number.parseInt(categoriesCount[0].count) === 0) {
      await sql`INSERT INTO categories (name, description) VALUES 
        ('Adventure', 'Paket wisata petualangan dan olahraga ekstrem'),
        ('Cultural', 'Wisata budaya dan sejarah'),
        ('Beach', 'Wisata pantai dan bahari'),
        ('Mountain', 'Wisata pegunungan dan alam'),
        ('City Tour', 'Wisata kota dan urban');`

      await sql`INSERT INTO destinations (name, country, description, image_url) VALUES 
        ('Bali', 'Indonesia', 'Pulau dewata dengan keindahan alam dan budaya yang memukau', 'https://images.unsplash.com/photo-1537953773346-21bda4d32df1?w=800'),
        ('Yogyakarta', 'Indonesia', 'Kota budaya dengan warisan sejarah yang kaya', 'https://images.unsplash.com/photo-1555400082-6e5c3e6b6b5b?w=800'),
        ('Raja Ampat', 'Indonesia', 'Surga bawah laut dengan keanekaragaman hayati terbaik dunia', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'),
        ('Bromo Tengger', 'Indonesia', 'Kawasan pegunungan dengan pemandangan sunrise spektakuler', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),
        ('Jakarta', 'Indonesia', 'Ibu kota dengan berbagai atraksi modern dan kuliner', 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800');`

      await sql`INSERT INTO tour_packages (title, description, price, duration_days, max_participants, category_id, destination_id, image_url, itinerary, includes, excludes) VALUES 
        ('Bali Cultural Heritage 4D3N', 'Jelajahi keindahan budaya Bali dengan mengunjungi pura-pura bersejarah, desa tradisional, dan pertunjukan seni budaya', 2500000, 4, 20, 2, 1, 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800', 
        'Day 1: Arrival - Ubud Palace - Monkey Forest
Day 2: Tegallalang Rice Terrace - Tirta Empul Temple
Day 3: Uluwatu Temple - Kecak Dance - Jimbaran Beach
Day 4: Shopping - Departure', 
        'Hotel 3*, Transport AC, Guide, Entrance tickets, 3x Breakfast', 
        'Flight tickets, Lunch, Dinner, Personal expenses'),
        ('Yogyakarta Heritage Tour 3D2N', 'Wisata sejarah dan budaya Yogyakarta dengan mengunjungi Candi Borobudur, Prambanan, dan Keraton', 1800000, 3, 25, 2, 2, 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
        'Day 1: Arrival - Malioboro Street - Keraton
Day 2: Borobudur Temple - Prambanan Temple
Day 3: Silver Workshop - Departure',
        'Hotel 3*, Transport AC, Guide, Entrance tickets, 2x Breakfast',
        'Flight tickets, Lunch, Dinner, Personal expenses'),
        ('Raja Ampat Diving Adventure 5D4N', 'Petualangan diving di Raja Ampat dengan spot-spot terbaik dunia untuk melihat keindahan bawah laut', 8500000, 5, 12, 1, 3, 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
        'Day 1: Arrival Sorong - Transfer to boat
Day 2-4: Diving at various spots (Arborek, Pianemo, etc)
Day 5: Return to Sorong - Departure',
        'Boat accommodation, All meals, Diving equipment, Guide',
        'Flight tickets, Diving certification, Personal expenses'),
        ('Bromo Sunrise Trekking 2D1N', 'Trekking menuju puncak Bromo untuk menyaksikan sunrise spektakuler', 850000, 2, 15, 1, 4, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'Day 1: Departure - Cemoro Lawang - Bromo Crater
Day 2: Sunrise Point - Return',
        'Transport 4WD, Guide, Entrance ticket, 1x Breakfast',
        'Hotel, Meals, Personal expenses'),
        ('Jakarta City Explorer 2D1N', 'Jelajahi Jakarta modern dengan berbagai atraksi wisata dan kuliner', 1200000, 2, 20, 5, 5, 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800',
        'Day 1: Monas - Old Town - Ancol
Day 2: Shopping - Culinary Tour',
        'Transport AC, Guide, Entrance tickets, 1x Breakfast',
        'Hotel, Meals, Personal expenses');`
    }

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

// Initialize database on module load
void ensureDb()
