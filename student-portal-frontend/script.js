// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript is loading...');
    // Check if we're on the login page
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        // Login page functionality
        console.log('Login page detected');
        const errorMessage = document.getElementById('error-message');

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const email = document.getElementById('email-address').value;
            const password = document.getElementById('password').value;
            
            console.log('Email:', email);
            console.log('Password entered:', password ? 'Yes' : 'No');
            
            // Simple validation
            if (validateLogin(email, password)) {
                console.log('Login successful');
                // Store login status
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Redirect to dashboard
                window.location.href = 'index.html';
            } else {
                console.log('Login failed');
                showError('Invalid email or password. Please try again.');
            }
        });

        function validateLogin(email, password) {
            // Single valid credential
            const validEmail = 'lol@gmail.com';
            const validPassword = '11223344';
            
            const isValid = email === validEmail && password === validPassword;
            console.log('Validation result:', isValid);
            return isValid;
        }

        function showError(message) {
            if (errorMessage) {
                errorMessage.textContent = message;
                errorMessage.classList.remove('hidden');
                
                // Hide error after 5 seconds
                setTimeout(() => {
                    errorMessage.classList.add('hidden');
                }, 5000);
            }
        }
    } else {
        // Dashboard functionality
        console.log('Dashboard page detected');
        
        // Check if user is logged in
        if (!localStorage.getItem('isLoggedIn')) {
            console.log('User not logged in, redirecting to login');
            window.location.href = 'login.html';
            return;
        }
        
        console.log('User is logged in, loading dashboard');
    // Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Toggle theme with a three-state cycle: light -> dark -> auto
    themeToggle.addEventListener('click', function() {
        const currentTheme = localStorage.getItem('theme');
        
        if (document.body.classList.contains('dark-mode')) {
            // If current is dark, switch to light
            document.body.classList.remove('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
            console.log('Theme set to light');
        } else if (currentTheme === 'light') {
            // If current is light, switch to auto (by removing the preference)
            localStorage.removeItem('theme');
            // Show auto icon (adjust icon)
            themeIcon.classList.remove('fa-sun', 'fa-moon', 'fa-desktop');
            themeIcon.classList.add('fa-adjust'); // Circle half-light, half-dark icon for auto
            console.log('Theme set to auto');
            
            // Add a brief visual indication that we're in auto mode
            setTimeout(() => {
                // Immediately apply the correct system theme after showing auto icon
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.classList.add('dark-mode');
                    themeIcon.classList.remove('fa-adjust');
                    themeIcon.classList.add('fa-moon');
                } else {
                    document.body.classList.remove('dark-mode');
                    themeIcon.classList.remove('fa-adjust');
                    themeIcon.classList.add('fa-sun');
                }
            }, 800); // Show auto icon for 800ms to make it clear
        } else {
            // If current is auto (no preference), switch to dark
            document.body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon'); // It might be fa-desktop, so just set it
            themeIcon.classList.replace('fa-desktop', 'fa-moon');
            localStorage.setItem('theme', 'dark');
            console.log('Theme set to dark');
        }
    });

    // Listen for changes in the system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleThemeChange(e) {
        const newColorScheme = e.matches ? 'dark' : 'light';
        console.log('System theme changed to', newColorScheme);
        
        // Only auto-change if user hasn't manually set a preference
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            console.log('Auto-updating theme to match system:', newColorScheme);
            if (newColorScheme === 'dark') {
                document.body.classList.add('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            } else {
                document.body.classList.remove('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }
        } else {
            console.log('User has manual theme preference:', savedTheme, '- not auto-changing');
        }
    }
    
    // Add the event listener with better Opera support
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleThemeChange);
    } else if (mediaQuery.addListener) {
        // Fallback for older browsers including older Opera
        mediaQuery.addListener(handleThemeChange);
    }
    
    // Additional fallback for Opera - poll for changes
    let lastSystemTheme = mediaQuery.matches;
    setInterval(() => {
        const currentSystemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (currentSystemTheme !== lastSystemTheme) {
            console.log('Opera fallback: System theme change detected');
            handleThemeChange({ matches: currentSystemTheme });
            lastSystemTheme = currentSystemTheme;
        }
    }, 1000); // Check every second
    
    // Test the current system preference
    console.log('Current system prefers dark mode:', mediaQuery.matches);
    console.log('Current saved theme preference:', localStorage.getItem('theme'));

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-hidden');
    });

    // Profile dropdown toggle
    const profileDropdown = document.getElementById('profile-dropdown');
    const profileMenu = document.getElementById('profile-menu');
    
    profileDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        profileMenu.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        profileMenu.classList.add('hidden');
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logoutModal.classList.remove('hidden');
        profileMenu.classList.add('hidden');
    });

    confirmLogout.addEventListener('click', function() {
        // Clear login status
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });

    cancelLogout.addEventListener('click', function() {
        logoutModal.classList.add('hidden');
    });

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentContainer = document.getElementById('content-container');

    // Debug: Check if elements exist
    console.log('Navigation items found:', navItems.length);
    console.log('Content container found:', contentContainer);
    
    if (!contentContainer) {
        console.error('Content container not found!');
        return;
    }

    // Load dashboard content by default
    console.log('Loading dashboard...');
    loadDashboard();

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => {
                nav.classList.remove('active');
                nav.style.color = 'var(--text-color)';
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            this.style.color = 'var(--active-text)';
            
            // Get the section to load
            const section = this.getAttribute('href').substring(1);
            loadContent(section);
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth < 768) {
                sidebar.classList.add('sidebar-hidden');
            }
        });
    });

    function loadContent(section) {
        contentContainer.innerHTML = '';
        contentContainer.classList.add('fade-in');
        
        switch(section) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'timetable':
                loadTimetable();
                break;
            case 'calendar':
                loadCalendar();
                break;
            case 'attendance':
                loadAttendance();
                break;
            case 'results':
                loadResults();
                break;
            case 'assignments':
                loadAssignments();
                break;
            case 'courses':
                loadCourses();
                break;
            case 'grades':
                loadGrades();
                break;
            case 'messages':
                loadMessages();
                break;
            case 'announcements':
                loadAnnouncements();
                break;
            case 'forums':
                loadForums();
                break;
            case 'notifications':
                loadNotifications();
                break;
            case 'library':
                loadLibrary();
                break;
            case 'downloads':
                loadDownloads();
                break;
            case 'elearning':
                loadELearning();
                break;
            case 'research':
                loadResearch();
                break;
            case 'fees':
                loadFees();
                break;
            case 'idcard':
                loadIDCard();
                break;
            case 'transport':
                loadTransport();
                break;
            case 'hostel':
                loadHostel();
                break;
            case 'cafeteria':
                loadCafeteria();
                break;
            case 'events':
                loadEvents();
                break;
            case 'clubs':
                loadClubs();
                break;
            case 'sports':
                loadSports();
                break;
            case 'map':
                loadMap();
                break;
            case 'news':
                loadNews();
                break;
            case 'helpdesk':
                loadHelpDesk();
                break;
            case 'feedback':
                loadFeedback();
                break;
            case 'career':
                loadCareer();
                break;
            default:
                loadDashboard();
        }
    }

    function loadDashboard() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="mb-8">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                                <p class="text-gray-600">Welcome back, Muhammad Abbas! Here's your academic overview.</p>
                            </div>
                            <div class="hidden md:block">
                                <div class="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2">
                                    <span class="text-sm text-gray-500">Today:</span>
                                    <span class="text-sm font-medium">${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <!-- Quick stats cards -->
                        <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">Attendance</h3>
                                    <p class="text-sm text-gray-600">Present vs Absent</p>
                                </div>
                                <div class="text-3xl font-bold text-blue-600">80%</div>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="bg-blue-600 h-2.5 rounded-full" style="width: 80%"></div>
                            </div>
                            <p class="text-xs text-right mt-1 text-gray-500">48/60 days</p>
                        </div>
                        <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">Results</h3>
                                    <p class="text-sm text-gray-600">Overall Percentage</p>
                                </div>
                                <div class="text-3xl font-bold text-green-600">70%</div>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="bg-green-600 h-2.5 rounded-full" style="width: 70%"></div>
                            </div>
                            <p class="text-xs text-right mt-1 text-gray-500">Grade: B</p>
                        </div>
                        <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">Fees</h3>
                                    <p class="text-sm text-gray-600">Due Amount</p>
                                </div>
                                <div class="text-2xl font-bold text-red-600">147,500</div>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <span class="text-xs text-gray-500">Due date:</span>
                                <span class="text-xs font-medium text-red-600">15 Aug, 2024</span>
                            </div>
                            <button class="w-full mt-3 btn-primary text-sm py-1.5">Pay Now</button>
                        </div>
                        <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">ID Card</h3>
                                    <p class="text-sm text-gray-600">Student ID</p>
                                </div>
                                <div class="badge badge-primary">Active</div>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <span class="text-xs text-gray-500">ID Number:</span>
                                <span class="text-xs font-medium">F20242661172</span>
                            </div>
                            <button class="w-full mt-3 btn-primary text-sm py-1.5">View ID Card</button>
                        </div>
                    </div>

                    <!-- Upcoming Classes & Events -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div class="lg:col-span-2">
                            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                                <div class="card-header bg-gray-50 flex justify-between items-center">
                                    <h3 class="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
                                    <a href="#timetable" class="text-sm text-blue-600 hover:text-blue-800">View All</a>
                                </div>
                                <div class="p-6">
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-4 p-3 rounded-lg bg-blue-50">
                                            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <span class="text-blue-600 font-semibold">9:00</span>
                                            </div>
                                            <div class="flex-1">
                                                <h4 class="font-medium text-gray-900">Programming Fundamentals</h4>
                                                <p class="text-sm text-gray-600">Room 201, Block A</p>
                                                <div class="flex items-center mt-1">
                                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">2 hours</span>
                                                    <span class="text-xs text-gray-500 ml-2">Dr. Ahmed Khan</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-start space-x-4 p-3 rounded-lg bg-purple-50">
                                            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                                <span class="text-purple-600 font-semibold">11:30</span>
                                            </div>
                                            <div class="flex-1">
                                                <h4 class="font-medium text-gray-900">Mathematics</h4>
                                                <p class="text-sm text-gray-600">Room 105, Block B</p>
                                                <div class="flex items-center mt-1">
                                                    <span class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">1.5 hours</span>
                                                    <span class="text-xs text-gray-500 ml-2">Dr. Sarah Ahmed</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-start space-x-4 p-3 rounded-lg bg-green-50">
                                            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                                <span class="text-green-600 font-semibold">2:00</span>
                                            </div>
                                            <div class="flex-1">
                                                <h4 class="font-medium text-gray-900">English</h4>
                                                <p class="text-sm text-gray-600">Room 302, Block C</p>
                                                <div class="flex items-center mt-1">
                                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">1 hour</span>
                                                    <span class="text-xs text-gray-500 ml-2">Ms. Fatima Ali</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                                <div class="card-header bg-gray-50 flex justify-between items-center">
                                    <h3 class="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                                    <a href="#calendar" class="text-sm text-blue-600 hover:text-blue-800">View All</a>
                                </div>
                                <div class="p-6">
                                    <div class="space-y-4">
                                        <div class="border-l-4 border-blue-500 pl-4 py-2">
                                            <p class="text-sm font-medium text-gray-900">Mid-term Examinations</p>
                                            <p class="text-xs text-gray-600">August 15-25, 2024</p>
                                        </div>
                                        <div class="border-l-4 border-green-500 pl-4 py-2">
                                            <p class="text-sm font-medium text-gray-900">Tech Fest 2024</p>
                                            <p class="text-xs text-gray-600">September 5-7, 2024</p>
                                        </div>
                                        <div class="border-l-4 border-yellow-500 pl-4 py-2">
                                            <p class="text-sm font-medium text-gray-900">Career Fair</p>
                                            <p class="text-xs text-gray-600">September 15, 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Assignments & Announcements -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                                <div class="card-header bg-gray-50 flex justify-between items-center">
                                    <h3 class="text-lg font-semibold text-gray-900">Recent Assignments</h3>
                                    <a href="#assignments" class="text-sm text-blue-600 hover:text-blue-800">View All</a>
                                </div>
                                <div class="p-6">
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 class="font-medium text-gray-900">Programming Assignment #3</h4>
                                                <p class="text-sm text-gray-600">Due: August 10, 2024</p>
                                            </div>
                                            <div class="badge badge-danger">Pending</div>
                                        </div>
                                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 class="font-medium text-gray-900">Mathematics Problem Set</h4>
                                                <p class="text-sm text-gray-600">Due: August 12, 2024</p>
                                            </div>
                                            <div class="badge badge-warning">In Progress</div>
                                        </div>
                                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 class="font-medium text-gray-900">English Essay</h4>
                                                <p class="text-sm text-gray-600">Due: August 15, 2024</p>
                                            </div>
                                            <div class="badge badge-success">Submitted</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                                <div class="card-header bg-gray-50 flex justify-between items-center">
                                    <h3 class="text-lg font-semibold text-gray-900">Announcements</h3>
                                    <a href="#announcements" class="text-sm text-blue-600 hover:text-blue-800">View All</a>
                                </div>
                                <div class="p-6">
                                    <div class="space-y-4">
                                        <div class="p-3 bg-red-50 rounded-lg">
                                            <p class="text-sm font-medium text-red-800">Important: Fee Submission Deadline</p>
                                            <p class="text-xs text-gray-600 mt-1">Last date for fee submission is August 15, 2024.</p>
                                            <p class="text-xs text-gray-500 mt-2">Posted: 2 days ago</p>
                                        </div>
                                        <div class="p-3 bg-blue-50 rounded-lg">
                                            <p class="text-sm font-medium text-blue-800">Library Timings Updated</p>
                                            <p class="text-xs text-gray-600 mt-1">Library will now be open from 8 AM to 10 PM.</p>
                                            <p class="text-xs text-gray-500 mt-2">Posted: 3 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Add event listeners for the dashboard buttons after a small delay to ensure DOM is ready
        setTimeout(() => {
            // Function to simulate navigation item click
            function navigateToSection(section) {
                // Remove active class from all nav items
                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(nav => {
                    nav.classList.remove('active');
                    nav.style.color = 'var(--text-color)';
                });
                
                // Find and activate the corresponding nav item
                const targetNavItem = document.querySelector(`a[href="#${section}"]`);
                if (targetNavItem) {
                    targetNavItem.classList.add('active');
                    targetNavItem.style.color = 'var(--active-text)';
                }
                
                // Load the content
                loadContent(section);
                
                // Close sidebar on mobile after navigation
                const sidebar = document.getElementById('sidebar');
                if (sidebar && window.innerWidth < 768) {
                    sidebar.classList.add('sidebar-hidden');
                }
            }
            
            // Find and add event listeners to dashboard buttons
            const buttons = document.querySelectorAll('.btn-primary');
            buttons.forEach(btn => {
                if (btn.textContent.includes('Pay Now')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        navigateToSection('fees');
                    });
                }
                if (btn.textContent.includes('View ID Card')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        navigateToSection('idcard');
                    });
                }
            });
        }, 100);
    }

    function loadTimetable() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-3xl font-bold text-gray-900">Time Table</h2>
                        <div class="flex space-x-2">
                            <button id="timetable-download-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-download mr-2"></i>Download
                            </button>
                            <button id="timetable-print-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-print mr-2"></i>Print
                            </button>
                        </div>
                    </div>
                    
                    <!-- Week Navigation -->
                    <div class="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm p-4">
                        <button class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h3 class="text-lg font-semibold text-gray-900">August 7 - August 13, 2024</h3>
                        <button class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <!-- Timetable Grid -->
                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <!-- Days of Week Header -->
                        <div class="grid grid-cols-6 bg-gray-50 border-b">
                            <div class="p-4 font-semibold text-gray-500 text-center border-r">Time</div>
                            <div class="p-4 font-semibold text-gray-900 text-center border-r">Monday</div>
                            <div class="p-4 font-semibold text-gray-900 text-center border-r">Tuesday</div>
                            <div class="p-4 font-semibold text-gray-900 text-center border-r">Wednesday</div>
                            <div class="p-4 font-semibold text-gray-900 text-center border-r">Thursday</div>
                            <div class="p-4 font-semibold text-gray-900 text-center">Friday</div>
                        </div>
                        
                        <!-- Time Slots -->
                        <div class="grid grid-cols-6 border-b">
                            <div class="p-4 font-medium text-gray-500 text-center border-r bg-gray-50">9:00 - 11:00</div>
                            <div class="p-3 border-r">
                                <div class="bg-blue-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">Programming</p>
                                    <p class="text-xs text-gray-600">Room 201</p>
                                    <p class="text-xs text-gray-500 mt-1">Dr. Ahmed</p>
                                </div>
                            </div>
                            <div class="p-3 border-r"></div>
                            <div class="p-3 border-r">
                                <div class="bg-blue-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">Programming</p>
                                    <p class="text-xs text-gray-600">Room 201</p>
                                    <p class="text-xs text-gray-500 mt-1">Dr. Ahmed</p>
                                </div>
                            </div>
                            <div class="p-3 border-r"></div>
                            <div class="p-3">
                                <div class="bg-blue-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">Programming</p>
                                    <p class="text-xs text-gray-600">Room 201</p>
                                    <p class="text-xs text-gray-500 mt-1">Dr. Ahmed</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-6 border-b">
                            <div class="p-4 font-medium text-gray-500 text-center border-r bg-gray-50">11:30 - 1:00</div>
                            <div class="p-3 border-r">
                                <div class="bg-purple-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">Mathematics</p>
                                    <p class="text-xs text-gray-600">Room 105</p>
                                    <p class="text-xs text-gray-500 mt-1">Dr. Sarah</p>
                                </div>
                            </div>
                            <div class="p-3 border-r">
                                <div class="bg-purple-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">Mathematics</p>
                                    <p class="text-xs text-gray-600">Room 105</p>
                                    <p class="text-xs text-gray-500 mt-1">Dr. Sarah</p>
                                </div>
                            </div>
                            <div class="p-3 border-r"></div>
                            <div class="p-3 border-r">
                                <div class="bg-purple-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">Mathematics</p>
                                    <p class="text-xs text-gray-600">Room 105</p>
                                    <p class="text-xs text-gray-500 mt-1">Dr. Sarah</p>
                                </div>
                            </div>
                            <div class="p-3"></div>
                        </div>
                        
                        <div class="grid grid-cols-6 border-b">
                            <div class="p-4 font-medium text-gray-500 text-center border-r bg-gray-50">2:00 - 3:00</div>
                            <div class="p-3 border-r"></div>
                            <div class="p-3 border-r">
                                <div class="bg-green-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">English</p>
                                    <p class="text-xs text-gray-600">Room 302</p>
                                    <p class="text-xs text-gray-500 mt-1">Ms. Fatima</p>
                                </div>
                            </div>
                            <div class="p-3 border-r"></div>
                            <div class="p-3 border-r">
                                <div class="bg-green-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">English</p>
                                    <p class="text-xs text-gray-600">Room 302</p>
                                    <p class="text-xs text-gray-500 mt-1">Ms. Fatima</p>
                                </div>
                            </div>
                            <div class="p-3">
                                <div class="bg-green-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">English</p>
                                    <p class="text-xs text-gray-600">Room 302</p>
                                    <p class="text-xs text-gray-500 mt-1">Ms. Fatima</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-6">
                            <div class="p-4 font-medium text-gray-500 text-center border-r bg-gray-50">3:30 - 5:00</div>
                            <div class="p-3 border-r">
                                <div class="bg-yellow-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">Physics Lab</p>
                                    <p class="text-xs text-gray-600">Lab 3</p>
                                    <p class="text-xs text-gray-500 mt-1">Dr. Khalid</p>
                                </div>
                            </div>
                            <div class="p-3 border-r"></div>
                            <div class="p-3 border-r">
                                <div class="bg-yellow-50 p-2 rounded-lg h-full">
                                    <p class="font-medium text-sm text-gray-900">Physics Lab</p>
                                    <p class="text-xs text-gray-600">Lab 3</p>
                                    <p class="text-xs text-gray-500 mt-1">Dr. Khalid</p>
                                </div>
                            </div>
                            <div class="p-3 border-r"></div>
                            <div class="p-3"></div>
                        </div>
                    </div>
                    
                    <!-- Legend -->
                    <div class="mt-6 bg-white rounded-xl shadow-md p-4">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="flex items-center">
                                <div class="w-4 h-4 bg-blue-50 rounded mr-2 border border-blue-100"></div>
                                <span class="text-sm text-gray-600">Programming</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-4 h-4 bg-purple-50 rounded mr-2 border border-purple-100"></div>
                                <span class="text-sm text-gray-600">Mathematics</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-4 h-4 bg-green-50 rounded mr-2 border border-green-100"></div>
                                <span class="text-sm text-gray-600">English</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-4 h-4 bg-yellow-50 rounded mr-2 border border-yellow-100"></div>
                                <span class="text-sm text-gray-600">Physics Lab</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        // Add event listeners for the timetable buttons after content is loaded
        setTimeout(() => {
            addTimetableButtonListeners();
        }, 100);
    }

    function addTimetableButtonListeners() {
        const downloadBtn = document.getElementById('timetable-download-btn');
        const printBtn = document.getElementById('timetable-print-btn');

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Downloading timetable...', 'info');
            });
        }

        if (printBtn) {
            printBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Printing timetable...', 'info');
            });
        }
    }

    function addFeesButtonListeners() {
        const downloadBtn = document.getElementById('fees-download-statement-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Downloading fee statement...', 'info');
            });
        }
    }

    function addCalendarButtonListeners() {
        const refreshBtn = document.getElementById('calendar-refresh-btn');
        const exportBtn = document.getElementById('calendar-export-btn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Refreshing calendar...', 'info');
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Exporting calendar...', 'info');
            });
        }
    }

    function addAttendanceButtonListeners() {
        const exportBtn = document.getElementById('attendance-export-btn');
        const printBtn = document.getElementById('attendance-print-btn');

        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Exporting attendance...', 'info');
            });
        }

        if (printBtn) {
            printBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Printing attendance...', 'info');
            });
        }
    }

    function addResultsButtonListeners() {
        const exportBtn = document.getElementById('results-export-btn');

        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Exporting results...', 'info');
            });
        }
    }

    function addAssignmentsButtonListeners() {
        const submitBtn = document.getElementById('submit-assignment-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('The submission portal is not yet available. Please check back later.', 'info');
            });
        }
    }

