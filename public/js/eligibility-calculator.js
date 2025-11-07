// Eligibility Calculator JavaScript

let eligibilityChart = null;

// Format number with Indian currency format
function formatIndianCurrency(num) {
    if (!num) return '0';
    const numStr = num.toString().replace(/,/g, '');
    const numValue = parseFloat(numStr);
    if (isNaN(numValue)) return '0';
    
    const parts = numValue.toFixed(0).split('.');
    const lastThree = parts[0].slice(-3);
    const otherNumbers = parts[0].slice(0, -3);
    if (otherNumbers !== '') {
        parts[0] = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return parts.join('.');
}

// Convert number to words (simplified)
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    if (num < 1000) {
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        return ones[hundred] + ' Hundred' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    if (num < 100000) {
        const thousand = Math.floor(num / 1000);
        const remainder = num % 1000;
        return numberToWords(thousand) + ' Thousand' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    if (num < 10000000) {
        const lakh = Math.floor(num / 100000);
        const remainder = num % 100000;
        return numberToWords(lakh) + ' Lakh' + (lakh > 1 ? 's' : '') + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    const crore = Math.floor(num / 10000000);
    const remainder = num % 10000000;
    return numberToWords(crore) + ' Crore' + (crore > 1 ? 's' : '') + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
}

// Parse formatted number
function parseFormattedNumber(str) {
    if (!str) return 0;
    const cleaned = str.toString().replace(/,/g, '');
    return parseFloat(cleaned) || 0;
}

// Calculate EMI
function calculateEMI(principal, rate, tenure) {
    if (principal <= 0 || rate <= 0 || tenure <= 0) return 0;
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
}

// Calculate eligibility
function calculateEligibility(age, occupation, netIncome, incomeType, existingEmi, rate, tenure) {
    // Convert income to monthly if annual
    let monthlyIncome = netIncome;
    if (incomeType === 'annually') {
        monthlyIncome = netIncome / 12;
    }
    
    // FOIR (Fixed Obligation to Income Ratio) - 99acres uses 66.67% for salaried
    // Based on 99acres calculation: EMI ₹60,000 from available ₹90,000 = 66.67%
    let foir = 0.6667; // Default 66.67% (2/3) for 99acres
    
    // Adjust FOIR based on occupation
    if (occupation === 'salaried') {
        foir = 0.6667; // 66.67% FOIR for salaried (99acres standard - 2/3 of available income)
    } else if (occupation === 'self-employed' || occupation === 'business') {
        foir = 0.50; // 50% FOIR for self-employed
    }
    
    // Calculate available income after existing EMI
    const availableIncome = Math.max(0, monthlyIncome - existingEmi);
    
    // Calculate maximum EMI that can be paid
    // 99acres uses: Max EMI = Available Income × FOIR
    const maxEMI = availableIncome * foir;
    
    // Calculate loan amount based on EMI, rate, and tenure
    if (maxEMI <= 0 || rate <= 0 || tenure <= 0) return { loanAmount: 0, emi: 0, totalPayable: 0 };
    
    const monthlyRate = rate / (12 * 100);
    const loanAmount = (maxEMI * (Math.pow(1 + monthlyRate, tenure) - 1)) / 
                       (monthlyRate * Math.pow(1 + monthlyRate, tenure));
    
    // Age-based multiplier (99acres uses higher multipliers)
    // Typically: 60-80 times monthly income based on age
    let ageMultiplier = age < 30 ? 80 : age < 40 ? 70 : age < 50 ? 60 : 50;
    
    // Age-based maximum loan calculation
    const maxLoanByAge = monthlyIncome * ageMultiplier;
    
    // 99acres typically uses the EMI-based calculation as primary
    // Age multiplier is used as a cap, but EMI-based is usually the limiting factor
    // For 99acres, we prioritize EMI-based calculation
    const finalLoanAmount = Math.min(loanAmount, maxLoanByAge);
    
    // Calculate actual EMI and total payable
    const actualEMI = calculateEMI(finalLoanAmount, rate, tenure);
    const totalPayable = actualEMI * tenure;
    
    return {
        loanAmount: Math.round(finalLoanAmount),
        emi: actualEMI,
        totalPayable: Math.round(totalPayable)
    };
}

// Update chart
function updateEligibilityChart(loanAmount, tenure, emi) {
    const ctx = document.getElementById('eligibilityChart');
    if (!ctx) return;
    
    if (eligibilityChart) {
        eligibilityChart.destroy();
    }
    
    // Show chart container only when explicitly called (after Calculate button click)
    const chartContainer = document.getElementById('eligibilityChartContainer');
    if (chartContainer) {
        chartContainer.style.display = 'block';
    }
    
    // Show results wrapper
    const resultsWrapper = document.querySelector('.resultsWrapper');
    if (resultsWrapper) {
        resultsWrapper.style.display = 'block';
    }
    
    // Generate data points for the stacked area chart
    const labels = [];
    const principalData = []; // Remaining principal
    const interestData = []; // Remaining interest
    
    const monthlyRate = parseFloat(document.getElementById('rateOfInterest').value) / (12 * 100);
    const tenureYears = Math.round(tenure / 12);
    const totalPayable = emi * tenure;
    const totalInterest = totalPayable - loanAmount;
    
    // Generate data for each year
    for (let year = 0; year <= tenureYears; year++) {
        labels.push(year);
        
        if (year === 0) {
            // At year 0: full principal and full interest
            principalData.push(loanAmount);
            interestData.push(totalInterest);
        } else if (year >= tenureYears) {
            // At final year: both should be 0
            principalData.push(0);
            interestData.push(0);
        } else {
            const months = year * 12;
            // Calculate remaining principal after 'months' months using amortization formula
            const remainingPrincipal = loanAmount * (Math.pow(1 + monthlyRate, tenure) - Math.pow(1 + monthlyRate, months)) / 
                            (Math.pow(1 + monthlyRate, tenure) - 1);
            
            // Calculate interest paid so far
            const paidPrincipal = loanAmount - remainingPrincipal;
            const interestPaid = (emi * months) - paidPrincipal;
            
            // Remaining interest = total interest - interest paid
            const remainingInterest = Math.max(0, totalInterest - interestPaid);
            
            principalData.push(Math.max(0, remainingPrincipal));
            interestData.push(Math.max(0, remainingInterest));
        }
    }
    
    // For stacked area chart, interest needs to be positioned on top of principal
    // So we calculate the stacked values: interestStacked = principal + interest
    const interestStacked = interestData.map((interest, i) => principalData[i] + interest);
    
    // Calculate max value for Y-axis
    const maxValue = Math.max(...interestStacked) * 1.1;
    const stepSize = Math.ceil(maxValue / 8 / 100000) * 100000; // Round to nearest lakh
    
    eligibilityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Principal Amount',
                    data: principalData,
                    borderColor: '#0e0e43',
                    backgroundColor: 'rgba(14, 14, 67, 0.8)',
                    fill: true, // Fill to the axis (bottom)
                    tension: 0.4,
                    order: 2
                },
                {
                    label: 'Interest Amount',
                    data: interestStacked, // Stacked on top of principal
                    borderColor: '#59cfb5',
                    backgroundColor: 'rgba(89, 207, 181, 0.8)',
                    fill: '-1', // Fill to the previous dataset (principal)
                    tension: 0.4,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxValue,
                    ticks: {
                        callback: function(value) {
                            return (value / 100000).toFixed(0) + ' L';
                        },
                        stepSize: stepSize
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time (in years)',
                        color: '#999',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        stepSize: Math.max(1, Math.floor(tenureYears / 4))
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                },
                line: {
                    borderWidth: 0
                }
            }
        }
    });
}

