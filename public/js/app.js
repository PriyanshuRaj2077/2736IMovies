// ==========================================================================
// iMovies Frontend Application Logic (Ticketnew Light Theme)
// ==========================================================================

const API_BASE = '/api';

// Application State
let state = {
  movies: [],
  theatres: [],
  shows: [],
  favorites: [],
  myBookings: [],
  activeGenre: 'All',
  selectedShow: null,
  selectedSeats: [], // ['B-1', 'M-5']
  currentMovieForDetails: null
};

// DOM Elements
const moviesGrid = document.getElementById('movies-grid');
const theatresGrid = document.getElementById('theatres-grid');
const genreTabsContainer = document.getElementById('genre-tabs-container');
const globalSearchInput = document.getElementById('global-search-input');
const bookingsCountBadge = document.getElementById('bookings-count-badge');

// Modals
const movieDetailsModal = document.getElementById('movie-details-modal');
const seatBookingModal = document.getElementById('seat-booking-modal');
const ticketModal = document.getElementById('ticket-modal');
const myBookingsModal = document.getElementById('my-bookings-modal');
const favoritesModal = document.getElementById('favorites-modal');
const adminModal = document.getElementById('admin-modal');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await loadInitialData();
});

async function loadInitialData() {
  try {
    await Promise.all([
      fetchMovies(),
      fetchTheatres(),
      fetchFavorites(),
      fetchMyBookings()
    ]);
  } catch (err) {
    showToast('Failed to load some catalog data', 'error');
  }
}

// ==========================================
// API FETCHERS
// ==========================================
async function fetchMovies(search = '', genre = state.activeGenre) {
  let url = `${API_BASE}/movies?`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (genre && genre !== 'All') url += `genre=${encodeURIComponent(genre)}&`;

  const res = await fetch(url);
  const data = await res.json();
  if (data.success) {
    state.movies = data.data.movies;
    renderMoviesGrid(state.movies);
    if (!state.currentMovieForDetails && state.movies.length > 0) {
      updateHeroBanner(state.movies[0]);
    }
  }
}

async function fetchTheatres() {
  const res = await fetch(`${API_BASE}/theatres`);
  const data = await res.json();
  if (data.success) {
    state.theatres = data.data;
    renderTheatresGrid(state.theatres);
    populateAdminDropdowns();
  }
}

async function fetchFavorites() {
  const res = await fetch(`${API_BASE}/favorites`);
  const data = await res.json();
  if (data.success) {
    state.favorites = data.data;
  }
}

async function fetchMyBookings() {
  const res = await fetch(`${API_BASE}/bookings/my-bookings`);
  const data = await res.json();
  if (data.success) {
    state.myBookings = data.data;
    if (bookingsCountBadge) {
      const activeCount = state.myBookings.filter(b => b.status === 'CONFIRMED').length;
      bookingsCountBadge.textContent = activeCount;
    }
  }
}

// ==========================================
// RENDERING FUNCTIONS
// ==========================================
function updateHeroBanner(movie) {
  const posterImg = document.getElementById('hero-poster-img');
  const title = document.getElementById('hero-title');
  const synopsis = document.getElementById('hero-synopsis');
  const meta = document.getElementById('hero-meta');
  const cert = document.getElementById('hero-cert');
  const rating = document.getElementById('hero-rating');
  const btnBook = document.getElementById('btn-hero-book');
  const btnTrailer = document.getElementById('btn-hero-trailer');
  const btnFav = document.getElementById('btn-hero-fav');

  if (posterImg && movie.posterUrl) {
    posterImg.src = movie.posterUrl;
  }
  if (title) title.textContent = movie.title;
  if (synopsis) synopsis.textContent = movie.description;
  if (meta) meta.textContent = `${Math.floor(movie.runtimeMinutes / 60)}h ${movie.runtimeMinutes % 60}m • ${movie.genre.join(', ')}`;
  if (cert) cert.textContent = movie.certification;
  if (rating) rating.textContent = `⭐ ${movie.averageRating}`;

  if (btnBook) btnBook.onclick = () => openMovieDetails(movie.id);
  if (btnTrailer) btnTrailer.onclick = () => window.open(movie.trailerUrl, '_blank');
  if (btnFav) btnFav.onclick = () => toggleFavorite(movie.id);
}

