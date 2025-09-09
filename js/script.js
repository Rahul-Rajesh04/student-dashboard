// js/script.js

/**
 * Wait for the DOM to be fully loaded before running any scripts.
 * This is a crucial step to ensure that all HTML elements are available for manipulation.
 */
document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    // MOCK DATA SOURCE
    // In a real-world application, this object would be replaced by responses from a server API.
    // =================================================================================
    const mockData = {
        user: {
            name: "John Doe",
            id: "CSE2024001",
            firstName: "John",
            email: "john.doe@university.edu",
            profilePic: "assets/images/profile-pic.png",
        },
        courses: [
            { id: "CSE301", name: "Data Structures and Algorithms", instructor: "Dr. Deepa Yogesh", schedule: "Mon, Wed, Fri 10:00 - 11:00 AM", progress: 75, grade: "A" },
            { id: "AIML501", name: "Machine Learning Fundamentals", instructor: "Prof. Sharon Roji Prisa C", schedule: "Tue, Thu 2:00 - 3:30 PM", progress: 50, grade: "A-" },
            { id: "CSE401", name: "Data Base Management Systems", instructor: "Dr. Naveen J", schedule: "Mon, Wed 3:00 - 4:00 PM", progress: 82, grade: "B" },
            { id: "GEN101", name: "Professional Ethics", instructor: "Dr. Ananya Sharma", schedule: "Tue 11:00 AM - 1:00 PM", progress: 95, grade: "O" }
        ],
        // UPDATED assignments array with new data and types
        assignments: [
            // September Assignments
            { id: 1, courseId: "CSE301", title: "Lab Assignment 5: Heaps", dueDate: "2025-09-10", status: "Submitted", type: "Lab" },
            { id: 2, courseId: "CSE301", title: "Project Phase 1", dueDate: "2025-09-22", status: "Pending", type: "Project" },
            { id: 3, courseId: "AIML501", title: "K-Means Clustering Implementation", dueDate: "2025-09-15", status: "Graded", score: "9/10", type: "Lab" },
            { id: 4, courseId: "AIML501", title: "Research Paper Review", dueDate: "2025-09-29", status: "Pending", type: "Report" },
            { id: 5, courseId: "CSE401", title: "ER Diagram Design", dueDate: "2025-09-12", status: "Submitted", type: "Project" },
            { id: 6, courseId: "CSE401", title: "SQL Query Practice", dueDate: "2025-09-25", status: "Pending", type: "Lab" },
            { id: 7, courseId: "GEN101", title: "Case Study Analysis", dueDate: "2025-09-08", status: "Graded", score: "10/10", type: "Report" },
            
            // New Assignments for Other Months
            { id: 8, courseId: "GEN101", title: "Final Report Draft", dueDate: "2025-08-28", status: "Submitted", type: "Report" },
            { id: 9, courseId: "CSE301", title: "Quiz 2: Graphs", dueDate: "2025-10-06", status: "Pending", type: "Quiz" },
            { id: 10, courseId: "AIML501", title: "Project Mid-review", dueDate: "2025-10-15", status: "Pending", type: "Project" },
            { id: 11, courseId: "CSE401", title: "Lab 7: Normalization", dueDate: "2025-10-22", status: "Pending", type: "Lab" }
        ],
        grades: { "A": 2, "A-": 1, "B": 1, "O": 1 } // Grade distribution for the chart
    };

    // =================================================================================
    // GLOBAL UI FUNCTIONS
    // =================================================================================

    function setupMobileMenu() {
        const menuButton = document.querySelector('.mobile-menu-button');
        const sidebar = document.querySelector('.sidebar');
        if (menuButton && sidebar) {
            menuButton.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
    }

/**
 * Populates the header and other dynamic elements by fetching the current user's data from the server.
 */
/**
     * Populates the header and other dynamic elements by fetching the current user's data from the server.
     */
    async function populateUserData() {
        try {
            const response = await fetch('/api/current-user');
            
            // If the server says we're not logged in, redirect to the login page
            if (!response.ok) {
                // Check if we are not already on a public page before redirecting
                const currentPage = window.location.pathname.split('/').pop();
                if (currentPage !== 'login.html' && currentPage !== 'signup.html') {
                    window.location.href = 'login.html';
                }
                return;
            }

            const user = await response.json();

            // Populate all elements with the user's name
            document.querySelectorAll('#user-name').forEach(el => el.textContent = user.fullName);
            
            // Populate the welcome banner on the dashboard
            const welcomeName = document.querySelector('#welcome-user-name');
            if (welcomeName) {
                const firstName = user.fullName.split(' ')[0];
                welcomeName.textContent = firstName;
            }

            // Populate the email as the ID for now
            document.querySelectorAll('#user-id').forEach(el => el.textContent = user.email);
            
            // Populate the fields on the profile page
            const profileName = document.getElementById('profile-name');
            if (profileName) profileName.value = user.fullName;
            
            const profileEmail = document.getElementById('profile-email');
            if (profileEmail) profileEmail.value = user.email;

            const profileId = document.getElementById('profile-id-field');
            if (profileId) profileId.value = user._id; // Assuming user object has _id

        } catch (error) {
            console.error('Failed to fetch user data, redirecting to login.', error);
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage !== 'login.html' && currentPage !== 'signup.html') {
                window.location.href = 'login.html';
            }
        }
    }

    // =================================================================================
    // PAGE-SPECIFIC RENDERER FUNCTIONS
    // =================================================================================

    function renderCourses(containerId, courses) {
        const container = document.getElementById(containerId);
        if (!container) return; 

        container.innerHTML = '';
        courses.forEach(course => {
            const courseCardHTML = `
                <div class="card course-card">
                    <div class="course-card-header">
                        <div>
                            <h3>${course.id}</h3>
                            <p>${course.name}</p>
                        </div>
                        <span class="grade-badge">${course.grade}</span>
                    </div>
                    <div class="course-card-body">
                       <p><i class="icon fa-solid fa-user-tie"></i> ${course.instructor}</p>
                       <p><i class="icon fa-solid fa-clock"></i> ${course.schedule}</p>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-label">
                            <span>Course Progress</span>
                            <span>${course.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${course.progress}%;"></div>
                        </div>
                    </div>
                    <div class="course-card-footer">
                        <span>${mockData.assignments.filter(a => a.courseId === course.id && a.status === 'Pending').length} pending assignments</span>
                        <a href="course_detail.html?courseId=${course.id}" class="btn btn-primary" style="padding: 8px 15px;">View</a>
                    </div>
                </div>`;
            container.innerHTML += courseCardHTML;
        });
    }

    function renderAllAssignments() {
        const tableBody = document.getElementById('assignments-table-body');
        const sortControl = document.getElementById('sort-assignments');
        if (!tableBody || !sortControl) return;

        let assignmentsToRender = [...mockData.assignments];

        sortControl.addEventListener('change', () => renderTable(sortControl.value));

        function renderTable(sortBy = 'due-date') {
            if (sortBy === 'course') {
                assignmentsToRender.sort((a, b) => a.courseId.localeCompare(b.courseId));
            } else if (sortBy === 'status') {
                 assignmentsToRender.sort((a, b) => a.status.localeCompare(b.status));
            } else {
                 assignmentsToRender.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            }

            tableBody.innerHTML = '';
            assignmentsToRender.forEach(assignment => {
                const course = mockData.courses.find(c => c.id === assignment.courseId);
                const rowHTML = `
                    <tr>
                        <td><span class="status-badge ${assignment.status.toLowerCase()}">${assignment.status}</span></td>
                        <td>${assignment.title}</td>
                        <td>${course.name}</td>
                        <td>${new Date(assignment.dueDate).toLocaleDateString()}</td>
                        <td>
                            <a href="course_detail.html?courseId=${course.id}" class="btn btn-primary btn-small">View Course</a>
                        </td>
                    </tr>`;
                tableBody.innerHTML += rowHTML;
            });
        }
        renderTable();
    }
    
    function renderCourseDetail() {
        const header = document.getElementById('course-detail-header');
        if (!header) return;

        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('courseId');
        const course = mockData.courses.find(c => c.id === courseId);

        if (!course) {
            document.querySelector('.page-content').innerHTML = '<h1>Course not found.</h1>';
            return;
        }

        document.getElementById('course-page-title').textContent = course.name;
        header.innerHTML = `<h2>${course.id}: ${course.name}</h2><p><strong>Instructor:</strong> ${course.instructor}</p>`;

        const assignmentList = document.getElementById('course-assignment-list');
        const assignmentSelect = document.getElementById('assignment-select');
        const courseAssignments = mockData.assignments.filter(a => a.courseId === courseId);

        assignmentList.innerHTML = '';
        assignmentSelect.innerHTML = '';
        courseAssignments.forEach(a => {
            assignmentList.innerHTML += `<li><strong>${a.title}</strong> - Due: ${new Date(a.dueDate).toLocaleDateString()} [${a.status}]</li>`;
            if (a.status === 'Pending') {
                 assignmentSelect.innerHTML += `<option value="${a.id}">${a.title}</option>`;
            }
        });
        
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.getAttribute('data-tab');
                
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                link.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    /**
     * Renders the profile page, including the form, grades chart, and tab functionality.
     */
async function renderProfilePage() {
    // Exit if not on the profile page
    if (!document.getElementById('profile-form')) return;

    // --- Tab Switching and Edit Button Logic (remains the same) ---
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const formInputs = document.querySelectorAll('#profile-form .form-control');
    editBtn.addEventListener('click', () => {
        formInputs.forEach(input => {
            if (input.id !== 'profile-id-field') input.disabled = false;
        });
        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
    });
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- NEW: Delete Account Modal Logic ---
    const showDeleteModalBtn = document.getElementById('show-delete-modal-btn');
    const deleteModal = document.getElementById('delete-account-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const cancelDeleteBtn2 = document.getElementById('cancel-delete-btn-2');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const deleteConfirmInput = document.getElementById('delete-confirm-input');

    const openDeleteModal = () => deleteModal.classList.add('active');
    const closeDeleteModal = () => {
        deleteConfirmInput.value = ''; // Clear input on close
        confirmDeleteBtn.disabled = true; // Re-disable button
        deleteModal.classList.remove('active');
    };

    showDeleteModalBtn.addEventListener('click', openDeleteModal);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    cancelDeleteBtn2.addEventListener('click', closeDeleteModal);

    // Enable the final delete button only when the user types "DELETE"
    deleteConfirmInput.addEventListener('input', () => {
        if (deleteConfirmInput.value === 'DELETE') {
            confirmDeleteBtn.disabled = false;
        } else {
            confirmDeleteBtn.disabled = true;
        }
    });

    // Handle the final account deletion
    confirmDeleteBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/delete-account', {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Account deleted successfully. You have been logged out.');
                window.location.href = 'login.html'; // Redirect to login page
            } else {
                alert('Failed to delete account. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('A network error occurred.');
        } finally {
            closeDeleteModal();
        }
    });
}
    // UPDATED setupCalendar function with new logic
    function setupCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;

        const monthYearTitle = document.getElementById('month-year-title');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');

        let currentDate = new Date(2025, 8, 1);

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            monthYearTitle.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

            calendarGrid.innerHTML = `
                <div class="day-name">Sun</div> <div class="day-name">Mon</div> <div class="day-name">Tue</div>
                <div class="day-name">Wed</div> <div class="day-name">Thu</div> <div class="day-name">Fri</div>
                <div class="day-name">Sat</div>
            `;

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
            const lastDateOfPrevMonth = new Date(year, month, 0).getDate();
            
            for (let i = firstDayOfMonth; i > 0; i--) {
                const day = lastDateOfPrevMonth - i + 1;
                calendarGrid.innerHTML += `<div class="day other-month"><span>${day}</span></div>`;
            }

            const today = new Date(2025, 8, 9);
            today.setHours(0, 0, 0, 0);

            for (let i = 1; i <= lastDateOfMonth; i++) {
                let dayClasses = "day";
                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayClasses += " current-day";
                }
                
                let eventsHTML = '';
                const checkDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                
                mockData.assignments.forEach(a => {
                    if (a.dueDate === checkDateStr) {
                        const assignmentDueDate = new Date(a.dueDate + 'T00:00:00');
                        let eventClasses = 'event';

                        if (a.type) {
                            eventClasses += ` event-${a.type.toLowerCase()}`;
                        }
                        
                        if (assignmentDueDate < today) {
                            eventClasses += ' past-due';
                        }
                        
                        eventsHTML += `<div class="${eventClasses}">${a.title}</div>`;
                    }
                });

                calendarGrid.innerHTML += `<div class="${dayClasses}"><span>${i}</span>${eventsHTML}</div>`;
            }

            const totalDaysRendered = firstDayOfMonth + lastDateOfMonth;
            const nextMonthDays = (7 - (totalDaysRendered % 7)) % 7;
            for (let i = 1; i <= nextMonthDays; i++) {
                 calendarGrid.innerHTML += `<div class="day other-month"><span>${i}</span></div>`;
            }
        }

        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        renderCalendar();
    }

    // Add this entire new function
