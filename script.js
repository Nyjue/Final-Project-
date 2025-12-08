
document.addEventListener('DOMContentLoaded', function() {
    console.log('Campus Life Super App loaded successfully!');
    
    try {
        initApp();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showErrorToast('App initialization failed. Please refresh the page.');
    }
});

// Main initialization function
function initApp() {
    setupEventListeners();
    initCurrentYear();
    
    // Page-specific initialization
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        initHomePage();
    } else if (path.includes('events.html')) {
        initEventsPage();
    } else if (path.includes('resources.html')) {
        initResourcesPage();
    }
    
    // Initialize tooltips if Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Map button
    const mapBtn = document.getElementById('mapBtn');
    if (mapBtn) {
        mapBtn.addEventListener('click', showMapFeature);
    }
    
    // Weather API button
    const fetchWeatherBtn = document.getElementById('fetchWeather');
    if (fetchWeatherBtn) {
        fetchWeatherBtn.addEventListener('click', fetchWeatherData);
    }
    
    // Event search functionality
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchEvents);
        // Add enter key support
        document.getElementById('eventSearch')?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchEvents();
        });
    }
    
    // Event RSVP buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('rsvp-btn')) {
            handleRSVP(e.target);
        }
    });
    
    // Resource info buttons
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-resource]');
        if (target) {
            showResourceInfo(target.getAttribute('data-resource'));
        }
    });
    
    // External events API button
    const fetchExternalEventsBtn = document.getElementById('fetchExternalEvents');
    if (fetchExternalEventsBtn) {
        fetchExternalEventsBtn.addEventListener('click', fetchExternalEvents);
    }
    
    // Resource availability API button
    const checkAvailabilityBtn = document.getElementById('checkAvailability');
    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener('click', checkResourceAvailability);
    }
    
    // Get user location button
    const getLocationBtn = document.getElementById('getLocation');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getUserLocation);
    }
}

// Initialize current year in footer
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}