function loadCalendar() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-3xl font-bold text-gray-900">Academic Calendar</h2>
                        <div class="flex space-x-2">
                            <button id="calendar-refresh-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-sync-alt mr-2"></i>Refresh
                            </button>
                            <button id="calendar-export-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-download mr-2"></i>Export
                            </button>
                        </div>
                    </div>
                    
                    <!-- Calendar Navigation -->
                    <div class="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm p-4">
                        <button class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h3 class="text-lg font-semibold text-gray-900">August 2024</h3>
                        <button class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <!-- Calendar Grid -->
                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <!-- Days of Week Header -->
                        <div class="grid grid-cols-7 bg-gray-50 border-b">
                            <div class="p-4 font-semibold text-gray-500 text-center">Sun</div>
                            <div class="p-4 font-semibold text-gray-500 text-center">Mon</div>
                            <div class="p-4 font-semibold text-gray-500 text-center">Tue</div>
                            <div class="p-4 font-semibold text-gray-500 text-center">Wed</div>
                            <div class="p-4 font-semibold text-gray-500 text-center">Thu</div>
                            <div class="p-4 font-semibold text-gray-500 text-center">Fri</div>
                            <div class="p-4 font-semibold text-gray-500 text-center">Sat</div>
                        </div>
                        
                        <!-- Calendar Dates -->
                        <div class="grid grid-cols-7">
                            <!-- Week 1 -->
                            <div class="p-2 border-b border-r h-32 text-gray-400">30</div>
                            <div class="p-2 border-b border-r h-32 text-gray-400">31</div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">1</div>
                                <div class="mt-1 text-xs bg-blue-100 text-blue-800 p-1 rounded">
                                    <div>New Semester</div>
                                    <div>8:00 AM</div>
                                </div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">2</div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">3</div>
                                <div class="mt-1 text-xs bg-green-100 text-green-800 p-1 rounded">
                                    <div>Course Registration</div>
                                    <div>9:00 AM - 4:00 PM</div>
                                </div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">4</div>
                            </div>
                            <div class="p-2 border-b h-32">
                                <div class="font-medium">5</div>
                            </div>
                            
                            <!-- Week 2 -->
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">6</div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">7</div>
                                <div class="mt-1 text-xs bg-purple-100 text-purple-800 p-1 rounded">
                                    <div>Faculty Meeting</div>
                                    <div>2:00 PM</div>
                                </div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">8</div>
                            </div>
                            <div class="p-2 border-b border-r h-32 bg-gray-50">
                                <div class="font-medium text-blue-600">9</div>
                                <div class="mt-1 text-xs bg-yellow-100 text-yellow-800 p-1 rounded">
                                    <div>Assignment Due</div>
                                    <div>11:59 PM</div>
                                </div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">10</div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">11</div>
                                <div class="mt-1 text-xs bg-red-100 text-red-800 p-1 rounded">
                                    <div>Quiz</div>
                                    <div>10:00 AM</div>
                                </div>
                            </div>
                            <div class="p-2 border-b h-32">
                                <div class="font-medium">12</div>
                            </div>
                            
                            <!-- Week 3 (partial) -->
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">13</div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">14</div>
                                <div class="mt-1 text-xs bg-blue-100 text-blue-800 p-1 rounded">
                                    <div>Guest Lecture</div>
                                    <div>1:00 PM</div>
                                </div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">15</div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">16</div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">17</div>
                                <div class="mt-1 text-xs bg-green-100 text-green-800 p-1 rounded">
                                    <div>Project Submission</div>
                                    <div>5:00 PM</div>
                                </div>
                            </div>
                            <div class="p-2 border-b border-r h-32">
                                <div class="font-medium">18</div>
                            </div>
                            <div class="p-2 border-b h-32">
                                <div class="font-medium">19</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Upcoming Events -->
                    <div class="mt-6 bg-white rounded-xl shadow-md p-4">
                        <h4 class="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h4>
                        <div class="space-y-4">
                            <div class="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div class="flex-shrink-0 bg-blue-100 text-blue-800 rounded-lg p-2 text-center w-14 h-14 flex flex-col justify-center">
                                    <div class="text-sm font-bold">AUG</div>
                                    <div class="text-lg font-bold">9</div>
                                </div>
                                <div class="ml-4">
                                    <h5 class="text-md font-semibold text-gray-900">Assignment Due: Programming Fundamentals</h5>
                                    <p class="text-sm text-gray-600">11:59 PM • Online Submission</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div class="flex-shrink-0 bg-red-100 text-red-800 rounded-lg p-2 text-center w-14 h-14 flex flex-col justify-center">
                                    <div class="text-sm font-bold">AUG</div>
                                    <div class="text-lg font-bold">11</div>
                                </div>
                                <div class="ml-4">
                                    <h5 class="text-md font-semibold text-gray-900">Quiz: Mathematics</h5>
                                    <p class="text-sm text-gray-600">10:00 AM • Room 105</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div class="flex-shrink-0 bg-blue-100 text-blue-800 rounded-lg p-2 text-center w-14 h-14 flex flex-col justify-center">
                                    <div class="text-sm font-bold">AUG</div>
                                    <div class="text-lg font-bold">14</div>
                                </div>
                                <div class="ml-4">
                                    <h5 class="text-md font-semibold text-gray-900">Guest Lecture: Industry Trends</h5>
                                    <p class="text-sm text-gray-600">1:00 PM • Auditorium</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div class="flex-shrink-0 bg-green-100 text-green-800 rounded-lg p-2 text-center w-14 h-14 flex flex-col justify-center">
                                    <div class="text-sm font-bold">AUG</div>
                                    <div class="text-lg font-bold">17</div>
                                </div>
                                <div class="ml-4">
                                    <h5 class="text-md font-semibold text-gray-900">Project Submission: Group Assignment</h5>
                                    <p class="text-sm text-gray-600">5:00 PM • Online Submission</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Add event listeners for the calendar buttons after content is loaded
        setTimeout(() => {
            addCalendarButtonListeners();
        }, 100);
    }

    function loadAttendance() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-3xl font-bold text-gray-900">Attendance</h2>
                        <div class="flex space-x-2">
                            <button id="attendance-export-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-download mr-2"></i>Export
                            </button>
                            <button id="attendance-print-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <i class="fas fa-print mr-2"></i>Print
                            </button>
                        </div>
                    </div>
                    
                    <!-- Attendance Summary -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-gray-500">Overall Attendance</p>
                                    <h3 class="text-2xl font-bold text-gray-900 mt-1">87%</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                    <i class="fas fa-calendar-check text-blue-500"></i>
                                </div>
                            </div>
                            <div class="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                                <div class="bg-blue-600 h-2.5 rounded-full" style="width: 87%"></div>
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-gray-500">Present</p>
                                    <h3 class="text-2xl font-bold text-gray-900 mt-1">52</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                                    <i class="fas fa-check text-green-500"></i>
                                </div>
                            </div>
                            <p class="text-sm text-gray-500 mt-4">Out of 60 total classes</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-gray-500">Absent</p>
                                    <h3 class="text-2xl font-bold text-gray-900 mt-1">8</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                    <i class="fas fa-times text-red-500"></i>
                                </div>
                            </div>
                            <p class="text-sm text-gray-500 mt-4">Out of 60 total classes</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-gray-500">Leave</p>
                                    <h3 class="text-2xl font-bold text-gray-900 mt-1">0</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                                    <i class="fas fa-hourglass-half text-yellow-500"></i>
                                </div>
                            </div>
                            <p class="text-sm text-gray-500 mt-4">Approved leaves</p>
                        </div>
                    </div>
                    
                    <!-- Course-wise Attendance -->
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Course-wise Attendance</h3>
                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">Programming Fundamentals</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">Dr. Ahmed</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">15</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">0</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="w-full bg-gray-200 rounded-full h-2.5 w-32">
                                                <div class="bg-green-600 h-2.5 rounded-full" style="width: 100%"></div>
                                            </div>
                                            <div class="text-sm text-gray-900 mt-1">100%</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Excellent</span>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">Mathematics</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">Dr. Sarah</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">12</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">3</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="w-full bg-gray-200 rounded-full h-2.5 w-32">
                                                <div class="bg-blue-600 h-2.5 rounded-full" style="width: 80%"></div>
                                            </div>
                                            <div class="text-sm text-gray-900 mt-1">80%</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Good</span>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">English</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">Ms. Fatima</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">13</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">2</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="w-full bg-gray-200 rounded-full h-2.5 w-32">
                                                <div class="bg-blue-600 h-2.5 rounded-full" style="width: 87%"></div>
                                            </div>
                                            <div class="text-sm text-gray-900 mt-1">87%</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Good</span>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">Physics</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">Dr. Khalid</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">12</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">3</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="w-full bg-gray-200 rounded-full h-2.5 w-32">
                                                <div class="bg-yellow-600 h-2.5 rounded-full" style="width: 75%"></div>
                                            </div>
                                            <div class="text-sm text-gray-900 mt-1">75%</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Average</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Recent Attendance -->
                    <h3 class="text-xl font-bold text-gray-900 mt-6 mb-4">Recent Attendance</h3>
                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">Aug 7, 2024</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">Programming Fundamentals</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">9:00 - 11:00 AM</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Present</span>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">Aug 7, 2024</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">Mathematics</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">11:30 - 1:00 PM</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Present</span>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">Aug 6, 2024</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">Physics</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">3:30 - 5:00 PM</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Absent</span>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">Aug 5, 2024</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">English</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">2:00 - 3:00 PM</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Present</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Add event listeners for the attendance buttons after content is loaded
        setTimeout(() => {
            addAttendanceButtonListeners();
        }, 100);
    }

    function loadResults() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold text-gray-900">Results</h2>
                        <div class="flex space-x-2">
                            <select class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Fall 2023</option>
                                <option selected>Spring 2024</option>
                                <option>Summer 2024</option>
                            </select>
                            <button id="results-export-btn" class="btn-primary py-2 px-4 rounded-lg flex items-center">
                                <i class="fas fa-download mr-2"></i> Export
                            </button>
                        </div>
                    </div>
                    
                    <!-- GPA Summary -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div class="card p-6 text-center">
                            <div class="text-5xl font-bold text-blue-600 mb-2">3.7</div>
                            <p class="text-gray-600">Current GPA</p>
                            <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full bg-blue-600 rounded-full" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="card p-6 text-center">
                            <div class="text-5xl font-bold text-green-600 mb-2">3.5</div>
                            <p class="text-gray-600">CGPA</p>
                            <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full bg-green-600 rounded-full" style="width: 78%"></div>
                            </div>
                        </div>
                        <div class="card p-6 text-center">
                            <div class="text-5xl font-bold text-purple-600 mb-2">87%</div>
                            <p class="text-gray-600">Percentile Rank</p>
                            <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full bg-purple-600 rounded-full" style="width: 87%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Current Semester Results -->
                    <div class="card mb-6 overflow-hidden">
                        <div class="card-header bg-gray-50 p-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">Spring 2024 Results</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Hours</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CS-101</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Programming Fundamentals</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">85/100</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-success">Passed</span></td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">MATH-201</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Calculus & Analytical Geometry</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">78/100</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">B+</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-success">Passed</span></td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ENG-103</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Technical Writing</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">65/100</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">C</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-warning">Conditional</span></td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PHY-102</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Physics Lab</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">92/100</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A+</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-success">Passed</span></td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">STAT-201</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Statistics & Probability</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">81/100</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A-</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-success">Passed</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Grade Distribution & GPA Trend -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="card">
                            <div class="card-header bg-gray-50 p-4 border-b border-gray-200">
                                <h3 class="text-lg font-semibold text-gray-900">Grade Distribution</h3>
                            </div>
                            <div class="card-body p-4">
                                <div class="space-y-3">
                                    <div class="flex items-center">
                                        <div class="w-16 text-sm font-medium">A+/A</div>
                                        <div class="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-green-500 rounded-full" style="width: 40%"></div>
                                        </div>
                                        <div class="w-12 text-right text-sm">40%</div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-16 text-sm font-medium">A-/B+</div>
                                        <div class="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-blue-500 rounded-full" style="width: 30%"></div>
                                        </div>
                                        <div class="w-12 text-right text-sm">30%</div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-16 text-sm font-medium">B/B-</div>
                                        <div class="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-yellow-500 rounded-full" style="width: 15%"></div>
                                        </div>
                                        <div class="w-12 text-right text-sm">15%</div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-16 text-sm font-medium">C+/C</div>
                                        <div class="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-orange-500 rounded-full" style="width: 10%"></div>
                                        </div>
                                        <div class="w-12 text-right text-sm">10%</div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-16 text-sm font-medium">C-/D</div>
                                        <div class="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-red-500 rounded-full" style="width: 5%"></div>
                                        </div>
                                        <div class="w-12 text-right text-sm">5%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header bg-gray-50 p-4 border-b border-gray-200">
                                <h3 class="text-lg font-semibold text-gray-900">GPA Trend</h3>
                            </div>
                            <div class="card-body p-4">
                                <div class="h-64">
                                    <canvas id="results-gpa-chart" width="400" height="200"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Add event listeners for the results buttons after content is loaded
        setTimeout(() => {
            addResultsButtonListeners();
            initializeResultsGPAChart();
        }, 100);
    }

    function loadFees() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold text-gray-900">Fees & Payments</h2>
                        <div class="flex space-x-2">
                        <button id="fees-download-statement-btn" class="btn-primary py-2 px-4 rounded-lg flex items-center">
                            <i class="fas fa-file-invoice mr-2"></i> Download Statement
                        </button>
                        </div>
                    </div>
                    
                    <!-- Fee Summary Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div class="card p-6 text-center">
                            <div class="text-4xl font-bold text-red-600 mb-2">147,500</div>
                            <p class="text-gray-600">Due Amount (PKR)</p>
                            <div class="mt-4 text-sm text-red-500">Due Date: August 15, 2024</div>
                        </div>
                        <div class="card p-6 text-center">
                            <div class="text-4xl font-bold text-green-600 mb-2">250,000</div>
                            <p class="text-gray-600">Paid Amount (PKR)</p>
                            <div class="mt-4 text-sm text-green-500">Last Payment: July 1, 2024</div>
                        </div>
                        <div class="card p-6 text-center">
                            <div class="text-4xl font-bold text-blue-600 mb-2">397,500</div>
                            <p class="text-gray-600">Total Fee (PKR)</p>
                            <div class="mt-4 text-sm text-blue-500">Academic Year 2023-24</div>
                        </div>
                        <div class="card p-6 text-center">
                            <div class="text-4xl font-bold text-purple-600 mb-2">0</div>
                            <p class="text-gray-600">Scholarship (PKR)</p>
                            <div class="mt-4 text-sm text-purple-500">
                                <a href="#" class="underline">Apply for Scholarship</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Current Semester Fee Details -->
                    <div class="card mb-6 overflow-hidden">
                        <div class="card-header bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">Spring 2024 Fee Details</h3>
                            <span class="badge badge-warning">Partially Paid</span>
                        </div>
                        <div class="p-6">
                            <div class="space-y-4">
                                <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span class="font-medium">Tuition Fee:</span>
                                    <span class="font-semibold">120,000 PKR</span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span class="font-medium">Lab Fee:</span>
                                    <span class="font-semibold">15,000 PKR</span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span class="font-medium">Library Fee:</span>
                                    <span class="font-semibold">5,000 PKR</span>
                                </div>
                                <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <span class="font-medium">Miscellaneous:</span>
                                    <span class="font-semibold">7,500 PKR</span>
                                </div>
                                <div class="flex justify-between items-center pt-2 text-lg font-bold">
                                    <span class="text-red-600">Total Due:</span>
                                    <span class="text-red-600">147,500 PKR</span>
                                </div>
                            </div>
                            
                            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button class="btn-primary py-3 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-credit-card mr-2"></i> Pay Online
                                </button>
                                <button class="bg-white border border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center hover:bg-gray-50">
                                    <i class="fas fa-university mr-2"></i> Bank Transfer Details
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment History -->
                    <div class="card overflow-hidden">
                        <div class="card-header bg-gray-50 p-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">Payment History</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">July 1, 2024</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TXN-24070101</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tuition Fee Payment</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">150,000 PKR</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-success">Completed</span></td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Feb 15, 2024</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TXN-24021502</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tuition Fee Payment</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100,000 PKR</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-success">Completed</span></td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 10, 2024</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TXN-24011003</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Registration Fee</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25,000 PKR</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-success">Completed</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Add event listeners for the fees buttons after content is loaded
        setTimeout(() => {
            addFeesButtonListeners();
        }, 100);
    }

    function loadIDCard() {
        contentContainer.innerHTML = `
            <section class="p-6" style="background-color: var(--bg-color);">
                <div class="max-w-7xl mx-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold" style="color: var(--text-color);">ID Card</h2>
                        <div class="flex space-x-2">
                            <button id="idcard-download-btn" class="btn-primary py-2 px-4 rounded-lg flex items-center">
                                <i class="fas fa-download mr-2"></i> Download ID Card
                            </button>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- ID Card Preview -->
                        <div class="card p-0 overflow-hidden">
                            <div class="relative">
                                <!-- ID Card Front -->
                                <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
                                    <div class="flex justify-between items-center mb-4">
                                        <div class="flex items-center">
                                            <!-- UMT Logo -->
                                            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 100 100" class="w-12 h-12" fill="none">
                                                    <!-- UMT Logo Recreation -->
                                                    <circle cx="50" cy="50" r="45" fill="#3b82f6"/>
                                                    <circle cx="50" cy="50" r="35" fill="#60a5fa"/>
                                                    <text x="50" y="58" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">UMT</text>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <h3 class="text-xl font-bold">University of Management and Technology</h3>
                                            <p class="text-sm opacity-80">Student Identification Card</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="p-6" style="background-color: var(--card-bg);">
                                    <div class="flex">
                                        <div class="mr-6">
                                            <div class="relative">
                                                <img src="profile.jpg" 
                                                     alt="Muhammad Abbas Profile" class="w-32 h-40 object-cover rounded-lg border-4 border-white shadow-lg">
                                                <div class="absolute top-2 right-2">
                                                    <span class="inline-block px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">Active</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex-1">
                                            <h3 class="text-2xl font-bold mb-1" style="color: var(--text-color);">Muhammad Abbas</h3>
                                            <div class="text-lg font-medium text-blue-600 mb-4">F20242661172</div>
                                            
                                            <div class="space-y-3 text-sm">
                                                <div class="flex">
                                                    <div class="w-24" style="color: var(--text-color); opacity: 0.7;">ID Number:</div>
                                                    <div class="font-medium" style="color: var(--text-color);">F20242661172</div>
                                                </div>
                                                <div class="flex">
                                                    <div class="w-24" style="color: var(--text-color); opacity: 0.7;">Semester:</div>
                                                    <div class="font-medium" style="color: var(--text-color);">3rd Semester</div>
                                                </div>
                                                <div class="flex">
                                                    <div class="w-24" style="color: var(--text-color); opacity: 0.7;">Section:</div>
                                                    <div class="font-medium" style="color: var(--text-color);">V24</div>
                                                </div>
                                                <div class="flex">
                                                    <div class="w-24" style="color: var(--text-color); opacity: 0.7;">Blood Group:</div>
                                                    <div class="font-medium" style="color: var(--text-color);">O+</div>
                                                </div>
                                                <div class="flex">
                                                    <div class="w-24" style="color: var(--text-color); opacity: 0.7;">Valid Until:</div>
                                                    <div class="font-medium" style="color: var(--text-color);">December 31, 2028</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-6 pt-6" style="border-top: 1px solid var(--border-color);">
                                        <div class="flex justify-between items-center">
                                            <div>
                                                <div class="h-10 w-24 border-2 border-dashed" style="border-color: var(--border-color); background-color: var(--bg-color);"></div>
                                                <div class="text-xs mt-1" style="color: var(--text-color); opacity: 0.6;">Student Signature</div>
                                            </div>
                                            <div>
                                                <div class="h-10 w-24 border-2 border-dashed" style="border-color: var(--border-color); background-color: var(--bg-color);"></div>
                                                <div class="text-xs mt-1" style="color: var(--text-color); opacity: 0.6;">Registrar</div>
                                            </div>
                                            <div>
                                                <div class="h-16 w-16 border-2 border-dashed flex items-center justify-center" style="border-color: var(--border-color); background-color: var(--bg-color);">
                                                    <i class="fas fa-qrcode text-2xl" style="color: var(--text-color); opacity: 0.4;"></i>
                                                </div>
                                                <div class="text-xs mt-1 text-center" style="color: var(--text-color); opacity: 0.6;">QR Code</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="p-4 text-center text-sm" style="background-color: var(--card-bg); color: var(--text-color); opacity: 0.8; border-top: 1px solid var(--border-color);">
                                    <p>If found, please return to the University of Management and Technology, Main Campus.</p>
                                    <p>Contact: +92-42-111-300-200 | www.umt.edu.pk</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- ID Card Information -->
                        <div>
                            <div class="card mb-6">
                                <div class="card-header bg-gray-50 p-4 border-b border-gray-200">
                                    <h3 class="text-lg font-semibold text-gray-900">ID Card Status</h3>
                                </div>
                                <div class="p-6">
                                    <div class="flex items-center mb-6">
                                        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                            <i class="fas fa-check-circle text-3xl text-green-500"></i>
                                        </div>
                                        <div>
                                            <h4 class="text-lg font-medium text-gray-900">Active</h4>
                                            <p class="text-gray-600">Your ID card is active and valid</p>
                                        </div>
                                    </div>
                                    
                                    <div class="space-y-4">
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                                            <span class="text-gray-600">Issue Date:</span>
                                            <span class="font-medium">January 15, 2024</span>
                                        </div>
                            <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span class="text-gray-600">Expiry Date:</span>
                                <span class="font-medium">December 31, 2028</span>
                            </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                                            <span class="text-gray-600">Last Renewed:</span>
                                            <span class="font-medium">N/A (New Card)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header bg-gray-50 p-4 border-b border-gray-200">
                                    <h3 class="text-lg font-semibold text-gray-900">ID Card Services</h3>
                                </div>
                                <div class="p-6 space-y-4">
                                    <button class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-between hover:bg-gray-50">
                                        <div class="flex items-center">
                                            <i class="fas fa-sync-alt text-blue-500 mr-3"></i>
                                            <span>Request Card Renewal</span>
                                        </div>
                                        <i class="fas fa-chevron-right text-gray-400"></i>
                                    </button>
                                    
                                    <button class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-between hover:bg-gray-50">
                                        <div class="flex items-center">
                                            <i class="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
                                            <span>Report Lost/Stolen</span>
                                        </div>
                                        <i class="fas fa-chevron-right text-gray-400"></i>
                                    </button>
                                    
                                    <button class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-between hover:bg-gray-50">
                                        <div class="flex items-center">
                                            <i class="fas fa-id-card text-purple-500 mr-3"></i>
                                            <span>Request Duplicate Card</span>
                                        </div>
                                        <i class="fas fa-chevron-right text-gray-400"></i>
                                    </button>
                                    
                                    <button class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-between hover:bg-gray-50">
                                        <div class="flex items-center">
                                            <i class="fas fa-question-circle text-green-500 mr-3"></i>
                                            <span>ID Card FAQ</span>
                                        </div>
                                        <i class="fas fa-chevron-right text-gray-400"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Add event listeners for ID card buttons after content is loaded
        setTimeout(() => {
            addIDCardButtonListeners();
        }, 100);
    }
    
    function addIDCardButtonListeners() {
        // Get all ID card service buttons
        const downloadBtn = document.getElementById('idcard-download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Downloading ID card...', 'info');
            });
        }
        const idCardButtons = document.querySelectorAll('#content-container .card:last-child .p-6 button');
        
        idCardButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const buttonText = button.querySelector('span').textContent;
                
                switch(index) {
                    case 0: // Request Card Renewal
                        showNotification('Card renewal request has been submitted. You will receive an email confirmation within 24 hours.', 'success');
                        break;
                    case 1: // Report Lost/Stolen
                        showNotification('Lost/Stolen card report has been filed. A replacement card will be issued within 3-5 business days.', 'info');
                        break;
                    case 2: // Request Duplicate Card
                        showNotification('Duplicate card request has been submitted. Processing will take 5-7 business days.', 'success');
                        break;
                    case 3: // ID Card FAQ
                        showNotification('Loading ID Card FAQ...', 'info');
                        break;
                    default:
                        showNotification(`${buttonText} request has been processed.`, 'info');
                }
            });
        });
    }
    
    function loadAssignments() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold" style="color: var(--text-color);">Assignments</h2>
                        <div class="flex space-x-2">
                            <button id="submit-assignment-btn" class="btn-primary py-2 px-4 rounded-lg flex items-center">
                                <i class="fas fa-plus mr-2"></i> Submit Assignment
                            </button>
                        </div>
                    </div>

                    <!-- Assignments List -->
                    <div class="card overflow-hidden">
                        <div class="card-header bg-gray-50 p-4 border-b" style="border-color: var(--border-color); background-color: var(--card-bg);">
                            <h3 class="text-lg font-semibold" style="color: var(--text-color);">Your Assignments</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y" style="divide-color: var(--border-color);">
                                <thead style="background-color: var(--card-bg);">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color); opacity: 0.6;">Course</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color); opacity: 0.6;">Assignment</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color); opacity: 0.6;">Due Date</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color); opacity: 0.6;">Status</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color); opacity: 0.6;"></th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y" style="background-color: var(--card-bg); divide-color: var(--border-color);">
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" style="color: var(--text-color);">Programming Fundamentals</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);">Assignment #3</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);">August 10, 2024</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-danger">Pending</span></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href="#" class="hover:underline" style="color: var(--active-text);">View</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" style="color: var(--text-color);">Mathematics</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);">Problem Set</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);">August 12, 2024</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-warning">In Progress</span></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href="#" class="hover:underline" style="color: var(--active-text);">View</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" style="color: var(--text-color);">English</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);">Essay</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);">August 15, 2024</td>
                                        <td class="px-6 py-4 whitespace-nowrap"><span class="badge badge-success">Submitted</span></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href="#" class="hover:underline" style="color: var(--active-text);">View</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function loadCourses() {
    contentContainer.innerHTML = `
        <section class="p-6">
            <div class="max-w-7xl mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Your Courses</h2>
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <input id="course-search" type="text" placeholder="Search courses..." class="pl-10 pr-4 py-2 rounded-lg border" style="background-color: var(--card-bg); border-color: var(--border-color); color: var(--text-color);">
                            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <div class="relative">
                            <button id="filter-btn" class="btn-primary py-2 px-4 rounded-lg flex items-center">
                                <i class="fas fa-filter mr-2"></i> Filter
                            </button>
                            <!-- Filter Dropdown -->
                            <div id="filter-dropdown" class="hidden absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 z-50" style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
                                <div class="px-4 py-2 border-b" style="border-color: var(--border-color);">
                                    <h3 class="text-sm font-semibold" style="color: var(--text-color);">Filter by Progress</h3>
                                </div>
                                <div class="px-4 py-2 space-y-2">
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="progress-filter mr-2" value="all" checked>
                                        <span class="text-sm" style="color: var(--text-color);">All Courses</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="progress-filter mr-2" value="completed">
                                        <span class="text-sm" style="color: var(--text-color);">Completed (80%+)</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="progress-filter mr-2" value="in-progress">
                                        <span class="text-sm" style="color: var(--text-color);">In Progress (30-79%)</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="progress-filter mr-2" value="starting">
                                        <span class="text-sm" style="color: var(--text-color);">Just Started (0-29%)</span>
                                    </label>
                                </div>
                                <div class="px-4 py-2 border-t border-b" style="border-color: var(--border-color);">
                                    <h3 class="text-sm font-semibold" style="color: var(--text-color);">Filter by Department</h3>
                                </div>
                                <div class="px-4 py-2 space-y-2">
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="dept-filter mr-2" value="all-dept" checked>
                                        <span class="text-sm" style="color: var(--text-color);">All Departments</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="dept-filter mr-2" value="cs">
                                        <span class="text-sm" style="color: var(--text-color);">Computer Science</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="dept-filter mr-2" value="se">
                                        <span class="text-sm" style="color: var(--text-color);">Software Engineering</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="dept-filter mr-2" value="web">
                                        <span class="text-sm" style="color: var(--text-color);">Web Development</span>
                                    </label>
                                    <label class="flex items-center cursor-pointer">
                                        <input type="checkbox" class="dept-filter mr-2" value="cy">
                                        <span class="text-sm" style="color: var(--text-color);">Cybersecurity</span>
                                    </label>
                                </div>
                                <div class="px-4 py-2 border-t" style="border-color: var(--border-color);">
                                    <button id="clear-filters" class="text-sm text-blue-500 hover:text-blue-700">Clear All Filters</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Course Card 1 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-blue-500">CS-101</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Introduction to Programming</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                                    <i class="fas fa-code text-blue-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Dr. Ahmed Khan</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-blue-500">60%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-blue-500 h-2 rounded-full" style="width: 60%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-800">View Details</a>
                        </div>
                    </div>

                    <!-- Course Card 2 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-green-500">CS-201</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Data Structures & Algorithms</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                                    <i class="fas fa-project-diagram text-green-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Prof. Sarah Ali</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-green-500">45%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 45%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-green-600 hover:text-green-800">View Details</a>
                        </div>
                    </div>
                    
                    <!-- Course Card 3 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-purple-500">CS-211</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Object-Oriented Programming</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                                    <i class="fas fa-object-group text-purple-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Dr. Fatima Rizvi</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-purple-500">75%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-purple-500 h-2 rounded-full" style="width: 75%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-purple-600 hover:text-purple-800">View Details</a>
                        </div>
                    </div>
                    
                    <!-- Course Card 4 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-red-500">CS-301</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Database Systems</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                                    <i class="fas fa-database text-red-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Mr. Bilal Chaudhry</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-red-500">30%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-red-500 h-2 rounded-full" style="width: 30%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-red-600 hover:text-red-800">View Details</a>
                        </div>
                    </div>
                    
                    <!-- Course Card 5 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-yellow-500">CS-305</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Operating Systems</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                                    <i class="fab fa-windows text-yellow-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Dr. Aisha Jamil</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-yellow-500">50%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-yellow-500 h-2 rounded-full" style="width: 50%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-yellow-600 hover:text-yellow-800">View Details</a>
                        </div>
                    </div>
                    
                    <!-- Course Card 6 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-indigo-500">CS-401</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Computer Networks</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-100">
                                    <i class="fas fa-network-wired text-indigo-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Mr. Usman Ghani</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-indigo-500">80%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-indigo-500 h-2 rounded-full" style="width: 80%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">View Details</a>
                        </div>
                    </div>

                    <!-- Course Card 7 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-pink-500">SE-201</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Software Engineering</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-pink-100">
                                    <i class="fas fa-cogs text-pink-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Dr. Hina Aslam</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-pink-500">90%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-pink-500 h-2 rounded-full" style="width: 90%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-pink-600 hover:text-pink-800">View Details</a>
                        </div>
                    </div>

                    <!-- Course Card 8 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-teal-500">CS-451</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Artificial Intelligence</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-teal-100">
                                    <i class="fas fa-robot text-teal-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Prof. Zeeshan Haider</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-teal-500">20%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-teal-500 h-2 rounded-full" style="width: 20%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-teal-600 hover:text-teal-800">View Details</a>
                        </div>
                    </div>

                     <!-- Course Card 9 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-orange-500">WEB-301</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Web Development</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100">
                                    <i class="fas fa-globe text-orange-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Ms. Sana Javed</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-orange-500">100%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-orange-500 h-2 rounded-full" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                         <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-orange-600 hover:text-orange-800">View Details</a>
                        </div>
                    </div>

                     <!-- Course Card 10 -->
                    <div class="card card-hover">
                        <div class="p-5">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-medium text-gray-500">CY-101</p>
                                    <h3 class="text-xl font-semibold mt-1" style="color: var(--text-color);">Cybersecurity Fundamentals</h3>
                                </div>
                                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                                    <i class="fas fa-shield-alt text-gray-500 text-xl"></i>
                                </div>
                            </div>
                            <p class="text-sm mt-2" style="color: var(--text-color); opacity: 0.8;">Instructor: Mr. Omar Abdullah</p>
                            <div class="mt-4">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-xs font-medium" style="color: var(--text-color);">Progress</p>
                                    <p class="text-xs font-medium text-gray-500">15%</p>
                                </div>
                                <div class="w-full rounded-full h-2" style="background-color: var(--border-color);">
                                    <div class="bg-gray-500 h-2 rounded-full" style="width: 15%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="border-t p-4" style="border-color: var(--border-color);">
                            <a href="#" class="text-sm font-medium text-gray-600 hover:text-gray-800">View Details</a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    `;
    
    // Add event listeners after the content is loaded
    setTimeout(() => {
        addCoursesFilterFunctionality();
    }, 100);
}

// Function to add filter functionality
function addCoursesFilterFunctionality() {
    const filterBtn = document.getElementById('filter-btn');
    const filterDropdown = document.getElementById('filter-dropdown');
    const courseSearch = document.getElementById('course-search');
    const clearFilters = document.getElementById('clear-filters');
    const progressFilters = document.querySelectorAll('.progress-filter');
    const deptFilters = document.querySelectorAll('.dept-filter');
    
    if (!filterBtn || !filterDropdown) return;
    
    // Toggle filter dropdown
    filterBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        filterDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
            filterDropdown.classList.add('hidden');
        }
    });
    
    // Course data for filtering
    const courseData = {
        'CS-101': { progress: 60, dept: 'cs', title: 'Introduction to Programming', instructor: 'Dr. Ahmed Khan' },
        'CS-201': { progress: 45, dept: 'cs', title: 'Data Structures & Algorithms', instructor: 'Prof. Sarah Ali' },
        'CS-211': { progress: 75, dept: 'cs', title: 'Object-Oriented Programming', instructor: 'Dr. Fatima Rizvi' },
        'CS-301': { progress: 30, dept: 'cs', title: 'Database Systems', instructor: 'Mr. Bilal Chaudhry' },
        'CS-305': { progress: 50, dept: 'cs', title: 'Operating Systems', instructor: 'Dr. Aisha Jamil' },
        'CS-401': { progress: 80, dept: 'cs', title: 'Computer Networks', instructor: 'Mr. Usman Ghani' },
        'SE-201': { progress: 90, dept: 'se', title: 'Software Engineering', instructor: 'Dr. Hina Aslam' },
        'CS-451': { progress: 20, dept: 'cs', title: 'Artificial Intelligence', instructor: 'Prof. Zeeshan Haider' },
        'WEB-301': { progress: 100, dept: 'web', title: 'Web Development', instructor: 'Ms. Sana Javed' },
        'CY-101': { progress: 15, dept: 'cy', title: 'Cybersecurity Fundamentals', instructor: 'Mr. Omar Abdullah' }
    };
    
    // Filter and search functionality
    function filterCourses() {
        const searchTerm = courseSearch.value.toLowerCase();
        const courseCards = document.querySelectorAll('.card.card-hover');
        
        // Get selected filters
        const selectedProgressFilters = Array.from(progressFilters)
            .filter(cb => cb.checked && cb.value !== 'all')
            .map(cb => cb.value);
        
        const selectedDeptFilters = Array.from(deptFilters)
            .filter(cb => cb.checked && cb.value !== 'all-dept')
            .map(cb => cb.value);
        
        const showAll = progressFilters[0].checked; // "All Courses" checkbox
        const showAllDepts = deptFilters[0].checked; // "All Departments" checkbox
        
        courseCards.forEach(card => {
            const courseCode = card.querySelector('p').textContent;
            const courseTitle = card.querySelector('h3').textContent;
            const instructor = card.querySelector('p:nth-child(2)').textContent;
            
            const course = courseData[courseCode];
            if (!course) return;
            
            // Search filter
            const matchesSearch = !searchTerm || 
                courseCode.toLowerCase().includes(searchTerm) ||
                courseTitle.toLowerCase().includes(searchTerm) ||
                instructor.toLowerCase().includes(searchTerm);
            
            // Progress filter
            let matchesProgress = showAll;
            if (!showAll && selectedProgressFilters.length > 0) {
                matchesProgress = selectedProgressFilters.some(filter => {
                    switch(filter) {
                        case 'completed': return course.progress >= 80;
                        case 'in-progress': return course.progress >= 30 && course.progress < 80;
                        case 'starting': return course.progress < 30;
                        default: return false;
                    }
                });
            }
            
            // Department filter
            let matchesDept = showAllDepts;
            if (!showAllDepts && selectedDeptFilters.length > 0) {
                matchesDept = selectedDeptFilters.includes(course.dept);
            }
            
            // Show/hide card
            if (matchesSearch && matchesProgress && matchesDept) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Search input event
    if (courseSearch) {
        courseSearch.addEventListener('input', filterCourses);
    }
    
    // Filter checkbox events
    progressFilters.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'all') {
                if (this.checked) {
                    progressFilters.forEach(cb => {
                        if (cb.value !== 'all') cb.checked = false;
                    });
                }
            } else {
                if (this.checked) {
                    progressFilters[0].checked = false; // Uncheck "All"
                }
            }
            filterCourses();
        });
    });
    
    deptFilters.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'all-dept') {
                if (this.checked) {
                    deptFilters.forEach(cb => {
                        if (cb.value !== 'all-dept') cb.checked = false;
                    });
                }
            } else {
                if (this.checked) {
                    deptFilters[0].checked = false; // Uncheck "All"
                }
            }
            filterCourses();
        });
    });
    
    // Clear filters button
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            // Reset all checkboxes
            progressFilters.forEach(cb => cb.checked = cb.value === 'all');
            deptFilters.forEach(cb => cb.checked = cb.value === 'all-dept');
            courseSearch.value = '';
            filterCourses();
        });
    }
}

    function loadHostel() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Hostel</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadCafeteria() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Cafeteria</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadEvents() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Events</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadClubs() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Clubs & Societies</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadSports() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Sports</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadMap() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Campus Map</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadNews() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Campus News</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

function loadHelpDesk() {
    contentContainer.innerHTML = `
        <section class="p-6" id="helpdesk">
            <div class="max-w-7xl mx-auto">
                <h2 class="text-3xl font-bold mb-6" style="color: var(--text-color);">Help Desk</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Left Side: FAQ and Contact -->
                    <div class="md:col-span-2">
                        <div class="card mb-6">
                            <div class="card-header">
                                <h3 class="text-lg font-semibold">Frequently Asked Questions</h3>
                            </div>
                            <div class="card-body">
                                <input type="text" id="faq-search" placeholder="Search FAQs..." class="w-full px-4 py-2 mb-4 rounded-lg" style="background-color: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color);">
                                <div id="faq-accordion" class="space-y-2">
                                    <!-- FAQ items will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side: Submit Ticket and My Tickets -->
                    <div>
                        <div class="card mb-6">
                            <div class="card-header">
                                <h3 class="text-lg font-semibold">Submit a Support Ticket</h3>
                            </div>
                            <div class="card-body space-y-4">
                                <select id="ticket-type" class="w-full p-2 rounded-lg" style="background-color: var(--bg-color); border: 1px solid var(--border-color);">
                                    <option>General Inquiry</option>
                                    <option>Technical Issue</option>
                                    <option>Billing Question</option>
                                    <option>Academic Support</option>
                                    <option>System Access</option>
                                </select>
                                <textarea id="ticket-description" placeholder="Describe your issue..." rows="4" class="w-full p-2 rounded-lg" style="background-color: var(--bg-color); border: 1px solid var(--border-color);"></textarea>
                                <button id="submit-ticket-btn" class="btn-primary w-full py-2">Submit Ticket</button>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h3 class="text-lg font-semibold">My Open Tickets</h3>
                            </div>
                            <div class="card-body" id="open-tickets-container">
                                <!-- Open tickets list -->
                                <p class="text-sm opacity-70" id="no-tickets-msg">No open tickets.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    loadFaqs();
    loadOpenTickets();
    
    const submitTicketBtn = document.getElementById('submit-ticket-btn');
    if (submitTicketBtn) {
        submitTicketBtn.addEventListener('click', handleSubmitTicket);
    }
}

    function loadFaqs() {
        const faqs = [
            { q: 'How do I reset my password?', a: 'You can reset your password from the login page by clicking the \"Forgot Password\" link.' },
            { q: 'Where can I find my grades?', a: 'Navigate to the \"Grade Book\" section from the sidebar to view your grades.' },
        ];
        const accordion = document.getElementById('faq-accordion');
        accordion.innerHTML = faqs.map((faq, index) => `
            <div class="border-b" style="border-color: var(--border-color);">
                <button class="w-full text-left p-4 focus:outline-none" onclick="toggleAccordion(${index})">
                    <h4 class="font-medium">${faq.q}</h4>
                </button>
                <div id="answer-${index}" class="hidden p-4 pt-0">
                    <p class="text-sm opacity-80">${faq.a}</p>
                </div>
            </div>
        `).join('');
    }

    window.toggleAccordion = (index) => {
        const answer = document.getElementById(`answer-${index}`);
        answer.classList.toggle('hidden');
    };

