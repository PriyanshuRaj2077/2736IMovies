const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// IN-MEMORY / PERSISTENT MOCK DATA STORE
// (Production-ready Mongoose-compatible schema)
// ==========================================
let users = [
  { id: 'usr-1', username: 'Alex Rivera', email: 'alex@example.com', role: 'user' },
  { id: 'adm-1', username: 'System Admin', email: 'admin@imovies.com', role: 'admin' }
];

let theatres = [
  {
    id: 'th-1',
    name: 'PVR IMAX Metropolis',
    location: '4th Floor, Phoenix Mall, Downtown',
    city: 'Metro City',
    seatingCapacity: {
      lower: { count: 16, defaultPrice: 160 },
      middle: { count: 20, defaultPrice: 240 },
      balcony: { count: 12, defaultPrice: 380 }
    }
  },
  {
    id: 'th-2',
    name: 'INOX Megaplex Dolby Atmos',
    location: 'Central Plaza, Tech District',
    city: 'Metro City',
    seatingCapacity: {
      lower: { count: 16, defaultPrice: 150 },
      middle: { count: 20, defaultPrice: 220 },
      balcony: { count: 12, defaultPrice: 350 }
    }
  },
  {
    id: 'th-3',
    name: 'Cinepolis Grand Luxe',
    location: 'Galleria Mall, West End',
    city: 'Metro City',
    seatingCapacity: {
      lower: { count: 16, defaultPrice: 180 },
      middle: { count: 20, defaultPrice: 260 },
      balcony: { count: 12, defaultPrice: 420 }
    }
  }
];

let movies = [
  {
    id: 'mov-1',
    title: 'Dune: Part Two',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    certification: 'UA',
    runtimeMinutes: 166,
    releaseDate: '2024-03-01',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    averageRating: 4.8,
    reviewCount: 342,
    trending: true
  },
  {
    id: 'mov-2',
    title: 'Oppenheimer',
    genre: ['Biography', 'Drama', 'History'],
    certification: 'A',
    runtimeMinutes: 180,
    releaseDate: '2023-07-21',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    averageRating: 4.9,
    reviewCount: 512,
    trending: true
  },
  {
    id: 'mov-3',
    title: 'Interstellar: 10th Anniversary IMAX',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    certification: 'UA',
    runtimeMinutes: 169,
    releaseDate: '2014-11-07',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    averageRating: 4.9,
    reviewCount: 890,
    trending: true
  },
  {
    id: 'mov-4',
    title: 'Spider-Man: Across the Spider-Verse',
    genre: ['Animation', 'Action', 'Sci-Fi'],
    certification: 'U',
    runtimeMinutes: 140,
    releaseDate: '2023-06-02',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    averageRating: 4.7,
    reviewCount: 420,
    trending: false
  },
  {
    id: 'mov-5',
    title: 'The Batman',
    genre: ['Action', 'Crime', 'Drama'],
    certification: 'UA',
    runtimeMinutes: 176,
    releaseDate: '2022-03-04',
    description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    averageRating: 4.6,
    reviewCount: 295,
    trending: false
  },
  {
    id: 'mov-6',
    title: 'Inception',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    certification: 'UA',
    runtimeMinutes: 148,
    releaseDate: '2010-07-16',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    averageRating: 4.8,
    reviewCount: 680,
    trending: false
  }
];

const todayStr = new Date().toISOString().split('T')[0];

