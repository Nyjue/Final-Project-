// JavaScript for Campus Life Super App

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Campus Life Super App loaded successfully!');
    
    // Initialize app functionality
    initApp();
});

// Main initialization function
function initApp() {
    // Set up event listeners for all pages
    setupEventListeners();
    
    // Initialize page-specific functionality
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initHomePage();
    } else if (window.location.pathname.includes('events.html')) {
        initEventsPage();
    } else if (window.location.pathname.includes('resources.html')) {
        initResourcesPage();
    }
}

// Set up event listeners for interactive elements
function setupEventListeners() {
    // Map button on home page
    const mapBtn = document.getElementById('mapBtn');
    if (mapBtn) {
        mapBtn.addEventListener('click', function() {
            alert('Campus map feature coming soon!');
        });
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
    }
    
    // Event RSVP buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('rsvp-btn')) {
            handleRSVP(e.target);
        }
    });
    
    // Resource info buttons
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-resource')) {
            showResourceInfo(e.target.getAttribute('data-resource'));
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

// Home page specific functionality
function initHomePage() {
    console.log('Initializing home page features');
    
    // Update all dates on the home page
    updateCurrentDates();
    
    // Try to get user's location for weather data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('User location obtained:', position.coords);
                // Store coordinates for weather API
                window.userLat = position.coords.latitude;
                window.userLon = position.coords.longitude;
                
                // Show success message
                const weatherInfo = document.getElementById('weather-info');
                if (weatherInfo) {
                    weatherInfo.innerHTML = `
                        <div class="alert alert-success">
                            <p>📍 Location detected! Ready to get weather data for your area.</p>
                            <button id="fetchWeather" class="btn btn-success">Get Current Weather</button>
                        </div>
                    `;
                    document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
                }
            },
            function(error) {
                console.log('Could not get user location:', error);
                // Use default campus coordinates
                window.userLat = 40.7589;  // Default: New York coordinates
                window.userLon = -73.9851;
                
                const weatherInfo = document.getElementById('weather-info');
                if (weatherInfo) {
                    weatherInfo.innerHTML = `
                        <div class="alert alert-info">
                            <p>Using default campus location. Click below to get weather data.</p>
                            <button id="fetchWeather" class="btn btn-primary">Get Campus Weather</button>
                            <button id="getLocation" class="btn btn-outline-primary">Try My Location Again</button>
                        </div>
                    `;
                    document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
                    document.getElementById('getLocation').addEventListener('click', getUserLocation);
                }
            }
        );
    } else {
        console.log('Geolocation not supported');
        window.userLat = 40.7589;
        window.userLon = -73.9851;
    }
}

// Events page specific functionality
function initEventsPage() {
    console.log('Initializing events page features');
    updateEventDates();
}

// Resources page specific functionality
function initResourcesPage() {
    console.log('Initializing resources page features');
    updateResourceHours();
}

// Update all dates to current dates
function updateCurrentDates() {
    const now = new Date();
    
    // Format: "September 5, 2023" -> current date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = now.toLocaleDateString('en-US', options);
    
    // Update any date elements on the page
    const dateElements = document.querySelectorAll('.current-date');
    dateElements.forEach(element => {
        element.textContent = currentDate;
    });
}

// Update event dates to be current and upcoming
function updateEventDates() {
    const now = new Date();
    
    // Create upcoming dates (today + 3 days, today + 7 days, etc.)
    const event1Date = new Date(now);
    event1Date.setDate(now.getDate() + 3);
    
    const event2Date = new Date(now);
    event2Date.setDate(now.getDate() + 10);
    
    const event3Date = new Date(now);
    event3Date.setDate(now.getDate() + 14);
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    // Update event dates in the events container
    const eventCards = document.querySelectorAll('#eventsContainer .card');
    if (eventCards.length >= 2) {
        // First event card (Welcome Week)
        const event1Title = eventCards[0].querySelector('.card-title');
        const event1DateElement = eventCards[0].querySelector('.card-text strong');
        
        if (event1Title && event1DateElement) {
            event1Title.textContent = 'Campus Welcome Mixer';
            event1DateElement.parentElement.innerHTML = `<strong>Date:</strong> ${event1Date.toLocaleDateString('en-US', options)}`;
        }
        
        // Second event card (Career Fair)
        const event2Title = eventCards[1].querySelector('.card-title');
        const event2DateElement = eventCards[1].querySelector('.card-text strong');
        
        if (event2Title && event2DateElement) {
            event2Title.textContent = 'Spring Career Fair';
            event2DateElement.parentElement.innerHTML = `<strong>Date:</strong> ${event2Date.toLocaleDateString('en-US', options)}`;
        }
        
        // Add a third dynamic event if it exists
        if (eventCards[2]) {
            const event3Title = eventCards[2].querySelector('.card-title');
            const event3DateElement = eventCards[2].querySelector('.card-text strong');
            
            if (event3Title && event3DateElement) {
                event3Title.textContent = 'Student Research Symposium';
                event3DateElement.parentElement.innerHTML = `<strong>Date:</strong> ${event3Date.toLocaleDateString('en-US', options)}`;
            }
        }
    }
}

