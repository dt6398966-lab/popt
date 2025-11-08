// Area Converter JavaScript

// Conversion factors: "1 square foot = X of this unit"
// To convert FROM this unit TO square feet: divide by this factor
// To convert FROM square feet TO this unit: multiply by this factor
const conversionFactors = {
    "1": 0.000009290313,   // Hectare (1 sq ft = 0.000009290313 hectare)
    "2": 0.000022956841,    // Acre (1 sq ft = 0.000022956841 acre)
    "3": 0.092903039972,    // Square Meter (1 sq ft = 0.092903039972 sq m)
    "4": 0.002295894940,    // Cent (1 sq ft = 0.002295894940 cent)
    "5": 0.111111100300,    // Square Yard (1 sq ft = 0.111111100300 sq yd)
    "6": 0.000036730946,    // Bigha (1 sq ft = 0.000036730946 bigha)
    "7": 0.111112035800,    // Gaj (1 sq ft = 0.111112035800 gaj)
    "8": 0.002295894940,    // Decimal (1 sq ft = 0.002295894940 decimal)
    "9": 0.003673094582,    // Marla (1 sq ft = 0.003673094582 marla)
    "10": 0.000918273646,   // Guntha (1 sq ft = 0.000918273646 guntha)
    "11": 0.000183654729,   // Kanal (1 sq ft = 0.000183654729 kanal)
    "12": 0.000734618916,   // Katha (1 sq ft = 0.000734618916 katha)
    "13": 0.000740740741,   // Biswa (1 sq ft = 0.000740740741 biswa)
    "14": 0.033057851240,   // Square Karam (1 sq ft = 0.033057851240 sq karam)
    "15": 0.000000092903,   // Square Kilometer (1 sq ft = 0.000000092903 sq km)
    "16": 0.000416605560,   // Ground (1 sq ft = 0.000416605560 ground)
    "17": 0.022222222220,   // Chatak (1 sq ft = 0.022222222220 chatak)
    "18": 0.014692378330,   // Dhur (1 sq ft = 0.014692378330 dhur)
    "19": 0.000022956841,   // Killa (1 sq ft = 0.000022956841 killa)
    "20": 0.000000035870,   // Square Mile (1 sq ft = 0.000000035870 sq mi)
    "21": 0.014692378330,   // Lessa (1 sq ft = 0.014692378330 lessa)
    "22": 0.000000918273,   // Murabba (1 sq ft = 0.000000918273 murabba)
    "23": 143.999712000000, // Square Inch (1 sq ft = 143.999712 sq in)
    "24": 0.000367309458,   // Biswa Kacha (1 sq ft = 0.000367309458 biswa kacha)
    "25": 929.030399700000, // Square Centimeter (1 sq ft = 929.030399700000 sq cm)
    "26": 0.000017361111,   // Pura (1 sq ft = 0.000017361111 pura)
    "27": 1,                 // Square Feet (base unit)
    "28": 0.000929031299,   // Ares (1 sq ft = 0.000929031299 ares)
    "29": 0.002295894940,   // Dismil (1 sq ft = 0.002295894940 dismil)
    "30": 0.013888888889,   // Ankanam (1 sq ft = 0.013888888889 ankanam)
    "31": 0.111111111111,   // Gajam (1 sq ft = 0.111111111111 gajam)
    "32": 0.003673094582,   // Perch (1 sq ft = 0.003673094582 perch)
    "33": 0.000462962963    // Nali (1 sq ft = 0.000462962963 nali)
};

// Unit labels
const unitLabels = {
    "1": "Hectare",
    "2": "Acre",
    "3": "Square Meter",
    "4": "Cent",
    "5": "Square Yard",
    "6": "Bigha",
    "7": "Gaj",
    "8": "Decimal",
    "9": "Marla",
    "10": "Guntha",
    "11": "Kanal",
    "12": "Katha",
    "13": "Biswa",
    "14": "Square Karam",
    "15": "Square Kilometer",
    "16": "Ground",
    "17": "Chatak",
    "18": "Dhur",
    "19": "Killa",
    "20": "Square Mile",
    "21": "Lessa",
    "22": "Murabba",
    "23": "Square Inch",
    "24": "Biswa Kacha",
    "25": "Square Centimeter",
    "26": "Pura",
    "27": "Square Feet",
    "28": "Ares",
    "29": "Dismil",
    "30": "Ankanam",
    "31": "Gajam",
    "32": "Perch",
    "33": "Nali"
};