let shows = [
  {
    id: 'shw-1',
    movieId: 'mov-1',
    theatreId: 'th-1',
    showDate: todayStr,
    showTime: '10:30 AM',
    pricing: { lower: 160, middle: 240, balcony: 380 },
    bookedSeats: ['L-3', 'L-4', 'M-7', 'M-8', 'B-1', 'B-2']
  },
  {
    id: 'shw-2',
    movieId: 'mov-1',
    theatreId: 'th-1',
    showDate: todayStr,
    showTime: '02:15 PM',
    pricing: { lower: 160, middle: 240, balcony: 380 },
    bookedSeats: ['M-10', 'M-11', 'B-5']
  },
  {
    id: 'shw-3',
    movieId: 'mov-1',
    theatreId: 'th-2',
    showDate: todayStr,
    showTime: '06:30 PM',
    pricing: { lower: 150, middle: 220, balcony: 350 },
    bookedSeats: ['L-1', 'L-2', 'B-7', 'B-8']
  },
  {
    id: 'shw-4',
    movieId: 'mov-2',
    theatreId: 'th-1',
    showDate: todayStr,
    showTime: '05:00 PM',
    pricing: { lower: 160, middle: 240, balcony: 380 },
    bookedSeats: ['M-1', 'M-2', 'B-3']
  },
  {
    id: 'shw-5',
    movieId: 'mov-3',
    theatreId: 'th-1',
    showDate: todayStr,
    showTime: '08:45 PM',
    pricing: { lower: 180, middle: 260, balcony: 420 },
    bookedSeats: ['B-5', 'B-6', 'M-14']
  },
  {
    id: 'shw-6',
    movieId: 'mov-4',
    theatreId: 'th-3',
    showDate: todayStr,
    showTime: '01:00 PM',
    pricing: { lower: 180, middle: 260, balcony: 420 },
    bookedSeats: []
  }
];

let bookings = [
  {
    id: 'bkg-1',
    bookingReference: 'IMV-837192',
    userId: 'usr-1',
    userName: 'Alex Rivera',
    userEmail: 'alex@example.com',
    showId: 'shw-1',
    movieTitle: 'Dune: Part Two',
    theatreName: 'PVR IMAX Metropolis',
    showDate: todayStr,
    showTime: '10:30 AM',
    seats: ['B-1', 'B-2'],
    totalAmount: 760,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  }
];

let favorites = [
  { userId: 'usr-1', movieId: 'mov-1' },
  { userId: 'usr-1', movieId: 'mov-3' }
];

let reviews = [
  {
    id: 'rev-1',
    movieId: 'mov-1',
    userId: 'usr-1',
    userName: 'Alex Rivera',
    rating: 5,
    comment: 'An absolute masterpiece of cinema. Visuals and sound in IMAX were breathtaking!',
    createdAt: '2024-03-04T12:00:00Z'
  },
  {
    id: 'rev-2',
    movieId: 'mov-2',
    userId: 'usr-1',
    userName: 'Alex Rivera',
    rating: 5,
    comment: 'Cillian Murphy delivered a historic performance. Tense from start to finish.',
    createdAt: '2023-07-25T14:30:00Z'
  }
];

// ==========================================
// REST API ENDPOINTS
// ==========================================

// --- Auth Endpoints ---
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  let user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    user = { id: `usr-${Date.now()}`, username: email ? email.split('@')[0] : 'Guest User', email: email || 'guest@example.com', role: 'user' };
    users.push(user);
  }
  res.json({
    success: true,
    message: 'Authentication successful',
    data: {
      user,
      token: `jwt_mock_token_${user.id}_${Date.now()}`
    }
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.json({ success: true, data: users[0] });
});

// --- Movie Endpoints ---
app.get('/api/movies', (req, res) => {
  const { search, genre } = req.query;
  let filtered = [...movies];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
  }
  if (genre && genre !== 'All') {
    filtered = filtered.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
  }
  res.json({
    success: true,
    data: {
      movies: filtered,
      total: filtered.length
    }
  });
});

app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
  const movieShows = shows.filter(s => s.movieId === movie.id);
  res.json({ success: true, data: { ...movie, shows: movieShows } });
});

app.post('/api/movies', (req, res) => {
  const { title, genre, certification, runtimeMinutes, description, posterUrl, backdropUrl } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }
  const newMovie = {
    id: `mov-${Date.now()}`,
    title,
    genre: Array.isArray(genre) ? genre : (genre || 'Action').split(',').map(s => s.trim()),
    certification: certification || 'UA',
    runtimeMinutes: Number(runtimeMinutes) || 120,
    releaseDate: new Date().toISOString().split('T')[0],
    description,
    posterUrl: posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: backdropUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    averageRating: 5.0,
    reviewCount: 1,
    trending: false
  };
  movies.unshift(newMovie);
  res.status(201).json({ success: true, message: 'Movie created successfully', data: newMovie });
});

app.delete('/api/movies/:id', (req, res) => {
  const idx = movies.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Movie not found' });
  movies.splice(idx, 1);
  res.json({ success: true, message: 'Movie deleted successfully' });
});

