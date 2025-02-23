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
            alert('Username already exists. Please choose another one.');
            return;
        }
        users[newUsername] = { password: newPassword, questions: [] };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully! Please login.');
        showLogin();
    } else {
        alert('Please enter a username and password.');
    }
}

// Login function
function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (username in users && users[username].password === password) {
        localStorage.setItem('currentUser', username);
        alert('Login successful!');
        window.location.href = 'dashboard.html';  // Redirect to Dashboard
    } else {
        alert('Invalid username or password.');
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
        alert('You must be logged in to access the dashboard.');
        window.location.href = 'index.html';
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
        alert('No user logged in!');
        return;
    }

    if (!question || !solution) {
        alert('Please enter both question and solution.');
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
    alert('Question saved successfully!');
    loadQuestions(); // Ensure this function is called after saving
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

    let list = document.getElementById('questions-list');
    list.innerHTML = '';

    users[currentUser].questions.forEach((q, index) => {
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
    document.getElementById('full-question').innerText = questionData.question;
    document.getElementById('full-solution').innerText = questionData.solution;
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
});