function renderMoviesGrid(movies) {
  if (!moviesGrid) return;
  if (movies.length === 0) {
    moviesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: var(--color-secondary);">
        <p style="font-size: 24px; margin-bottom: 8px;">🎬</p>
        <p style="font-size: 16px; font-weight: 600; color: var(--color-primary);">No movies found</p>
        <p style="font-size: 13px; margin-top: 4px;">Try searching with different terms or selecting another genre chip.</p>
      </div>
    `;
    return;
  }

  moviesGrid.innerHTML = movies.map(movie => {
    const isFav = state.favorites.some(f => f.id === movie.id);
    return `
      <div class="movie-card" data-id="${movie.id}">
        <div class="movie-poster-box" onclick="openMovieDetails('${movie.id}')" style="cursor: pointer;">
          <img src="${movie.posterUrl}" alt="${movie.title}" class="movie-poster-img" loading="lazy">
          <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${movie.id}')" title="Save to favorites">
            ${isFav ? '❤️' : '🤍'}
          </button>
          <div class="card-rating-badge">
            ⭐ ${movie.averageRating}
          </div>
        </div>
        <div class="movie-card-info">
          <h3 class="movie-card-title">${movie.title}</h3>
          <p class="movie-card-genres">${movie.genre.join(', ')} • ${movie.runtimeMinutes}m</p>
          <div class="movie-card-footer">
            <span class="movie-cert-tag">${movie.certification}</span>
            <button class="btn btn-primary" onclick="openMovieDetails('${movie.id}')">
              Book
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTheatresGrid(theatres) {
  if (!theatresGrid) return;
  theatresGrid.innerHTML = theatres.map(theatre => `
    <div class="theatre-card">
      <h3 class="theatre-name">${theatre.name}</h3>
      <p class="theatre-location">${theatre.location}, ${theatre.city}</p>
      <div class="theatre-features">
        <span class="theatre-tag">Dolby Atmos</span>
        <span class="theatre-tag">4K Laser</span>
        <span class="theatre-tag">Recliners</span>
      </div>
    </div>
  `).join('');
}

// ==========================================
// MOVIE DETAILS & SHOWTIME SELECTOR
// ==========================================
async function openMovieDetails(movieId) {
  try {
    const res = await fetch(`${API_BASE}/movies/${movieId}`);
    const data = await res.json();
    if (!data.success) return showToast('Movie details not available', 'error');

    const movie = data.data;
    state.currentMovieForDetails = movie;

    // Fetch shows for this movie
    const todayStr = new Date().toISOString().split('T')[0];
    const showRes = await fetch(`${API_BASE}/shows?movieId=${movieId}&date=${todayStr}`);
    const showData = await showRes.json();
    const shows = showData.success ? showData.data : [];

    // Fetch reviews
    const revRes = await fetch(`${API_BASE}/movies/${movieId}/reviews`);
    const revData = await revRes.json();
    const reviews = revData.success ? revData.data : [];

    const titleEl = document.getElementById('modal-movie-title');
    if (titleEl) titleEl.textContent = movie.title;

    const content = document.getElementById('movie-details-content');
    content.innerHTML = `
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <img src="${movie.posterUrl}" style="width: 160px; height: 230px; border-radius: 8px; object-fit: cover; border: 1px solid var(--color-border);">
        <div style="flex: 1; min-width: 280px;">
          <div style="display: flex; gap: 6px; margin-bottom: 8px; align-items: center;">
            <span class="tag-chip cert-chip">${movie.certification}</span>
            <span class="tag-chip rating-chip">⭐ ${movie.averageRating} / 5</span>
            <span class="tag-chip">${movie.runtimeMinutes} Mins</span>
          </div>
          <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 8px; color: var(--color-primary);">${movie.title}</h2>
          <p style="color: var(--color-on-surface); font-size: 13.5px; line-height: 20px; margin-bottom: 16px;">${movie.description}</p>
          <div style="display: flex; gap: 8px;">
            <a href="${movie.trailerUrl}" target="_blank" class="btn btn-secondary" style="height: 30px;">Watch Trailer</a>
            <button class="btn btn-chip" style="height: 30px;" onclick="toggleFavorite('${movie.id}')">❤️ Save</button>
          </div>
        </div>
      </div>

      <!-- Showtime Section -->
      <div style="margin-top: 24px; border-top: 1px solid var(--color-border); padding-top: 16px;">
        <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 12px; color: var(--color-primary);">Select Showtime for Today</h4>
        <div id="movie-showtimes-list">
          ${renderShowtimesList(shows)}
        </div>
      </div>

      <!-- Reviews Section -->
      <div style="margin-top: 24px; border-top: 1px solid var(--color-border); padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 15px; font-weight: 600; color: var(--color-primary);">Audience Reviews (${reviews.length})</h4>
          <button class="btn btn-secondary" style="height: 28px; padding: 4px 12px;" onclick="showAddReviewPrompt('${movie.id}')">Write Review</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${reviews.length === 0 ? '<p style="color: var(--color-secondary); font-size: 13px;">No reviews yet. Be the first to share your thoughts!</p>' : reviews.map(r => `
            <div style="background-color: var(--color-bg-page); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--color-border);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <strong style="font-size: 13px; color: var(--color-primary);">${r.userName}</strong>
                <span style="font-size: 12px; color: var(--color-primary); font-weight: 600;">★ ${r.rating} / 5</span>
              </div>
              <p style="font-size: 13px; color: var(--color-on-surface); line-height: 18px;">${r.comment}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    openModal(movieDetailsModal);
  } catch (e) {
    showToast('Failed to open movie details', 'error');
  }
}

function renderShowtimesList(shows) {
  if (shows.length === 0) {
    return `<p style="color: var(--color-secondary); font-size: 13px; padding: 8px 0;">No active screenings scheduled for today.</p>`;
  }

  // Group shows by theatre
  const grouped = {};
  shows.forEach(s => {
    if (!grouped[s.theatreName]) grouped[s.theatreName] = [];
    grouped[s.theatreName].push(s);
  });

  return Object.entries(grouped).map(([theatreName, sList]) => `
    <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 12px 16px; margin-bottom: 10px;">
      <h5 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">${theatreName}</h5>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${sList.map(s => `
          <button class="btn btn-secondary" style="border-radius: var(--rounded-full); height: 30px; padding: 4px 14px;" onclick="openSeatSelector('${s.id}')">
            <strong>${s.showTime}</strong>
            <span style="font-size: 11px; color: var(--color-secondary); margin-left: 4px;">₹${s.pricing.lower}+</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================
// INTERACTIVE CINEMA SEAT SELECTOR
// ==========================================
async function openSeatSelector(showId) {
  closeModal(movieDetailsModal);
  state.selectedSeats = [];
  updateCheckoutBar();

  try {
    const res = await fetch(`${API_BASE}/shows/${showId}/seats`);
    const data = await res.json();
    if (!data.success) return showToast('Failed to load hall seating layout', 'error');

    state.selectedShow = data.data;

    document.getElementById('seat-modal-movie-title').textContent = state.selectedShow.movieTitle;
    document.getElementById('seat-modal-theatre-info').textContent =
      `${state.selectedShow.theatreName} • ${state.selectedShow.showDate} at ${state.selectedShow.showTime}`;

    renderCinemaHallGrid(state.selectedShow);
    openModal(seatBookingModal);
  } catch (e) {
    showToast('Error opening seat layout', 'error');
  }
}

function renderCinemaHallGrid(showData) {
  const container = document.getElementById('cinema-hall-grid');
  if (!container) return;

  const bookedSeats = showData.bookedSeats || [];

  container.innerHTML = showData.tiers.map(tier => `
    <div class="tier-block">
      <div class="tier-header">
        <span class="tier-name">${tier.name}</span>
        <span class="tier-price">₹${tier.price} / ticket</span>
      </div>
      <div class="tier-rows">
        ${tier.rows.map(rowLabel => `
          <div class="seat-row">
            <span class="row-label">${rowLabel}</span>
            <div style="display: flex; gap: 6px;">
              ${Array.from({ length: tier.seatsPerRow }).map((_, idx) => {
                const seatNumber = `${rowLabel}-${idx + 1}`;
                const isBooked = bookedSeats.includes(seatNumber);
                const isSelected = state.selectedSeats.includes(seatNumber);
                return `
                  <button 
                    class="seat-btn ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}" 
                    data-seat="${seatNumber}"
                    data-price="${tier.price}"
                    ${isBooked ? 'disabled' : ''}
                    onclick="toggleSeatSelection('${seatNumber}')">
                    ${idx + 1}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleSeatSelection(seatNumber) {
  const idx = state.selectedSeats.indexOf(seatNumber);
  if (idx > -1) {
    state.selectedSeats.splice(idx, 1);
  } else {
    if (state.selectedSeats.length >= 8) {
      return showToast('Maximum 8 tickets allowed per booking.', 'error');
    }
    state.selectedSeats.push(seatNumber);
  }

  // Update button visual
  const btn = document.querySelector(`.seat-btn[data-seat="${seatNumber}"]`);
  if (btn) {
    btn.classList.toggle('selected');
  }

  updateCheckoutBar();
}

function updateCheckoutBar() {
  const display = document.getElementById('selected-seats-display');
  const priceDisplay = document.getElementById('checkout-total-price');
  const btnConfirm = document.getElementById('btn-confirm-booking');

  if (state.selectedSeats.length === 0) {
    display.textContent = 'None';
    priceDisplay.textContent = '₹0.00';
    btnConfirm.disabled = true;
    return;
  }

  display.textContent = state.selectedSeats.join(', ');

  // Calculate pricing based on show tier
  let total = 0;
  state.selectedSeats.forEach(seat => {
    if (seat.startsWith('B')) total += state.selectedShow.pricing.balcony;
    else if (seat.startsWith('M')) total += state.selectedShow.pricing.middle;
    else total += state.selectedShow.pricing.lower;
  });

  priceDisplay.textContent = `₹${total.toFixed(2)}`;
  btnConfirm.disabled = false;
}

// ==========================================
// ATOMIC BOOKING DISPATCH (CONCURRENCY SAFE)
// ==========================================
async function confirmBooking() {
  if (!state.selectedShow || state.selectedSeats.length === 0) return;

  const btnConfirm = document.getElementById('btn-confirm-booking');
  btnConfirm.disabled = true;
  btnConfirm.textContent = 'Processing...';

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showId: state.selectedShow.showId,
        selectedSeats: state.selectedSeats,
        userName: 'Alex Rivera',
        userEmail: 'alex@example.com'
      })
    });

    const result = await res.json();

    if (!res.ok) {
      // 409 Conflict: Concurrent double-booking caught!
      showToast(result.message, 'error');
      // Refresh seat layout to show newly reserved seats
      await openSeatSelector(state.selectedShow.showId);
      return;
    }

    // Success!
    showToast('Booking confirmed! Ticket generated.', 'success');
    closeModal(seatBookingModal);
    await fetchMyBookings();
    renderTicketReceipt(result.data);
    openModal(ticketModal);

  } catch (err) {
    showToast('Network error while booking tickets.', 'error');
  } finally {
    btnConfirm.disabled = false;
    btnConfirm.textContent = 'Proceed to Book';
  }
}

// ==========================================
// TICKET RECEIPT & PRINTING
// ==========================================
function renderTicketReceipt(booking) {
  const container = document.getElementById('ticket-slip-content');
  if (!container) return;

  container.innerHTML = `
    <div class="ticket-header">
      <img src="${booking.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80'}" class="ticket-poster">
      <div>
        <span class="ticket-ref">REF: ${booking.bookingReference}</span>
        <h3 class="ticket-movie-title">${booking.movieTitle}</h3>
        <p style="font-size: 13px; color: var(--color-secondary);">${booking.theatreName}</p>
      </div>
    </div>
    <div class="ticket-body">
      <div class="ticket-item">
        <span class="ticket-label">Show Date</span>
        <span class="ticket-value">${booking.showDate}</span>
      </div>
      <div class="ticket-item">
        <span class="ticket-label">Showtime</span>
        <span class="ticket-value">${booking.showTime}</span>
      </div>
      <div class="ticket-item">
        <span class="ticket-label">Confirmed Seats</span>
        <span class="ticket-value">${booking.seats.join(', ')}</span>
      </div>
      <div class="ticket-item">
        <span class="ticket-label">Total Amount Paid</span>
        <span class="ticket-value">₹${booking.totalAmount.toFixed(2)}</span>
      </div>
    </div>
    <div class="ticket-footer">
      <span style="font-size: 11px; color: var(--color-secondary);">Scan reference code at hall gate</span>
      <button class="btn btn-primary" onclick="window.print()">
        Print Ticket Slip
      </button>
    </div>
  `;
}

// ==========================================
// USER BOOKINGS DRAWER & CANCELLATION
// ==========================================
function openMyBookings() {
  const container = document.getElementById('my-bookings-list');
  if (!container) return;

  if (state.myBookings.length === 0) {
    container.innerHTML = `<p style="padding: 24px; text-align: center; color: var(--color-secondary);">No ticket bookings yet.</p>`;
  } else {
    container.innerHTML = state.myBookings.map(b => `
      <div style="background-color: var(--color-surface); border-radius: 8px; padding: 14px; margin: 12px; border: 1px solid var(--color-border);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <span class="ticket-ref">${b.bookingReference}</span>
            <h4 style="font-size: 15px; font-weight: 600; color: var(--color-primary);">${b.movieTitle}</h4>
            <p style="font-size: 12px; color: var(--color-secondary);">${b.theatreName} • ${b.showDate} at ${b.showTime}</p>
          </div>
          <span class="tag-chip ${b.status === 'CONFIRMED' ? 'cert-chip' : ''}">${b.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--color-border);">
          <span style="font-size: 12px; color: var(--color-secondary);">Seats: <strong>${b.seats.join(', ')}</strong> (₹${b.totalAmount})</span>
          ${b.status === 'CONFIRMED' ? `
            <button class="btn btn-secondary" style="font-size: 11px; height: 26px; padding: 2px 10px; border-color: var(--color-error); color: var(--color-error);" onclick="cancelBooking('${b.id}')">
              Cancel Ticket
            </button>
          ` : '<span style="font-size: 11px; color: var(--color-secondary);">Seats Released</span>'}
        </div>
      </div>
    `).join('');
  }

  openModal(myBookingsModal);
}

async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking? Confirmed seats will be released.')) return;
  try {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, { method: 'PUT' });
    const data = await res.json();
    if (data.success) {
      showToast('Booking cancelled and seats released.', 'success');
      await fetchMyBookings();
      openMyBookings();
    } else {
      showToast(data.message, 'error');
    }
  } catch (e) {
    showToast('Failed to cancel booking', 'error');
  }
}

// ==========================================
// FAVORITES WATCHLIST
// ==========================================
async function toggleFavorite(movieId) {
  try {
    const res = await fetch(`${API_BASE}/favorites/${movieId}`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      await fetchFavorites();
      renderMoviesGrid(state.movies);
    }
  } catch (e) {
    showToast('Failed to update favorites', 'error');
  }
}

function openFavoritesModal() {
  const container = document.getElementById('favorites-grid-content');
  if (!container) return;

  if (state.favorites.length === 0) {
    container.innerHTML = `<p style="padding: 24px; text-align: center; color: var(--color-secondary);">No saved films in your watchlist.</p>`;
  } else {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px; padding: 12px;">
        ${state.favorites.map(m => `
          <div style="display: flex; gap: 12px; background-color: var(--color-surface); padding: 10px; border-radius: 8px; align-items: center; border: 1px solid var(--color-border);">
            <img src="${m.posterUrl}" style="width: 44px; height: 62px; object-fit: cover; border-radius: 4px; border: 1px solid var(--color-border);">
            <div style="flex-grow: 1;">
              <h4 style="font-size: 14px; font-weight: 600; color: var(--color-primary);">${m.title}</h4>
              <p style="font-size: 12px; color: var(--color-secondary);">${m.genre.join(', ')} • ${m.runtimeMinutes}m</p>
            </div>
            <button class="btn btn-primary" style="height: 28px; padding: 2px 12px;" onclick="closeModal(favoritesModal); openMovieDetails('${m.id}')">
              Book
            </button>
            <button class="btn btn-chip" style="height: 28px; padding: 2px 8px;" onclick="toggleFavorite('${m.id}'); openFavoritesModal();">
              ✕
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  openModal(favoritesModal);
}

// ==========================================
// REVIEWS SYSTEM
// ==========================================
async function showAddReviewPrompt(movieId) {
  const rating = prompt('Enter rating (1 to 5 stars):', '5');
  if (!rating || isNaN(rating) || Number(rating) < 1 || Number(rating) > 5) return;
  const comment = prompt('Write brief review feedback:');
  if (!comment) return;

  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, rating: Number(rating), comment })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Review submitted!', 'success');
      await openMovieDetails(movieId);
    }
  } catch (e) {
    showToast('Failed to post review', 'error');
  }
}

// ==========================================
// ADMIN PORTAL
// ==========================================
async function openAdminPortal() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`);
    const data = await res.json();
    if (data.success) {
      renderAdminKPIs(data.data);
    }

    const bRes = await fetch(`${API_BASE}/admin/bookings`);
    const bData = await bRes.json();
    if (bData.success) {
      renderAdminBookingsTable(bData.data);
    }

    openModal(adminModal);
  } catch (e) {
    showToast('Error opening Admin Dashboard', 'error');
  }
}

function renderAdminKPIs(kpis) {
  const container = document.getElementById('admin-kpi-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="kpi-card">
      <span class="kpi-title">Gross Revenue</span>
      <div class="kpi-value">₹${kpis.totalRevenue.toLocaleString()}</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-title">Tickets Sold</span>
      <div class="kpi-value">${kpis.totalTickets}</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-title">Active Screenings</span>
      <div class="kpi-value">${kpis.activeShows}</div>
    </div>
    <div class="kpi-card">
      <span class="kpi-title">Movies in Catalog</span>
      <div class="kpi-value">${kpis.totalMovies}</div>
    </div>
  `;
}

function renderAdminBookingsTable(bookings) {
  const tbody = document.getElementById('admin-bookings-table-body');
  if (!tbody) return;

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td><span class="ticket-ref">${b.bookingReference}</span></td>
      <td><strong>${b.userName}</strong></td>
      <td>${b.movieTitle}</td>
      <td>${b.theatreName}</td>
      <td>${b.showDate}</td>
      <td>${b.seats.join(', ')}</td>
      <td>₹${b.totalAmount}</td>
      <td><span class="tag-chip">${b.status}</span></td>
    </tr>
  `).join('');
}

function populateAdminDropdowns() {
  const movieSelect = document.getElementById('admin-show-movie');
  const theatreSelect = document.getElementById('admin-show-theatre');
  const showDateInput = document.getElementById('admin-show-date');

  if (movieSelect) {
    movieSelect.innerHTML = state.movies.map(m => `<option value="${m.id}">${m.title}</option>`).join('');
  }
  if (theatreSelect) {
    theatreSelect.innerHTML = state.theatres.map(t => `<option value="${t.id}">${t.name} (${t.city})</option>`).join('');
  }
  if (showDateInput) {
    showDateInput.value = new Date().toISOString().split('T')[0];
  }
}

// ==========================================
// EVENT LISTENERS & WIRING
// ==========================================
function setupEventListeners() {
  // Brand Home click
  document.getElementById('nav-brand').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Search input
  let searchTimeout;
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchMovies(e.target.value.trim());
      }, 200);
    });
  }

  // Genre Tabs
  if (genreTabsContainer) {
    genreTabsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-chip')) {
        document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        state.activeGenre = e.target.getAttribute('data-genre');
        fetchMovies(globalSearchInput ? globalSearchInput.value.trim() : '', state.activeGenre);
      }
    });
  }

  // Header Buttons
  document.getElementById('btn-my-bookings').onclick = openMyBookings;
  document.getElementById('btn-favorites').onclick = openFavoritesModal;
  document.getElementById('btn-admin-portal').onclick = openAdminPortal;

  // Modal Closers
  document.getElementById('btn-close-details').onclick = () => closeModal(movieDetailsModal);
  document.getElementById('btn-close-seats').onclick = () => closeModal(seatBookingModal);
  document.getElementById('btn-close-ticket').onclick = () => closeModal(ticketModal);
  document.getElementById('btn-close-bookings').onclick = () => closeModal(myBookingsModal);
  document.getElementById('btn-close-favorites').onclick = () => closeModal(favoritesModal);
  document.getElementById('btn-close-admin').onclick = () => closeModal(adminModal);

  // Close modals when clicking outside
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Seat confirm button
  document.getElementById('btn-confirm-booking').onclick = confirmBooking;

  // Admin Tab Switcher
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-tab'));
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Admin: Add Movie Form
  const formAddMovie = document.getElementById('form-add-movie');
  if (formAddMovie) {
    formAddMovie.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-movie-title').value;
      const genre = document.getElementById('admin-movie-genre').value;
      const certification = document.getElementById('admin-movie-cert').value;
      const runtimeMinutes = document.getElementById('admin-movie-runtime').value;
      const posterUrl = document.getElementById('admin-movie-poster').value;
      const description = document.getElementById('admin-movie-desc').value;

      try {
        const res = await fetch(`${API_BASE}/movies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, genre, certification, runtimeMinutes, posterUrl, description })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Movie "${title}" published!`, 'success');
          formAddMovie.reset();
          await fetchMovies();
          populateAdminDropdowns();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('Failed to add movie', 'error');
      }
    });
  }

  // Admin: Schedule Show Form
  const formScheduleShow = document.getElementById('form-schedule-show');
  if (formScheduleShow) {
    formScheduleShow.addEventListener('submit', async (e) => {
      e.preventDefault();
      const movieId = document.getElementById('admin-show-movie').value;
      const theatreId = document.getElementById('admin-show-theatre').value;
      const showDate = document.getElementById('admin-show-date').value;
      const showTime = document.getElementById('admin-show-time').value;

      try {
        const res = await fetch(`${API_BASE}/shows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId, theatreId, showDate, showTime })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Screening scheduled successfully!', 'success');
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('Error scheduling show', 'error');
      }
    });
  }
}

// ==========================================
// HELPERS
// ==========================================
function openModal(modal) {
  if (modal) modal.classList.add('open');
}

function closeModal(modal) {
  if (modal) modal.classList.remove('open');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}