/**
 * Sets up interactivity for the notifications page.
 */
function setupNotificationsPage() {
    const markAllReadBtn = document.getElementById('mark-all-read-btn');
    if (!markAllReadBtn) return; // Only run on the notifications page

    markAllReadBtn.addEventListener('click', () => {
        // Find all notification items that have the 'unread' class
        const unreadItems = document.querySelectorAll('.notification-item.unread');

        // Loop through each unread item and remove the 'unread' class
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
    });
}
// Add this entire new function
/**
 * Sets up interactivity for the messages page.
 */
/**
     * Sets up interactivity for the messages page, including the compose modal.
     */
    function setupMessagesPage() {
        // --- Dynamic Name Insertion ---
        const nameSpans = document.querySelectorAll('.message-user-name');
        if (nameSpans.length > 0) {
            nameSpans.forEach(span => {
                span.textContent = mockData.user.firstName;
            });
        }

        // --- Compose Modal Logic ---
        const composeBtn = document.getElementById('compose-btn');
        const modalOverlay = document.getElementById('compose-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const cancelModalBtn = document.getElementById('cancel-modal-btn');
        const composeForm = document.getElementById('compose-form');

        // Exit if the modal elements aren't on the page
        if (!composeBtn || !modalOverlay) return;

        // Function to open the modal
        const openModal = () => {
            modalOverlay.classList.add('active');
        };

        // Function to close the modal
        const closeModal = () => {
            composeForm.reset(); // Clear the form fields
            modalOverlay.classList.remove('active');
        };

        // Event listeners
        composeBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        cancelModalBtn.addEventListener('click', closeModal);

        // Also close the modal if the user clicks on the dark overlay
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Handle the form submission
        composeForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the page from reloading
            alert('Message sent successfully!'); // Simulate sending the message
            closeModal();
        });
    }
