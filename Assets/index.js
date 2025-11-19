// ================================
// GLOBAL VARIABLES & INITIALIZATION
// ================================
let cart = JSON.parse(localStorage.getItem('bakeryCart')) || [];
let currentImageIndex = 0;
let galleryImages = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAllPages();
    updateCartCount();
});

// ================================
// CORE FUNCTIONS - CART SYSTEM
// ================================
function addToCart(productId, productName, price, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    updateCartCount();
    saveCartToStorage();
    showNotification(`${productName} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToStorage();
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function saveCartToStorage() {
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

// ================================
// CORE FUNCTIONS - NOTIFICATIONS & MODALS
// ================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : '⚠️'}</span>
        <span class="notification-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function setupModalCloseHandlers() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('lightbox') || 
            e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.lightbox.active, .modal.active');
            openModals.forEach(modal => closeModal(modal.id));
        }
    });
}

// ================================
// CORE FUNCTIONS - ANIMATIONS & UTILITIES
// ================================
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.promotion-card, .menu-card, .gallery-item, .baker-card, .mission-item, .faq-item, .upcoming-card, .step-card');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function initializeParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.page-hero');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ================================
// ABOUT PAGE FUNCTIONALITY
// ================================
function initializeAboutPage() {
    if (!document.querySelector('.about-tabs-nav')) return;
    
    // Tab System
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            // Initialize map if location tab is active
            if (tabId === 'location') {
                setTimeout(initializeAboutMap, 100);
            }
        });
    });
    
    // Accordion System
    const accordionButtons = document.querySelectorAll('.accordion-btn');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // Close all accordions
            accordionButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.nextElementSibling.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
                this.classList.add('active');
                this.nextElementSibling.classList.add('active');
            }
        });
    });
    
    // Animate statistics
    animateStatistics();
}

function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
            }
        }, 40);
    });
}

function initializeAboutMap() {
    if (!document.getElementById('about-map')) return;
    
    try {
        const map = L.map('about-map').setView([-23.896, 29.448], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        L.marker([-23.896, 29.448])
            .addTo(map)
            .bindPopup('<b>Klip & Crust Bakery</b><br>123 Bakery Street, Polokwane')
            .openPopup();
    } catch (error) {
        console.log('Map initialization failed:', error);
    }
}

// ================================
// CONTACT PAGE FUNCTIONALITY
// ================================
function initializeContactPage() {
    if (!document.querySelector('.contact-type-selector')) return;
    
    // Contact Tab System
    const contactTabButtons = document.querySelectorAll('.contact-tab-btn');
    const contactForms = document.querySelectorAll('.contact-form');
    
    contactTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            contactTabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show active form
            contactForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === tabId) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Form Validation
    setupFormValidation();
    
    // Rating System
    setupRatingSystem();
    
    // Get Directions Button
    setupDirectionsButton();
    
    // Initialize Contact Map
    initializeContactMap();
}

function setupFormValidation() {
    const forms = document.querySelectorAll('.enquiry-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showSuccessMessage(this);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Special validation for email
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function setupRatingSystem() {
    const ratingStars = document.querySelectorAll('.rating-star');
    
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            const container = this.parentNode;
            
            // Update visual state
            container.querySelectorAll('.rating-star').forEach(s => {
                s.classList.remove('active');
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                }
            });
            
            // Store rating in hidden field or data attribute
            container.setAttribute('data-selected-rating', rating);
        });
    });
}

function setupDirectionsButton() {
    const directionsBtn = document.querySelector('.get-directions-btn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            const address = "123 Bakery Lane, Polokwane, South Africa";
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
    }
}

function initializeContactMap() {
    if (!document.getElementById('contact-map')) return;
    
    try {
        const map = L.map('contact-map').setView([-23.896, 29.448], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        const bakeryIcon = L.divIcon({
            html: '🍞',
            className: 'bakery-marker',
            iconSize: [40, 40]
        });
        
        L.marker([-23.896, 29.448], {icon: bakeryIcon})
            .addTo(map)
            .bindPopup(`
                <div class="map-popup">
                    <h3>Klip & Crust Bakery</h3>
                    <p>123 Bakery Lane, Polokwane</p>
                    <p>Open today until 6:00 PM</p>
                </div>
            `)
            .openPopup();
    } catch (error) {
        console.log('Contact map initialization failed:', error);
    }
}

function showSuccessMessage(form) {
    const successModal = document.querySelector('.form-success-message');
    if (successModal) {
        successModal.style.display = 'block';
        
        // Reset form
        form.reset();
        
        // Reset rating if exists
        const ratingContainer = form.querySelector('.rating-input');
        if (ratingContainer) {
            ratingContainer.querySelectorAll('.rating-star').forEach(star => {
                star.classList.remove('active');
            });
            ratingContainer.removeAttribute('data-selected-rating');
        }
        
        // Close success message
        const closeBtn = successModal.querySelector('.close-success-btn');
        closeBtn.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    } else {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
    }
}

// ================================
// GALLERY PAGE FUNCTIONALITY
// ================================
function initializeGalleryPage() {
    if (!document.querySelector('.gallery-filters')) return;
    
    // Filter System
    setupGalleryFiltering();
    
    // Search Functionality
    setupGallerySearch();
    
    // Lightbox System
    setupLightbox();
    
    // Load More Functionality
    setupLoadMore();
    
    // Custom Order Modal
    setupCustomOrderModal();
}

function setupGalleryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('animate-in'), 100);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function setupGallerySearch() {
    const searchInput = document.querySelector('.search-gallery-input');
    const searchButton = document.querySelector('.search-gallery-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        galleryItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const tags = item.getAttribute('data-tags').toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                item.style.display = 'block';
                setTimeout(() => item.classList.add('animate-in'), 100);
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function setupLightbox() {
    const viewButtons = document.querySelectorAll('.view-image-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxPrice = document.getElementById('lightbox-price');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevButton = document.querySelector('.lightbox-prev');
    const nextButton = document.querySelector('.lightbox-next');
    
    // Collect all gallery images
    galleryImages = Array.from(document.querySelectorAll('.gallery-item'));
    
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const galleryItem = this.closest('.gallery-item');
            openLightbox(galleryItem, index);
        });
    });
    
    function openLightbox(item, index) {
        currentImageIndex = index;
        const imgSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const category = item.querySelector('.category-tag').textContent;
        const priceElement = item.querySelector('.price');
        
        lightboxImg.src = imgSrc;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxCategory.textContent = category;
        lightboxPrice.textContent = priceElement ? priceElement.textContent : '';
        
        lightbox.classList.add('active');
    }
    
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }
        
        openLightbox(galleryImages[currentImageIndex], currentImageIndex);
    }
    
    // Event listeners
    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => closeModal('lightbox'));
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => navigateLightbox(-1));
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => navigateLightbox(1));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'Escape') closeModal('lightbox');
    });
}

function setupLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    const allItems = Array.from(document.querySelectorAll('.gallery-item'));
    let visibleCount = 6; // Initial visible items
    
    function showMoreItems() {
        const itemsToShow = allItems.slice(visibleCount, visibleCount + 3);
        
        itemsToShow.forEach((item, index) => {
            setTimeout(() => {
                item.style.display = 'block';
                item.classList.add('animate-in');
            }, index * 100);
        });
        
        visibleCount += itemsToShow.length;
        
        // Hide button if all items are visible
        if (visibleCount >= allItems.length) {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Initially hide extra items
    allItems.slice(visibleCount).forEach(item => {
        item.style.display = 'none';
    });
    
    loadMoreBtn.addEventListener('click', showMoreItems);
}

function setupCustomOrderModal() {
    const customOrderButtons = document.querySelectorAll('.custom-order-btn');
    const customOrderModal = document.getElementById('custom-order-modal');
    
    customOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const productName = this.closest('.gallery-item').querySelector('h3').textContent;
            
            // Fill product name in modal
            const productInput = customOrderModal.querySelector('#custom-product');
            if (productInput) {
                productInput.value = productName;
            }
            
            openModal('custom-order-modal');
        });
    });
    
    // Custom order form submission
    const customOrderForm = document.querySelector('.custom-order-form');
    if (customOrderForm) {
        customOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showNotification('Custom order request submitted successfully!', 'success');
                closeModal('custom-order-modal');
                this.reset();
            }
        });
    }
}

// ================================
// MENU PAGE FUNCTIONALITY
// ================================
function initializeMenuPage() {
    if (!document.querySelector('.menu-controls')) return;
    
    // Filter System
    setupMenuFiltering();
    
    // Search Functionality
    setupMenuSearch();
    
    // Sort Functionality
    setupMenuSorting();
    
    // Add to Cart Buttons
    setupMenuAddToCart();
    
    // Custom Order Buttons
    setupMenuCustomOrders();
    
    // Allergy Information Toggle
    setupAllergyToggle();
}

function setupMenuFiltering() {
    const filterButtons = document.querySelectorAll('.menu-filters .filter-btn');
    const categorySections = document.querySelectorAll('.menu-category-section');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide categories
            categorySections.forEach(section => {
                if (filter === 'all' || section.getAttribute('data-category') === filter) {
                    section.style.display = 'block';
                    setTimeout(() => section.classList.add('animate-in'), 100);
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

function setupMenuSearch() {
    const searchInput = document.querySelector('.search-menu-input');
    const searchButton = document.querySelector('.search-menu-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        menuCards.forEach(card => {
            const title = card.querySelector('.item-name').textContent.toLowerCase();
            const description = card.querySelector('.item-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.closest('.menu-category-section').style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Hide empty categories
        document.querySelectorAll('.menu-category-section').forEach(section => {
            const visibleCards = section.querySelectorAll('.menu-card[style="display: block"]');
            if (visibleCards.length === 0) {
                section.style.display = 'none';
            }
        });
    }
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('input', performSearch);
    }
}

function setupMenuSorting() {
    const sortSelect = document.querySelector('.sort-menu-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const categorySections = document.querySelectorAll('.menu-category-section');
        
        categorySections.forEach(section => {
            const menuGrid = section.querySelector('.menu-grid');
            const menuCards = Array.from(section.querySelectorAll('.menu-card'));
            
            menuCards.sort((a, b) => {
                switch (sortValue) {
                    case 'price-low':
                        return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                    case 'price-high':
                        return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                    case 'name':
                        return a.querySelector('.item-name').textContent.localeCompare(b.querySelector('.item-name').textContent);
                    case 'popular':
                    default:
                        const aPopular = a.getAttribute('data-popular') === 'true';
                        const bPopular = b.getAttribute('data-popular') === 'true';
                        return bPopular - aPopular;
                }
            });
            
            // Reappend sorted cards
            menuCards.forEach(card => menuGrid.appendChild(card));
        });
    });
}

function setupMenuAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const productName = this.closest('.menu-card').querySelector('.item-name').textContent;
            const priceText = this.closest('.menu-card').querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('R', '').replace('From ', ''));
            
            addToCart(productId, productName, price);
        });
    });
}

function setupMenuCustomOrders() {
    const customOrderButtons = document.querySelectorAll('.custom-order-btn');
    
    customOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const productName = this.closest('.menu-card').querySelector('.item-name').textContent;
            
            openCustomOrderModal(productName, productId);
        });
    });
}

function openCustomOrderModal(productName, productId) {
    const modal = document.getElementById('custom-order-modal');
    const productInput = modal.querySelector('#custom-product');
    
    if (productInput) {
        productInput.value = productName;
    }
    
    // Set minimum date to today
    const dateInput = modal.querySelector('#custom-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    openModal('custom-order-modal');
    
    // Form submission
    const form = modal.querySelector('.custom-order-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            showNotification(`Custom order request for ${productName} submitted! We'll contact you soon.`, 'success');
            closeModal('custom-order-modal');
            this.reset();
        }
    };
}