// Short labels for display
const unitShortLabels = {
    "1": "hectare",
    "2": "acre",
    "3": "sq.mt.",
    "4": "cent",
    "5": "sq.yd.",
    "6": "bigha",
    "7": "gaj",
    "8": "decimal",
    "9": "marla",
    "10": "guntha",
    "11": "kanal",
    "12": "katha",
    "13": "biswa",
    "14": "sq.karam",
    "15": "sq.km.",
    "16": "ground",
    "17": "chatak",
    "18": "dhur",
    "19": "killa",
    "20": "sq.mi.",
    "21": "lessa",
    "22": "murabba",
    "23": "sq.in.",
    "24": "biswa kacha",
    "25": "sq.cm.",
    "26": "pura",
    "27": "sq.ft.",
    "28": "ares",
    "29": "dismil",
    "30": "ankanam",
    "31": "gajam",
    "32": "perch",
    "33": "nali"
};

let selectedFromUnit = null;
let selectedToUnit = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeStateDropdown();
    initializeUnitDropdowns();
    setupExchangeButton();
    setupFAQAccordion();
    setupViewMoreLinks();
    setupInputListeners();
});

function initializeStateDropdown() {
    const stateContainer = document.getElementById('budget_container_id');
    const stateInput = document.getElementById('state');
    const stateDropdown = stateContainer?.querySelector('.selectBox__selectList');
    
    if (!stateContainer || !stateInput || !stateDropdown) {
        return;
    }
    
    const stateItems = stateDropdown.querySelectorAll('div');

    // Toggle dropdown on container click
    stateContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        stateDropdown.classList.toggle('selectBox__hide');
    });

    // Handle state selection
    stateItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const stateName = this.querySelector('span')?.textContent.trim() || this.textContent.trim();
            
            // Set the input value
            stateInput.value = stateName;
            stateInput.setAttribute('value', stateName);
            
            // Hide placeholder when value is set
            const placeholder = stateInput.parentElement?.querySelector('.inputField__placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Close dropdown
            stateDropdown.classList.add('selectBox__hide');
            
            // Trigger input event to ensure value is displayed
            stateInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!stateContainer.contains(e.target)) {
            stateDropdown.classList.add('selectBox__hide');
        }
    });
}

