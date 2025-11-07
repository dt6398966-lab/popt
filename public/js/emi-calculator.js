// EMI Calculator JavaScript

let emiChart = null;

// Format number with Indian numbering system
function formatIndianCurrency(num) {
    if (isNaN(num)) return '0';
    const numStr = num.toString();
    const parts = numStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] || '';
    
    // Add commas for Indian numbering
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
    if (otherNumbers !== '') {
        integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    
    return integerPart + (decimalPart ? '.' + decimalPart : '');
}

// Convert formatted string to number
function parseFormattedNumber(str) {
    return parseFloat(str.replace(/,/g, '')) || 0;
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
        return numberToWords(lakh) + ' Lakh' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    const crore = Math.floor(num / 10000000);
    const remainder = num % 10000000;
    return numberToWords(crore) + ' Crore' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
}

// Calculate EMI
function calculateEMI(principal, rate, tenure) {
    if (principal <= 0 || rate <= 0 || tenure <= 0) return 0;
    
    const monthlyRate = rate / (12 * 100);
    const numPayments = tenure;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return Math.round(emi);
}

// Calculate total payable and interest
function calculateTotalPayable(emi, tenure) {
    const totalPayable = emi * tenure;
    return totalPayable;
}

// Update chart
function updateChart(principal, interestAmount) {
    const ctx = document.getElementById('emiChart');
    if (!ctx) return;
    
    const totalPayable = principal + interestAmount;
    
    if (emiChart) {
        emiChart.destroy();
    }
    
    emiChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal Amount', 'Interest Amount'],
            datasets: [{
                data: [principal, interestAmount],
                backgroundColor: ['#0e0e43', '#59cfb5'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const percentage = ((value / (principal + interestAmount)) * 100).toFixed(2);
                                    return {
                                        text: `${label} - ₹ ${formatIndianCurrency(value)} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const percentage = ((value / (principal + interestAmount)) * 100).toFixed(2);
                            return `${label}: ₹ ${formatIndianCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update results
function updateResults() {
    const loanAmountStr = document.getElementById('loanAmount').value;
    const tenureStr = document.getElementById('loanTenure').value;
    const rateStr = document.getElementById('rateOfInterest').value;
    
    const loanAmount = parseFormattedNumber(loanAmountStr);
    let tenure = parseFloat(tenureStr) || 0;
    const rate = parseFloat(rateStr) || 0;
    
    // Convert tenure to months if needed
    const tenureUnit = document.getElementById('tenureUnit').textContent.trim();
    if (tenureUnit === 'Years') {
        tenure = tenure * 12;
    }
    
    if (loanAmount <= 0 || rate <= 0 || tenure <= 0) {
        return;
    }
    
    const emi = calculateEMI(loanAmount, rate, tenure);
    const totalPayable = calculateTotalPayable(emi, tenure);
    const interestAmount = totalPayable - loanAmount;
    
    // Update display
    document.getElementById('monthlyEMI').innerHTML = `<b>₹ ${formatIndianCurrency(emi)}</b>`;
    document.getElementById('totalPayable').innerHTML = `<b>₹ ${formatIndianCurrency(totalPayable)}</b>`;
    
    // Update chart
    updateChart(loanAmount, interestAmount);
}

// Format input on input event
function setupInputFormatting() {
    const loanAmountInput = document.getElementById('loanAmount');
    const tenureInput = document.getElementById('loanTenure');
    const rateInput = document.getElementById('rateOfInterest');
    
    // Loan Amount formatting
    loanAmountInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/,/g, '');
        value = value.replace(/[^0-9]/g, '');
        
        if (value) {
            const num = parseFloat(value);
            e.target.value = formatIndianCurrency(num);
            
            // Update display text
            const display = document.getElementById('loanAmountDisplay');
            if (display && num > 0) {
                const words = numberToWords(Math.floor(num / 100000));
                display.textContent = words + (words ? ' Lakhs' : '');
            }
        } else {
            e.target.value = '';
            document.getElementById('loanAmountDisplay').textContent = '';
        }
        
        updateResults();
    });
    
    // Tenure formatting
    tenureInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9.]/g, '');
        e.target.value = value;
        updateResults();
    });
    
    // Rate formatting
    rateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9.]/g, '');
        e.target.value = value;
        updateResults();
    });
}

// Tenure unit dropdown
function setupTenureUnitDropdown() {
    const tenureUnit = document.getElementById('tenureUnit');
    const dropdown = document.getElementById('tenureUnitDropdown');
    
    if (tenureUnit && dropdown) {
        tenureUnit.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('hide1');
        });
        
        document.addEventListener('click', function() {
            if (dropdown) {
                dropdown.classList.add('hide1');
            }
        });
        
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        const items = dropdown.querySelectorAll('.phoneCodeListItem');
        items.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                tenureUnit.textContent = value === 'years' ? 'Years' : 'Months';
                dropdown.classList.add('hide1');
                updateResults();
            });
        });
    }
}

// Accordion functionality
function setupAccordion() {
    const accordionItems = document.querySelectorAll('.__hmAccordion');
    
    accordionItems.forEach(item => {
        const question = item.querySelector('.homeLoan99Ques');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all items
                accordionItems.forEach(accItem => {
                    accItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Read more functionality
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

// View More FAQ functionality
function setupViewMoreFaq() {
    const viewMoreLink = document.getElementById('viewMoreFaq');
    const hiddenFaqs = document.querySelectorAll('.faq-hidden');
    
    if (viewMoreLink && hiddenFaqs.length > 0) {
        viewMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            hiddenFaqs.forEach(function(faq) {
                faq.style.display = 'block';
            });
            viewMoreLink.parentElement.style.display = 'none';
        });
    }
}

// Smooth scroll to section
function setupSmoothScroll() {
    // Handle anchor links with smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#calculateEmi' || href === '#faqs') {
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

document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScroll();
    setupInputFormatting();
    setupTenureUnitDropdown();
    setupAccordion();
    setupReadMore();
    setupViewMoreFaq();
    updateResults();
    
    // Initial calculation
    const loanAmount = parseFormattedNumber(document.getElementById('loanAmount').value);
    const tenureStr = document.getElementById('loanTenure').value;
    let tenure = parseFloat(tenureStr) || 20;
    const rate = parseFloat(document.getElementById('rateOfInterest').value) || 8.9;
    
    const tenureUnit = document.getElementById('tenureUnit').textContent.trim();
    if (tenureUnit === 'Years') {
        tenure = tenure * 12;
    }
    
    const emi = calculateEMI(loanAmount, rate, tenure);
    const totalPayable = calculateTotalPayable(emi, tenure);
    const interestAmount = totalPayable - loanAmount;
    
    updateChart(loanAmount, interestAmount);
});