function setupAllergyToggle() {
    const toggleButton = document.querySelector('.allergy-toggle-btn');
    const allergyDetails = document.querySelector('.allergy-details');
    
    if (toggleButton && allergyDetails) {
        toggleButton.addEventListener('click', function() {
            const isVisible = allergyDetails.style.display !== 'none';
            
            if (isVisible) {
                allergyDetails.style.display = 'none';
                this.textContent = 'View Detailed Allergy Information';
            } else {
                allergyDetails.style.display = 'block';
                this.textContent = 'Hide Allergy Information';
            }
        });
    }
}

// ================================
// PROMOTIONS PAGE FUNCTIONALITY
// ================================
function initializePromotionsPage() {
    if (!document.querySelector('.promotions-filter')) return;
    
    // Filter System
    setupPromotionsFiltering();
    
    // Promotion Modals
    setupPromotionModals();
    
    // Countdown Timers
    setupCountdownTimers();
    
    // Add to Cart for Promotions
    setupPromotionCart();
}

function setupPromotionsFiltering() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const promotionCards = document.querySelectorAll('.promotion-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter promotions
            promotionCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('animate-in'), 100);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function setupPromotionModals() {
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const promotionModal = document.getElementById('promotion-modal');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promotionCard = this.closest('.promotion-card');
            openPromotionModal(promotionCard);
        });
    });
    
    function openPromotionModal(card) {
        const title = card.querySelector('.promotion-title').textContent;
        const description = card.querySelector('.promotion-description').textContent;
        const originalPrice = card.querySelector('.original-price').textContent;
        const promotionPrice = card.querySelector('.promotion-price').textContent;
        const discountBadge = card.querySelector('.discount-badge').textContent;
        const validity = card.querySelector('.validity').textContent;
        const availability = card.querySelector('.availability-tag').textContent;
        
        // Set modal content
        document.getElementById('modal-promotion-title').textContent = title;
        document.getElementById('modal-promotion-description').textContent = description;
        document.getElementById('modal-original-price').textContent = originalPrice;
        document.getElementById('modal-promotion-price').textContent = promotionPrice;
        document.getElementById('modal-discount-badge').textContent = discountBadge;
        document.getElementById('modal-validity').textContent = validity;
        document.getElementById('modal-availability').textContent = availability;
        
        // Set image if available
        const img = card.querySelector('img');
        if (img) {
            document.getElementById('modal-promotion-image').src = img.src;
            document.getElementById('modal-promotion-image').alt = img.alt;
        }
        
        // Set redeem button action
        const redeemBtn = document.getElementById('modal-redeem-btn');
        const addToCartBtn = card.querySelector('.add-to-cart-promo');
        if (addToCartBtn && redeemBtn) {
            redeemBtn.onclick = () => addToCartBtn.click();
        }
        
        openModal('promotion-modal');
    }
}

