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
    const popularToolsLeftArrow = document.getElementById('popularToolsLeft');
    const popularToolsRightArrow = document.getElementById('popularToolsRight');

    if (popularToolsCarousel && popularToolsLeftArrow && popularToolsRightArrow) {
        const scrollAmount = 662; // Card width (650px) + gap (12px)

        // Right arrow click
        popularToolsRightArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const currentScroll = popularToolsCarousel.scrollLeft;
            const maxScroll = popularToolsCarousel.scrollWidth - popularToolsCarousel.clientWidth;
                const newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
            popularToolsCarousel.scrollTo({
                    left: newScroll,
                    behavior: 'smooth'
                });
        });

        // Left arrow click
        popularToolsLeftArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const currentScroll = popularToolsCarousel.scrollLeft;
            const newScroll = Math.max(0, currentScroll - scrollAmount);
            popularToolsCarousel.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        });

        // Update arrow visibility based on scroll position
        function updatePopularToolsArrowVisibility() {
            const scrollLeft = popularToolsCarousel.scrollLeft;
            const scrollWidth = popularToolsCarousel.scrollWidth;
            const clientWidth = popularToolsCarousel.clientWidth;
            const maxScroll = Math.max(0, scrollWidth - clientWidth);

            // Hide left arrow when at the very beginning
            if (scrollLeft <= 0.5) {
                popularToolsLeftArrow.style.display = 'none';
            } else {
                popularToolsLeftArrow.style.display = 'flex';
            }

            // Hide right arrow when at the very end
            if (maxScroll <= 0 || scrollLeft >= maxScroll - 0.5) {
                popularToolsRightArrow.style.display = 'none';
            } else {
                popularToolsRightArrow.style.display = 'flex';
            }
        }

        // Set arrows visible by default
        popularToolsLeftArrow.style.display = 'none'; // Hidden initially since at start
        popularToolsRightArrow.style.display = 'flex';

        // Initial check
        setTimeout(function() {
            updatePopularToolsArrowVisibility();
        }, 100);

        // Update on scroll
        popularToolsCarousel.addEventListener('scroll', updatePopularToolsArrowVisibility);

        // Update on window resize
        window.addEventListener('resize', function() {
            setTimeout(updatePopularToolsArrowVisibility, 100);
        });
    }
});

// Budget Calculator Modal Functions
function openBudgetCalculator() {
    const modal = document.getElementById('budgetCalculatorModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        initializeBudgetSliders();
    }
}

function closeBudgetCalculator() {
    const modal = document.getElementById('budgetCalculatorModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('budgetCalculatorModal');
    if (modal && e.target === modal) {
        closeBudgetCalculator();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBudgetCalculator();
    }
});

// Initialize Budget Calculator Sliders
function initializeBudgetSliders() {
    // Savings Slider
    const savingsSlider = document.getElementById('savingsSlider');
    const savingsValue = document.getElementById('savingsValue');
    const savingsWrapper = document.getElementById('hp_savings_range_slider');
    const savingsNode = document.getElementById('hp_savings_max_node');
    
    // EMI Slider
    const emiSlider = document.getElementById('emiSlider');
    const emiValue = document.getElementById('emiValue');
    const emiWrapper = document.getElementById('hp_emi_range_slider');
    const emiNode = document.getElementById('hp_emi_max_node');
    
    // Tenure Slider
    const tenureSlider = document.getElementById('tenureSlider');
    const tenureValue = document.getElementById('tenureValue');
    const tenureWrapper = document.getElementById('hp_loan_tenure_range_slider');
    const tenureNode = document.getElementById('hp_loan_tenure_max_node');
    
    // Initialize sliders
    setupSlider(savingsWrapper, savingsSlider, savingsNode, savingsValue, 2000000, 0, 200000000, formatCurrency, 'savings');
    setupSlider(emiWrapper, emiSlider, emiNode, emiValue, 20000, 1000, 1000000, formatCurrency, 'emi');
    setupSlider(tenureWrapper, tenureSlider, tenureNode, tenureValue, 20, 1, 30, formatYears, 'tenure');
    
    // Calculate initial budget
    calculateBudget();
}