function initializeUnitDropdowns() {
    // From Unit Dropdown
    const fromDropdown = document.getElementById('fromUnitDropdown');
    const fromDisplay = fromDropdown?.querySelector('.comp__dropdownDisplay');
    const fromList = document.getElementById('fromUnitList');
    
    // To Unit Dropdown
    const toDropdown = document.getElementById('toUnitDropdown');
    const toDisplay = toDropdown?.querySelector('.comp__dropdownDisplay');
    const toList = document.getElementById('toUnitList');

    // Populate unit lists
    if (fromList && toList) {
        Object.keys(unitLabels).forEach(unitId => {
            const fromItem = document.createElement('div');
            fromItem.textContent = unitLabels[unitId];
            fromItem.dataset.unitId = unitId;
            fromItem.addEventListener('click', function() {
                selectedFromUnit = unitId;
                fromDisplay.querySelector('span').textContent = unitLabels[unitId];
                fromList.classList.add('comp__hide');
                updateConversionEquivalence();
                performConversion();
            });
            fromList.appendChild(fromItem);

            const toItem = document.createElement('div');
            toItem.textContent = unitLabels[unitId];
            toItem.dataset.unitId = unitId;
            toItem.addEventListener('click', function() {
                selectedToUnit = unitId;
                toDisplay.querySelector('span').textContent = unitLabels[unitId];
                toList.classList.add('comp__hide');
                updateConversionEquivalence();
                performConversion();
            });
            toList.appendChild(toItem);
        });
    }

    // Toggle dropdowns
    if (fromDisplay) {
        fromDisplay.addEventListener('click', function(e) {
            e.stopPropagation();
            fromList.classList.toggle('comp__hide');
            if (!toList.classList.contains('comp__hide')) {
                toList.classList.add('comp__hide');
            }
        });
    }

    if (toDisplay) {
        toDisplay.addEventListener('click', function(e) {
            e.stopPropagation();
            toList.classList.toggle('comp__hide');
            if (!fromList.classList.contains('comp__hide')) {
                fromList.classList.add('comp__hide');
            }
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (fromDropdown && !fromDropdown.contains(e.target)) {
            fromList.classList.add('comp__hide');
        }
        if (toDropdown && !toDropdown.contains(e.target)) {
            toList.classList.add('comp__hide');
        }
    });
}

function setupExchangeButton() {
    const exchangeBtn = document.getElementById('exchangeBtn');
    if (exchangeBtn) {
        exchangeBtn.addEventListener('click', function() {
            // Swap units
            const tempUnit = selectedFromUnit;
            selectedFromUnit = selectedToUnit;
            selectedToUnit = tempUnit;

            // Update displays
            const fromDisplay = document.querySelector('#fromUnitDropdown .comp__dropdownDisplay span');
            const toDisplay = document.querySelector('#toUnitDropdown .comp__dropdownDisplay span');
            
            if (selectedFromUnit && fromDisplay) {
                fromDisplay.textContent = unitLabels[selectedFromUnit];
            } else if (fromDisplay) {
                fromDisplay.textContent = 'select unit';
            }

            if (selectedToUnit && toDisplay) {
                toDisplay.textContent = unitLabels[selectedToUnit];
            } else if (toDisplay) {
                toDisplay.textContent = 'select unit';
            }

            // Swap values
            const fromValue = document.getElementById('fromValue');
            const toValue = document.getElementById('toValue');
            const tempValue = fromValue.value;
            fromValue.value = toValue.value;
            toValue.value = tempValue;

            // Perform conversion with swapped values
            updateConversionEquivalence();
            performConversion();
        });
    }
}

function updateConversionEquivalence() {
    const equivalenceDiv = document.getElementById('conversionEquivalence');
    const equivalenceText = equivalenceDiv?.querySelector('.acs__equivalenceText');
    
    if (!equivalenceDiv || !equivalenceText) {
        return;
    }
    
    if (!selectedFromUnit || !selectedToUnit) {
        equivalenceDiv.style.display = 'none';
        return;
    }
    
    // Calculate: 1 unit of "from" = X units of "to"
    // Convert 1 unit of fromUnit to square feet, then to toUnit
    const valueInSquareFeet = 1 / conversionFactors[selectedFromUnit];
    const convertedValue = valueInSquareFeet * conversionFactors[selectedToUnit];
    
    // Format the result
    const formattedValue = formatEquivalenceNumber(convertedValue);
    const fromLabel = unitLabels[selectedFromUnit];
    const toLabel = unitLabels[selectedToUnit];
    
    equivalenceText.textContent = `1 ${fromLabel} = ${formattedValue} ${toLabel}`;
    equivalenceDiv.style.display = 'flex';
}

function formatEquivalenceNumber(num) {
    if (num >= 1000) {
        return num.toFixed(1);
    } else if (num >= 1) {
        return num.toFixed(2);
    } else if (num >= 0.01) {
        return num.toFixed(3);
    } else {
        return num.toExponential(3);
    }
}

function setupInputListeners() {
    const fromValue = document.getElementById('fromValue');
    if (fromValue) {
        fromValue.addEventListener('input', function() {
            performConversion();
        });
    }
}

function performConversion() {
    const fromValue = document.getElementById('fromValue');
    const toValue = document.getElementById('toValue');
    
    if (!fromValue || !toValue || !selectedFromUnit || !selectedToUnit) {
        return;
    }

    const inputValue = parseFloat(fromValue.value);
    
    if (isNaN(inputValue) || inputValue < 0) {
        toValue.value = '';
        return;
    }

    // Convert from source unit to square feet (base unit)
    const valueInSquareFeet = inputValue / conversionFactors[selectedFromUnit];
    
    // Convert from square feet to target unit
    const convertedValue = valueInSquareFeet * conversionFactors[selectedToUnit];
    
    // Format the result
    toValue.value = formatNumber(convertedValue);
}

function formatNumber(num) {
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2) + ' L';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + ' K';
    } else if (num < 0.01) {
        return num.toExponential(4);
    } else {
        return num.toFixed(6).replace(/\.?0+$/, '');
    }
}