function setupCountdownTimers() {
    const countdownElements = document.querySelectorAll('.countdown-timer');
    
    countdownElements.forEach(timer => {
        const launchDate = new Date(timer.getAttribute('data-launch')).getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = launchDate - now;
            
            if (distance < 0) {
                timer.innerHTML = '<span class="timer-number">Launched!</span>';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const timerNumber = timer.querySelector('.timer-number');
            
            if (timerNumber) {
                timerNumber.textContent = days;
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 86400000); // Update daily
    });
}

function setupPromotionCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-promo');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promoId = this.getAttribute('data-promo');
            const promotionCard = this.closest('.promotion-card');
            const productName = promotionCard.querySelector('.promotion-title').textContent;
            const priceText = promotionCard.querySelector('.promotion-price').textContent;
            
            let price;
            if (priceText.includes('OFF') || priceText.includes('%')) {
                // For percentage discounts, use a symbolic price or handle differently
                price = 0; // You might want to implement this differently
            } else {
                price = parseFloat(priceText.replace('R', '').replace('From ', ''));
            }
            
            addToCart(promoId, productName, price);
        });
    });
    
    // Contact for bulk orders
    const contactButtons = document.querySelectorAll('.contact-for-bulk');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'contact.html?type=catering';
        });
    });
    
    // Pre-order buttons
    const preOrderButtons = document.querySelectorAll('.pre-order-btn');
    preOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.promotion-card').querySelector('.promotion-title').textContent;
            openCustomOrderModal(productName, 'seasonal-preorder');
        });
    });
}

