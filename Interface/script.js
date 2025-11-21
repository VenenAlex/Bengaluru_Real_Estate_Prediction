// ==================== Smooth Scroll Navigation ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Navbar Scroll Effect ====================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.7)';
    }
});

// ==================== Load Locations ====================
document.addEventListener('DOMContentLoaded', async function() {
    await loadLocations();
    addParallaxEffect();
    initializeCounterAnimation();
});

// Fetch available locations from API
async function loadLocations() {
    try {
        const response = await fetch('http://localhost:5000/api/locations');
        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        populateLocationDropdown(data.locations);
    } catch (error) {
        console.error('Error loading locations:', error);
        const locationError = document.getElementById('locationError');
        if (locationError) {
            locationError.textContent = 'Could not load locations. Make sure the Flask server is running on http://localhost:5000';
        }
    }
}

// Populate location dropdown with fetched data
function populateLocationDropdown(locations) {
    const locationSelect = document.getElementById('location');
    
    // Clear existing options except the first one
    while (locationSelect.options.length > 1) {
        locationSelect.remove(1);
    }
    
    // Add locations to dropdown (display formatted, store lowercase)
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.toLowerCase();
        option.textContent = formatLocationName(location);
        locationSelect.appendChild(option);
    });
}

// Format location name for display
function formatLocationName(location) {
    return location
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ==================== Form Submission ====================
const predictionForm = document.getElementById('predictionForm');
if (predictionForm) {
    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const location = document.getElementById('location').value;
        const sqft = parseFloat(document.getElementById('sqft').value);
        const bath = parseInt(document.getElementById('bath').value);
        const bhk = parseInt(document.getElementById('bhk').value);

        // Validate inputs
        if (!location || sqft <= 0 || bath <= 0 || bhk <= 0) {
            showNotification('Please fill in all fields with valid positive values', 'error');
            return;
        }

        // Show loading state
        const predictBtn = document.querySelector('.predict-btn');
        const originalText = predictBtn.innerHTML;
        predictBtn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Processing...</span>';
        predictBtn.disabled = true;

        try {
            // Send request to Flask API
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: location,
                    total_sqft: sqft,
                    bath: bath,
                    bhk: bhk
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get prediction');
            }

            const data = await response.json();
            
            // Display result with animation
            displayResult(data.predicted_price, data.location, bhk, data.formatted_price);
            showNotification('Prediction successful! 🎉', 'success');

            // Scroll to result
            setTimeout(() => {
                document.getElementById('result').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error: ' + error.message, 'error');
        } finally {
            // Restore button state
            predictBtn.innerHTML = originalText;
            predictBtn.disabled = false;
        }
    });
}

// Display prediction result
function displayResult(price, location, bhk, formattedPrice) {
    const resultContainer = document.getElementById('result');
    const priceDisplay = document.getElementById('priceDisplay');
    const resultMessage = document.getElementById('resultMessage');

    priceDisplay.textContent = formattedPrice || formatPrice(price);
    resultMessage.textContent = `Estimated price for a ${bhk} BHK property in ${formatLocationName(location)}`;

    resultContainer.style.display = 'block';
    resultContainer.style.animation = 'none';
    setTimeout(() => {
        resultContainer.style.animation = 'slideUp 0.5s ease';
    }, 10);
}

// Format price display
function formatPrice(price) {
    if (price >= 10000) {
        return '₹ ' + (price / 100).toFixed(2) + ' Crore';
    } else if (price >= 1) {
        return '₹ ' + price.toFixed(2) + ' Lakhs';
    } else {
        return '₹ ' + price.toLocaleString('en-IN');
    }
}

// ==================== Notification System ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add CSS for notification
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 15px 20px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
                font-weight: 600;
            }
            
            .notification-error .notification-content {
                background: rgba(255, 107, 107, 0.2);
                border: 2px solid rgba(255, 107, 107, 0.5);
                color: #ff6b6b;
            }
            
            .notification-success .notification-content {
                background: rgba(76, 175, 80, 0.2);
                border: 2px solid rgba(76, 175, 80, 0.5);
                color: #4cb050;
            }
            
            .notification-info .notification-content {
                background: rgba(0, 242, 254, 0.2);
                border: 2px solid rgba(0, 242, 254, 0.5);
                color: #00f2fe;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ==================== Scroll Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.glass-card, .feature-card, .gallery-item, .info-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ==================== Parallax Effect ====================
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrollPosition = window.scrollY;
            hero.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
        
        // Parallax for floating cards
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            const speed = 0.3 + (index * 0.1);
            card.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

// ==================== Counter Animation ====================
function initializeCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        
        const updateCount = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                setTimeout(updateCount, 30);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element comes into view
        const counterObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
        
        counterObserver.observe(counter);
    });
}

// ==================== Form Input Animations ====================
document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ==================== Mouse Move Glow Effect ====================
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
    });
});

// ==================== Active Navigation Link ====================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ==================== Keyboard Shortcuts ====================
document.addEventListener('keydown', function(e) {
    // Press "/" to focus on location select
    if (e.key === '/' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('location')?.focus();
    }
    
    // Press "Enter" in form to submit
    if (e.key === 'Enter' && document.activeElement.closest('.prediction-form')) {
        const btn = document.querySelector('.predict-btn');
        if (btn && !btn.disabled) {
            document.getElementById('predictionForm').dispatchEvent(new Event('submit'));
        }
    }
});

// ==================== Console Message ====================
console.log('%c🏠 Bengaluru Real Estate Price Predictor', 'font-size: 20px; color: #00f2fe; font-weight: bold; text-shadow: 0 0 10px rgba(0, 242, 254, 0.5)');
console.log('%cReady to predict amazing properties!', 'font-size: 14px; color: #4facfe; font-weight: 600');