// Update results
function updateEligibilityResults() {
    // Check if two borrowers are selected
    const toggleBtn = document.getElementById('container');
    const isTwoBorrowers = toggleBtn && toggleBtn.classList.contains('active');
    
    // Primary Borrower data
    const age = parseFloat(document.getElementById('yourAge').value) || 35;
    let occupation = document.getElementById('occupationUnit').textContent.trim().toLowerCase();
    // Normalize occupation values
    if (occupation === 'self employed') {
        occupation = 'self-employed';
    }
    const netIncomeStr = document.getElementById('netIncome').value;
    let netIncome = parseFormattedNumber(netIncomeStr);
    const incomeType = document.getElementById('incomeUnit').textContent.trim().toLowerCase();
    const existingEmiStr = document.getElementById('existingEmi').value;
    let existingEmi = parseFormattedNumber(existingEmiStr);
    
    // Co-Borrower data (if two borrowers)
    if (isTwoBorrowers) {
        const coBorrowerNetIncomeStr = document.getElementById('coBorrowerNetIncome').value || '0';
        const coBorrowerNetIncome = parseFormattedNumber(coBorrowerNetIncomeStr);
        const coBorrowerIncomeType = document.getElementById('coBorrowerIncomeUnit').textContent.trim().toLowerCase();
        
        // Convert co-borrower income to monthly if annual
        let coBorrowerMonthlyIncome = coBorrowerNetIncome;
        if (coBorrowerIncomeType === 'annually') {
            coBorrowerMonthlyIncome = coBorrowerNetIncome / 12;
        }
        
        // Convert primary income to monthly if annual
        let primaryMonthlyIncome = netIncome;
        if (incomeType === 'annually') {
            primaryMonthlyIncome = netIncome / 12;
        }
        
        // Combine incomes and EMIs for two borrowers
        netIncome = primaryMonthlyIncome + coBorrowerMonthlyIncome;
        
        const coBorrowerExistingEmiStr = document.getElementById('coBorrowerExistingEmi').value || '0';
        const coBorrowerExistingEmi = parseFormattedNumber(coBorrowerExistingEmiStr);
        existingEmi = existingEmi + coBorrowerExistingEmi;
    } else {
        // Convert primary income to monthly if annual (single borrower)
        if (incomeType === 'annually') {
            netIncome = netIncome / 12;
        }
    }
    
    // Rate and Tenure (common for both)
    const rate = parseFloat(document.getElementById('rateOfInterest').value) || 8.9;
    const tenureStr = document.getElementById('loanTenure').value;
    let tenure = parseFloat(tenureStr) || 20;
    
    const tenureUnit = document.getElementById('tenureUnit').textContent.trim();
    if (tenureUnit === 'Years') {
        tenure = tenure * 12;
    }
    
    // For two borrowers, use the more conservative FOIR (typically use the lower of the two)
    // But since we're combining incomes, we can use a slightly higher FOIR
    // Use primary borrower's occupation for FOIR calculation
    const result = calculateEligibility(age, occupation, netIncome, 'monthly', existingEmi, rate, tenure);
    
    // Update display
    document.getElementById('borrowAmount').textContent = '₹ ' + formatIndianCurrency(result.loanAmount);
    document.getElementById('payableAmount').textContent = '₹ ' + formatIndianCurrency(result.totalPayable);
    document.getElementById('monthlyEMI').innerHTML = '<b>₹ ' + formatIndianCurrency(result.emi) + '</b>';
    
    // Update chart
    updateEligibilityChart(result.loanAmount, tenure, result.emi);
}

