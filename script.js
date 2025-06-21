/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------- 1. Loading Screen --------------------
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Simulate a loading time if content is dynamically loaded, otherwise hide immediately
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            loadingScreen.style.display = 'none'; // Ensure it's completely gone
        }, 1500); // Adjust this delay as needed, or remove if not simulating
    }

    // -------------------- 2. Theme Switcher (Light/Dark Mode) --------------------
    const themeToggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // The <html> tag

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.remove('light');
            htmlElement.classList.add('dark');
            if (themeToggleButton) {
                themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode
                themeToggleButton.setAttribute('aria-label', 'Switch to light mode');
            }
        } else {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            if (themeToggleButton) {
                themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode
                themeToggleButton.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
        localStorage.setItem('theme', theme);
    };

    // Initialize theme on page load
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    // Event listener for theme toggle button
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // -------------------- 3. Sticky Header & Active Navigation Links --------------------
    const header = document.getElementById('site-header');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section'); // All sections of the page

    const addActiveClass = () => {
        let currentActive = 'home'; // Default to home if at the top

        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 50; // Offset for header height
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            }
        });
    };

    const handleScroll = () => {
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        addActiveClass();
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set header sticky state and active link

    // -------------------- 4. Hamburger Menu & Mobile Navigation --------------------
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            hamburgerMenu.classList.toggle('active'); // Optional: animate hamburger
            // Toggle body scroll lock
            if (mobileNav.classList.contains('open')) {
                document.body.style.overflowY = 'hidden';
            } else {
                document.body.style.overflowY = '';
            }
        });

        // Close mobile nav when a link is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflowY = ''; // Re-enable scroll
            });
        });
    }


    // -------------------- 5. Typing Effect (Hero Section) --------------------
    const typingTextElement = document.querySelector('.typing-text');
    const staticTextElement = document.querySelector('.static-text');
    if (typingTextElement && staticTextElement) {
        const words = JSON.parse(typingTextElement.dataset.words);
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 150; // Speed of typing
        let deletingSpeed = 75; // Speed of deleting
        let delayBetweenWords = 1500; // Delay before typing next word

        function typeEffect() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                // Deleting
                typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Typing
                typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Word is fully typed, start deleting after a delay
                isDeleting = true;
                setTimeout(typeEffect, delayBetweenWords);
            } else if (isDeleting && charIndex === 0) {
                // Word is fully deleted, move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 500); // Small delay before typing new word
            } else {
                // Continue typing or deleting
                setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
            }
        }
        typeEffect(); // Start the typing effect
    }

    // -------------------- 6. "Scroll to Top" Button --------------------
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add CSS for .scroll-to-top-btn.show
    const style = document.createElement('style');
    style.innerHTML = `
        .scroll-to-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
        }
        .scroll-to-top-btn.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);


    // -------------------- 7. Scroll Animations (`animate-on-scroll`) --------------------
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust root margin to trigger earlier/later
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // -------------------- 8. Form Submission (Contact Section) --------------------
    const contactForm = document.getElementById('contact-form');
    const formSubmissionMessage = document.getElementById('form-submission-message');

    if (contactForm && formSubmissionMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let isValid = true;
            let errorMessage = '';

            // Basic validation
            if (!name) {
                isValid = false;
                errorMessage += 'Name is required.<br>';
            }
            if (!email || !emailRegex.test(email)) {
                isValid = false;
                errorMessage += 'A valid email is required.<br>';
            }
            if (!message) {
                isValid = false;
                errorMessage += 'Message cannot be empty.<br>';
            }

            if (!isValid) {
                formSubmissionMessage.classList.remove('success');
                formSubmissionMessage.classList.add('error');
                formSubmissionMessage.innerHTML = errorMessage;
                formSubmissionMessage.style.display = 'block';
                return;
            }

            // Simulate form submission
            showLoader(contactForm.querySelector('.btn'), true);
            formSubmissionMessage.style.display = 'none';

            setTimeout(() => {
                // Simulate success or failure
                const success = Math.random() > 0.1; // 90% chance of success

                showLoader(contactForm.querySelector('.btn'), false);

                if (success) {
                    formSubmissionMessage.classList.remove('error');
                    formSubmissionMessage.classList.add('success');
                    formSubmissionMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                    contactForm.reset(); // Clear the form
                } else {
                    formSubmissionMessage.classList.remove('success');
                    formSubmissionMessage.classList.add('error');
                    formSubmissionMessage.textContent = 'Oops! Something went wrong. Please try again later.';
                }
                formSubmissionMessage.style.display = 'block';
            }, 2000); // Simulate network request delay
        });
    }

    // Helper function for showing/hiding loader on buttons
    function showLoader(button, isLoading) {
        if (!button) return;
        if (isLoading) {
            button.setAttribute('data-original-text', button.innerHTML);
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
        } else {
            button.innerHTML = button.getAttribute('data-original-text');
            button.disabled = false;
        }
    }


    // -------------------- 9. Blog Post Generator (Gemini Integration - Placeholder) --------------------
    // These functions are placeholders and would require a backend API call to Gemini.
    // The existing HTML seems to have some of this logic already, so ensuring consistency.

    const generateIdeaBtn = document.getElementById('generate-idea-btn');
    const blogIdeaOutput = document.getElementById('blog-idea-output');
    const generatedIdeaText = document.getElementById('generated-idea-text');
    const blogErrorMessage = document.getElementById('blog-error-message');
    const draftPostBtn = document.getElementById('draft-post-btn');
    const draftedPostOutput = document.getElementById('drafted-post-output');
    const draftedPostText = document.getElementById('drafted-post-text');
    const blogTopicInput = document.getElementById('blog-topic-input');


    function displayError(message) {
        blogErrorMessage.textContent = message;
        blogErrorMessage.classList.remove('hidden');
    }

    // Placeholder for Gemini API call
    async function callGeminiAPI(prompt) {
        console.log("Simulating Gemini API call with prompt:", prompt);
        // In a real application, you would send this prompt to your backend,
        // which then calls the Gemini API.
        return new Promise(resolve => {
            setTimeout(() => {
                if (prompt.includes("idea")) {
                    resolve("An innovative blog post idea about 'The Future of AI in UI/UX Design' focusing on personalized user experiences.");
                } else if (prompt.includes("Draft a short")) {
                    resolve("<h3>The Future of AI in UI/UX Design: Crafting Personalized Experiences</h3><p>Artificial Intelligence is rapidly reshaping the landscape of UI/UX design. Gone are the days of one-size-fits-all interfaces; AI enables designers to create truly personalized user experiences that adapt and evolve with individual user behavior. From intelligent content recommendations to predictive interfaces, AI-powered design tools are empowering designers to work more efficiently and create more intuitive products.</p><p>Imagine an interface that anticipates your needs, presenting the most relevant information before you even search for it. This is the promise of AI in UI/UX. By leveraging machine learning algorithms, designers can gain deeper insights into user preferences, pain points, and interaction patterns, leading to designs that are not just aesthetically pleasing but also highly functional and user-centric. The future of design is smart, adaptive, and deeply personal.</p>");
                } else {
                    resolve("Simulated response for: " + prompt);
                }
            }, 2000); // Simulate API latency
        });
    }

    if (generateIdeaBtn) {
        generateIdeaBtn.addEventListener('click', async () => {
            blogIdeaOutput.classList.add('hidden');
            blogErrorMessage.classList.add('hidden'); // Hide previous errors
            const topic = blogTopicInput.value.trim();

            if (!topic) {
                displayError('Please enter a topic for the blog idea.');
                return;
            }

            showLoader(generateIdeaBtn, true);
            const prompt = `Generate an innovative blog post idea (title and a brief paragraph) for a UI/UX and full-stack development portfolio, based on the topic: "${topic}".`;
            const responseText = await callGeminiAPI(prompt);

            if (responseText) {
                generatedIdeaText.innerHTML = responseText;
                blogIdeaOutput.classList.remove('hidden');
            }
            showLoader(generateIdeaBtn, false);
        });
    }

    if (draftPostBtn) {
        draftPostBtn.addEventListener('click', async () => {
            let topicToDraft = generatedIdeaText.textContent || blogTopicInput.value.trim();

            if (!topicToDraft) {
                displayError('Please generate an idea first or enter a topic to draft a post.');
                return;
            }

            showLoader(draftPostBtn, true);
            draftedPostOutput.classList.add('hidden');
            blogErrorMessage.classList.add('hidden'); // Hide previous errors

            const prompt = `Draft a short (around 200-300 words) blog post based on the following idea/topic: "${topicToDraft}". Focus on engaging content, relevant to UI/UX or full-stack development, and use a professional yet approachable tone.`;
            const responseText = await callGeminiAPI(prompt);

            if (responseText) {
                draftedPostText.innerHTML = responseText;
                draftedPostOutput.classList.remove('hidden');
            }
            showLoader(draftPostBtn, false);
        });
    }


    // -------------------- 10. Cursor Follower (Basic Implementation) --------------------
    function initCursorFollower() {
        const cursorFollower = document.createElement('div');
        cursorFollower.classList.add('cursor-follower');
        document.body.appendChild(cursorFollower);

        document.addEventListener('mousemove', (e) => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });

        // Add a basic hover effect for clickable elements
        const clickableElements = document.querySelectorAll('a, button, .btn, .service-card, .project-card, .skill-item');
        clickableElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
        });

        // Add CSS for the cursor follower
        const cursorStyle = document.createElement('style');
        cursorStyle.innerHTML = `
            .cursor-follower {
                position: fixed;
                width: 30px;
                height: 30px;
                border: 2px solid var(--color-primary);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease-out, width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
                z-index: 9999;
                mix-blend-mode: exclusion; /* Creative blending */
            }

            .cursor-follower.active {
                width: 50px;
                height: 50px;
                background-color: var(--color-primary);
                border-color: transparent;
            }

            /* Hide default cursor */
            body {
                cursor: none;
            }
            a, button, input, textarea, .btn, .service-card, .project-card, .skill-item, .logo {
                cursor: none;
            }

            /* Fallback for touch devices or if JS fails */
            @media (pointer: coarse) {
                .cursor-follower {
                    display: none;
                }
                body {
                    cursor: default;
                }
            }
        `;
        document.head.appendChild(cursorStyle);
    }

    initCursorFollower(); // Initialize on DOMContentLoaded
});