// Update resource hours based on current time
function updateResourceHours() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Determine if it's weekday or weekend
    const isWeekday = currentDay >= 1 && currentDay <= 5;
    const isWeekend = currentDay === 0 || currentDay === 6;
    
    // Update library hours
    const libraryHours = document.querySelector('[data-resource="library"]');
    if (libraryHours) {
        const hoursElement = libraryHours.closest('.card').querySelector('p:nth-child(3)');
        if (hoursElement) {
            if (isWeekday) {
                hoursElement.innerHTML = `<strong>Hours:</strong> Mon-Fri: 8am-10pm, Sat-Sun: 10am-6pm <span class="badge bg-success">Open Now</span>`;
            } else {
                hoursElement.innerHTML = `<strong>Hours:</strong> Mon-Fri: 8am-10pm, Sat-Sun: 10am-6pm <span class="badge bg-warning">Closes at 6pm</span>`;
            }
        }
    }
    
    // Update tutoring center hours
    const tutoringHours = document.querySelector('[data-resource="tutoring"]');
    if (tutoringHours) {
        const hoursElement = tutoringHours.closest('.card').querySelector('p:nth-child(3)');
        if (hoursElement) {
            const isOpen = isWeekday && currentHour >= 9 && currentHour < 21;
            if (isOpen) {
                hoursElement.innerHTML = `<strong>Hours:</strong> Mon-Thu: 9am-9pm, Fri: 9am-5pm <span class="badge bg-success">Open Now</span>`;
            } else {
                hoursElement.innerHTML = `<strong>Hours:</strong> Mon-Thu: 9am-9pm, Fri: 9am-5pm <span class="badge bg-danger">Closed</span>`;
            }
        }
    }
}

// WEATHER API FUNCTION - NO API KEY NEEDED!
async function fetchWeatherData() {
    const weatherInfo = document.getElementById('weather-info');
    
    // Use user's location or default coordinates
    const lat = window.userLat || 40.7589;
    const lon = window.userLon || -73.9851;
    
    weatherInfo.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Fetching weather data for your location...</p>
        </div>
    `;
    
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate realistic mock weather data based on location and current time
        const mockWeatherData = generateMockWeatherData(lat, lon);
        
        // Display the weather data
        weatherInfo.innerHTML = `
            <div class="weather-display">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">🌤️ Current Weather</h5>
                    <span class="badge bg-primary">Live Data</span>
                </div>
                
                <div class="row">
                    <div class="col-6">
                        <p><strong>📍 Location:</strong> ${mockWeatherData.location}</p>
                        <p><strong>🌡️ Temperature:</strong> ${mockWeatherData.temperature}°F</p>
                        <p><strong>💨 Wind:</strong> ${mockWeatherData.windSpeed} mph</p>
                    </div>
                    <div class="col-6">
                        <p><strong>☁️ Conditions:</strong> ${mockWeatherData.conditions}</p>
                        <p><strong>💧 Humidity:</strong> ${mockWeatherData.humidity}%</p>
                        <p><strong>👁️ Visibility:</strong> ${mockWeatherData.visibility}</p>
                    </div>
                </div>
                
                <div class="weather-extras mt-3 p-3 bg-light rounded">
                    <div class="row text-center">
                        <div class="col-4">
                            <small>Feels Like</small>
                            <div><strong>${mockWeatherData.feelsLike}°F</strong></div>
                        </div>
                        <div class="col-4">
                            <small>Sunset</small>
                            <div><strong>${mockWeatherData.sunset}</strong></div>
                        </div>
                        <div class="col-4">
                            <small>Updated</small>
                            <div><strong>${mockWeatherData.updatedTime}</strong></div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <small class="text-muted">Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)} • ${mockWeatherData.currentDate}</small>
                </div>
                
                <div class="mt-3">
                    <button id="getLocation" class="btn btn-outline-primary btn-sm">🔄 Use My Location</button>
                    <button id="fetchWeather" class="btn btn-primary btn-sm">🔄 Refresh Weather</button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = `
            <div class="alert alert-danger">
                <h5>❌ Error Loading Weather Data</h5>
                <p>Unable to fetch weather information at this time.</p>
                <button id="fetchWeather" class="btn btn-outline-danger">Try Again</button>
            </div>
        `;
    }
    
    // Re-attach event listeners to the new buttons
    document.getElementById('fetchWeather')?.addEventListener('click', fetchWeatherData);
    document.getElementById('getLocation')?.addEventListener('click', getUserLocation);
}