/**
     * Sets up client-side validation and server communication for login and signup forms.
     */
    /**
 * Sets up client-side validation and server communication for login and signup forms.
 */
/**
     * Sets up client-side validation and server communication for login and signup forms.
     */
    function handleAuthForms() {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault(); // Prevents the form from submitting to login.html
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const errorEl = document.getElementById('login-error');

                try {
                    // Send login data to the correct API endpoint
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // On successful login, redirect to the dashboard
                        errorEl.style.display = 'none';
                        window.location.href = 'dashboard.html';
                    } else {
                        // Show error message from the server
                        errorEl.textContent = result.message;
                        errorEl.style.display = 'block';
                    }
                } catch (error) {
                    console.error('Login fetch error:', error);
                    errorEl.textContent = 'A network error occurred. Please try again.';
                    errorEl.style.display = 'block';
                }
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const fullName = document.getElementById('fullname').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                const errorEl = document.getElementById('signup-error');

                if (password !== confirmPassword) {
                    errorEl.textContent = 'Passwords do not match.';
                    errorEl.style.display = 'block';
                    return;
                }

                try {
                    const response = await fetch('/api/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fullname: fullName, email, password }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        errorEl.style.display = 'none';
                        alert('Signup successful! Please log in.');
                        window.location.href = 'login.html';
                    } else {
                        errorEl.textContent = result.message;
                        errorEl.style.display = 'block';
                    }
                } catch (error) {
                    console.error('Signup fetch error:', error);
                    errorEl.textContent = 'A network error occurred. Please try again.';
                    errorEl.style.display = 'block';
                }
            });
        }
    }

