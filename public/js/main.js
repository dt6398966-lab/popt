// Main JavaScript for 99acres Clone

// Auto-hide flash messages
document.addEventListener('DOMContentLoaded', function() {
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(function(message) {
        setTimeout(function() {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s';
            setTimeout(function() {
                message.remove();
            }, 500);
        }, 5000);
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#DC3545';
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // Number formatting for price inputs
    const priceInputs = document.querySelectorAll('input[name="price"]');
    priceInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            if (this.value) {
                this.value = parseFloat(this.value).toLocaleString('en-IN');
            }
        });
    });
});

// Image gallery functionality
function changeImage(imageSrc) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
}

// Favorite toggle
function toggleFavorite(propertyId) {
    if (!propertyId) return;
    
    fetch('/properties/favorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ property_id: propertyId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            if (data.error.includes('login')) {
                window.location.href = '/auth/login';
            } else {
                alert(data.error);
            }
            return;
        }

        const btn = document.getElementById('favoriteBtn');
        const text = document.getElementById('favoriteText');
        
        if (btn && text) {
            if (data.favorited) {
                text.textContent = 'Remove from Favorites';
                btn.classList.add('favorited');
                btn.style.backgroundColor = '#DC3545';
            } else {
                text.textContent = 'Add to Favorites';
                btn.classList.remove('favorited');
                btn.style.backgroundColor = '';
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating favorite. Please try again.');
    });
}

// Smooth scroll
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

// Header Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const navItems = document.querySelectorAll('.theader-nav-item');
        const contactIcon = document.querySelector('.theader-contact-icon');
        const userIcon = document.querySelector('.theader-user-icon');
        
        // Close nav dropdowns if clicking outside
        navItems.forEach(item => {
            if (!item.contains(event.target)) {
                const dropdown = item.querySelector('.theader-dropdown-menu');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            }
        });
        
        // Close contact dropdown if clicking outside
        if (contactIcon && !contactIcon.contains(event.target)) {
            const dropdown = contactIcon.querySelector('.theader-popup-contact-list');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
        
        // Close user dropdown if clicking outside
        if (userIcon && !userIcon.contains(event.target)) {
            const dropdown = userIcon.querySelector('.theader-popup-city.theader-login');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
    });

    // Search Tab Switching - 99acres Exact Structure
    const searchTabs = document.querySelectorAll('.tab-child');
    const searchForm = document.querySelector('.inpage-search-form');
    const tabBar = document.querySelector('.tab-bar');
    
    function updateTabBar(activeTab) {
        if (tabBar && activeTab) {
            const rect = activeTab.getBoundingClientRect();
            const containerRect = activeTab.parentElement.getBoundingClientRect();
            tabBar.style.left = (rect.left - containerRect.left) + 'px';
            tabBar.style.width = rect.width + 'px';
        }
    }
    
    // Initialize tab bar position
    const activeTab = document.querySelector('.tab-child.active');
    if (activeTab) {
        updateTabBar(activeTab);
    }
    
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Don't switch if it's post property tab
            if (this.classList.contains('tab-post-property')) {
                window.location.href = '/properties/create';
                return;
            }
            
            // Remove active class from all tabs
            searchTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update tab bar position
            updateTabBar(this);
            
            // Update form action based on tab
            const tabType = this.getAttribute('data-tab');
            if (searchForm) {
                if (tabType === 'rent') {
                    searchForm.action = '/search?transaction_type=Rent';
                } else if (tabType === 'plots') {
                    searchForm.action = '/search?property_type=Plot';
                } else if (tabType === 'commercial') {
                    searchForm.action = '/search?property_type=Commercial';
                } else if (tabType === 'new-launch') {
                    searchForm.action = '/search?availability=New Launch';
                } else if (tabType === 'projects') {
                    searchForm.action = '/search?property_type=Project';
                } else {
                    searchForm.action = '/search?transaction_type=Sale';
                }
            }
        });
    });

    // Image fallback handling
    const contactImg = document.querySelector('.theader-contact-img');
    const contactFallback = document.querySelector('.theader-contact-fallback');
    const userImg = document.querySelector('.theader-user-img');
    const userFallback = document.querySelector('.theader-user-fallback');
    
    if (contactImg) {
        contactImg.addEventListener('error', function() {
            this.style.display = 'none';
            if (contactFallback) contactFallback.style.display = 'block';
        });
    }
    
    if (userImg) {
        userImg.addEventListener('error', function() {
            this.style.display = 'none';
            if (userFallback) userFallback.style.display = 'block';
        });
    }
    
    // Keep dropdowns open on hover (for better UX)
    const navItems = document.querySelectorAll('.theader-nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const dropdown = this.querySelector('.theader-dropdown-menu');
            if (dropdown) {
                dropdown.style.display = 'block';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const dropdown = this.querySelector('.theader-dropdown-menu');
            if (dropdown) {
                // Small delay before hiding
                setTimeout(() => {
                    if (!item.matches(':hover')) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            }
        });
    });
    
    // Contact and User icon hover handlers
    const contactIcon = document.querySelector('.theader-contact-icon');
    const userIcon = document.querySelector('.theader-user-icon');
    
    if (contactIcon) {
        contactIcon.addEventListener('mouseenter', function() {
            const dropdown = this.querySelector('.theader-popup-contact-list');
            if (dropdown) {
                dropdown.style.display = 'block';
            }
        });
        
        contactIcon.addEventListener('mouseleave', function() {
            const dropdown = this.querySelector('.theader-popup-contact-list');
            if (dropdown) {
                setTimeout(() => {
                    if (!contactIcon.matches(':hover')) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            }
        });
    }
    
    if (userIcon) {
        userIcon.addEventListener('mouseenter', function() {
            const dropdown = this.querySelector('.theader-popup-city.theader-login');
            if (dropdown) {
                dropdown.style.display = 'block';
            }
        });
        
        userIcon.addEventListener('mouseleave', function() {
            const dropdown = this.querySelector('.theader-popup-city.theader-login');
            if (dropdown) {
                setTimeout(() => {
                    if (!userIcon.matches(':hover')) {
                        dropdown.style.display = 'none';
                    }
                }, 200);
            }
        });
    }
});