// ================================
// COMMON PAGE FUNCTIONALITY
// ================================
function initializeCommonFeatures() {
    // Mobile Menu Toggle
    setupMobileMenu();
    
    // Smooth Scrolling for Anchor Links
    setupSmoothScrolling();
    
    // Lazy Loading Images
    setupLazyLoading();
    
    // Current Year in Footer
    updateFooterYear();
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
    
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }
}

function setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function updateFooterYear() {
    const yearElements = document.querySelectorAll('.footer-bottom p');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.innerHTML = element.innerHTML.replace('2025', currentYear);
    });
}

// ================================
// MAIN INITIALIZATION FUNCTION
// ================================
function initializeAllPages() {
    // Initialize common features for all pages
    initializeCommonFeatures();
    
    // Initialize page-specific features
    initializeAboutPage();
    initializeContactPage();
    initializeGalleryPage();
    initializeMenuPage();
    initializePromotionsPage();
    
    // Initialize animations and effects
    animateOnScroll();
    initializeParallax();
    setupModalCloseHandlers();
    
    // Add CSS for animations
    injectAnimationStyles();
}

// ================================
// ANIMATION STYLES INJECTION
// ================================
function injectAnimationStyles() {
    const styles = `
        <style>
            /* Notification Styles */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                border-left: 4px solid #2ecc71;
            }
            
            .notification.error {
                border-left-color: #e74c3c;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-icon {
                font-size: 1.2rem;
            }
            
            /* Animation Classes */
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Map Marker Styles */
            .bakery-marker {
                font-size: 2rem;
                text-align: center;
            }
            
            .map-popup h3 {
                color: #6B4226;
                margin-bottom: 5px;
            }
            
            .map-popup p {
                margin: 2px 0;
                color: #666;
            }
            
            /* Loading States */
            .loading {
                position: relative;
                pointer-events: none;
            }
            
            .loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #D4A373;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Form Error States */
            .error {
                border-color: #e74c3c !important;
            }
            
            .error-message {
                color: #e74c3c;
                font-size: 0.8rem;
                margin-top: 5px;
                display: block;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ================================
// EXPORT FOR MODULAR USE (if needed)
// ================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeFromCart,
        updateCartCount,
        showNotification,
        openModal,
        closeModal
    };
}