// Toggle switch functionality
function setupToggleSwitch() {
    const toggleBtn = document.getElementById('container');
    const switchElement = document.getElementById('switch');
    const coBorrowerTitle = document.getElementById('coBorrowerTitle');
    const coBorrowerSpacer = document.getElementById('coBorrowerSpacer');
    const coBorrowerFields = document.getElementById('coBorrowerFields');
    
    if (toggleBtn && switchElement) {
        toggleBtn.addEventListener('click', function() {
            // Toggle between 'off' and 'active' states
            if (toggleBtn.classList.contains('off')) {
                toggleBtn.classList.remove('off');
                toggleBtn.classList.add('active');
            } else {
                toggleBtn.classList.remove('active');
                toggleBtn.classList.add('off');
            }
            
            // Show/hide Co-Borrower section
            const isTwoBorrowers = toggleBtn.classList.contains('active');
            if (isTwoBorrowers) {
                // Show Co-Borrower section
                if (coBorrowerTitle) coBorrowerTitle.style.display = 'block';
                if (coBorrowerSpacer) coBorrowerSpacer.style.display = 'block';
                if (coBorrowerFields) coBorrowerFields.style.display = 'flex';
            } else {
                // Hide Co-Borrower section
                if (coBorrowerTitle) coBorrowerTitle.style.display = 'none';
                if (coBorrowerSpacer) coBorrowerSpacer.style.display = 'none';
                if (coBorrowerFields) coBorrowerFields.style.display = 'none';
            }
            
            // Don't auto-calculate, wait for Calculate button click
        });
    }
}

