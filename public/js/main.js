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

    // Recommended Properties Carousel Navigation
    const recomListWrap = document.querySelector('.npSrpWidget__recomListWrap');
    const rightArrow = document.querySelector('.arrow__rightIcon');
    
    if (recomListWrap && rightArrow) {
        rightArrow.addEventListener('click', function() {
            recomListWrap.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
    }

    // Left arrow (if added later)
    const leftArrow = document.querySelector('.arrow__leftIcon');
    if (recomListWrap && leftArrow) {
        leftArrow.addEventListener('click', function() {
            recomListWrap.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
    }

    // Shortlist heart icon toggle
    const shortlistHearts = document.querySelectorAll('.style__shortlistHeart16');
    shortlistHearts.forEach(function(heart) {
        heart.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#FF6600';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '#FFFFFF';
                }
            }
        });
    });
});

// Scroll Recommended Properties
function scrollRecommendedProperties(direction) {
    const grid = document.querySelector('.recommended-properties-detailed-section .properties-grid');
    if (!grid) {
        console.error('Properties grid not found');
        return;
    }
    
    const scrollAmount = 340; // Card width (320px) + gap (20px)
    const currentScroll = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    
    if (direction === 'left') {
        const newScroll = Math.max(0, currentScroll - scrollAmount);
        grid.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    } else {
        const newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
        grid.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }
}

// Scroll Recommended Projects
function scrollRecommendedProjects(direction) {
    // Find the grid that's closest to the clicked button
    const allGrids = document.querySelectorAll('.npSrpWidget__recomListWrap');
    if (!allGrids || allGrids.length === 0) {
        console.error('Projects grid not found');
        return;
    }
    
    // Use the first grid (for Recommended Projects section)
    const grid = allGrids[0];
    const scrollAmount = 311; // Card width (295px) + gap (16px)
    const currentScroll = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    
    if (direction === 'left') {
        const newScroll = Math.max(0, currentScroll - scrollAmount);
        grid.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    } else {
        const newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
        grid.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }
}

// Initialize project navigation buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find all right arrow buttons for Recommended Projects sections
    const projectRightArrows = document.querySelectorAll('.arrow__rightIcon');
    projectRightArrows.forEach(function(arrow) {
        // Check if this arrow is in a projects section
        const projectsWrapper = arrow.closest('.npSrpWidget__npWidgtCardsWrp');
        if (projectsWrapper) {
            arrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scrollRecommendedProjects('right');
            });
        }
    });
    
    // Also handle the recommended-projects-section specifically
    const recommendedProjectsSection = document.querySelector('.recommended-projects-section');
    if (recommendedProjectsSection) {
        const projectRightArrow = recommendedProjectsSection.querySelector('.arrow__rightIcon');
        if (projectRightArrow) {
            projectRightArrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scrollRecommendedProjects('right');
            });
        }
    }
    
    // Handle Recommended Projects in recommended-properties-section (first section at top)
    const recommendedPropertiesSection = document.querySelector('.recommended-properties-section');
    if (recommendedPropertiesSection) {
        const projectRightArrow = recommendedPropertiesSection.querySelector('.arrow__rightIcon');
        if (projectRightArrow) {
            // Remove any existing listeners to avoid duplicates
            const newArrow = projectRightArrow.cloneNode(true);
            projectRightArrow.parentNode.replaceChild(newArrow, projectRightArrow);
            
            newArrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scrollRecommendedProjects('right');
            });
        }
    }
    
    // Add left arrow for projects if not exists
    const projectsSections = document.querySelectorAll('.npSrpWidget__npWidgtCardsWrp');
    projectsSections.forEach(function(projectsSection) {
        if (!projectsSection.querySelector('.arrow__leftIcon')) {
            const leftArrow = document.createElement('div');
            leftArrow.className = 'arrow__whiteBg arrow__leftIcon';
            leftArrow.style.cssText = 'position: absolute; left: -50px; top: 50%; transform: translateY(-50%); cursor: pointer; background: #FFFFFF; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 10;';
            leftArrow.innerHTML = '<i class="fas fa-chevron-left" style="color: #333333; font-size: 18px;"></i>';
            leftArrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scrollRecommendedProjects('left');
            });
            projectsSection.style.position = 'relative';
            projectsSection.appendChild(leftArrow);
        }
    });
    
    // Ensure Recommended Properties navigation buttons work
    const leftNavBtn = document.querySelector('.recommended-properties-nav .arrow-nav-left');
    const rightNavBtn = document.querySelector('.recommended-properties-nav .arrow-nav-right');
    
    if (leftNavBtn) {
        leftNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            scrollRecommendedProperties('left');
        });
    }
    
    if (rightNavBtn) {
        rightNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            scrollRecommendedProperties('right');
        });
    }
    
    // Property Types Carousel Navigation
    const propertyTypesArrow = document.querySelector('.cc__arrowContainerBox.cc__right');
    if (propertyTypesArrow) {
        propertyTypesArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const slidingBox = document.querySelector('.cc__slidingBox[compattr="recomm_BROWSE_BY_PROP_TYPE"]');
            if (slidingBox) {
                const scrollAmount = 340; // Card width (320px) + gap (20px)
                const currentScroll = slidingBox.scrollLeft;
                const maxScroll = slidingBox.scrollWidth - slidingBox.clientWidth;
                const newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
                slidingBox.scrollTo({
                    left: newScroll,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Projects in High Demand Carousel Navigation
    const projectsHighDemandArrow = document.querySelector('#npSrpWidget .arrow__whiteBg.arrow__rightIcon');
    if (projectsHighDemandArrow) {
        projectsHighDemandArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const recomListWrap = document.querySelector('#npSrpWidget .npSrpWidget__recomListWrap');
            if (recomListWrap) {
                const scrollAmount = 286; // Card width (270px) + gap (16px)
                const currentScroll = recomListWrap.scrollLeft;
                const maxScroll = recomListWrap.scrollWidth - recomListWrap.clientWidth;
                const newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
                recomListWrap.scrollTo({
                    left: newScroll,
                    behavior: 'smooth'
                });
            }
        });
    }
});

