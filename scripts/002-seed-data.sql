-- Insert admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@tourtravel.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Tour Travel', 'admin');

-- Insert categories
INSERT INTO categories (name, description) VALUES 
('Adventure', 'Paket wisata petualangan dan olahraga ekstrem'),
('Cultural', 'Wisata budaya dan sejarah'),
('Beach', 'Wisata pantai dan bahari'),
('Mountain', 'Wisata pegunungan dan alam'),
('City Tour', 'Wisata kota dan urban');

-- Insert destinations
INSERT INTO destinations (name, country, description, image_url) VALUES 
('Bali', 'Indonesia', 'Pulau dewata dengan keindahan alam dan budaya yang memukau', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800'),
('Yogyakarta', 'Indonesia', 'Kota budaya dengan warisan sejarah yang kaya', 'https://images.unsplash.com/photo-1555400082-6e5c3e6b6b5b?w=800'),
('Raja Ampat', 'Indonesia', 'Surga bawah laut dengan keanekaragaman hayati terbaik dunia', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'),
('Bromo Tengger', 'Indonesia', 'Kawasan pegunungan dengan pemandangan sunrise spektakuler', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),
('Jakarta', 'Indonesia', 'Ibu kota dengan berbagai atraksi modern dan kuliner', 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800');

-- Insert tour packages
INSERT INTO tour_packages (title, description, price, duration_days, max_participants, category_id, destination_id, image_url, itinerary, includes, excludes) VALUES 
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

('Bromo Sunrise Trekking 2D1N', 'Trekking ke Gunung Bromo untuk menyaksikan sunrise spektakuler dan menjelajahi kawasan Tengger', 850000, 2, 15, 1, 4, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
'Day 1: Arrival - Check in hotel - Explore Tengger village
Day 2: 3AM start for sunrise viewing - Return',
'Hotel, Transport 4WD, Guide, Entrance tickets',
'Flight tickets, Meals, Personal expenses'),

('Jakarta City Explorer 2D1N', 'Jelajahi Jakarta modern dengan mengunjungi landmark, museum, dan pusat perbelanjaan', 1200000, 2, 30, 5, 5, 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800',
'Day 1: National Monument - Old Town - Museum
Day 2: Grand Indonesia - Ancol - Departure',
'Hotel 4*, Transport AC, Guide, Entrance tickets, 1x Breakfast',
'Flight tickets, Lunch, Dinner, Personal expenses');

-- Insert sample reviews
INSERT INTO reviews (tour_package_id, customer_name, rating, comment) VALUES 
(1, 'Sari Dewi', 5, 'Paket tour Bali sangat memuaskan! Guide ramah dan destinasi yang dikunjungi sangat indah.'),
(1, 'Budi Santoso', 4, 'Pengalaman yang luar biasa, hanya saja waktu di setiap tempat agak terburu-buru.'),
(2, 'Maya Sari', 5, 'Tour Yogyakarta sangat edukatif, anak-anak jadi belajar banyak tentang sejarah.'),
(3, 'Andi Wijaya', 5, 'Raja Ampat benar-benar surga bawah laut! Diving spots yang luar biasa indah.'),
(4, 'Rina Kusuma', 4, 'Sunrise di Bromo memang spektakuler, worth it banget!');