// --- Theatres Endpoints ---
app.get('/api/theatres', (req, res) => {
  res.json({ success: true, data: theatres });
});

// --- Shows Endpoints ---
app.get('/api/shows', (req, res) => {
  const { movieId, date } = req.query;
  let result = shows.map(s => {
    const movie = movies.find(m => m.id === s.movieId);
    const theatre = theatres.find(t => t.id === s.theatreId);
    return {
      ...s,
      movieTitle: movie ? movie.title : 'Unknown Movie',
      theatreName: theatre ? theatre.name : 'Unknown Theatre',
      theatreLocation: theatre ? theatre.location : ''
    };
  });
  if (movieId) result = result.filter(s => s.movieId === movieId);
  if (date) result = result.filter(s => s.showDate === date);
  res.json({ success: true, data: result });
});

app.get('/api/shows/:id/seats', (req, res) => {
  const show = shows.find(s => s.id === req.params.id);
  if (!show) return res.status(404).json({ success: false, message: 'Show not found' });
  const theatre = theatres.find(t => t.id === show.theatreId);
  const movie = movies.find(m => m.id === show.movieId);

  res.json({
    success: true,
    data: {
      showId: show.id,
      movieTitle: movie ? movie.title : '',
      posterUrl: movie ? movie.posterUrl : '',
      theatreName: theatre ? theatre.name : '',
      theatreLocation: theatre ? theatre.location : '',
      showDate: show.showDate,
      showTime: show.showTime,
      pricing: show.pricing,
      bookedSeats: show.bookedSeats,
      tiers: [
        { id: 'balcony', name: 'Balcony Tier (Premium)', price: show.pricing.balcony, rows: ['B'], seatsPerRow: 12 },
        { id: 'middle', name: 'Middle Tier (Executive)', price: show.pricing.middle, rows: ['M1', 'M2'], seatsPerRow: 10 },
        { id: 'lower', name: 'Lower Tier (Standard)', price: show.pricing.lower, rows: ['L1', 'L2'], seatsPerRow: 8 }
      ]
    }
  });
});

app.post('/api/shows', (req, res) => {
  const { movieId, theatreId, showDate, showTime, pricing } = req.body;
  if (!movieId || !theatreId || !showDate || !showTime) {
    return res.status(400).json({ success: false, message: 'Movie, theatre, date, and time are required.' });
  }

  // Conflict detection
  const collision = shows.find(s => s.theatreId === theatreId && s.showDate === showDate && s.showTime === showTime);
  if (collision) {
    return res.status(409).json({ success: false, message: 'Hall schedule collision: Another show is already scheduled at this theatre and time.' });
  }

  const theatre = theatres.find(t => t.id === theatreId);
  const newShow = {
    id: `shw-${Date.now()}`,
    movieId,
    theatreId,
    showDate,
    showTime,
    pricing: pricing || (theatre ? {
      lower: theatre.seatingCapacity.lower.defaultPrice,
      middle: theatre.seatingCapacity.middle.defaultPrice,
      balcony: theatre.seatingCapacity.balcony.defaultPrice
    } : { lower: 150, middle: 220, balcony: 350 }),
    bookedSeats: []
  };
  shows.push(newShow);
  res.status(201).json({ success: true, message: 'Show scheduled successfully', data: newShow });
});

