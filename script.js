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
}


function initHomePage() {
    console.log('Initializing home page features');
    
   
}


function initEventsPage() {
    console.log('Initializing events page features');
    
    
}


function initResourcesPage() {
    console.log('Initializing resources page features');
    
    
}


function fetchWeatherData() {
    const weatherInfo = document.getElementById('weather-info');
    
    
    weatherInfo.innerHTML = '<p>Fetching weather data...</p>';
    
    setTimeout(function() {
        
        weatherInfo.innerHTML = `
            <p>Weather API integration placeholder</p>
            <p>Temperature: 72°F | Conditions: Sunny</p>
            <button id="fetchWeather" class="btn btn-outline-info">Refresh Weather</button>
        `;
        
        
        document.getElementById('fetchWeather').addEventListener('click', fetchWeatherData);
    }, 1500);
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
    button.textContent = 'RSVPed!';
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
    button.disabled = true;
    
    
    console.log(`RSVP recorded for: ${eventTitle}`);
}


function showResourceInfo(resourceType) {
    const messages = {
        'library': 'Library: Open until 10 PM today. Study rooms available for reservation.',
        'tutoring': 'Tutoring: Drop-in hours from 2-5 PM today. Math and writing support available.',
        'health': 'Health Center: Open for appointments and walk-ins. Insurance information available.',
        'counseling': 'Counseling: Confidential services available. Schedule an appointment online.',
        'career': 'Career Center: Resume reviews available today. Mock interviews next week.',
        'internship': 'Internship Office: Summer internship applications now open.'
    };
    
    alert(messages[resourceType] || 'Information not available for this resource.');
}


function fetchExternalEvents() {
    const externalEventsDiv = document.getElementById('external-events');
    
    
    externalEventsDiv.innerHTML = '<p>Loading external events...</p>';
    
    setTimeout(function() {
       
        externalEventsDiv.innerHTML = `
            <p>External events API integration placeholder</p>
            <p>Sample external event: Community Tech Talk - November 15</p>
            <button id="fetchExternalEvents" class="btn btn-outline-warning">Load More Events</button>
        `;
        
        
        document.getElementById('fetchExternalEvents').addEventListener('click', fetchExternalEvents);
    }, 1500);
}


function checkResourceAvailability() {
    const availabilityDiv = document.getElementById('resource-availability');
    
    
    availabilityDiv.innerHTML = '<p>Checking resource availability...</p>';
    
    setTimeout(function() {
        
        availabilityDiv.innerHTML = `
            <p>Resource availability API integration placeholder</p>
            <p>Library: 45% capacity | Tutoring Center: 3 tutors available</p>
            <button id="checkAvailability" class="btn btn-outline-success">Refresh Availability</button>
        `;
        
        
        document.getElementById('checkAvailability').addEventListener('click', checkResourceAvailability);
    }, 1500);
}