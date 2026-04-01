// Online Pooja Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initializePage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup form handling
    setupFormHandling();
    
    // Setup animations
    setupAnimations();
});

function initializePage() {
    // Add loading animation
    document.body.classList.add('loading');
    
    // Set minimum date for pooja booking to today
    const dateInput = document.getElementById('pooja-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

function setupEventListeners() {
    // Pooja card click handlers
    document.querySelectorAll('.pooja-card').forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Scroll to booking form
            const bookingSection = document.querySelector('.booking-form-section');
            if (bookingSection) {
                bookingSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Pre-fill pooja type in form
            const poojaType = this.querySelector('h3').textContent;
            const poojaTypeSelect = document.getElementById('pooja-type');
            if (poojaTypeSelect) {
                const option = Array.from(poojaTypeSelect.options).find(opt => 
                    opt.textContent.toLowerCase().includes(poojaType.toLowerCase())
                );
                if (option) {
                    poojaTypeSelect.value = option.value;
                }
            }
        });
    });
    
    // Video placeholder click handler
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            showNotification('Live streaming will be available during scheduled pooja times', 'info');
        });
    }
    
    // Book now button handlers
    document.querySelectorAll('.pooja-card .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.pooja-card');
            const poojaType = card.querySelector('h3').textContent;
            const price = card.querySelector('.pooja-price').textContent;
            
            // Scroll to booking form
            const bookingSection = document.querySelector('.booking-form-section');
            if (bookingSection) {
                bookingSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Pre-fill form
            setTimeout(() => {
                const poojaTypeSelect = document.getElementById('pooja-type');
                if (poojaTypeSelect) {
                    const option = Array.from(poojaTypeSelect.options).find(opt => 
                        opt.textContent.toLowerCase().includes(poojaType.toLowerCase())
                    );
                    if (option) {
                        poojaTypeSelect.value = option.value;
                    }
                }
            }, 500);
        });
    });
}

function setupFormHandling() {
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Real-time form validation
    const formInputs = document.querySelectorAll('.booking-form input, .booking-form select, .booking-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Price update based on pooja type
    const poojaTypeSelect = document.getElementById('pooja-type');
    if (poojaTypeSelect) {
        poojaTypeSelect.addEventListener('change', updatePriceDisplay);
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const poojaData = {
        devoteeName: formData.get('devotee-name') || document.getElementById('devotee-name').value,
        email: formData.get('email') || document.getElementById('email').value,
        phone: formData.get('phone') || document.getElementById('phone').value,
        poojaType: formData.get('pooja-type') || document.getElementById('pooja-type').value,
        temple: formData.get('temple') || document.getElementById('temple').value,
        poojaDate: formData.get('pooja-date') || document.getElementById('pooja-date').value,
        poojaTime: formData.get('pooja-time') || document.getElementById('pooja-time').value,
        specialRequests: formData.get('special-requests') || document.getElementById('special-requests').value
    };
    
    // Show loading state
    showLoadingState();
    
    try {
        // Call backend API
        const response = await fetch('http://localhost:5002/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(poojaData)
        });

        const result = await response.json();

        if (result.success) {
            hideLoadingState();
            showSuccessMessage(result.data);
            e.target.reset();
        } else {
            throw new Error(result.message || 'Booking failed');
        }
    } catch (error) {
        console.error('Booking error:', error);
        hideLoadingState();
        showErrorMessage(error.message || 'Failed to book pooja. Please try again.');
    }
}

function validateForm() {
    const requiredFields = [
        'pooja-type',
        'temple',
        'pooja-date',
        'pooja-time',
        'devotee-name',
        'email',
        'phone'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email
    const emailField = document.getElementById('email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    const phoneField = document.getElementById('phone');
    if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific validations
    if (field.type === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #ff4444; font-size: 0.8rem; margin-top: 0.25rem;';
    field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function updatePriceDisplay() {
    const poojaTypeSelect = document.getElementById('pooja-type');
    if (!poojaTypeSelect) return;
    
    const selectedOption = poojaTypeSelect.options[poojaTypeSelect.selectedIndex];
    if (selectedOption && selectedOption.value) {
        const price = selectedOption.textContent.match(/₹(\d+)/);
        if (price) {
            showNotification(`Selected: ${selectedOption.textContent}`, 'info');
        }
    }
}

function showLoadingState() {
    const submitButton = document.querySelector('.booking-form .btn-primary');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
}

function hideLoadingState() {
    const submitButton = document.querySelector('.booking-form .btn-primary');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Book Pooja Now';
    }
}

function showSuccessMessage(bookingData) {
    const message = `
        <div style="text-align: left;">
            <h3 style="color: #8B4513; margin-bottom: 1rem;">Pooja Booking Confirmed! 🙏</h3>
            <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
            <p><strong>Pooja Type:</strong> ${bookingData.poojaType}</p>
            <p><strong>Temple:</strong> ${bookingData.temple}</p>
            <p><strong>Date:</strong> ${bookingData.poojaDate}</p>
            <p><strong>Time:</strong> ${bookingData.poojaTime}</p>
            <p><strong>Devotee:</strong> ${bookingData.devoteeName}</p>
            <p><strong>Amount:</strong> ₹${bookingData.amount}</p>
            <p style="margin-top: 1rem; color: #4CAF50;">
                ✅ Confirmation email sent to ${bookingData.email}
            </p>
            <p style="margin-top: 1rem;">You will receive a live streaming link 30 minutes before your pooja time.</p>
            ${bookingData.previewUrl ? `<p style="font-size: 12px; color: #666;">Email Preview: <a href="${bookingData.previewUrl}" target="_blank">View Email</a></p>` : ''}
        </div>
    `;
    
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    const errorMessage = `
        <div style="text-align: left;">
            <h3 style="color: #f44336; margin-bottom: 1rem;">Booking Failed ❌</h3>
            <p>${message}</p>
            <p style="margin-top: 1rem;">Please try again or contact support if the issue persists.</p>
        </div>
    `;
    
    showNotification(errorMessage, 'error');
}

function setupAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.pooja-card, .step, .testimonial-card, .live-feature');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ff4444;
        box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.1);
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .pooja-card {
        cursor: pointer;
    }
    
    .pooja-card:hover .pooja-icon {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
    
    .step-number {
        transition: transform 0.3s ease;
    }
    
    .step:hover .step-number {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

console.log('Online Pooja page loaded successfully! 🙏');