function loadFeedback() {
    contentContainer.innerHTML = `
        <section class="p-6" id="feedback">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-3xl font-bold mb-6" style="color: var(--text-color);">Submit Feedback</h2>
                <div class="card">
                    <div class="card-body space-y-4">
                        <div>
                            <label class="font-medium">Feedback Category</label>
                            <select class="w-full mt-1 p-2 rounded-lg" style="background-color: var(--bg-color); border: 1px solid var(--border-color);">
                                <option>Portal Feedback</option>
                                <option>Course Feedback</option>
                                <option>General Suggestion</option>
                            </select>
                        </div>
                        <div>
                            <label class="font-medium">Your Feedback</label>
                            <textarea placeholder="Tell us what you think..." rows="5" class="w-full mt-1 p-2 rounded-lg" style="background-color: var(--bg-color); border: 1px solid var(--border-color);"></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button id="submit-feedback-btn" class="btn-primary py-2 px-6">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', handleSubmitFeedback);
    }
}

    function loadCareer() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold mb-6" style="color: var(--text-color);">Career Services</h2>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="text-lg font-semibold">Job Board</h3>
                                </div>
                                <div class="card-body">
                                    <!-- Job listings here -->
                                    <p class="text-sm opacity-70">No job listings at this time.</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="card mb-6">
                                <div class="card-header">
                                    <h3 class="text-lg font-semibold">Career Resources</h3>
                                </div>
                                <div class="card-body space-y-3">
                                    <a href="#" class="block hover:underline">Resume Builder</a>
                                    <a href="#" class="block hover:underline">Interview Prep</a>
                                    <a href="#" class="block hover:underline">Workshops</a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="text-lg font-semibold">Schedule an Appointment</h3>
                                </div>
                                <div class="card-body">
                                    <button class="btn-primary w-full py-2">Book Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        // Add event listeners for the career buttons after content is loaded
        setTimeout(() => {
            addCareerButtonListeners();
        }, 100);
    }
    
    function addCareerButtonListeners() {
        const bookNowButton = document.querySelector('#content-container .card button.btn-primary');
        
        if (bookNowButton) {
            bookNowButton.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Appointment booking is not yet available. Please check back later.', 'info');
            });
        }
    }


function loadGrades() {
    contentContainer.innerHTML = `
        <section class="p-6">
            <div class="max-w-7xl mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Grade Book</h2>
                    <div class="flex space-x-2">
                        <select id="semester-filter" class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">All Semesters</option>
                            <option value="spring2024" selected>Spring 2024</option>
                            <option value="fall2023">Fall 2023</option>
                        </select>
                        <button id="grades-export-btn" class="btn-primary py-2 px-4 rounded-lg flex items-center">
                            <i class="fas fa-download mr-2"></i> Export Grades
                        </button>
                    </div>
                </div>

                <!-- Grade Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="card p-6 text-center">
                        <div class="text-5xl font-bold text-blue-600 mb-2">3.7</div>
                        <p class="text-gray-600">Current GPA</p>
                    </div>
                    <div class="card p-6 text-center">
                        <div class="text-5xl font-bold text-green-600 mb-2">3.5</div>
                        <p class="text-gray-600">CGPA</p>
                    </div>
                    <div class="card p-6 text-center">
                        <div class="text-5xl font-bold text-purple-600 mb-2">48</div>
                        <p class="text-gray-600">Completed Credits</p>
                    </div>
                </div>

                <!-- Course Grades Table -->
                <div class="card mb-6 overflow-hidden">
                    <div class="card-header bg-gray-50 p-4 border-b">
                        <h3 class="text-lg font-semibold text-gray-900">Course Grades</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <!-- Grades will be populated here by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- GPA Trend Chart -->
                <div class="card">
                    <div class="card-header bg-gray-50 p-4 border-b">
                        <h3 class="text-lg font-semibold text-gray-900">GPA Trend Analysis</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="h-64">
                            <canvas id="grades-gpa-chart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    setTimeout(() => {
        addGradeBookEventListeners();
        populateGradeData('spring2024');
        initializeGradeBookGPAChart();
    }, 100);
}

