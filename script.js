// Function to show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = message;
        toast.className = 'toast show';
        setTimeout(() => {
            toast.className = 'toast hide';
        }, 3000);
    } else {
        console.error('Toast element not found');
    }
}

// Function to show signup form
function showSignup() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
}

// Function to show login form
function showLogin() {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

// Signup function
function signup() {
    let newUsername = document.getElementById('new-username').value;
    let newPassword = document.getElementById('new-password').value;

    if (newUsername && newPassword) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (newUsername in users) {
            showToast('Username already exists. Please choose another one.');
            return;
        }
        users[newUsername] = { password: newPassword, questions: [] };
        localStorage.setItem('users', JSON.stringify(users));
        showToast('Account created successfully! Please login.');
        showLogin();
    } else {
        showToast('Please enter a username and password.');
    }
}

// Login function
function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (username in users && users[username].password === password) {
        localStorage.setItem('currentUser', username);
        showToast('Login successful!');
        setTimeout(() => {
            window.location.href = 'dashboard.html';  // Redirect to Dashboard
        }, 1000);
    } else {
        showToast('Invalid username or password.');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check login status
function checkLoginStatus() {
    let currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showToast('You must be logged in to access the dashboard.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        document.getElementById('user-display').innerText = currentUser;
        loadQuestions();
    }
}

// Function to save or update a question
function saveQuestion() {
    let question = document.getElementById('question').value;
    let solution = document.getElementById('solution').value;
    let tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    let editIndex = document.getElementById('edit-index').value;

    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser || !(currentUser in users)) {
        showToast('No user logged in!');
        return;
    }

    if (!question || !solution) {
        showToast('Please enter both question and solution.');
        return;
    }

    if (editIndex) {
        users[currentUser].questions[editIndex] = { question, solution, tags };
        document.getElementById('edit-index').value = '';
    } else {
        users[currentUser].questions.push({ question, solution, tags });
    }

    localStorage.setItem('users', JSON.stringify(users));
    console.log('Questions after saving:', users[currentUser].questions);
    document.getElementById('question').value = '';
    document.getElementById('solution').value = '';
    document.getElementById('tags').value = '';
    showToast('Question saved successfully!');
    loadQuestions(); // Ensure this function is called after saving
}

// Function to search questions
function searchQuestions() {
    let searchTerm = document.getElementById('search').value.toLowerCase();
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser || !(currentUser in users)) {
        alert('No user logged in!');
        return;
    }

    let filteredQuestions = users[currentUser].questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm) || 
        q.solution.toLowerCase().includes(searchTerm)
    );

    displayQuestions(filteredQuestions);
}

// Function to filter questions by tags
function filterQuestionsByTags() {
    let filterTags = document.getElementById('filter-tags').value.split(',').map(tag => tag.trim().toLowerCase());
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser || !(currentUser in users)) {
        alert('No user logged in!');
        return;
    }

    let filteredQuestions = users[currentUser].questions.filter(q => 
        q.tags && q.tags.some(tag => filterTags.includes(tag.toLowerCase()))
    );

    displayQuestions(filteredQuestions);
}

// Function to sort questions
function sortQuestions() {
    let sortOption = document.getElementById('sort-questions').value;
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser || !(currentUser in users)) {
        alert('No user logged in!');
        return;
    }

    let sortedQuestions = [...users[currentUser].questions];

    if (sortOption === 'alphabetical') {
        sortedQuestions.sort((a, b) => a.question.localeCompare(b.question));
    } else if (sortOption === 'date') {
        sortedQuestions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    displayQuestions(sortedQuestions);
}

// Function to display questions
function displayQuestions(questions) {
    let list = document.getElementById('questions-list');
    list.innerHTML = '';

    questions.forEach((q, index) => {
        let li = document.createElement('li');
        li.innerHTML = `
            <strong>Q${index + 1}:</strong> ${q.question} 
            <br> <em>Solution:</em> ${q.solution} 
            <br> <em>Tags:</em> ${q.tags ? q.tags.join(', ') : 'No tags'}
            <br>
            <button onclick="viewFullQuestion(${index})">🔍 View</button>
            <button onclick="editQuestion(${index})">✏️ Edit</button>
            <button onclick="deleteQuestion(${index})">🗑 Delete</button>
        `;
        list.appendChild(li);
    });
}

// Function to load saved questions
function loadQuestions() {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser || !(currentUser in users)) {
        alert('No user logged in!');
        return;
    }

    console.log('Loading questions for user:', currentUser);
    console.log('Questions:', users[currentUser].questions);

    displayQuestions(users[currentUser].questions);
}

// Function to edit a question
function editQuestion(index) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser || !(currentUser in users)) {
        alert('No user logged in!');
        return;
    }

    let questionData = users[currentUser].questions[index];
    document.getElementById('question').value = questionData.question;
    document.getElementById('solution').value = questionData.solution;
    document.getElementById('tags').value = questionData.tags.join(', ');
    document.getElementById('edit-index').value = index;
}

// Function to delete a question
function deleteQuestion(index) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser || !(currentUser in users)) {
        alert('No user logged in!');
        return;
    }

    users[currentUser].questions.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    loadQuestions();
    alert('Question deleted successfully!');
}

// Function to view full question and solution
function viewFullQuestion(index) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    if (!currentUser || !(currentUser in users)) {
        alert('No user logged in!');
        return;
    }

    let questionData = users[currentUser].questions[index];
    document.getElementById('full-question').textContent = questionData.question;
    document.getElementById('full-solution').textContent = questionData.solution;
    document.getElementById('full-question-section').style.display = 'block';
}

// Function to close the full question section
function closeFullQuestion() {
    document.getElementById('full-question-section').style.display = 'none';
}

// Run on page load
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('dashboard.html')) {
        checkLoginStatus();
    }

    // Add event listener for Enter key on login inputs
    const loginInputs = document.querySelectorAll('#username, #password');
    loginInputs.forEach(input => {
        input.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                login();
            }
        });
    });
});