function setupSlider(wrapper, slider, node, valueDisplay, initialValue, min, max, formatter, type) {
    if (!wrapper || !slider || !valueDisplay) return;
    
    const percentage = ((initialValue - min) / (max - min)) * 100;
    slider.style.width = percentage + '%';
    
    let isDragging = false;
    
    function updateSlider(e) {
        if (!isDragging) return;
        
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        const value = min + (percentage / 100) * (max - min);
        const formattedValue = formatter(value);
        valueDisplay.textContent = formattedValue;
        
        slider.style.width = percentage + '%';
        
        // Store value for calculation
        if (type === 'savings') window.budgetSavings = value;
        if (type === 'emi') window.budgetEMI = value;
        if (type === 'tenure') window.budgetTenure = value;
        
        calculateBudget();
    }
    
    wrapper.addEventListener('mousedown', function(e) {
        isDragging = true;
        updateSlider(e);
    });
    
    document.addEventListener('mousemove', updateSlider);
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // Initialize values
    if (type === 'savings') window.budgetSavings = initialValue;
    if (type === 'emi') window.budgetEMI = initialValue;
    if (type === 'tenure') window.budgetTenure = initialValue;
}

function formatCurrency(value) {
    if (value >= 10000000) {
        return '₹ ' + (value / 10000000).toFixed(1) + ' Cr';
    } else if (value >= 100000) {
        return '₹ ' + (value / 100000).toFixed(2) + ' Lacs';
    } else {
        return '₹ ' + Math.round(value).toLocaleString('en-IN');
    }
}

function formatYears(value) {
    return Math.round(value) + ' Years';
}

function calculateBudget() {
    const savings = window.budgetSavings || 2000000;
    const emi = window.budgetEMI || 20000;
    const tenure = window.budgetTenure || 20;
    const interestRate = 0.0875; // 8.75%
    
    // Calculate loan amount from EMI
    const monthlyRate = interestRate / 12;
    const numPayments = tenure * 12;
    const loanAmount = emi * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
    
    // Total budget = savings + loan amount
    const totalBudget = savings + loanAmount;
    
    // Display budget range
    const budgetValue = document.getElementById('homeBudgetValue');
    if (budgetValue) {
        const minBudget = totalBudget * 0.9;
        const maxBudget = totalBudget * 1.1;
        
        if (totalBudget >= 10000000) {
            budgetValue.textContent = Math.round(minBudget / 10000000) + ' - ' + Math.round(maxBudget / 10000000) + ' Cr';
        } else if (totalBudget >= 100000) {
            budgetValue.textContent = Math.round(minBudget / 100000) + ' - ' + Math.round(maxBudget / 100000) + ' lacs';
        } else {
            budgetValue.textContent = formatCurrency(minBudget) + ' - ' + formatCurrency(maxBudget);
        }
    }
}

// Offers Carousel Navigation
function offerSlide(direction) {
    const slider = document.querySelector('.offerWidgetSlider');
    const prevBtn = document.querySelector('.offer_slidePrev');
    const nextBtn = document.querySelector('.offer_slideNext');
    
    if (!slider) return;
    
    const cardWidth = 312; // Card width
    const gap = 20; // Gap between cards
    const scrollAmount = cardWidth + gap;
    
    const currentTransform = slider.style.transform;
    const currentX = currentTransform ? parseInt(currentTransform.match(/-?\d+/)[0]) : 0;
    
    let newX = currentX;
    
    if (direction === 'left') {
        newX = currentX - scrollAmount;
    } else if (direction === 'right') {
        newX = currentX + scrollAmount;
    }
    
    // Calculate max scroll
    const wrapper = slider.parentElement;
    const maxScroll = -(slider.scrollWidth - wrapper.clientWidth);
    newX = Math.max(maxScroll, Math.min(0, newX));
    
    slider.style.transform = `translate(${newX}px, 0px)`;
    
    // Update arrow visibility
    if (prevBtn && nextBtn) {
        if (newX >= 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
        }
        
        if (newX <= maxScroll + 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
        }
    }
}

// Initialize arrow visibility on page load
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.offerWidgetSlider');
    const prevBtn = document.querySelector('.offer_slidePrev');
    const nextBtn = document.querySelector('.offer_slideNext');
    
    if (slider && prevBtn && nextBtn) {
        // Check initial state
        setTimeout(function() {
            const wrapper = slider.parentElement;
            const maxScroll = -(slider.scrollWidth - wrapper.clientWidth);
            
            // Hide left arrow initially (at start)
            prevBtn.style.display = 'none';
            
            // Show right arrow if there's more content to scroll
            if (maxScroll < 0) {
                nextBtn.style.display = 'flex';
            } else {
                nextBtn.style.display = 'none';
            }
        }, 100);
    }
});

// Open project page offer
function openProjectPageOffer(url) {
    if (url) {
        window.open(url, '_blank');
    }
}