// Setup dropdowns
function setupDropdowns() {
    // Occupation dropdown
    const occupationUnit = document.getElementById('occupationUnit');
    const occupationDropdown = document.getElementById('occupationDropdown');
    
    if (occupationUnit && occupationDropdown) {
        occupationUnit.addEventListener('click', function(e) {
            e.stopPropagation();
            occupationDropdown.classList.toggle('hide1');
        });
        
        const occupationItems = occupationDropdown.querySelectorAll('.phoneCodeListItem');
        occupationItems.forEach(item => {
            item.addEventListener('click', function() {
                occupationUnit.textContent = this.textContent.trim();
                occupationDropdown.classList.add('hide1');
                // Don't auto-calculate, wait for Calculate button click
            });
        });
        
        document.addEventListener('click', function() {
            occupationDropdown.classList.add('hide1');
        });
    }
    
    // Income unit dropdown
    const incomeUnit = document.getElementById('incomeUnit');
    const incomeUnitDropdown = document.getElementById('incomeUnitDropdown');
    
    if (incomeUnit && incomeUnitDropdown) {
        incomeUnit.addEventListener('click', function(e) {
            e.stopPropagation();
            incomeUnitDropdown.classList.toggle('hide1');
        });
        
        const incomeItems = incomeUnitDropdown.querySelectorAll('.phoneCodeListItem');
        incomeItems.forEach(item => {
            item.addEventListener('click', function() {
                incomeUnit.textContent = this.textContent.trim();
                incomeUnitDropdown.classList.add('hide1');
                // Don't auto-calculate, wait for Calculate button click
            });
        });
        
        document.addEventListener('click', function() {
            incomeUnitDropdown.classList.add('hide1');
        });
    }
    
    // Tenure unit dropdown
    const tenureUnit = document.getElementById('tenureUnit');
    const tenureUnitDropdown = document.getElementById('tenureUnitDropdown');
    
    if (tenureUnit && tenureUnitDropdown) {
        tenureUnit.addEventListener('click', function(e) {
            e.stopPropagation();
            tenureUnitDropdown.classList.toggle('hide1');
        });
        
        const tenureItems = tenureUnitDropdown.querySelectorAll('.phoneCodeListItem');
        tenureItems.forEach(item => {
            item.addEventListener('click', function() {
                tenureUnit.textContent = this.textContent.trim();
                tenureUnitDropdown.classList.add('hide1');
                // Don't auto-calculate, wait for Calculate button click
            });
        });
        
        document.addEventListener('click', function() {
            tenureUnitDropdown.classList.add('hide1');
        });
    }
}