function addGradeBookEventListeners() {
    const semesterFilter = document.getElementById('semester-filter');
    if (semesterFilter) {
        semesterFilter.addEventListener('change', (e) => {
            populateGradeData(e.target.value);
        });
    }

    const exportBtn = document.getElementById('grades-export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showNotification('Exporting grade book...', 'info');
        });
    }
}

function populateGradeData(semester) {
    const gradeData = {
        spring2024: [
            { course: 'Programming Fundamentals', instructor: 'Dr. Ahmed Khan', credits: 3, marks: 85, grade: 'A', status: 'Passed' },
            { course: 'Calculus & Analytical Geometry', instructor: 'Dr. Sarah Ali', credits: 4, marks: 78, grade: 'B+', status: 'Passed' },
            { course: 'Technical Writing', instructor: 'Ms. Fatima Rizvi', credits: 3, marks: 65, grade: 'C', status: 'Conditional' },
            { course: 'Physics Lab', instructor: 'Dr. Khalid Mehmood', credits: 1, marks: 92, grade: 'A+', status: 'Passed' }
        ],
        fall2023: [
            { course: 'Introduction to Computing', instructor: 'Dr. Zeshan Haider', credits: 3, marks: 88, grade: 'A', status: 'Passed' },
            { course: 'English Composition', instructor: 'Ms. Hina Aslam', credits: 3, marks: 75, grade: 'B', status: 'Passed' }
        ]
    };

    const tableBody = document.querySelector('.card-body table tbody');
    if (!tableBody) return;

    let coursesToShow = [];
    if (semester === 'all') {
        coursesToShow = [...gradeData.spring2024, ...gradeData.fall2023];
    } else {
        coursesToShow = gradeData[semester] || [];
    }
    
    tableBody.innerHTML = coursesToShow.map(course => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${course.course}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.instructor}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.credits}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.marks}/100</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.grade}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge ${course.status === 'Passed' ? 'badge-success' : 'badge-warning'}">${course.status}</span>
            </td>
        </tr>
    `).join('');
}

    function loadMessages() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold" style="color: var(--text-color);">Messages</h2>
                        <div class="flex space-x-2">
                            <button id="compose-message-btn" class="btn-primary py-2 px-4 rounded-lg flex items-center">
                                <i class="fas fa-edit mr-2"></i> Compose
                            </button>
                            <button id="refresh-messages-btn" class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center hover:bg-gray-50">
                                <i class="fas fa-sync-alt mr-2"></i> Refresh
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <!-- Message Categories Sidebar -->
                        <div class="lg:col-span-1">
                            <div class="card">
                                <div class="card-header bg-gray-50 p-4 border-b">
                                    <h3 class="text-lg font-semibold" style="color: var(--text-color);">Folders</h3>
                                </div>
                                <div class="card-body p-0">
                                    <nav class="space-y-1 p-4">
                                        <a href="#" class="message-folder active flex items-center space-x-3 p-2 rounded-lg" data-folder="inbox">
                                            <i class="fas fa-inbox text-sm"></i>
                                            <span class="font-medium text-sm">Inbox</span>
                                            <span class="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">5</span>
                                        </a>
                                        <a href="#" class="message-folder flex items-center space-x-3 p-2 rounded-lg" data-folder="sent">
                                            <i class="fas fa-paper-plane text-sm"></i>
                                            <span class="font-medium text-sm">Sent</span>
                                        </a>
                                        <a href="#" class="message-folder flex items-center space-x-3 p-2 rounded-lg" data-folder="drafts">
                                            <i class="fas fa-file-alt text-sm"></i>
                                            <span class="font-medium text-sm">Drafts</span>
                                            <span class="bg-gray-500 text-white text-xs rounded-full px-2 py-1 ml-auto">2</span>
                                        </a>
                                        <a href="#" class="message-folder flex items-center space-x-3 p-2 rounded-lg" data-folder="important">
                                            <i class="fas fa-star text-sm"></i>
                                            <span class="font-medium text-sm">Important</span>
                                        </a>
                                        <a href="#" class="message-folder flex items-center space-x-3 p-2 rounded-lg" data-folder="trash">
                                            <i class="fas fa-trash text-sm"></i>
                                            <span class="font-medium text-sm">Trash</span>
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>

                        <!-- Messages List -->
                        <div class="lg:col-span-3">
                            <div class="card">
                                <div class="card-header bg-gray-50 p-4 border-b flex justify-between items-center">
                                    <h3 class="text-lg font-semibold" style="color: var(--text-color);">Inbox</h3>
                                    <div class="flex items-center space-x-2">
                                        <select class="text-sm border rounded px-2 py-1" style="background-color: var(--card-bg); border-color: var(--border-color);">
                                            <option>All Messages</option>
                                            <option>Unread</option>
                                            <option>Read</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="card-body p-0">
                                    <div id="messages-list" class="divide-y" style="divide-color: var(--border-color);">
                                        <!-- Message items will be loaded here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Compose Message Modal -->
                <div id="compose-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md" style="background-color: var(--card-bg);">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold" style="color: var(--text-color);">Compose Message</h3>
                            <button id="close-compose-modal" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <form id="compose-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1" style="color: var(--text-color);">To:</label>
                                <select class="w-full p-2 border rounded-lg" style="background-color: var(--bg-color); border-color: var(--border-color);">
                                    <option>Select Recipient</option>
                                    <option>Dr. Ahmed Khan (Programming Instructor)</option>
                                    <option>Dr. Sarah Ali (Mathematics Instructor)</option>
                                    <option>Ms. Fatima Rizvi (English Instructor)</option>
                                    <option>Academic Office</option>
                                    <option>IT Support</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1" style="color: var(--text-color);">Subject:</label>
                                <input type="text" class="w-full p-2 border rounded-lg" placeholder="Enter subject" style="background-color: var(--bg-color); border-color: var(--border-color);">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1" style="color: var(--text-color);">Message:</label>
                                <textarea rows="6" class="w-full p-2 border rounded-lg" placeholder="Type your message here..." style="background-color: var(--bg-color); border-color: var(--border-color);"></textarea>
                            </div>
                            <div class="flex justify-end space-x-2">
                                <button type="button" id="cancel-compose" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                                <button type="submit" class="btn-primary px-4 py-2 rounded-lg">Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        `;
        
        setTimeout(() => {
            loadMessagesList('inbox');
            addMessagesEventListeners();
        }, 100);
    }

    function loadAnnouncements() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl font-bold" style="color: var(--text-color);">Announcements</h2>
                        <div class="flex space-x-2">
                            <button id="filter-announcements-btn" class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center hover:bg-gray-50">
                                <i class="fas fa-filter mr-2"></i> Filter
                            </button>
                            <button id="refresh-announcements-btn" class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center hover:bg-gray-50">
                                <i class="fas fa-sync-alt mr-2"></i> Refresh
                            </button>
                        </div>
                    </div>

                    <!-- Filter Bar -->
                    <div id="announcements-filter-bar" class="hidden mb-6 bg-white rounded-lg p-4 shadow-sm">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select id="category-filter" class="px-3 py-2 border rounded-lg" style="background-color: var(--bg-color); border-color: var(--border-color);">
                                <option value="all">All Categories</option>
                                <option value="academic">Academic</option>
                                <option value="general">General</option>
                                <option value="urgent">Urgent</option>
                                <option value="events">Events</option>
                                <option value="fees">Fees</option>
                            </select>
                            <select id="date-filter" class="px-3 py-2 border rounded-lg" style="background-color: var(--bg-color); border-color: var(--border-color);">
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                            <button id="clear-filters-btn" class="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50">
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    <!-- Announcements List -->
                    <div class="space-y-6" id="announcements-list">
                        <!-- Urgent Announcement -->
                        <div class="card border-l-4 border-red-500 bg-red-50 announcement-item" data-category="urgent" data-date="2024-08-07">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-semibold text-red-800">URGENT: Fee Payment Deadline</h3>
                                            <div class="flex items-center space-x-4 text-sm text-red-600">
                                                <span><i class="fas fa-tag mr-1"></i>Urgent</span>
                                                <span><i class="fas fa-calendar mr-1"></i>Aug 7, 2024</span>
                                                <span><i class="fas fa-user mr-1"></i>Finance Office</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="px-3 py-1 text-xs font-medium bg-red-200 text-red-800 rounded-full">URGENT</span>
                                </div>
                                <p class="text-gray-700 mb-4">Reminder: The last date for semester fee submission is August 15, 2024. After this date, a late fee penalty of PKR 5,000 will be charged. Please ensure timely payment to avoid any inconvenience.</p>
                                <div class="flex items-center justify-between">
                                    <button class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center">
                                        <i class="fas fa-external-link-alt mr-1"></i> Pay Now
                                    </button>
                                    <span class="text-xs text-gray-500">Posted 2 hours ago</span>
                                </div>
                            </div>
                        </div>

                        <!-- Academic Announcement -->
                        <div class="card border-l-4 border-blue-500 announcement-item" data-category="academic" data-date="2024-08-06">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <i class="fas fa-graduation-cap text-blue-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-semibold" style="color: var(--text-color);">Mid-Term Examination Schedule Released</h3>
                                            <div class="flex items-center space-x-4 text-sm" style="color: var(--text-color); opacity: 0.7;">
                                                <span><i class="fas fa-tag mr-1"></i>Academic</span>
                                                <span><i class="fas fa-calendar mr-1"></i>Aug 6, 2024</span>
                                                <span><i class="fas fa-user mr-1"></i>Academic Office</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">ACADEMIC</span>
                                </div>
                                <p style="color: var(--text-color); opacity: 0.8;" class="mb-4">The mid-term examination schedule for Spring 2024 semester has been uploaded to the student portal. Examinations will be conducted from August 15-25, 2024. Please check your individual timetable for specific dates and venues.</p>
                                <div class="flex items-center justify-between">
                                    <button class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                        <i class="fas fa-download mr-1"></i> Download Schedule
                                    </button>
                                    <span class="text-xs" style="color: var(--text-color); opacity: 0.5;">Posted yesterday</span>
                                </div>
                            </div>
                        </div>

                        <!-- Event Announcement -->
                        <div class="card border-l-4 border-green-500 announcement-item" data-category="events" data-date="2024-08-05">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <i class="fas fa-calendar-plus text-green-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-semibold" style="color: var(--text-color);">Tech Fest 2024 - Registration Open</h3>
                                            <div class="flex items-center space-x-4 text-sm" style="color: var(--text-color); opacity: 0.7;">
                                                <span><i class="fas fa-tag mr-1"></i>Events</span>
                                                <span><i class="fas fa-calendar mr-1"></i>Aug 5, 2024</span>
                                                <span><i class="fas fa-user mr-1"></i>Student Affairs</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">EVENT</span>
                                </div>
                                <p style="color: var(--text-color); opacity: 0.8;" class="mb-4">Registration is now open for Tech Fest 2024, scheduled for September 5-7, 2024. Join us for three days of innovation, competitions, and networking. Categories include: Programming Contest, Robotics, Web Development, and AI Challenge.</p>
                                <div class="flex items-center justify-between">
                                    <button class="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                                        <i class="fas fa-user-plus mr-1"></i> Register Now
                                    </button>
                                    <span class="text-xs" style="color: var(--text-color); opacity: 0.5;">Posted 2 days ago</span>
                                </div>
                            </div>
                        </div>

                        <!-- General Announcement -->
                        <div class="card border-l-4 border-yellow-500 announcement-item" data-category="general" data-date="2024-08-04">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <i class="fas fa-info-circle text-yellow-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-semibold" style="color: var(--text-color);">Library Timings Extended</h3>
                                            <div class="flex items-center space-x-4 text-sm" style="color: var(--text-color); opacity: 0.7;">
                                                <span><i class="fas fa-tag mr-1"></i>General</span>
                                                <span><i class="fas fa-calendar mr-1"></i>Aug 4, 2024</span>
                                                <span><i class="fas fa-user mr-1"></i>Library Administration</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">GENERAL</span>
                                </div>
                                <p style="color: var(--text-color); opacity: 0.8;" class="mb-4">The digital library hours have been extended from 8:00 AM to 10:00 PM on weekdays, effective immediately. Weekend timings remain 9:00 AM to 6:00 PM. Students can now access study resources and research materials for extended hours.</p>
                                <div class="flex items-center justify-between">
                                    <button class="text-yellow-600 hover:text-yellow-800 text-sm font-medium flex items-center">
                                        <i class="fas fa-book mr-1"></i> Visit Library
                                    </button>
                                    <span class="text-xs" style="color: var(--text-color); opacity: 0.5;">Posted 3 days ago</span>
                                </div>
                            </div>
                        </div>

                        <!-- Academic Announcement -->
                        <div class="card border-l-4 border-purple-500 announcement-item" data-category="academic" data-date="2024-08-03">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                            <i class="fas fa-chalkboard-teacher text-purple-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-semibold" style="color: var(--text-color);">Guest Lecture: Industry Trends in AI</h3>
                                            <div class="flex items-center space-x-4 text-sm" style="color: var(--text-color); opacity: 0.7;">
                                                <span><i class="fas fa-tag mr-1"></i>Academic</span>
                                                <span><i class="fas fa-calendar mr-1"></i>Aug 3, 2024</span>
                                                <span><i class="fas fa-user mr-1"></i>CS Department</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">ACADEMIC</span>
                                </div>
                                <p style="color: var(--text-color); opacity: 0.8;" class="mb-4">Join us for an exclusive guest lecture by Dr. Maria Khan, AI Research Director at TechCorp, on "Emerging Trends in Artificial Intelligence and Machine Learning". The session is scheduled for August 14, 2024, at 1:00 PM in the Main Auditorium.</p>
                                <div class="flex items-center justify-between">
                                    <button class="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                                        <i class="fas fa-calendar-check mr-1"></i> Add to Calendar
                                    </button>
                                    <span class="text-xs" style="color: var(--text-color); opacity: 0.5;">Posted 4 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Load More Button -->
                    <div class="text-center mt-8">
                        <button id="load-more-announcements" class="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50">
                            <i class="fas fa-plus mr-2"></i> Load More Announcements
                        </button>
                    </div>
                </div>
            </section>
        `;
        
        setTimeout(() => {
            addAnnouncementsEventListeners();
        }, 100);
    }

    function loadForums() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Discussion Forums</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadNotifications() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Notifications</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadLibrary() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Digital Library</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }
    function loadDownloads() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Downloads</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadELearning() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">E-Learning</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadResearch() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Research Portal</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    function loadTransport() {
        contentContainer.innerHTML = `
            <section class="p-6">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-3xl font-bold" style="color: var(--text-color);">Transport</h2>
                    <p class="mt-2" style="color: var(--text-color); opacity: 0.8;">This page is under construction. Please check back later.</p>
                </div>
            </section>
        `;
    }

    // Function to handle Submit Ticket button click
    function handleSubmitTicket(e) {
        e.preventDefault();
        
        // Get form values
        const ticketType = document.getElementById('ticket-type').value;
        const ticketDescription = document.getElementById('ticket-description').value.trim();
        
        // Validate form
        if (!ticketDescription) {
            showNotification('Please describe your issue before submitting.', 'error');
            return;
        }
        
        // Generate ticket ID and current date
        const ticketId = 'TKT-' + Date.now().toString().slice(-6);
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create ticket object
        const newTicket = {
            id: ticketId,
            type: ticketType,
            description: ticketDescription,
            date: currentDate,
            status: 'Open',
            priority: getPriorityByType(ticketType)
        };
        
        // Save ticket to localStorage
        saveTicket(newTicket);
        
        // Clear form
        document.getElementById('ticket-description').value = '';
        
        // Refresh the open tickets display
        loadOpenTickets();
        
        // Show success message
        showNotification(`Support ticket submitted successfully! Your ticket ID is: ${ticketId}. Our support team will contact you within 24 hours.`, 'success');
        
        console.log('Ticket submitted:', newTicket);
    }
    
    // Function to handle Submit Feedback button click
    function handleSubmitFeedback(e) {
        e.preventDefault();
        
        // Get form values
        const feedbackCategory = document.querySelector('#feedback select').value;
        const feedbackText = document.querySelector('#feedback textarea').value.trim();
        
        // Validate form
        if (!feedbackText) {
            showNotification('Please enter your feedback before submitting.', 'error');
            return;
        }
        
        // Clear form
        document.querySelector('#feedback textarea').value = '';
        
        // Show success message
        showNotification('Thank you for your feedback! Your input has been recorded and will help us improve our services.', 'success');
        
        console.log('Feedback submitted:', { category: feedbackCategory, feedback: feedbackText });
    }
    
    // Function to show notification messages
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        
        // Set styling based on type
        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-3"></i>
                    <div>
                        <p class="font-medium">Success!</p>
                        <p class="text-sm opacity-90">${message}</p>
                    </div>
                </div>
            `;
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle mr-3"></i>
                    <div>
                        <p class="font-medium">Error!</p>
                        <p class="text-sm opacity-90">${message}</p>
                    </div>
                </div>
            `;
        } else {
            notification.classList.add('bg-blue-500', 'text-white');
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-info-circle mr-3"></i>
                    <div>
                        <p class="font-medium">Info</p>
                        <p class="text-sm opacity-90">${message}</p>
                    </div>
                </div>
            `;
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Function to get priority based on ticket type
    function getPriorityByType(ticketType) {
        const priorityMap = {
            'Technical Issue': 'High',
            'System Access': 'High',
            'Billing Question': 'Medium',
            'Academic Support': 'Medium',
            'General Inquiry': 'Low'
        };
        return priorityMap[ticketType] || 'Medium';
    }
    
    // Function to save ticket to localStorage
    function saveTicket(ticket) {
        let tickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
        tickets.push(ticket);
        localStorage.setItem('supportTickets', JSON.stringify(tickets));
    }
    
    // Function to get all tickets from localStorage
    function getTickets() {
        return JSON.parse(localStorage.getItem('supportTickets')) || [];
    }
    
    // Function to load and display open tickets
    function loadOpenTickets() {
        const tickets = getTickets();
        const openTickets = tickets.filter(ticket => ticket.status === 'Open');
        const ticketsContainer = document.getElementById('open-tickets-container');
        const noTicketsMsg = document.getElementById('no-tickets-msg');
        
        if (!ticketsContainer) return;
        
        if (openTickets.length === 0) {
            if (noTicketsMsg) {
                noTicketsMsg.style.display = 'block';
            }
            // Clear any existing ticket displays
            const existingTickets = ticketsContainer.querySelectorAll('.ticket-item');
            existingTickets.forEach(ticket => ticket.remove());
        } else {
            if (noTicketsMsg) {
                noTicketsMsg.style.display = 'none';
            }
            
            // Clear existing tickets first
            const existingTickets = ticketsContainer.querySelectorAll('.ticket-item');
            existingTickets.forEach(ticket => ticket.remove());
            
            // Add new tickets
            openTickets.forEach(ticket => {
                const ticketElement = document.createElement('div');
                ticketElement.className = 'ticket-item border rounded-lg p-3 mb-3';
                ticketElement.style.borderColor = 'var(--border-color)';
                ticketElement.style.backgroundColor = 'var(--card-bg)';
                
                const priorityColor = {
                    'High': 'text-red-600 bg-red-100',
                    'Medium': 'text-yellow-600 bg-yellow-100',
                    'Low': 'text-green-600 bg-green-100'
                }[ticket.priority] || 'text-gray-600 bg-gray-100';
                
                ticketElement.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div class="font-medium text-sm" style="color: var(--text-color);">${ticket.id}</div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${priorityColor}">${ticket.priority}</span>
                    </div>
                    <div class="text-sm mb-2" style="color: var(--text-color); opacity: 0.8;">
                        <strong>Type:</strong> ${ticket.type}
                    </div>
                    <div class="text-sm mb-2" style="color: var(--text-color); opacity: 0.8;">
                        <strong>Date:</strong> ${ticket.date}
                    </div>
                    <div class="text-sm" style="color: var(--text-color); opacity: 0.7;">
                        ${ticket.description.length > 60 ? ticket.description.substring(0, 60) + '...' : ticket.description}
                    </div>
                    <div class="mt-3 flex justify-between items-center">
                        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">${ticket.status}</span>
                        <div>
                            <button class="text-xs text-blue-600 hover:text-blue-800 underline" onclick="viewTicketDetails('${ticket.id}')">View Details</button>
                            <button class="text-xs text-red-600 hover:text-red-800 underline ml-2" onclick="closeTicket('${ticket.id}')">Close</button>
                        </div>
                    </div>
                `;
                
                ticketsContainer.appendChild(ticketElement);
            });
        }
    }
    
    // Function to view ticket details (placeholder for future implementation)
    window.viewTicketDetails = function(ticketId) {
        const tickets = getTickets();
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            alert(`Ticket Details:\n\nID: ${ticket.id}\nType: ${ticket.type}\nPriority: ${ticket.priority}\nDate: ${ticket.date}\nStatus: ${ticket.status}\n\nDescription:\n${ticket.description}`);
        }
    };

    window.closeTicket = function(ticketId) {
        let tickets = getTickets();
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex > -1) {
            tickets[ticketIndex].status = 'Closed';
            localStorage.setItem('supportTickets', JSON.stringify(tickets));
            loadOpenTickets();
            showNotification(`Ticket ${ticketId} has been closed.`, 'info');
        }
    };
    
    // Function to initialize Results GPA Chart
    function initializeResultsGPAChart() {
        const canvas = document.getElementById('results-gpa-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // GPA data for different semesters
        const gpaData = {
            labels: ['Fall 2022', 'Spring 2023', 'Fall 2023', 'Spring 2024'],
            datasets: [{
                label: 'GPA Trend',
                data: [3.2, 3.4, 3.3, 3.7],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `GPA: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 2.5,
                    max: 4.0,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#6b7280',
                        stepSize: 0.5
                    }
                }
            },
            elements: {
                point: {
                    hoverBorderWidth: 3
                }
            }
        };

        new Chart(ctx, {
            type: 'line',
            data: gpaData,
            options: options
        });
    }

    // Function to initialize Grade Book GPA Chart
    function initializeGradeBookGPAChart() {
        const canvas = document.getElementById('grades-gpa-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // GPA data for grade book semesters
        const gpaData = {
            labels: ['Fall 2022', 'Spring 2023', 'Fall 2023', 'Spring 2024'],
            datasets: [{
                label: 'GPA Trend',
                data: [3.2, 3.4, 3.3, 3.7],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: context => `GPA: ${context.parsed.y}`
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#6b7280' } },
                y: {
                    beginAtZero: false,
                    min: 2.5,
                    max: 4.0,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#6b7280', stepSize: 0.5 }
                }
            },
            elements: { point: { hoverBorderWidth: 3 } }
        };

        new Chart(ctx, { type: 'line', data: gpaData, options: options });
    }

    } // Close the dashboard functionality section
});