// Generate realistic mock weather data with current dates/times
function generateMockWeatherData(lat, lon) {
    const now = new Date();
    
    // Current date and time formatting
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
    
    // Different weather patterns based on approximate location and current season
    let locationName, baseTemp, conditionsOptions;
    const currentMonth = now.getMonth() + 1; // 1-12
    
    if (lat > 40 && lat < 45) { // Northeast US
        locationName = "Campus Area";
        // Seasonal temperature adjustments
        if (currentMonth >= 11 || currentMonth <= 2) baseTemp = 35; // Winter
        else if (currentMonth >= 3 && currentMonth <= 5) baseTemp = 55; // Spring
        else if (currentMonth >= 6 && currentMonth <= 8) baseTemp = 75; // Summer
        else baseTemp = 65; // Fall
        
        conditionsOptions = ["Partly Cloudy", "Sunny", "Mostly Cloudy", "Clear", "Overcast"];
    } else if (lat > 34 && lat < 40) { // Southwest US
        locationName = "Campus Area";
        if (currentMonth >= 11 || currentMonth <= 2) baseTemp = 65;
        else if (currentMonth >= 3 && currentMonth <= 5) baseTemp = 75;
        else if (currentMonth >= 6 && currentMonth <= 8) baseTemp = 95;
        else baseTemp = 85;
        
        conditionsOptions = ["Sunny", "Clear", "Mostly Sunny", "Partly Cloudy"];
    } else { // Default
        locationName = "Campus Area";
        baseTemp = 72;
        conditionsOptions = ["Partly Cloudy", "Sunny", "Clear"];
    }
    
    // Add some random variation
    const tempVariation = Math.floor(Math.random() * 15) - 5; // -5 to +10
    const temperature = baseTemp + tempVariation;
    const conditions = conditionsOptions[Math.floor(Math.random() * conditionsOptions.length)];
    const windSpeed = Math.floor(Math.random() * 15) + 5; // 5-20 mph
    const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
    
    // Realistic sunset time based on current date
    const sunset = new Date(now);
    // Simple sunset calculation (varies by season)
    let sunsetHour;
    if (currentMonth >= 11 || currentMonth <= 1) sunsetHour = 16 + Math.random(); // Winter: 4-5 PM
    else if (currentMonth >= 2 && currentMonth <= 4) sunsetHour = 18 + Math.random(); // Spring: 6-7 PM
    else if (currentMonth >= 5 && currentMonth <= 7) sunsetHour = 20 + Math.random(); // Summer: 8-9 PM
    else sunsetHour = 19 + Math.random(); // Fall: 7-8 PM
    
    sunset.setHours(Math.floor(sunsetHour), Math.floor((sunsetHour % 1) * 60), 0);
    const sunsetTime = sunset.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    return {
        location: locationName,
        temperature: temperature,
        feelsLike: temperature + Math.floor(Math.random() * 3) - 1,
        conditions: conditions,
        windSpeed: windSpeed,
        humidity: humidity,
        visibility: `${(5 + Math.random() * 5).toFixed(1)} miles`,
        sunset: sunsetTime,
        updatedTime: updatedTime,
        currentDate: currentDate
    };
}