// Setup input formatting
function setupInputFormatting() {
    const netIncomeInput = document.getElementById('netIncome');
    const existingEmiInput = document.getElementById('existingEmi');
    
    if (netIncomeInput) {
        netIncomeInput.addEventListener('input', function() {
            let value = this.value.replace(/,/g, '');
            if (value) {
                value = formatIndianCurrency(value);
                this.value = value;
                
                // Update text display
                const numValue = parseFormattedNumber(value);
                const display = document.getElementById('netIncomeDisplay');
                if (display) {
                    display.textContent = numberToWords(numValue) + ' ';
                }
            }
            // Don't auto-calculate, wait for Calculate button click
        });
    }
    
    if (existingEmiInput) {
        existingEmiInput.addEventListener('input', function() {
            let value = this.value.replace(/,/g, '');
            if (value) {
                value = formatIndianCurrency(value);
                this.value = value;
                
                // Update text display
                const numValue = parseFormattedNumber(value);
                const display = document.getElementById('existingEmiDisplay');
                if (display) {
                    display.textContent = numberToWords(numValue) + ' ';
                }
            }
            // Don't auto-calculate, wait for Calculate button click
        });
    }
    
    // Remove auto-calculation from other inputs - only calculate on button click
    // const otherInputs = ['yourAge', 'rateOfInterest', 'loanTenure'];
    // otherInputs.forEach(inputId => {
    //     const input = document.getElementById(inputId);
    //     if (input) {
    //         input.addEventListener('input', function() {
    //             updateEligibilityResults();
    //         });
    //         
    //         input.addEventListener('blur', function() {
    //             updateEligibilityResults();
    //         });
    //     }
    // });
}

// Setup accordion
function setupAccordion() {
    const accordions = document.querySelectorAll('.__hmAccordion');
    
    accordions.forEach(accordion => {
        const question = accordion.querySelector('.homeLoan99Ques');
        if (question) {
            question.addEventListener('click', function() {
                accordion.classList.toggle('active');
            });
        }
    });
}

// Setup read more
function setupReadMore() {
    const readMoreBtn = document.getElementById('readMoreBtn');
    const readMoreContent = document.getElementById('readMoreContent');
    
    if (readMoreBtn && readMoreContent) {
        readMoreBtn.addEventListener('click', function() {
            readMoreContent.classList.remove('hide');
            readMoreBtn.parentElement.style.display = 'none';
        });
    }
}

// Calculate button
function setupCalculateButton() {
    const calculateBtn = document.getElementById('calculateEligibility');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Calculate and update results - this will also show the chart
            updateEligibilityResults();
        });
    }
}

// Smooth scroll to section
function setupSmoothScroll() {
    // Handle anchor links with smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#checkEligibility' || href === '#faqs') {
                e.preventDefault();
                const targetId = href.substring(1); // Remove the #
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate offset for fixed header (if any)
                    const headerOffset = 100; // Adjust based on your header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Show chart and results on page load with default data
    const chartContainer = document.getElementById('eligibilityChartContainer');
    const resultsWrapper = document.querySelector('.resultsWrapper');
    if (chartContainer) {
        chartContainer.style.display = 'block';
    }
    if (resultsWrapper) {
        resultsWrapper.style.display = 'block';
    }
    
    setupToggleSwitch();
    setupDropdowns();
    setupInputFormatting();
    setupAccordion();
    setupReadMore();
    setupCalculateButton();
    setupSmoothScroll();
    
    // Initialize text displays
    const netIncomeValue = parseFormattedNumber(document.getElementById('netIncome').value);
    const existingEmiValue = parseFormattedNumber(document.getElementById('existingEmi').value);
    
    const netIncomeDisplay = document.getElementById('netIncomeDisplay');
    if (netIncomeDisplay) {
        netIncomeDisplay.textContent = numberToWords(netIncomeValue) + ' ';
    }
    
    const existingEmiDisplay = document.getElementById('existingEmiDisplay');
    if (existingEmiDisplay) {
        existingEmiDisplay.textContent = numberToWords(existingEmiValue) + ' ';
    }
    
    // Calculate and show chart with default values on page load
    updateEligibilityResults();
});

