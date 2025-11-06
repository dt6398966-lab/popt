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
    
    // Handpicked Projects Carousel Navigation
    const featuredProjectsSlider = document.getElementById('featuredProjectsSlider');
    const featuredProjectsPrev = document.querySelector('.featuredProjectsCard__SliderPrev');
    const featuredProjectsNext = document.querySelector('.featuredProjectsCard__SliderNext');
    
    if (featuredProjectsPrev) {
        featuredProjectsPrev.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            slideFeaturedProjects('prev');
        });
    }
    
    if (featuredProjectsNext) {
        featuredProjectsNext.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            slideFeaturedProjects('next');
        });
    }
});

// Handpicked Projects Slider Function
function slideFeaturedProjects(direction) {
    const slider = document.getElementById('featuredProjectsSlider');
    if (!slider) {
        console.error('Featured projects slider not found');
        return;
    }
    
    const scrollAmount = 340; // Card width (320px) + gap (20px)
    const currentScroll = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    
    if (direction === 'prev') {
        const newScroll = Math.max(0, currentScroll - scrollAmount);
        slider.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    } else {
        const newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
        slider.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }
}

// Open Project Page Function
function openProjectPageFp(url) {
    if (url) {
        window.location.href = url;
    }
}

// Recommended Insights Carousel Navigation
document.addEventListener('DOMContentLoaded', function() {
    const recommendedInsightsCarousel = document.querySelector('.carousel__slidingBox[compattr="recommInsights"]');
    const rightArrow = document.querySelector('.recomInsightsContainer__customCarouselBoxCls .carousel__right[data-label="RIGHT_SCROLL"]');
    const leftArrow = document.querySelector('.recomInsightsContainer__customCarouselBoxCls .carousel__left[data-label="LEFT_SCROLL"]');
    
    if (recommendedInsightsCarousel && rightArrow) {
        rightArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const scrollAmount = 220; // Card width (200px) + gap (20px)
            const currentScroll = recommendedInsightsCarousel.scrollLeft;
            const maxScroll = recommendedInsightsCarousel.scrollWidth - recommendedInsightsCarousel.clientWidth;
            const newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
            recommendedInsightsCarousel.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        });
    }
    
    if (recommendedInsightsCarousel && leftArrow) {
        leftArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const scrollAmount = 220; // Card width (200px) + gap (20px)
            const currentScroll = recommendedInsightsCarousel.scrollLeft;
            const newScroll = Math.max(0, currentScroll - scrollAmount);
            recommendedInsightsCarousel.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        });
    }
});

// Inline Banner Carousel Navigation
function carouselSlideInlineBanner(direction) {
    const bannerContainer = document.querySelector('.SingleSlideSwipe__SingleSlideStrem_Inline_Banner');
    const prevIcon = document.getElementById('inline_banner_prev_icon_wrapper');
    const nextIcon = document.getElementById('inline_banner_next_icon_wrapper');
    
    if (!bannerContainer) return;
    
    const cardWidth = 328; // Card width (308px) + gap (20px)
    const currentTransform = bannerContainer.style.transform;
    const currentX = currentTransform ? parseInt(currentTransform.match(/-?\d+/)[0]) : 0;
    
    let newX = currentX;
    
    if (direction === 'next') {
        newX = currentX - cardWidth;
        const maxScroll = -(bannerContainer.scrollWidth - bannerContainer.parentElement.clientWidth);
        newX = Math.max(maxScroll, newX);
    } else if (direction === 'prev') {
        newX = currentX + cardWidth;
        newX = Math.min(0, newX);
    }
    
    bannerContainer.style.transform = `translate3d(${newX}px, 0px, 0px)`;
    
    // Show/hide arrows based on position
    if (prevIcon && nextIcon) {
        if (newX >= 0) {
            prevIcon.style.display = 'none';
        } else {
            prevIcon.style.display = 'flex';
        }
        
        if (newX <= -(bannerContainer.scrollWidth - bannerContainer.parentElement.clientWidth)) {
            nextIcon.style.display = 'none';
        } else {
            nextIcon.style.display = 'flex';
        }
    }
}

// Initialize inline banner arrow visibility
document.addEventListener('DOMContentLoaded', function() {
    const bannerContainer = document.querySelector('.SingleSlideSwipe__SingleSlideStrem_Inline_Banner');
    const prevIcon = document.getElementById('inline_banner_prev_icon_wrapper');
    const nextIcon = document.getElementById('inline_banner_next_icon_wrapper');
    
    if (bannerContainer && prevIcon && nextIcon) {
        const containerWidth = bannerContainer.parentElement.clientWidth;
        const contentWidth = bannerContainer.scrollWidth;
        
        if (contentWidth > containerWidth) {
            nextIcon.style.display = 'flex';
        } else {
            nextIcon.style.display = 'none';
            prevIcon.style.display = 'none';
        }
    }

    // Use Popular Tools Carousel Navigation
    const popularToolsCarousel = document.querySelector('.carousel__slidingBox[compattr="dealercomp1_"]');
    const popularToolsRightArrow = document.querySelector('.ini__caraousel .carousel__right');

    if (popularToolsCarousel && popularToolsRightArrow) {
        popularToolsRightArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const scrollAmount = 662; // Card width (650px) + gap (12px)
            const currentScroll = popularToolsCarousel.scrollLeft;
            const maxScroll = popularToolsCarousel.scrollWidth - popularToolsCarousel.clientWidth;
            const newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
            popularToolsCarousel.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        });
    }
});

