document.addEventListener('DOMContentLoaded', () => {
    // Track downloads
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.classList.contains('playstore-btn')) {
                e.preventDefault();
                showNotification('Play Store version coming soon!', 'info');
                return;
            }
            
            // Add loading animation
            const originalText = button.innerHTML;
            button.innerHTML = '<div class="loader"></div> Starting download...';
            
            // Simulate download start (you can remove setTimeout in production)
            setTimeout(() => {
                button.innerHTML = originalText;
                
                // Show download started notification
                showNotification('Download started!', 'success');
            }, 1500);
            
            // Track download analytics
            trackDownload(button.getAttribute('href'));
        });
    });
    
    // Download tracking function
    function trackDownload(downloadUrl) {
        console.log(`Download initiated for: ${downloadUrl}`);
        // Add your analytics code here
    }
    
    // Enhanced notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        
        // Add type-specific styling
        if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, var(--error-color), #dc2626)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(135deg, var(--warning-color), #d97706)';
        } else if (type === 'info') {
            notification.style.background = 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))';
        }
        
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
    // Feedback form handling
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = feedbackForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<div class="loader"></div> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(feedbackForm);
                const feedbackData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    timestamp: new Date().toISOString()
                };
                
                // Send feedback via email
                await sendFeedbackEmail(feedbackData);
                
                // Show success message
                showNotification('Thank you! Your feedback has been sent successfully.', 'success');
                
                // Reset form
                feedbackForm.reset();
                
            } catch (error) {
                console.error('Error sending feedback:', error);
                showNotification('Sorry, there was an error sending your feedback. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Email sending function using EmailJS or similar service
    async function sendFeedbackEmail(feedbackData) {
        // Option 1: Using EmailJS (recommended for client-side email sending)
        // You'll need to sign up at https://www.emailjs.com/ and add their script
        
        // Option 2: Using a simple mailto link (fallback)
        const subject = encodeURIComponent(`JAV Feedback: ${feedbackData.subject}`);
        const body = encodeURIComponent(`
Name: ${feedbackData.name}
Email: ${feedbackData.email}
Subject: ${feedbackData.subject}
Message: ${feedbackData.message}
Timestamp: ${feedbackData.timestamp}
        `);
        
        const mailtoLink = `mailto:blimtech01@gmail.com?subject=${subject}&body=${body}`;
        
        // Open default email client
        window.open(mailtoLink);
        
        // For a more professional solution, you would use EmailJS or a backend service
        // Here's how you would implement EmailJS:
        
        /*
        // Uncomment and configure if using EmailJS
        if (typeof emailjs !== 'undefined') {
            const templateParams = {
                to_email: 'blimtech01@gmail.com',
                from_name: feedbackData.name,
                from_email: feedbackData.email,
                subject: feedbackData.subject,
                message: feedbackData.message,
                timestamp: feedbackData.timestamp
            };
            
            return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
        }
        */
    }
    
    // Course request form handling
    const courseRequestForm = document.getElementById('courseRequestForm');
    
    if (courseRequestForm) {
        courseRequestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = courseRequestForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<div class="loader"></div> Submitting...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(courseRequestForm);
                const courseData = {
                    name: formData.get('lecturerName'),
                    email: formData.get('lecturerEmail'),
                    institution: formData.get('institution'),
                    courseName: formData.get('courseName'),
                    courseCode: formData.get('courseCode'),
                    details: formData.get('courseDetails'),
                    timestamp: new Date().toISOString()
                };

                // Validate form fields before sending
                let isValid = true;
                courseRequestForm.querySelectorAll('[required]').forEach(field => {
                    validateField(field);
                    if (field.classList.contains('error')) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    throw new Error('Please fill all required fields.');
                }
                
                // Send feedback via email
                await sendCourseRequestEmail(courseData);
                
                // Show success message
                showNotification('Thank you! Your course request has been submitted.', 'success');
                
                // Reset form
                courseRequestForm.reset();
                // Clear validation errors
                courseRequestForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                courseRequestForm.querySelectorAll('.error-message').forEach(el => el.remove());

            } catch (error) {
                console.error('Error submitting course request:', error);
                showNotification(error.message.includes('required') ? error.message : 'Sorry, there was an error submitting your request. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Email sending function for course requests
    async function sendCourseRequestEmail(courseData) {
        const subject = encodeURIComponent(`New Course Request: ${courseData.courseName}`);
        const body = encodeURIComponent(`
A new course has been requested for JAV.

--- Course Details ---
Course Name: ${courseData.courseName}
Course Code: ${courseData.courseCode || 'N/A'}
Institution: ${courseData.institution}
Reason: ${courseData.details}

--- Requester Details ---
Name: ${courseData.name}
Email: ${courseData.email}
Timestamp: ${courseData.timestamp}
        `);
        
        const mailtoLink = `mailto:blimtech01@gmail.com?subject=${subject}&body=${body}`;
        
        // Open default email client
        window.open(mailtoLink);
        
        // You can also use a service like EmailJS here for a better experience
    }
    
    // Tabbed interface functionality
    const tabs = document.querySelectorAll('.tab-link');
    const panels = document.querySelectorAll('.tab-panel');

    if (tabs.length && panels.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanelId = tab.getAttribute('data-tab');
                
                // Deactivate all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Activate the clicked tab and corresponding panel
                tab.classList.add('active');
                document.getElementById(targetPanelId).classList.add('active');
            });
        });
    }

    // Hamburger menu functionality
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('navigation-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            navMenu.classList.toggle('is-active');
            
            // Toggle body scroll
            if (navMenu.classList.contains('is-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when a link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-active')) {
                    hamburger.classList.remove('is-active');
                    navMenu.classList.remove('is-active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Enhanced download status handling
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadStatus = document.getElementById('downloadStatus');
    
    if (downloadBtn && downloadStatus) {
        downloadBtn.addEventListener('click', function(e) {
            downloadStatus.textContent = 'Downloading...';
            downloadStatus.style.color = 'var(--primary-color)';
            
            setTimeout(() => {
                downloadStatus.textContent = 'Download started!';
                downloadStatus.style.color = 'var(--success-color)';
                setTimeout(() => {
                    downloadStatus.textContent = '';
                }, 3000);
            }, 1000);
        });
    }
    
    // Add smooth scrolling for better UX
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
    
    // Add form validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.type === 'text' && field.name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        } else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
        
        // Apply error styling if invalid
        if (!isValid) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.color = 'var(--error-color)';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorElement);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Add some nice animations on scroll
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
    document.querySelectorAll('.download-card, .contact-section, .feedback-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});