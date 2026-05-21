document.addEventListener('DOMContentLoaded', () => {
    // === Robust JSON Parser Helper ===
    const robustJsonParse = (text, fallback = []) => {
        if (!text) return fallback;
        try {
            return JSON.parse(text);
        } catch (e) {
            console.warn("Initial JSON parse failed, attempting auto-repair...", e);
            try {
                // Repair missing commas between adjacent objects/arrays
                let repaired = text
                    .replace(/\}\s*\{/g, '},{')
                    .replace(/\]\s*\[/g, '],[')
                    .replace(/\}\s*\[/g, '},[')
                    .replace(/\]\s*\{/g, '],{');
                
                // Repair trailing commas before closing brackets/braces
                repaired = repaired.replace(/,\s*(?=[\]\}])/g, '');
                
                return JSON.parse(repaired);
            } catch (err2) {
                console.error("Auto-repair failed, returning fallback:", err2);
                return fallback;
            }
        }
    };

    // === Robust JSON Parser with Comments Helper ===
    const parseJsonWithComments = (text) => {
        if (!text) return null;
        try {
            // First, strip block comments: /* ... */
            let cleaned = text.replace(/\/\*[\s\S]*?\*\//g, '');
            
            // Strip single-line comments: // ...
            // Be careful to not strip // inside double quotes (like in URLs)
            const lines = cleaned.split('\n');
            const cleanedLines = lines.map(line => {
                let inQuotes = false;
                let escape = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"' && !escape) {
                        inQuotes = !inQuotes;
                    }
                    if (char === '\\' && !escape) {
                        escape = true;
                    } else {
                        escape = false;
                    }
                    // If we find // outside quotes, this is the start of a comment
                    if (!inQuotes && char === '/' && line[i + 1] === '/') {
                        return line.substring(0, i);
                    }
                }
                return line;
            });
            cleaned = cleanedLines.join('\n');

            // Clean up syntax errors that might arise from commenting out lines
            // Remove trailing commas before closing braces/brackets
            cleaned = cleaned.replace(/,\s*(?=[\]\}])/g, '');
            // Remove leading commas after opening braces/brackets
            cleaned = cleaned.replace(/(?:\{|\[)\s*,/g, (match) => match[0]);
            // Remove double commas
            cleaned = cleaned.replace(/,\s*,/g, ',');
            
            return JSON.parse(cleaned);
        } catch (e) {
            console.warn("Failed to parse JSON with comments:", e);
            return null;
        }
    };

    // === State ===
    let products = [];
    let cart = JSON.parse(localStorage.getItem('zaland_cart')) || [];
    let currentCategory = 'All';
    let activeDetailProduct = null;
    let siteConfig = {
        navbarOffer: "✨ Special Eidi Offer: Get 10% OFF on all premium items! ✨",
        popupTitle: "Special Eidi Offer",
        popupText: "Celebrate the season with elegance. Get 10% OFF your entire order!",
        showPopup: true,
        popupDelay: 1500
    };
    const WHATSAPP_NUMBER = '923329260721';

    // === DOM Elements ===
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const productGrid = document.getElementById('product-grid');
    const cartOpenBtn = document.getElementById('cart-open-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const cartTotalEl = document.getElementById('cart-total');
    const whatsappCheckoutBtn = document.getElementById('whatsapp-checkout-btn');
    const popupCloseBtn = document.getElementById('popup-close-btn');
    const popupClaimBtn = document.getElementById('popup-claim-btn');
    const toast = document.getElementById('toast');
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Search Drawer DOM Elements
    const searchOpenBtn = document.getElementById('search-open-btn');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchDrawer = document.getElementById('search-drawer');
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const searchResults = document.getElementById('search-results');
    const resultsCount = document.getElementById('results-count');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');

    // Product Detail Modal DOM Elements
    const productDetailModalOverlay = document.getElementById('product-detail-modal-overlay');
    const productDetailModal = document.getElementById('product-detail-modal');
    const detailModalCloseBtn = document.getElementById('detail-modal-close-btn');
    const detailMainImg = document.getElementById('detail-main-img');
    const detailThumbSlider = document.getElementById('detail-thumb-slider');
    const detailProductCat = document.getElementById('detail-product-cat');
    const detailProductTitle = document.getElementById('detail-product-title');
    const detailProductPriceWrap = document.getElementById('detail-product-price-wrap');
    const detailProductDesc = document.getElementById('detail-product-desc');
    const detailSizeGroup = document.getElementById('detail-size-group');
    const detailAddToCartBtn = document.getElementById('detail-add-to-cart-btn');
    const detailWhatsappBtn = document.getElementById('detail-whatsapp-btn');

    // === Event Listeners ===

    // Scroll Navbar
    window.addEventListener('scroll', () => {
        const threshold = document.body.classList.contains('no-announcement') ? 0 : 38;
        if (window.scrollY > threshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        mobileMenuDrawer.classList.add('active');
    });

    const closeMobileMenu = () => {
        mobileMenuOverlay.classList.remove('active');
        mobileMenuDrawer.classList.remove('active');
    };

    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cart Drawer
    cartOpenBtn.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
        renderCart();
    });

    const closeCart = () => {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
    };

    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Search Drawer Toggles
    if (searchOpenBtn) {
        searchOpenBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchDrawer.classList.add('active');
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            if (searchClearBtn) searchClearBtn.style.display = 'none';
            if (resultsCount) resultsCount.style.display = 'none';
            if (searchResults) searchResults.innerHTML = '';
        });
    }

    const closeSearch = () => {
        if (searchOverlay) searchOverlay.classList.remove('active');
        if (searchDrawer) searchDrawer.classList.remove('active');
    };

    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
    if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

    // Perform Search logic
    const performSearch = (query) => {
        if (!searchResults || !resultsCount) return;
        
        const filtered = products.filter(p => {
            if (p.hidden) return false;
            const title = (p.title || '').toLowerCase();
            const category = (p.category || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            return title.includes(query) || category.includes(query) || desc.includes(query);
        });

        resultsCount.textContent = `${filtered.length} product${filtered.length === 1 ? '' : 's'} found`;
        resultsCount.style.display = 'block';
        searchResults.innerHTML = '';

        if (filtered.length === 0) {
            searchResults.innerHTML = `
                <div class="search-empty-state" style="grid-column: 1/-1;">
                    <div class="search-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-slash">
                            <line x1="22" y1="2" x2="2" y2="22"/>
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.3-4.3"/>
                        </svg>
                    </div>
                    <h3 class="search-empty-title">No Matches Found</h3>
                    <p class="search-empty-text">We couldn't find any products matching "${query.replace(/"/g, '&quot;')}". Try adjusting your keywords.</p>
                </div>
            `;
            return;
        }

        filtered.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = `${index * 0.02}s`;
            
            let badgeHtml = '';
            let priceHtml = '';
            
            if (product.onSale) {
                badgeHtml = `<div class="sale-badge">${product.discountPercentage}% OFF</div>`;
                priceHtml = `
                    <p class="product-price-original"><del>PKR ${product.originalPrice.toLocaleString()}</del></p>
                    <p class="product-price sale">PKR ${product.price.toLocaleString()}</p>
                `;
            } else {
                priceHtml = `<p class="product-price">PKR ${product.price.toLocaleString()}</p>`;
            }

            card.innerHTML = `
                <div class="product-image-wrap">
                    ${badgeHtml}
                    <img src="${product.image}" loading="lazy" alt="${product.title}">
                    <div class="add-to-cart-action">
                        <button class="btn-add" data-id="${product.id}">Add To Cart</button>
                    </div>
                </div>
                <div class="product-info">
                    <p class="product-cat">${product.category}</p>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price-wrap">
                        ${priceHtml}
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                closeSearch();
                openDetailModal(product.id);
            });
            
            const addBtn = card.querySelector('.btn-add');
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                });
            }

            searchResults.appendChild(card);
        });
    };

    // Typing in Search
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length > 0) {
                if (searchClearBtn) searchClearBtn.style.display = 'block';
                performSearch(query);
            } else {
                if (searchClearBtn) searchClearBtn.style.display = 'none';
                if (resultsCount) resultsCount.style.display = 'none';
                if (searchResults) searchResults.innerHTML = '';
            }
        });
    }

    // Clear Search Input
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            searchClearBtn.style.display = 'none';
            if (resultsCount) resultsCount.style.display = 'none';
            if (searchResults) searchResults.innerHTML = '';
        });
    }

    // Suggested Tags click
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const val = tag.textContent.trim();
            if (searchInput) {
                searchInput.value = val;
                if (searchClearBtn) searchClearBtn.style.display = 'block';
                performSearch(val.toLowerCase());
                searchInput.focus();
            }
        });
    });

    // Product Detail Modal Toggles
    const closeDetailModal = () => {
        productDetailModalOverlay.classList.remove('active');
        productDetailModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    };

    if (detailModalCloseBtn) detailModalCloseBtn.addEventListener('click', closeDetailModal);
    if (productDetailModalOverlay) productDetailModalOverlay.addEventListener('click', closeDetailModal);

    // Open Product Detail Modal
    const openDetailModal = (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        activeDetailProduct = product;

        if (detailProductCat) detailProductCat.textContent = product.category;
        if (detailProductTitle) detailProductTitle.textContent = product.title;
        if (detailProductDesc) detailProductDesc.textContent = product.description || '';

        // Handle price
        if (detailProductPriceWrap) {
            if (product.onSale) {
                detailProductPriceWrap.innerHTML = `
                    <span class="detail-price-original">PKR ${product.originalPrice.toLocaleString()}</span>
                    <span class="detail-price sale">PKR ${product.price.toLocaleString()}</span>
                    <span class="sale-badge" style="position: static; display: inline-block; margin-left: 0.5rem; font-size: 0.75rem; padding: 2px 6px;">${product.discountPercentage}% OFF</span>
                `;
            } else {
                detailProductPriceWrap.innerHTML = `<span class="detail-price">PKR ${product.price.toLocaleString()}</span>`;
            }
        }

        // Handle main image
        if (detailMainImg) {
            detailMainImg.src = product.image;
            detailMainImg.alt = product.title;
        }

        // Handle thumbnails
        if (detailThumbSlider) {
            detailThumbSlider.innerHTML = '';
            const images = product.images && product.images.length > 0 ? product.images : [product.image];
            images.forEach((imgUrl, index) => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = `${product.title} View ${index + 1}`;
                img.className = `thumb-img${index === 0 ? ' active' : ''}`;
                img.addEventListener('click', () => {
                    if (detailMainImg) {
                        detailMainImg.src = imgUrl;
                    }
                    detailThumbSlider.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
                    img.classList.add('active');
                });
                detailThumbSlider.appendChild(img);
            });
        }

        // Handle sizes (hidden for cosmetics)
        if (detailSizeGroup) {
            if (product.category === 'Cosmetics') {
                detailSizeGroup.style.display = 'none';
            } else {
                detailSizeGroup.style.display = 'block';
                // Reset sizes to default 'M'
                detailSizeGroup.querySelectorAll('.size-swatch').forEach(swatch => {
                    if (swatch.textContent.trim() === 'M') {
                        swatch.classList.add('active');
                    } else {
                        swatch.classList.remove('active');
                    }
                });
            }
        }

        // Open modal
        if (productDetailModalOverlay && productDetailModal) {
            productDetailModalOverlay.classList.add('active');
            productDetailModal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    };

    // Dynamic Swatches Size Toggle Setup
    document.querySelectorAll('.size-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            const parent = swatch.parentElement;
            parent.querySelectorAll('.size-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
        });
    });

    // Add to Bag from Details Modal
    if (detailAddToCartBtn) {
        detailAddToCartBtn.addEventListener('click', () => {
            if (!activeDetailProduct) return;
            
            let selectedSize = null;
            if (activeDetailProduct.category !== 'Cosmetics') {
                const activeSwatch = detailSizeGroup.querySelector('.size-swatch.active');
                if (activeSwatch) {
                    selectedSize = activeSwatch.textContent.trim();
                }
            }
            
            addToCartWithDetails(activeDetailProduct.id, selectedSize);
            closeDetailModal();
        });
    }

    // WhatsApp Inquiry from Details Modal
    if (detailWhatsappBtn) {
        detailWhatsappBtn.addEventListener('click', () => {
            if (!activeDetailProduct) return;
            
            let selectedSize = null;
            if (activeDetailProduct.category !== 'Cosmetics') {
                const activeSwatch = detailSizeGroup.querySelector('.size-swatch.active');
                if (activeSwatch) {
                    selectedSize = activeSwatch.textContent.trim();
                }
            }
            
            let message = `*✨ New Product Inquiry | Zaland Collection ✨*\n\n`;
            message += `Hello Zaland team, I am interested in inquiring about the following item:\n\n`;
            message += `👗 *Product Name:* ${activeDetailProduct.title}\n`;
            message += `📂 *Category:* ${activeDetailProduct.category}\n`;
            if (selectedSize) {
                message += `📏 *Size:* ${selectedSize}\n`;
            }
            message += `💰 *Price:* PKR ${activeDetailProduct.price.toLocaleString()}\n`;
            message += `🔗 *Image Link:* ${activeDetailProduct.image}\n\n`;
            message += `Is this item currently in stock? Please guide me on availability and shipping.`;
            
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Dynamic Popup & Offers
    const dynamicPopupOverlay = document.getElementById('dynamic-popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const announcementBar = document.getElementById('announcement-bar');
    
    const checkPopupStatus = () => {
        if (siteConfig.showPopup && !sessionStorage.getItem('zaland_popup_shown_v2')) {
            popupTitle.textContent = siteConfig.popupTitle;
            popupText.textContent = siteConfig.popupText;
            setTimeout(() => {
                dynamicPopupOverlay.classList.add('active');
                sessionStorage.setItem('zaland_popup_shown_v2', 'true');
            }, siteConfig.popupDelay);
        }
    };

    const loadOffers = async () => {
        try {
            const res = await fetch(`/offers.json?t=${Date.now()}`);
            if (res.ok) {
                const text = await res.text();
                // Check if the file is effectively empty or contains only comments/whitespace
                const hasOnlyCommentsOrEmpty = !text.trim() || /^(?:\s*|\s*\/\/.*|\s*\/\*[\s\S]*?\*\/)*$/.test(text);
                
                if (hasOnlyCommentsOrEmpty) {
                    siteConfig = {
                        navbarOffer: "",
                        popupTitle: "",
                        popupText: "",
                        showPopup: false,
                        popupDelay: 2000
                    };
                } else {
                    const parsed = parseJsonWithComments(text);
                    if (parsed) {
                        siteConfig = {
                            navbarOffer: parsed.navbarOffer || "",
                            popupTitle: parsed.popupTitle || "",
                            popupText: parsed.popupText || "",
                            showPopup: parsed.showPopup === true && !!parsed.popupTitle && !!parsed.popupText,
                            popupDelay: parsed.popupDelay !== undefined ? parsed.popupDelay : 2000
                        };
                    } else {
                        // Treating parsing failure as disabling all offers
                        siteConfig = {
                            navbarOffer: "",
                            popupTitle: "",
                            popupText: "",
                            showPopup: false,
                            popupDelay: 2000
                        };
                    }
                }
            }
        } catch (error) {
            console.error("Could not load offers from server, using default or disabled state:", error);
        } finally {
            // Apply offer visibility dynamically
            if (siteConfig.navbarOffer && siteConfig.navbarOffer.trim() !== "") {
                const textSpan = announcementBar.querySelector('.announcement-text');
                if(textSpan) textSpan.textContent = siteConfig.navbarOffer;
                document.body.classList.remove('no-announcement');
            } else {
                document.body.classList.add('no-announcement');
            }
            
            checkPopupStatus();
        }
    };
    
    loadOffers();

    const closePopup = () => {
        dynamicPopupOverlay.classList.remove('active');
    };

    popupCloseBtn.addEventListener('click', closePopup);
    popupClaimBtn.addEventListener('click', () => {
        closePopup();
        showToast('Discount applied for checkout!');
    });
    dynamicPopupOverlay.addEventListener('click', (e) => {
        if (e.target === dynamicPopupOverlay) closePopup();
    });

    // === Core Functions ===

    // Render Skeleton Loader Cards
    const renderSkeletons = () => {
        productGrid.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card';
            skeleton.innerHTML = `
                <div class="skeleton-img-wrap"></div>
                <div class="skeleton-info-wrap">
                    <div class="skeleton-text skeleton-cat"></div>
                    <div class="skeleton-text skeleton-title"></div>
                    <div class="skeleton-text skeleton-price"></div>
                </div>
            `;
            productGrid.appendChild(skeleton);
        }
    };

    // Fetch Products
    const fetchProducts = async () => {
        renderSkeletons();
        try {
            let productsData = [];
            const productsRes = await fetch(`/products.json?t=${Date.now()}`).catch(e => { console.error("Error fetching products:", e); return { ok: false }; });
            if (productsRes && productsRes.ok) {
                try {
                    const text = await productsRes.text();
                    productsData = robustJsonParse(text, []);
                } catch (e) {
                    console.error("Error reading products.json text:", e);
                }
            }

            let cosmeticsData = [];
            const cosmeticsRes = await fetch(`/cosmetics.json?t=${Date.now()}`).catch(e => { console.error("Error fetching cosmetics:", e); return { ok: false }; });
            if (cosmeticsRes && cosmeticsRes.ok) {
                try {
                    const text = await cosmeticsRes.text();
                    cosmeticsData = robustJsonParse(text, []);
                } catch (e) {
                    console.error("Error reading cosmetics.json text:", e);
                }
            }
            
            products = [...productsData, ...cosmeticsData];
            
            if (products.length === 0) {
                productGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color: var(--color-gray-500); padding: 2rem 0;">We are currently updating our collections. Please check back shortly!</p>';
            } else {
                // Short timeout to demonstrate smooth skeleton transition
                setTimeout(() => {
                    renderCategoryFilters();
                    renderProducts();
                }, 400);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding: 2rem 0;">Error loading collection.</p>';
        }
    };

    // Dynamic Category Filters Builder
    const renderCategoryFilters = () => {
        const filtersContainer = document.getElementById('category-filters');
        if (!filtersContainer) return;

        // Get unique categories from products (excluding hidden ones)
        const uniqueCategories = new Set();
        products.forEach(p => {
            if (p.category && !p.hidden) {
                uniqueCategories.add(p.category);
            }
        });

        // Convert to array
        const categoryList = Array.from(uniqueCategories);

        // Sort categories with priority: 'Women', 'Men', 'Cosmetics', then any other alphabetically
        const priority = ['Women', 'Men', 'Cosmetics'];
        categoryList.sort((a, b) => {
            const indexA = priority.indexOf(a);
            const indexB = priority.indexOf(b);
            
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });

        // Insert 'All' at the beginning
        categoryList.unshift('All');

        // Create buttons
        filtersContainer.innerHTML = '';
        categoryList.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-btn${currentCategory === cat ? ' active' : ''}`;
            btn.setAttribute('data-filter', cat);
            btn.textContent = cat;
            
            btn.addEventListener('click', () => {
                // Update active class
                filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Re-render
                currentCategory = cat;
                renderProducts();
            });
            
            filtersContainer.appendChild(btn);
        });
    };

    // Render Products
    const renderProducts = () => {
        productGrid.innerHTML = '';
        
        // Sort by ID descending so newest items appear first
        const sortedProducts = [...products].sort((a, b) => b.id - a.id);
        
        // Filter out hidden products for the main collection view
        let filteredProducts = sortedProducts.filter(p => !p.hidden);
        if (currentCategory !== 'All') {
            filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
        }

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No products found in this category.</p>';
            return;
        }

        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = `${index * 0.04}s`;
            
            let badgeHtml = '';
            let priceHtml = '';
            
            if (product.onSale) {
                badgeHtml = `<div class="sale-badge">${product.discountPercentage}% OFF</div>`;
                priceHtml = `
                    <p class="product-price-original"><del>PKR ${product.originalPrice.toLocaleString()}</del></p>
                    <p class="product-price sale">PKR ${product.price.toLocaleString()}</p>
                `;
            } else {
                priceHtml = `<p class="product-price">PKR ${product.price.toLocaleString()}</p>`;
            }

            card.innerHTML = `
                <div class="product-image-wrap">
                    ${badgeHtml}
                    <img src="${product.image}" loading="lazy" alt="${product.title}">
                    <div class="add-to-cart-action">
                        <button class="btn-add" data-id="${product.id}">Add To Cart</button>
                    </div>
                </div>
                <div class="product-info">
                    <p class="product-cat">${product.category}</p>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price-wrap">
                        ${priceHtml}
                    </div>
                </div>
            `;
            
            // Open product details modal on card click
            card.addEventListener('click', () => {
                openDetailModal(product.id);
            });
            
            productGrid.appendChild(card);
        });

        // Add event listeners to "Add to Bag" buttons
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent card click
                const id = parseInt(e.target.getAttribute('data-id'));
                addToCart(id);
            });
        });
    };

    // Cart Logic
    const addToCartWithDetails = (id, size) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const cartItemId = size ? `${id}-${size}` : `${id}`;
        const existingItem = cart.find(item => item.cartItemId === cartItemId || (!item.cartItemId && item.id === id && item.selectedSize === size));
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, cartItemId, selectedSize: size, quantity: 1 });
        }

        saveCart();
        updateCartBadge();
        showToast('Added to your bag');
    };

    const addToCart = (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        const defaultSize = product.category === 'Cosmetics' ? null : 'M';
        addToCartWithDetails(id, defaultSize);
    };

    const updateQuantity = (cartItemId, delta) => {
        const item = cart.find(item => item.cartItemId === cartItemId || (!item.cartItemId && String(item.id) === String(cartItemId)));
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(cartItemId);
            } else {
                saveCart();
                renderCart();
                updateCartBadge();
            }
        }
    };

    const removeFromCart = (cartItemId) => {
        cart = cart.filter(item => !(item.cartItemId === cartItemId || (!item.cartItemId && String(item.id) === String(cartItemId))));
        saveCart();
        renderCart();
        updateCartBadge();
    };

    const saveCart = () => {
        localStorage.setItem('zaland_cart', JSON.stringify(cart));
    };

    const updateCartBadge = () => {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = count;
        if (count > 0) {
            cartBadge.style.transform = 'scale(1.2)';
            setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);
        }
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-wrap">
                    <p class="empty-cart">Your shopping bag is empty.</p>
                    <button class="btn btn-primary" id="continue-shopping-btn">Continue Shopping</button>
                </div>
            `;
            if (cartTotalEl) cartTotalEl.textContent = 'PKR 0';

            const continueShoppingBtn = cartItemsContainer.querySelector('#continue-shopping-btn');
            if (continueShoppingBtn) {
                continueShoppingBtn.addEventListener('click', closeCart);
            }
            return;
        }

        let subtotal = 0;

        cart.forEach(item => {
            const itemId = item.cartItemId || String(item.id);
            subtotal += item.price * item.quantity;
            const el = document.createElement('div');
            el.className = 'cart-item';
            
            const titleDisplay = item.selectedSize ? `${item.title} <span class="cart-item-size" style="font-size: 0.8rem; color: var(--color-accent); font-weight: 500;">(${item.selectedSize})</span>` : item.title;
            
            el.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <span class="cart-item-title">${titleDisplay}</span>
                        <button class="btn-remove" data-id="${itemId}" aria-label="Remove item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                    <div class="cart-item-price">PKR ${item.price.toLocaleString()}</div>
                    <div class="cart-item-controls">
                        <button class="btn-qty btn-minus" data-id="${itemId}">-</button>
                        <span class="cart-qty">${item.quantity}</span>
                        <button class="btn-qty btn-plus" data-id="${itemId}">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });

        // Add Listeners
        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(e.target.getAttribute('data-id'), -1));
        });
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(e.target.getAttribute('data-id'), 1));
        });
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const triggerBtn = e.currentTarget;
                removeFromCart(triggerBtn.getAttribute('data-id'));
            });
        });

        if (cartTotalEl) {
            cartTotalEl.textContent = `PKR ${subtotal.toLocaleString()}`;
        }
    };

    // Toast Notification
    let toastTimeout;
    const showToast = (msg) => {
        toast.textContent = msg;
        toast.classList.add('active');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    };

    // WhatsApp Checkout
    whatsappCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your bag is empty!');
            return;
        }

        const checkoutNameInput = document.getElementById('checkout-name');
        const checkoutAddressInput = document.getElementById('checkout-address');

        const customerName = checkoutNameInput ? checkoutNameInput.value.trim() : '';
        const customerAddress = checkoutAddressInput ? checkoutAddressInput.value.trim() : '';

        if (!customerName) {
            showToast('Please enter your name');
            if (checkoutNameInput) checkoutNameInput.focus();
            return;
        }

        if (!customerAddress) {
            showToast('Please enter your delivery address');
            if (checkoutAddressInput) checkoutAddressInput.focus();
            return;
        }

        let subtotal = 0;
        let message = `*✨ New Order | Zaland Collection ✨*\n\n`;
        message += `*Customer Details:*\n`;
        message += `👤 *Name:* ${customerName}\n`;
        message += `📍 *Address:* ${customerAddress}\n\n`;
        message += `*Order Details:*\n`;
        
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            const sizeInfo = item.selectedSize ? ` (Size: ${item.selectedSize})` : '';
            message += `${index + 1}. ${item.title}${sizeInfo}\n`;
            message += `   Qty: ${item.quantity} x PKR ${item.price.toLocaleString()} = PKR ${(item.price * item.quantity).toLocaleString()}\n`;
        });

        const total = subtotal;

        message += `\n------------------------\n`;
        message += `*Total Amount:* PKR ${total.toLocaleString()}\n`;
        message += `------------------------\n\n`;
        message += `Please process my order.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        // Clear cart and checkout input fields
        cart = [];
        saveCart();
        renderCart();
        updateCartBadge();
        closeCart();

        if (checkoutNameInput) checkoutNameInput.value = '';
        if (checkoutAddressInput) checkoutAddressInput.value = '';

        window.open(whatsappUrl, '_blank');
    });

    // === Initialization ===
    fetchProducts();
    updateCartBadge();
});