// =================================================================================
    // INITIALIZATION & ROUTING
    // =================================================================================

    setupMobileMenu();
    const currentPage = window.location.pathname.split('/').pop();

    // Protect all pages except login and signup
    if (currentPage !== 'login.html' && currentPage !== 'signup.html') {
        populateUserData();
    }
    
    // Run page-specific functions
    if (currentPage === 'dashboard.html' || currentPage === '') {
        renderCourses('dashboard-courses-container', mockData.courses.slice(0, 3));
    }
    if (currentPage === 'courses.html') {
        renderCourses('course-list-container', mockData.courses);
    }
    if (currentPage === 'assignments.html') {
        renderAllAssignments();
    }
    if (currentPage === 'course_detail.html') {
        renderCourseDetail();
    }
    if (currentPage === 'profile.html') {
        renderProfilePage();
    }
    if (currentPage === 'calendar.html') {
        setupCalendar();
    }
    if (currentPage === 'notifications.html') {
        setupNotificationsPage();
    }
    if (currentPage === 'messages.html') {
        setupMessagesPage();
    }
    if (currentPage === 'login.html' || currentPage === 'signup.html') {
        handleAuthForms();
    }

    // Inject status badge styles
    document.head.insertAdjacentHTML('beforeend', `<style>
        .status-badge { padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; color: white; font-weight: 500; }
        .status-badge.pending { background-color: var(--color-warning); color: var(--color-primary); }
        .status-badge.submitted { background-color: var(--color-accent); }
        .status-badge.graded { background-color: var(--color-success); }
    </style>`);
    
    // Fallback for dashboard grid ID
    if(document.querySelector('.grid-container')) {
        const grid = document.querySelector('.grid-container');
        if(!grid.id) {
           grid.id = 'dashboard-courses-container';
           renderCourses('dashboard-courses-container', mockData.courses.slice(0, 3));
        }
    }

}); // End of DOMContentLoaded