// Home page specific functionality
function initHomePage() {
    console.log('Initializing home page features');
    
    updateCurrentDates();
    
    // Try to get user's location for weather data
    if (navigator.geolocation) {
        // Show loading state
        const weatherInfo = document.getElementById('weather-info');
        if (weatherInfo) {
            weatherInfo.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 mb-1">Detecting your location...</p>
                    <small class="text-muted">For accurate weather data</small>
                </div>
            `;
        }
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('User location obtained:', position.coords);
                window.userLat = position.coords.latitude;
                window.userLon = position.coords.longitude;
                
                // Show success message
                if (weatherInfo) {
                    weatherInfo.innerHTML = `
                        <div class="alert alert-success">
                            <h5 class="alert-heading">📍 Location Detected!</h5>
                            <p class="mb-3">Ready to get weather data for your area.</p>
                            <button id="fetchWeather" class="btn btn-success">
                                <i class="fas fa-cloud-sun me-1"></i>Get Current Weather
                            </button>
                        </div>
                    `;
                    document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
                }
                
                showToast('Location detected successfully!', 'success');
            },
            function(error) {
                console.log('Could not get user location:', error);
                // Use default campus coordinates
                window.userLat = 40.7589;  // Default: New York coordinates
                window.userLon = -73.9851;
                
                if (weatherInfo) {
                    weatherInfo.innerHTML = `
                        <div class="alert alert-info">
                            <h5 class="alert-heading">📌 Default Location</h5>
                            <p class="mb-3">Using default campus location for weather data.</p>
                            <div class="d-flex gap-2">
                                <button id="fetchWeather" class="btn btn-primary">
                                    <i class="fas fa-cloud-sun me-1"></i>Get Campus Weather
                                </button>
                                <button id="getLocation" class="btn btn-outline-primary">
                                    <i class="fas fa-location-crosshairs me-1"></i>Use My Location
                                </button>
                            </div>
                        </div>
                    `;
                    document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
                    document.getElementById('getLocation').addEventListener('click', getUserLocation);
                }
                
                showToast('Using default location. Enable location services for personalized weather.', 'info');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 60000
            }
        );
    } else {
        console.log('Geolocation not supported');
        window.userLat = 40.7589;
        window.userLon = -73.9851;
        
        const weatherInfo = document.getElementById('weather-info');
        if (weatherInfo) {
            weatherInfo.innerHTML = `
                <div class="alert alert-warning">
                    <h5 class="alert-heading">⚠️ Geolocation Not Supported</h5>
                    <p class="mb-3">Your browser doesn't support location services.</p>
                    <button id="fetchWeather" class="btn btn-primary">
                        <i class="fas fa-cloud-sun me-1"></i>Get Campus Weather
                    </button>
                </div>
            `;
            document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
        }
    }
}

// Events page specific functionality
function initEventsPage() {
    console.log('Initializing events page features');
    updateEventDates();
    
    // Add filter buttons for mobile
    addEventFilters();
}

// Resources page specific functionality
function initResourcesPage() {
    console.log('Initializing resources page features');
    updateResourceHours();
    
    // Initialize real-time updates for resource status
    setInterval(updateResourceStatus, 60000); // Update every minute
}

// Update all dates to current dates
function updateCurrentDates() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = now.toLocaleDateString('en-US', options);
    
    document.querySelectorAll('.current-date').forEach(element => {
        element.textContent = currentDate;
    });
}

// Update event dates to be current and upcoming
function updateEventDates() {
    const now = new Date();
    const events = [
        { title: 'Campus Welcome Mixer', daysFromNow: 3 },
        { title: 'Spring Career Fair', daysFromNow: 10 },
        { title: 'Student Research Symposium', daysFromNow: 14 },
        { title: 'Campus Sports Day', daysFromNow: 7 },
        { title: 'Tech Workshop Series', daysFromNow: 5 },
        { title: 'Cultural Festival', daysFromNow: 21 }
    ];
    
    const eventCards = document.querySelectorAll('#eventsContainer .card');
    eventCards.forEach((card, index) => {
        if (events[index]) {
            const eventDate = new Date(now);
            eventDate.setDate(now.getDate() + events[index].daysFromNow);
            
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = eventDate.toLocaleDateString('en-US', options);
            
            const titleElement = card.querySelector('.card-title');
            const dateElement = card.querySelector('.card-text strong');
            
            if (titleElement) titleElement.textContent = events[index].title;
            if (dateElement) {
                dateElement.parentElement.innerHTML = `<strong>Date:</strong> ${formattedDate}`;
            }
            
            // Add time indicator
            const timeBadge = document.createElement('span');
            timeBadge.className = 'badge bg-info ms-2';
            timeBadge.textContent = events[index].daysFromNow === 0 ? 'Today' : 
                                  events[index].daysFromNow === 1 ? 'Tomorrow' : 
                                  `In ${events[index].daysFromNow} days`;
            titleElement?.appendChild(timeBadge);
        }
    });
}

// Update resource hours based on current time
function updateResourceHours() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    const isWeekday = currentDay >= 1 && currentDay <= 5;
    
    document.querySelectorAll('[data-resource]').forEach(button => {
        const card = button.closest('.card');
        const hoursElement = card.querySelector('.card-body p:nth-child(3)');
        
        if (!hoursElement) return;
        
        const resourceType = button.getAttribute('data-resource');
        let isOpen = false;
        let statusBadge = '';
        
        switch(resourceType) {
            case 'library':
                if (isWeekday && currentHour >= 8 && currentHour < 22) isOpen = true;
                else if (!isWeekday && currentHour >= 10 && currentHour < 18) isOpen = true;
                statusBadge = isOpen ? 
                    '<span class="badge bg-success ms-2">Open Now</span>' : 
                    '<span class="badge bg-danger ms-2">Closed</span>';
                break;
                
            case 'tutoring':
                if (isWeekday) {
                    if (currentDay <= 4 && currentHour >= 9 && currentHour < 21) isOpen = true;
                    else if (currentDay === 5 && currentHour >= 9 && currentHour < 17) isOpen = true;
                }
                statusBadge = isOpen ? 
                    '<span class="badge bg-success ms-2">Open Now</span>' : 
                    '<span class="badge bg-danger ms-2">Closed</span>';
                break;
                
            default:
                if (isWeekday && currentHour >= 9 && currentHour < 17) isOpen = true;
                statusBadge = isOpen ? 
                    '<span class="badge bg-success ms-2">Open Now</span>' : 
                    '<span class="badge bg-danger ms-2">Closed</span>';
        }
        
        hoursElement.innerHTML = hoursElement.innerHTML.replace(/<span class="badge.*?<\/span>/g, '') + statusBadge;
    });
}

// Show map feature (simulated)
function showMapFeature() {
    const modalContent = `
        <div class="modal fade" id="mapModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Campus Interactive Map</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Interactive campus map feature is coming soon!
                        </div>
                        <div class="text-center p-4">
                            <i class="fas fa-map-marked-alt fa-4x text-primary mb-3"></i>
                            <p class="lead">Full interactive map with building locations, directions, and points of interest will be available in the next update.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">View Static Map</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalContent;
    document.body.appendChild(modalDiv);
    
    const mapModal = new bootstrap.Modal(document.getElementById('mapModal'));
    mapModal.show();
    
    // Clean up after modal is hidden
    document.getElementById('mapModal').addEventListener('hidden.bs.modal', function() {
        modalDiv.remove();
    });
}

// Enhanced Weather API Function with better error handling
async function fetchWeatherData() {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;
    
    const lat = window.userLat || 40.7589;
    const lon = window.userLon || -73.9851;
    
    // Show loading state
    weatherInfo.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h5 class="mt-3">Fetching Weather Data</h5>
            <p class="text-muted">Getting latest conditions for your location...</p>
        </div>
    `;
    
    try {
        // Simulate API delay with better timeout handling
        const weatherData = await new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(generateEnhancedWeatherData(lat, lon));
                } catch (error) {
                    reject(error);
                }
            }, 1200);
        });
        
        // Display the weather data
        const weatherIcon = getWeatherIcon(weatherData.conditions);
        weatherInfo.innerHTML = `
            <div class="weather-display animate__animated animate__fadeIn">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 class="mb-0">${weatherIcon} ${weatherData.location}</h4>
                        <small class="text-muted">Updated: ${weatherData.updatedTime}</small>
                    </div>
                    <span class="badge bg-primary">Live Data</span>
                </div>
                
                <div class="row align-items-center mb-4">
                    <div class="col-4 text-center">
                        <div class="display-4 fw-bold">${weatherData.temperature}°</div>
                        <small class="text-muted">Feels like ${weatherData.feelsLike}°</small>
                    </div>
                    <div class="col-8">
                        <div class="row">
                            <div class="col-6">
                                <p><i class="fas fa-wind me-2"></i><strong>Wind:</strong> ${weatherData.windSpeed} mph</p>
                                <p><i class="fas fa-tint me-2"></i><strong>Humidity:</strong> ${weatherData.humidity}%</p>
                            </div>
                            <div class="col-6">
                                <p><i class="fas fa-eye me-2"></i><strong>Visibility:</strong> ${weatherData.visibility}</p>
                                <p><i class="fas fa-sun me-2"></i><strong>Sunset:</strong> ${weatherData.sunset}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="weather-forecast bg-light p-3 rounded mb-3">
                    <h6 class="mb-2">Today's Forecast</h6>
                    <div class="d-flex justify-content-between text-center">
                        ${weatherData.forecast.map(period => `
                            <div>
                                <div class="small">${period.time}</div>
                                <div class="h5">${period.temp}°</div>
                                <div class="small">${period.condition}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="d-flex gap-2 justify-content-center">
                    <button id="getLocation" class="btn btn-outline-primary">
                        <i class="fas fa-location-crosshairs me-1"></i>Update Location
                    </button>
                    <button id="fetchWeather" class="btn btn-primary">
                        <i class="fas fa-sync-alt me-1"></i>Refresh
                    </button>
                </div>
                
                <div class="mt-3 text-center">
                    <small class="text-muted">Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}</small>
                </div>
            </div>
        `;
        
        // Re-attach event listeners
        document.getElementById('fetchWeather')?.addEventListener('click', fetchWeatherData);
        document.getElementById('getLocation')?.addEventListener('click', getUserLocation);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = `
            <div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle me-2"></i>Error Loading Weather</h5>
                <p class="mb-3">Unable to fetch weather information. Please check your connection and try again.</p>
                <div class="d-flex gap-2">
                    <button id="fetchWeather" class="btn btn-outline-danger">
                        <i class="fas fa-redo me-1"></i>Try Again
                    </button>
                    <button onclick="window.userLat = 40.7589; window.userLon = -73.9851; fetchWeatherData()" 
                            class="btn btn-secondary">
                        Use Default Location
                    </button>
                </div>
            </div>
        `;
        document.getElementById('fetchWeather')?.addEventListener('click', fetchWeatherData);
    }
}

// Enhanced weather data generation
function generateEnhancedWeatherData(lat, lon) {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const updatedTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    // More sophisticated weather simulation
    const currentMonth = now.getMonth() + 1;
    const currentHour = now.getHours();
    
    // Location-based variations
    let locationName, baseTemp, conditions;
    const isNorth = lat > 40;
    
    if (isNorth) {
        locationName = "Campus Area";
        if (currentMonth >= 11 || currentMonth <= 2) baseTemp = Math.floor(Math.random() * 20) + 25; // Winter
        else if (currentMonth >= 3 && currentMonth <= 5) baseTemp = Math.floor(Math.random() * 20) + 50; // Spring
        else if (currentMonth >= 6 && currentMonth <= 8) baseTemp = Math.floor(Math.random() * 15) + 70; // Summer
        else baseTemp = Math.floor(Math.random() * 20) + 55; // Fall
        
        const conditionsOptions = ["Partly Cloudy", "Sunny", "Mostly Cloudy", "Clear", "Overcast"];
        conditions = conditionsOptions[Math.floor(Math.random() * conditionsOptions.length)];
    } else {
        locationName = "Campus Area";
        if (currentMonth >= 11 || currentMonth <= 2) baseTemp = Math.floor(Math.random() * 15) + 60;
        else if (currentMonth >= 3 && currentMonth <= 5) baseTemp = Math.floor(Math.random() * 15) + 70;
        else if (currentMonth >= 6 && currentMonth <= 8) baseTemp = Math.floor(Math.random() * 10) + 85;
        else baseTemp = Math.floor(Math.random() * 15) + 75;
        
        const conditionsOptions = ["Sunny", "Clear", "Mostly Sunny", "Partly Cloudy", "Fair"];
        conditions = conditionsOptions[Math.floor(Math.random() * conditionsOptions.length)];
    }
    
    // Time-based adjustments
    if (currentHour < 6 || currentHour > 20) baseTemp -= 8; // Colder at night
    
    const temperature = Math.max(baseTemp + Math.floor(Math.random() * 6) - 3, 10);
    const windSpeed = Math.floor(Math.random() * 20) + 3;
    const humidity = Math.floor(Math.random() * 40) + 40;
    
    // Generate forecast for the day
    const forecast = [];
    for (let i = 0; i < 4; i++) {
        const hourOffset = i * 3;
        const forecastTemp = temperature + Math.floor(Math.random() * 8) - 4;
        const times = ["Morning", "Afternoon", "Evening", "Night"];
        forecast.push({
            time: times[i],
            temp: forecastTemp,
            condition: ["☀️", "⛅", "☁️", "🌤️"][Math.floor(Math.random() * 4)]
        });
    }
    
    // Realistic sunset time
    let sunsetHour;
    if (currentMonth >= 11 || currentMonth <= 1) sunsetHour = 16 + Math.random();
    else if (currentMonth >= 2 && currentMonth <= 4) sunsetHour = 18 + Math.random();
    else if (currentMonth >= 5 && currentMonth <= 7) sunsetHour = 20 + Math.random();
    else sunsetHour = 19 + Math.random();
    
    const sunset = new Date(now);
    sunset.setHours(Math.floor(sunsetHour), Math.floor((sunsetHour % 1) * 60), 0);
    const sunsetTime = sunset.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    return {
        location: locationName,
        temperature: temperature,
        feelsLike: temperature + Math.floor(Math.random() * 4) - 2,
        conditions: conditions,
        windSpeed: windSpeed,
        humidity: humidity,
        visibility: `${(5 + Math.random() * 7).toFixed(1)} miles`,
        sunset: sunsetTime,
        updatedTime: updatedTime,
        currentDate: currentDate,
        forecast: forecast
    };
}

function getWeatherIcon(condition) {
    const icons = {
        'Sunny': '☀️',
        'Clear': '☀️',
        'Partly Cloudy': '⛅',
        'Mostly Cloudy': '☁️',
        'Overcast': '☁️',
        'Fair': '🌤️',
        'Mostly Sunny': '🌤️'
    };
    return icons[condition] || '🌡️';
}

// Get user's current location with better error handling
function getUserLocation() {
    if (!navigator.geolocation) {
        showErrorToast('Geolocation is not supported by your browser');
        return;
    }
    
    const weatherInfo = document.getElementById('weather-info');
    if (weatherInfo) {
        weatherInfo.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h5 class="mt-3">Detecting Location</h5>
                <p class="text-muted">Please allow location access...</p>
            </div>
        `;
    }
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            window.userLat = position.coords.latitude;
            window.userLon = position.coords.longitude;
            
            if (weatherInfo) {
                weatherInfo.innerHTML = `
                    <div class="alert alert-success">
                        <h5><i class="fas fa-check-circle me-2"></i>Location Updated!</h5>
                        <p class="mb-3">Successfully detected your location.</p>
                        <div class="mb-3">
                            <small class="text-muted">Coordinates:</small><br>
                            <code>${window.userLat.toFixed(6)}, ${window.userLon.toFixed(6)}</code>
                        </div>
                        <button id="fetchWeather" class="btn btn-success">
                            <i class="fas fa-cloud-sun me-1"></i>Get Weather for My Location
                        </button>
                    </div>
                `;
                document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
            }
            
            showToast('Location updated successfully!', 'success');
        },
        function(error) {
            console.error('Error getting location:', error);
            let errorMessage = 'Unable to get your location. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access was denied. Please enable location services in your browser settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is currently unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out. Please try again.';
                    break;
                default:
                    errorMessage = 'An unknown error occurred while getting location.';
                    break;
            }
            
            if (weatherInfo) {
                weatherInfo.innerHTML = `
                    <div class="alert alert-warning">
                        <h5><i class="fas fa-exclamation-triangle me-2"></i>Location Access Needed</h5>
                        <p class="mb-3">${errorMessage}</p>
                        <p>Using default campus location instead.</p>
                        <button id="fetchWeather" class="btn btn-primary">
                            <i class="fas fa-cloud-sun me-1"></i>Get Weather with Default Location
                        </button>
                    </div>
                `;
                document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
            }
            
            showErrorToast(errorMessage);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Enhanced event search with filters
function searchEvents() {
    const searchInput = document.getElementById('eventSearch');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    const events = document.querySelectorAll('#eventsContainer .card');
    
    if (!searchTerm) {
        // Show all events if search is empty
        events.forEach(event => event.style.display = 'block');
        showToast('Showing all events', 'info');
        return;
    }
    
    let found = false;
    events.forEach(event => {
        const eventText = event.textContent.toLowerCase();
        if (eventText.includes(searchTerm)) {
            event.style.display = 'block';
            event.classList.add('border-primary', 'border-2');
            found = true;
        } else {
            event.style.display = 'none';
            event.classList.remove('border-primary', 'border-2');
        }
    });
    
    if (!found) {
        showErrorToast(`No events found for "${searchTerm}"`);
    } else {
        showToast(`Found events matching "${searchTerm}"`, 'success');
    }
}

// Add event filters for mobile
function addEventFilters() {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'row mb-3';
    filterContainer.innerHTML = `
        <div class="col-12">
            <div class="btn-group w-100" role="group">
                <button type="button" class="btn btn-outline-primary filter-btn active" data-filter="all">All</button>
                <button type="button" class="btn btn-outline-primary filter-btn" data-filter="week">This Week</button>
                <button type="button" class="btn btn-outline-primary filter-btn" data-filter="month">This Month</button>
                <button type="button" class="btn btn-outline-primary filter-btn" data-filter="career">Career</button>
            </div>
        </div>
    `;
    
    eventsContainer.parentElement.insertBefore(filterContainer, eventsContainer);
    
    // Add filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterEvents(filter);
        });
    });
}

function filterEvents(filter) {
    const events = document.querySelectorAll('#eventsContainer .card');
    events.forEach(event => {
        event.style.display = 'block';
        
        if (filter === 'career') {
            const title = event.querySelector('.card-title').textContent.toLowerCase();
            if (!title.includes('career') && !title.includes('job') && !title.includes('internship')) {
                event.style.display = 'none';
            }
        }
    });
}

// Enhanced RSVP handling
function handleRSVP(button) {
    const card = button.closest('.card');
    const eventTitle = card.querySelector('.card-title').textContent.replace(/🕒.*/, '').trim();
    
    // Disable button and show loading state
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✓ RSVPed!';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        
        // Add success styling to card
        card.classList.add('border-success', 'border-2');
        
        // Add confirmation message
        const confirmation = document.createElement('div');
        confirmation.className = 'alert alert-success alert-dismissible fade show mt-2';
        confirmation.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Confirmed!</strong> You're registered for "${eventTitle}"
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        card.querySelector('.card-body').appendChild(confirmation);
        
        // Log to console (simulate API call)
        console.log(`RSVP confirmed for: ${eventTitle}`);
        showToast(`Successfully RSVPed for ${eventTitle}`, 'success');
    }, 800);
}

// Enhanced resource information display
function showResourceInfo(resourceType) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const modalContent = {
        'library': {
            title: '📚 Library Services',
            content: `
                <div class="mb-3">
                    <h6>Services Available:</h6>
                    <ul>
                        <li>Book lending (3-week loan period)</li>
                        <li>Study room reservations (up to 4 hours)</li>
                        <li>Research database access</li>
                        <li>Printing and scanning services</li>
                        <li>24/7 digital resources access</li>
                    </ul>
                </div>
                <div class="mb-3">
                    <h6>Contact:</h6>
                    <p>Phone: (555) 123-4567<br>
                    Email: library@campus.edu<br>
                    Website: library.campus.edu</p>
                </div>
                <div class="text-muted">
                    <small>Last updated: ${currentTime}</small>
                </div>
            `
        },
        'tutoring': {
            title: '🎓 Tutoring Center',
            content: `
                <div class="mb-3">
                    <h6>Subjects Available:</h6>
                    <ul>
                        <li>Mathematics (all levels)</li>
                        <li>Writing and Composition</li>
                        <li>Computer Science</li>
                        <li>Science (Physics, Chemistry, Biology)</li>
                        <li>Foreign Languages</li>
                    </ul>
                </div>
                <div class="mb-3">
                    <h6>Schedule:</h6>
                    <p>Drop-in hours: Mon-Thu 2-8pm, Fri 2-5pm<br>
                    Appointment hours: Mon-Fri 9am-5pm<br>
                    Location: Student Success Center, Room 203</p>
                </div>
                <div class="text-muted">
                    <small>Last updated: ${currentTime}</small>
                </div>
            `
        },
        'health': {
            title: '🏥 Health Center',
            content: `
                <div class="mb-3">
                    <h6>Services:</h6>
                    <ul>
                        <li>Primary care appointments</li>
                        <li>Vaccinations and immunizations</li>
                        <li>Laboratory services</li>
                        <li>Prescription services</li>
                        <li>Health education workshops</li>
                    </ul>
                </div>
                <div class="mb-3">
                    <h6>Emergency Contact:</h6>
                    <p>24/7 Emergency Line: (555) 911-4911<br>
                    Non-emergency: (555) 123-4920<br>
                    Address: Health Services Building</p>
                </div>
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    For life-threatening emergencies, call 911 immediately
                </div>
                <div class="text-muted">
                    <small>Last updated: ${currentTime}</small>
                </div>
            `
        },
        'counseling': {
            title: '💬 Counseling Services',
            content: `
                <div class="mb-3">
                    <h6>Confidential Services:</h6>
                    <ul>
                        <li>Individual counseling sessions</li>
                        <li>Group therapy sessions</li>
                        <li>Crisis intervention</li>
                        <li>Stress management workshops</li>
                        <li>Referral services</li>
                    </ul>
                </div>
                <div class="mb-3">
                    <h6>Appointments:</h6>
                    <p>Schedule online: counseling.campus.edu<br>
                    Phone: (555) 123-4920 (Press 2)<br>
                    Urgent appointments available same day</p>
                </div>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    All services are confidential and free for enrolled students
                </div>
                <div class="text-muted">
                    <small>Last updated: ${currentTime}</small>
                </div>
            `
        },
        'career': {
            title: '💼 Career Center',
            content: `
                <div class="mb-3">
                    <h6>Services:</h6>
                    <ul>
                        <li>Resume and cover letter reviews</li>
                        <li>Mock interviews (in-person & virtual)</li>
                        <li>Career counseling and assessment</li>
                        <li>Job search strategies</li>
                        <li>Graduate school planning</li>
                    </ul>
                </div>
                <div class="mb-3">
                    <h6>Upcoming Events:</h6>
                    <ul>
                        <li>Resume Workshop: Tomorrow, 3pm</li>
                        <li>Interview Skills: Thursday, 2pm</li>
                        <li>Career Fair Prep: Next Monday, 4pm</li>
                    </ul>
                </div>
                <div class="text-muted">
                    <small>Last updated: ${currentTime}</small>
                </div>
            `
        },
        'internship': {
            title: '🌟 Internship Office',
            content: `
                <div class="mb-3">
                    <h6>Opportunities:</h6>
                    <ul>
                        <li>Summer internships (200+ positions)</li>
                        <li>Part-time internships during semester</li>
                        <li>Research positions with faculty</li>
                        <li>International internship programs</li>
                        <li>Co-op programs (alternating semesters)</li>
                    </ul>
                </div>
                <div class="mb-3">
                    <h6>Application Deadlines:</h6>
                    <ul>
                        <li>Summer 2024: April 15, 2024</li>
                        <li>Fall 2024: July 31, 2024</li>
                        <li>Spring 2025: November 30, 2024</li>
                    </ul>
                </div>
                <div class="mb-3">
                    <p><strong>Portal:</strong> internships.campus.edu<br>
                    <strong>Contact:</strong> (555) 123-4930</p>
                </div>
                <div class="text-muted">
                    <small>Last updated: ${currentTime}</small>
                </div>
            `
        }
    };
    
    const resource = modalContent[resourceType] || {
        title: 'Resource Information',
        content: 'Information not available for this resource.'
    };
    
    // Create and show modal
    const modalHTML = `
        <div class="modal fade" id="resourceModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">${resource.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${resource.content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="showToast('Resource information saved', 'info')">
                            <i class="fas fa-bookmark me-1"></i>Save Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
    
    const resourceModal = new bootstrap.Modal(document.getElementById('resourceModal'));
    resourceModal.show();
    
    document.getElementById('resourceModal').addEventListener('hidden.bs.modal', function() {
        modalDiv.remove();
    });
}

// Enhanced external events API
function fetchExternalEvents() {
    const externalEventsDiv = document.getElementById('external-events');
    if (!externalEventsDiv) return;
    
    externalEventsDiv.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h5 class="mt-3">Loading External Events</h5>
            <p class="text-muted">Fetching events from community partners...</p>
        </div>
    `;
    
    setTimeout(() => {
        const now = new Date();
        const events = [
            { title: 'Community Tech Talk', days: 5, type: 'tech' },
            { title: 'Art Gallery Opening', days: 12, type: 'arts' },
            { title: 'City Basketball Tournament', days: 19, type: 'sports' },
            { title: 'Startup Pitch Night', days: 8, type: 'business' },
            { title: 'Local Food Festival', days: 15, type: 'food' }
        ];
        
        const eventHTML = events.map(event => {
            const eventDate = new Date(now);
            eventDate.setDate(now.getDate() + event.days);
            const formattedDate = eventDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            const icons = {
                'tech': '💻',
                'arts': '🎨',
                'sports': '🏀',
                'business': '💼',
                'food': '🍴'
            };
            
            return `
                <div class="d-flex align-items-start mb-2">
                    <span class="me-3 fs-5">${icons[event.type] || '📅'}</span>
                    <div class="flex-grow-1">
                        <strong>${event.title}</strong><br>
                        <small class="text-muted">${formattedDate} • ${event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event</small>
                    </div>
                    <button class="btn btn-sm btn-outline-warning" onclick="showToast('Added to your calendar', 'success')">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        externalEventsDiv.innerHTML = `
            <div class="alert alert-warning">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="alert-heading mb-0">
                        <i class="fas fa-external-link-alt me-2"></i>Community Events
                    </h5>
                    <span class="badge bg-warning text-dark">Updated: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="mb-3">
                    ${eventHTML}
                </div>
                <div class="d-flex justify-content-between">
                    <button id="fetchExternalEvents" class="btn btn-outline-warning">
                        <i class="fas fa-sync-alt me-1"></i>Load More Events
                    </button>
                    <button class="btn btn-warning" onclick="showToast('All events exported', 'info')">
                        <i class="fas fa-download me-1"></i>Export All
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('fetchExternalEvents').addEventListener('click', fetchExternalEvents);
    }, 1500);
}

// Enhanced resource availability check
function checkResourceAvailability() {
    const availabilityDiv = document.getElementById('resource-availability');
    if (!availabilityDiv) return;
    
    availabilityDiv.innerHTML = `
        <div class="text-center py-3">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 mb-0">Checking current resource availability...</p>
        </div>
    `;
    
    setTimeout(() => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        
        // Simulate dynamic data
        const libraryCapacity = Math.floor(Math.random() * 40) + 10;
        const studyRooms = Math.floor(Math.random() * 15) + 1;
        const tutorsAvailable = Math.floor(Math.random() * 8) + 1;
        const waitTime = Math.floor(Math.random() * 15);
        const computerStations = Math.floor(Math.random() * 20) + 1;
        
        availabilityDiv.innerHTML = `
            <div class="alert alert-success">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="alert-heading mb-0">
                        <i class="fas fa-chart-line me-2"></i>Live Resource Status
                    </h5>
                    <span class="badge bg-success">Updated: ${currentTime}</span>
                </div>
                
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="card bg-light border-success">
                            <div class="card-body text-center py-3">
                                <div class="h1 mb-2">📚</div>
                                <h6 class="card-subtitle mb-2 text-muted">Library</h6>
                                <div class="h4">${libraryCapacity}%</div>
                                <small class="text-muted">${studyRooms} study rooms available</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card bg-light border-success">
                            <div class="card-body text-center py-3">
                                <div class="h1 mb-2">🎓</div>
                                <h6 class="card-subtitle mb-2 text-muted">Tutoring Center</h6>
                                <div class="h4">${tutorsAvailable}</div>
                                <small class="text-muted">Wait time: ${waitTime} min</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card bg-light border-success">
                            <div class="card-body text-center py-3">
                                <div class="h1 mb-2">💻</div>
                                <h6 class="card-subtitle mb-2 text-muted">Computer Lab</h6>
                                <div class="h4">${computerStations}</div>
                                <small class="text-muted">Stations available</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <div class="progress mb-2" style="height: 10px;">
                        <div class="progress-bar bg-success" style="width: ${libraryCapacity}%" 
                             role="progressbar" aria-valuenow="${libraryCapacity}" 
                             aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                    <small class="text-muted">Overall campus resource utilization: ${libraryCapacity}%</small>
                </div>
                
                <div class="mt-4 d-flex justify-content-between">
                    <button id="checkAvailability" class="btn btn-outline-success">
                        <i class="fas fa-sync-alt me-1"></i>Refresh
                    </button>
                    <button class="btn btn-success" onclick="showToast('Availability data exported', 'success')">
                        <i class="fas fa-download me-1"></i>Export Data
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('checkAvailability').addEventListener('click', checkResourceAvailability);
    }, 1200);
}

// Update resource status in real-time
function updateResourceStatus() {
    const statusElements = document.querySelectorAll('[data-resource-status]');
    statusElements.forEach(element => {
        const resource = element.getAttribute('data-resource-status');
        const now = new Date();
        const currentHour = now.getHours();
        
        let status = 'closed';
        let statusClass = 'danger';
        
        if (resource === 'library') {
            if (currentHour >= 8 && currentHour < 22) {
                status = 'open';
                statusClass = 'success';
            }
        } else if (resource === 'tutoring') {
            const day = now.getDay();
            if (day >= 1 && day <= 5 && currentHour >= 9 && currentHour < 17) {
                status = 'open';
                statusClass = 'success';
            }
        }
        
        element.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        element.className = `badge bg-${statusClass}`;
    });
}

// Utility function to show toast notifications
function showToast(message, type = 'info') {
    // Remove existing toast container
    const existingContainer = document.getElementById('toast-container');
    if (existingContainer) existingContainer.remove();
    
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '1050';
    
    const toastId = 'toast-' + Date.now();
    const icon = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    }[type] || 'ℹ️';
    
    toastContainer.innerHTML = `
        <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${icon} ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function () {
        toastContainer.remove();
    });
}

function showErrorToast(message) {
    showToast(message, 'danger');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}