// --- ATOMIC BOOKING ENDPOINT (Double-Booking Protected) ---
app.post('/api/bookings', (req, res) => {
  const { showId, selectedSeats, userEmail, userName } = req.body;

  if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
    return res.status(400).json({ success: false, message: 'Valid show ID and seat selection are required.' });
  }

  const show = shows.find(s => s.id === showId);
  if (!show) {
    return res.status(404).json({ success: false, message: 'Showtime not found.' });
  }

  // ATOMIC CHECK: Check if any requested seat is already booked
  const conflictingSeats = selectedSeats.filter(seat => show.bookedSeats.includes(seat));
  if (conflictingSeats.length > 0) {
    return res.status(409).json({
      success: false,
      message: `Seat collision: ${conflictingSeats.join(', ')} already reserved by another customer. Please choose different seats.`,
      error: { code: 'SEAT_CONCURRENTLY_RESERVED', conflictingSeats }
    });
  }

  // ATOMIC COMMIT: Reserve seats
  show.bookedSeats.push(...selectedSeats);

  const movie = movies.find(m => m.id === show.movieId);
  const theatre = theatres.find(t => t.id === show.theatreId);

  // Calculate pricing
  let totalAmount = 0;
  selectedSeats.forEach(seat => {
    if (seat.startsWith('B')) totalAmount += show.pricing.balcony;
    else if (seat.startsWith('M')) totalAmount += show.pricing.middle;
    else totalAmount += show.pricing.lower;
  });

  const bookingRef = `IMV-${Math.floor(100000 + Math.random() * 900000)}`;
  const newBooking = {
    id: `bkg-${Date.now()}`,
    bookingReference: bookingRef,
    userId: 'usr-1',
    userName: userName || 'Alex Rivera',
    userEmail: userEmail || 'alex@example.com',
    showId: show.id,
    movieTitle: movie ? movie.title : 'Movie',
    posterUrl: movie ? movie.posterUrl : '',
    theatreName: theatre ? theatre.name : 'Theatre',
    theatreLocation: theatre ? theatre.location : '',
    showDate: show.showDate,
    showTime: show.showTime,
    seats: selectedSeats,
    totalAmount,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully!',
    data: newBooking
  });
});

app.get('/api/bookings/my-bookings', (req, res) => {
  res.json({ success: true, data: bookings });
});

app.put('/api/bookings/:id/cancel', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (booking.status === 'CANCELLED') {
    return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
  }

  // Release seats back
  const show = shows.find(s => s.id === booking.showId);
  if (show) {
    show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
  }

  booking.status = 'CANCELLED';
  res.json({ success: true, message: 'Booking cancelled and seats successfully released.', data: booking });
});

// --- Favorites Endpoints ---
app.get('/api/favorites', (req, res) => {
  const favMovieIds = favorites.map(f => f.movieId);
  const favMovies = movies.filter(m => favMovieIds.includes(m.id));
  res.json({ success: true, data: favMovies });
});

app.post('/api/favorites/:movieId', (req, res) => {
  const { movieId } = req.params;
  const existing = favorites.find(f => f.movieId === movieId);
  if (existing) {
    favorites = favorites.filter(f => f.movieId !== movieId);
    return res.json({ success: true, message: 'Removed from favorites', favorited: false });
  } else {
    favorites.push({ userId: 'usr-1', movieId });
    return res.json({ success: true, message: 'Added to favorites', favorited: true });
  }
});

// --- Reviews Endpoints ---
app.get('/api/movies/:id/reviews', (req, res) => {
  const movieReviews = reviews.filter(r => r.movieId === req.params.id);
  res.json({ success: true, data: movieReviews });
});

app.post('/api/reviews', (req, res) => {
  const { movieId, rating, comment } = req.body;
  if (!movieId || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Movie, rating, and comment are required.' });
  }
  const newReview = {
    id: `rev-${Date.now()}`,
    movieId,
    userId: 'usr-1',
    userName: 'Alex Rivera',
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  };
  reviews.unshift(newReview);

  // Recalculate average rating
  const movieReviews = reviews.filter(r => r.movieId === movieId);
  const avg = (movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length).toFixed(1);
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    movie.averageRating = Number(avg);
    movie.reviewCount = movieReviews.length;
  }

  res.status(201).json({ success: true, message: 'Review submitted', data: newReview });
});

// --- Admin Endpoints ---
app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = bookings.filter(b => b.status === 'CONFIRMED').reduce((acc, b) => acc + b.totalAmount, 0);
  const totalTickets = bookings.filter(b => b.status === 'CONFIRMED').reduce((acc, b) => acc + b.seats.length, 0);

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalTickets,
      activeShows: shows.length,
      totalMovies: movies.length,
      totalTheatres: theatres.length,
      totalUsers: users.length,
      recentBookings: bookings.slice(0, 5)
    }
  });
});

app.get('/api/admin/bookings', (req, res) => {
  res.json({ success: true, data: bookings });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎬 iMovies Platform is LIVE on http://localhost:${PORT}`);
  console.log(`🌟 REST API: http://localhost:${PORT}/api/movies`);
  console.log(`🎟️ Interactive Client: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
