// js/script.js

/**
 * Wait for the DOM to be fully loaded before running any scripts.
 * This is a crucial step to ensure that all HTML elements are available for manipulation.
 */
document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    // MOCK DATA SOURCE
    // In a real-world application, this object would be replaced by responses from a server API.
    // We've structured it to mimic a real API response for easy future integration.
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
        assignments: [
            { id: 1, courseId: "CSE301", title: "Lab Assignment 5: Heaps", dueDate: "2025-09-10", status: "Submitted" },
            { id: 2, courseId: "CSE301", title: "Project Phase 1", dueDate: "2025-09-22", status: "Pending" },
            { id: 3, courseId: "AIML501", title: "K-Means Clustering Implementation", dueDate: "2025-09-15", status: "Graded", score: "9/10" },
            { id: 4, courseId: "AIML501", title: "Research Paper Review", dueDate: "2025-09-29", status: "Pending" },
            { id: 5, courseId: "CSE401", title: "ER Diagram Design", dueDate: "2025-09-12", status: "Submitted" },
            { id: 6, courseId: "CSE401", title: "SQL Query Practice", dueDate: "2025-09-25", status: "Pending" },
            { id: 7, courseId: "GEN101", title: "Case Study Analysis", dueDate: "2025-09-08", status: "Graded", score: "10/10" }
        ],
        grades: { "A": 2, "A-": 1, "B": 1, "O": 1 } // Grade distribution for the chart
    };

    // =================================================================================
    // GLOBAL UI FUNCTIONS
    // These functions handle components that appear on multiple pages, like the sidebar and header.
    // =================================================================================

    /**
     * Toggles the mobile sidebar's visibility.
     */
    function setupMobileMenu() {
        const menuButton = document.querySelector('.mobile-menu-button');
        const sidebar = document.querySelector('.sidebar');
        if (menuButton && sidebar) {
            menuButton.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
    }

    /**
     * Populates the header with the current user's name and ID.
     * @param {object} user - The user data object.
     */
    function populateHeader(user) {
        document.querySelectorAll('#user-name').forEach(el => el.textContent = user.name);
        document.querySelectorAll('#user-id').forEach(el => el.textContent = `ID: ${user.id}`);
        const welcomeName = document.querySelector('#welcome-user-name');
        if(welcomeName) welcomeName.textContent = user.firstName;
    }


    // =================================================================================
    // PAGE-SPECIFIC RENDERER FUNCTIONS
    // Each function is responsible for populating the content of a specific page.
    // =================================================================================

    /**
     * Renders course cards into a specified container.
     * @param {string} containerId - The ID of the element to inject course cards into.
     * @param {Array} courses - An array of course objects.
     */
    function renderCourses(containerId, courses) {
        const container = document.getElementById(containerId);
        if (!container) return; // Exit if the container isn't on the current page

        container.innerHTML = ''; // Clear existing content
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

    /**
     * Renders all assignments into the master assignment table.
     */
    function renderAllAssignments() {
        const tableBody = document.getElementById('assignments-table-body');
        const sortControl = document.getElementById('sort-assignments');
        if (!tableBody || !sortControl) return;

        let assignmentsToRender = [...mockData.assignments]; // Create a copy to sort

        // Add sorting logic based on dropdown selection
        sortControl.addEventListener('change', () => renderTable(sortControl.value));

        function renderTable(sortBy = 'due-date') {
            // Sorting logic
            if (sortBy === 'course') {
                assignmentsToRender.sort((a, b) => a.courseId.localeCompare(b.courseId));
            } else if (sortBy === 'status') {
                 assignmentsToRender.sort((a, b) => a.status.localeCompare(b.status));
            } else { // Default to due date
                 assignmentsToRender.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            }

            tableBody.innerHTML = ''; // Clear table
            assignmentsToRender.forEach(assignment => {
                const course = mockData.courses.find(c => c.id === assignment.courseId);
                const rowHTML = `
                    <tr>
                        <td><span class="status-badge ${assignment.status.toLowerCase()}">${assignment.status}</span></td>
                        <td>${assignment.title}</td>
                        <td>${course.name}</td>
                        <td>${new Date(assignment.dueDate).toLocaleDateString()}</td>
                    </tr>`;
                tableBody.innerHTML += rowHTML;
            });
        }
        renderTable(); // Initial render
    }
    
    /**
     * Renders the details for a single course page.
     */
    function renderCourseDetail() {
        const header = document.getElementById('course-detail-header');
        if (!header) return; // Only run on the course detail page

        // Get course ID from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('courseId');
        const course = mockData.courses.find(c => c.id === courseId);

        if (!course) {
            document.querySelector('.page-content').innerHTML = '<h1>Course not found.</h1>';
            return;
        }

        // Populate header
        document.getElementById('course-page-title').textContent = course.name;
        header.innerHTML = `<h2>${course.id}: ${course.name}</h2><p><strong>Instructor:</strong> ${course.instructor}</p>`;

        // Populate assignments for this course
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
        
        // Tab switching logic
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
     * Renders the profile page, including the form and the grades chart.
     */
    function renderProfilePage() {
        const gradeChartCanvas = document.getElementById('gradeChart');
        if (!gradeChartCanvas) return;

        // Populate form fields
        document.getElementById('profile-name').value = mockData.user.name;
        document.getElementById('profile-email').value = mockData.user.email;
        document.getElementById('profile-id-field').value = mockData.user.id;

        // Edit/Save button logic
        const editBtn = document.getElementById('edit-profile-btn');
        const saveBtn = document.getElementById('save-profile-btn');
        const formInputs = document.querySelectorAll('#profile-form .form-control');
        editBtn.addEventListener('click', () => {
            formInputs.forEach(input => input.disabled = false);
            editBtn.style.display = 'none';
            saveBtn.style.display = 'block';
        });
        
        // Render the chart using Chart.js
        new Chart(gradeChartCanvas, {
            type: 'doughnut',
            data: {
                labels: Object.keys(mockData.grades),
                datasets: [{
                    label: 'Grade Distribution',
                    data: Object.values(mockData.grades),
                    backgroundColor: ['#1dd1a1', '#4a69bd', '#feca57', '#ff6b6b', '#6a89cc'],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    /**
     * Sets up client-side validation for login and signup forms.
     */
    function handleAuthForms() {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Prevent actual submission
                // In a real app, you'd send this to a server. Here, we just simulate success.
                alert('Login successful! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                const errorEl = document.getElementById('signup-error');

                if (password !== confirmPassword) {
                    errorEl.textContent = 'Passwords do not match.';
                    errorEl.style.display = 'block';
                } else {
                     errorEl.style.display = 'none';
                     alert('Signup successful! Redirecting to dashboard...');
                     window.location.href = 'dashboard.html';
                }
            });
        }
    }


    // =================================================================================
    // INITIALIZATION & ROUTING
    // This is the main execution block that runs when the page loads.
    // It determines which page is currently active and calls the appropriate functions.
    // =================================================================================

    // --- Global Initializers ---
    setupMobileMenu();
    populateHeader(mockData.user);

    // --- Page-Specific Initializers (Simple Router) ---
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'dashboard.html' || currentPage === '') {
        renderCourses('dashboard-courses-container', mockData.courses.slice(0, 3)); // Assume a div with this ID on dashboard
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
    if (currentPage === 'login.html' || currentPage === 'signup.html') {
        handleAuthForms();
    }

    /* Add a quick style for status badges to the head, or add to style.css */
    document.head.insertAdjacentHTML('beforeend', `<style>
        .status-badge { padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; color: white; font-weight: 500; }
        .status-badge.pending { background-color: var(--color-warning); color: var(--color-primary); }
        .status-badge.submitted { background-color: var(--color-accent); }
        .status-badge.graded { background-color: var(--color-success); }
    </style>`);
    
    // Note for dashboard.html: make sure the main grid container has id="dashboard-courses-container"
    if(document.querySelector('.grid-container')) {
        const grid = document.querySelector('.grid-container');
        if(!grid.id) { // Simple check, assuming the dashboard is the only one without an ID
           grid.id = 'dashboard-courses-container';
           renderCourses('dashboard-courses-container', mockData.courses.slice(0, 3));
        }
    }

}); // End of DOMContentLoaded