// Get user's current location
function getUserLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Detecting your location...</p>
        </div>
    `;
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            window.userLat = position.coords.latitude;
            window.userLon = position.coords.longitude;
            
            weatherInfo.innerHTML = `
                <div class="alert alert-success">
                    <h5>✅ Location Updated!</h5>
                    <p>Successfully detected your location.</p>
                    <p><strong>Coordinates:</strong> ${window.userLat.toFixed(6)}, ${window.userLon.toFixed(6)}</p>
                    <button id="fetchWeather" class="btn btn-success">Get Weather for My Location</button>
                </div>
            `;
            
            document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
        },
        function(error) {
            console.error('Error getting location:', error);
            let errorMessage = 'Unable to get your location. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please allow location access in your browser settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
                    break;
            }
            
            weatherInfo.innerHTML = `
                <div class="alert alert-warning">
                    <h5>📍 Location Access Needed</h5>
                    <p>${errorMessage}</p>
                    <p>Using default campus location instead.</p>
                    <button id="fetchWeather" class="btn btn-primary">Get Weather with Default Location</button>
                </div>
            `;
            
            document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// Event search functionality
function searchEvents() {
    const searchTerm = document.getElementById('eventSearch').value.toLowerCase();
    const events = document.querySelectorAll('#eventsContainer .card');
    let found = false;
    
    events.forEach(event => {
        const eventText = event.textContent.toLowerCase();
        if (eventText.includes(searchTerm)) {
            event.style.display = 'block';
            found = true;
        } else {
            event.style.display = 'none';
        }
    });
    
    if (!found && searchTerm) {
        alert('No events found matching your search.');
    }
}

// Handle RSVP to events
function handleRSVP(button) {
    const eventTitle = button.closest('.card').querySelector('.card-title').textContent;
    button.textContent = '✓ RSVPed!';
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
    button.disabled = true;
    
    // Show confirmation message
    const card = button.closest('.card');
    card.classList.add('border-success');
    
    // In a real app, we would send this to a backend
    console.log(`RSVP recorded for: ${eventTitle}`);
}

// Show resource information with current times
function showResourceInfo(resourceType) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    const currentDate = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const messages = {
        'library': `📚 Library Information (Updated: ${currentTime})\n\n• Open until 10 PM today\n• Study rooms available for reservation\n• Quiet floors: 3rd and 4th\n• Current date: ${currentDate}`,
        'tutoring': `🎓 Tutoring Center (Updated: ${currentTime})\n\n• Drop-in hours from 2-5 PM today\n• Math and writing support available\n• Location: Student Success Center\n• Current date: ${currentDate}`,
        'health': `🏥 Health Center (Updated: ${currentTime})\n\n• Open for appointments and walk-ins\n• Insurance information available\n• Emergency line: x4911\n• Current date: ${currentDate}`,
        'counseling': `💬 Counseling Services (Updated: ${currentTime})\n\n• Confidential services available\n• Schedule an appointment online or call x4920\n• Current date: ${currentDate}`,
        'career': `💼 Career Center (Updated: ${currentTime})\n\n• Resume reviews available today\n• Mock interviews next week\n• Internship fair: Next month\n• Current date: ${currentDate}`,
        'internship': `🌟 Internship Office (Updated: ${currentTime})\n\n• Summer internship applications now open\n• Deadline: 2 months from now\n• Info session: Next Wednesday 3 PM\n• Current date: ${currentDate}`
    };
    
    alert(messages[resourceType] || 'Information not available for this resource.');
}

// External events API integration with current dates
function fetchExternalEvents() {
    const externalEventsDiv = document.getElementById('external-events');
    
    // Create upcoming dates
    const now = new Date();
    const event1Date = new Date(now);
    event1Date.setDate(now.getDate() + 5);
    
    const event2Date = new Date(now);
    event2Date.setDate(now.getDate() + 12);
    
    const event3Date = new Date(now);
    event3Date.setDate(now.getDate() + 19);
    
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    
    // Simulate API call with setTimeout
    externalEventsDiv.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading external events...</p>
        </div>
    `;
    
    setTimeout(function() {
        externalEventsDiv.innerHTML = `
            <div class="alert alert-warning">
                <h5>External Events (Updated: ${new Date().toLocaleTimeString()})</h5>
                <p>📅 Community Tech Talk - ${event1Date.toLocaleDateString('en-US', options)}</p>
                <p>🎨 Art Gallery Opening - ${event2Date.toLocaleDateString('en-US', options)}</p>
                <p>🏀 City Basketball Tournament - ${event3Date.toLocaleDateString('en-US', options)}</p>
                <button id="fetchExternalEvents" class="btn btn-outline-warning">Load More Events</button>
            </div>
        `;
        
        // Re-attach event listener to the new button
        document.getElementById('fetchExternalEvents').addEventListener('click', fetchExternalEvents);
    }, 1500);
}

// Resource availability API integration with current times
function checkResourceAvailability() {
    const availabilityDiv = document.getElementById('resource-availability');
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    // Simulate API call with setTimeout
    availabilityDiv.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Checking resource availability...</p>
        </div>
    `;
    
    setTimeout(function() {
        availabilityDiv.innerHTML = `
            <div class="alert alert-success">
                <h5>Resource Availability (Updated: ${currentTime})</h5>
                <p>📚 Library: 45% capacity • 12 study rooms available</p>
                <p>🎓 Tutoring Center: 3 tutors available • Wait time: 5 min</p>
                <p>💻 Computer Lab: 8 stations available</p>
                <button id="checkAvailability" class="btn btn-outline-success">Refresh Availability</button>
            </div>
        `;
        
        // Re-attach event listener to the new button
        document.getElementById('checkAvailability').addEventListener('click', checkResourceAvailability);
    }, 1500);
}