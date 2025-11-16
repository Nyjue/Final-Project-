// JavaScript for Campus Life Super App


document.addEventListener('DOMContentLoaded', function() {
    console.log('Campus Life Super App loaded successfully!');
    
    
    initApp();
});


function initApp() {
    
    setupEventListeners();
    
    
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initHomePage();
    } else if (window.location.pathname.includes('events.html')) {
        initEventsPage();
    } else if (window.location.pathname.includes('resources.html')) {
        initResourcesPage();
    }
}


 
function setupEventListeners() {
    
    const mapBtn = document.getElementById('mapBtn');
    if (mapBtn) {
        mapBtn.addEventListener('click', function() {
            alert('Campus map feature coming soon!');
        });
    }
    
    
    const fetchWeatherBtn = document.getElementById('fetchWeather');
    if (fetchWeatherBtn) {
        fetchWeatherBtn.addEventListener('click', fetchWeatherData);
    }
    
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchEvents);
    }
    
  
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('rsvp-btn')) {
            handleRSVP(e.target);
        }
    });
    
    
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-resource')) {
            showResourceInfo(e.target.getAttribute('data-resource'));
        }
    });
    
   
    const fetchExternalEventsBtn = document.getElementById('fetchExternalEvents');
    if (fetchExternalEventsBtn) {
        fetchExternalEventsBtn.addEventListener('click', fetchExternalEvents);
    }
    
    
    const checkAvailabilityBtn = document.getElementById('checkAvailability');
    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener('click', checkResourceAvailability);
    }
    

    const getLocationBtn = document.getElementById('getLocation');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getUserLocation);
    }
}


function initHomePage() {
    console.log('Initializing home page features');
    
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('User location obtained:', position.coords);
                
                window.userLat = position.coords.latitude;
                window.userLon = position.coords.longitude;
                
                
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
                
                window.userLat = 40.7589;  
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


function initEventsPage() {
    console.log('Initializing events page features');
}


function initResourcesPage() {
    console.log('Initializing resources page features');
}


async function fetchWeatherData() {
    const weatherInfo = document.getElementById('weather-info');
    
    
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
       
        await new Promise(resolve => setTimeout(resolve, 1500));
        
       
        const mockWeatherData = generateMockWeatherData(lat, lon);
        
        
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
                            <div><strong>Just now</strong></div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <small class="text-muted">Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}</small>
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
    
    
    document.getElementById('fetchWeather')?.addEventListener('click', fetchWeatherData);
    document.getElementById('getLocation')?.addEventListener('click', getUserLocation);
}


function generateMockWeatherData(lat, lon) {
    
    let locationName, baseTemp, conditionsOptions;
    
    if (lat > 40 && lat < 45) { 
        locationName = "Campus Area";
        baseTemp = 65;
        conditionsOptions = ["Partly Cloudy", "Sunny", "Mostly Cloudy", "Clear"];
    } else if (lat > 34 && lat < 40) { 
        locationName = "Campus Area";
        baseTemp = 78;
        conditionsOptions = ["Sunny", "Clear", "Mostly Sunny"];
    } else { 
        locationName = "Campus Area";
        baseTemp = 72;
        conditionsOptions = ["Partly Cloudy", "Sunny", "Clear"];
    }
    
   
    const tempVariation = Math.floor(Math.random() * 15) - 5; 
    const temperature = baseTemp + tempVariation;
    const conditions = conditionsOptions[Math.floor(Math.random() * conditionsOptions.length)];
    const windSpeed = Math.floor(Math.random() * 15) + 5; 
    const humidity = Math.floor(Math.random() * 40) + 40; 
    
    
    const now = new Date();
    const sunsetHour = 17 + Math.floor(Math.random() * 3); 
    const sunsetMinute = Math.floor(Math.random() * 60);
    const sunsetTime = `${sunsetHour}:${sunsetMinute.toString().padStart(2, '0')} PM`;
    
    return {
        location: locationName,
        temperature: temperature,
        feelsLike: temperature + Math.floor(Math.random() * 3) - 1,
        conditions: conditions,
        windSpeed: windSpeed,
        humidity: humidity,
        visibility: `${(5 + Math.random() * 5).toFixed(1)} miles`,
        sunset: sunsetTime
    };
}


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


function handleRSVP(button) {
    const eventTitle = button.closest('.card').querySelector('.card-title').textContent;
    button.textContent = '✓ RSVPed!';
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
    button.disabled = true;
    
    
    const card = button.closest('.card');
    card.classList.add('border-success');
    
    
    console.log(`RSVP recorded for: ${eventTitle}`);
}


function showResourceInfo(resourceType) {
    const messages = {
        'library': '📚 Library: Open until 10 PM today. Study rooms available for reservation. Quiet floors: 3rd and 4th.',
        'tutoring': '🎓 Tutoring: Drop-in hours from 2-5 PM today. Math and writing support available. Location: Student Success Center.',
        'health': '🏥 Health Center: Open for appointments and walk-ins. Insurance information available. Emergency line: x4911.',
        'counseling': '💬 Counseling: Confidential services available. Schedule an appointment online or call x4920.',
        'career': '💼 Career Center: Resume reviews available today. Mock interviews next week. Internship fair: Oct 25th.',
        'internship': '🌟 Internship Office: Summer internship applications now open. Deadline: March 15th. Info session: Wednesday 3 PM.'
    };
    
    alert(messages[resourceType] || 'Information not available for this resource.');
}


function fetchExternalEvents() {
    const externalEventsDiv = document.getElementById('external-events');
    
    
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
                <h5>External Events</h5>
                <p>📅 Community Tech Talk - November 15, 6:00 PM</p>
                <p>🎨 Art Gallery Opening - November 18, 7:00 PM</p>
                <p>🏀 City Basketball Tournament - November 20, 2:00 PM</p>
                <button id="fetchExternalEvents" class="btn btn-outline-warning">Load More Events</button>
            </div>
        `;
        
        
        document.getElementById('fetchExternalEvents').addEventListener('click', fetchExternalEvents);
    }, 1500);
}


function checkResourceAvailability() {
    const availabilityDiv = document.getElementById('resource-availability');
    
    
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
                <h5>Resource Availability</h5>
                <p>📚 Library: 45% capacity • 12 study rooms available</p>
                <p>🎓 Tutoring Center: 3 tutors available • Wait time: 5 min</p>
                <p>💻 Computer Lab: 8 stations available</p>
                <button id="checkAvailability" class="btn btn-outline-success">Refresh Availability</button>
            </div>
        `;
        
        
        document.getElementById('checkAvailability').addEventListener('click', checkResourceAvailability);
    }, 1500);
}