function setupFAQAccordion() {
    const accordionItems = document.querySelectorAll('.accordion_content_rent__accord_container');
    
    accordionItems.forEach(item => {
        const head = item.querySelector('.accordion_content_rent__accord_head');
        const inner = item.querySelector('.accordion_content_rent__accord_inner');
        const icon = head.querySelector('i');
        
        if (head && inner) {
            head.addEventListener('click', function() {
                const isOpen = inner.classList.contains('accordion_content_rent__open');
                
                // Close all other items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherInner = otherItem.querySelector('.accordion_content_rent__accord_inner');
                        const otherIcon = otherItem.querySelector('.accordion_content_rent__accord_head i');
                        if (otherInner) {
                            otherInner.classList.remove('accordion_content_rent__open');
                        }
                        if (otherIcon) {
                            otherIcon.className = 'iconS_Common_20 icon_grayAdd';
                        }
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    inner.classList.remove('accordion_content_rent__open');
                    if (icon) {
                        icon.className = 'iconS_Common_20 icon_grayAdd';
                    }
                } else {
                    inner.classList.add('accordion_content_rent__open');
                    if (icon) {
                        icon.className = 'iconS_Common_20 icon_graySub';
                    }
                }
            });
        }
    });
}

function setupViewMoreLinks() {
    const viewMoreLinks = document.querySelectorAll('.lc__viewmore');
    
    viewMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.lc__seoCard');
            const hideSection = card?.querySelector('.lc__hide');
            
            if (hideSection) {
                if (hideSection.style.display === 'none' || !hideSection.style.display) {
                    hideSection.style.display = 'block';
                    this.textContent = 'View Less';
                } else {
                    hideSection.style.display = 'none';
                    this.textContent = 'View 5 More';
                }
            }
        });
    });
}

// Article Carousel Navigation
document.addEventListener('DOMContentLoaded', function() {
    const articleCarouselBox = document.getElementById('articleCarouselBox');
    const articleCarouselLeft = document.getElementById('articleCarouselLeft');
    const articleCarouselRight = document.getElementById('articleCarouselRight');

    if (articleCarouselBox && articleCarouselLeft && articleCarouselRight) {
        const scrollAmount = 320; // Width of one card + gap

        // Right arrow click
        articleCarouselRight.addEventListener('click', function() {
            articleCarouselBox.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Left arrow click
        articleCarouselLeft.addEventListener('click', function() {
            articleCarouselBox.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update arrow visibility based on scroll position
        function updateArrowVisibility() {
            const scrollLeft = articleCarouselBox.scrollLeft;
            const scrollWidth = articleCarouselBox.scrollWidth;
            const clientWidth = articleCarouselBox.clientWidth;

            // Show/hide left arrow
            if (scrollLeft > 0) {
                articleCarouselLeft.style.display = 'flex';
            } else {
                articleCarouselLeft.style.display = 'none';
            }

            // Show/hide right arrow
            if (scrollLeft < scrollWidth - clientWidth - 10) {
                articleCarouselRight.style.display = 'flex';
            } else {
                articleCarouselRight.style.display = 'none';
            }
        }

        // Initial check
        updateArrowVisibility();

        // Update on scroll
        articleCarouselBox.addEventListener('scroll', updateArrowVisibility);

        // Update on window resize
        window.addEventListener('resize', updateArrowVisibility);
    }
});

