function isLoggedIn() {
  return localStorage.getItem("currentUser") !== null;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getSurveys() {
  return JSON.parse(localStorage.getItem("surveys") || "[]");
}

function saveSurveys(surveys) {
  localStorage.setItem("surveys", JSON.stringify(surveys));
}

function getSurveyById(id) {
  return getSurveys().find((s) => s.id === id);
}

function saveNewSurvey(survey) {
  const surveys = getSurveys();
  surveys.push(survey);
  saveSurveys(surveys);
}

function saveSurveyResponse(surveyId, responseData) {
  const surveys = getSurveys();
  const index = surveys.findIndex((s) => s.id === surveyId);
  if (index !== -1) {
    if (!Array.isArray(surveys[index].responses)) {
      surveys[index].responses = [];
    }
    surveys[index].responses.push(responseData);
    saveSurveys(surveys);
  }
}

function loadUserSurveys() {
  const user = getCurrentUser();
  const surveys = getSurveys().filter((s) => s.createdBy === user.username);
  const container = document.getElementById("surveys-list");
  container.innerHTML = "";

  surveys.forEach((survey) => {
    const div = document.createElement("div");
    div.className = "survey-item";
    div.innerHTML = `
            <strong>${survey.title}</strong><br>
            <button onclick="location.href='completed.html?id=${survey.id}'">View Responses</button>
        `;
    container.appendChild(div);
  });
}

function loadPublicSurveys() {
  const surveys = getSurveys().filter((s) => s.isPublic);
  const container = document.getElementById("public-surveys");
  container.innerHTML = "";

  surveys.forEach((survey) => {
    const div = document.createElement("div");
    div.className = "survey-item";
    div.innerHTML = `
            <strong>${survey.title}</strong><br>
            <button onclick="location.href='complete.html?id=${survey.id}'">Take Survey</button>
        `;
    container.appendChild(div);
  });
}

function showRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
}

function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;
  const email = document.getElementById("register-email").value.trim();

  if (!username || !password || !email) {
    alert("Please fill all fields");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some((u) => u.username === username)) {
    alert("Username already exists");
    return;
  }

  const newUser = { username, password, email };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  alert("Registered successfully!");
  location.href = "home.html";
}

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!foundUser) {
    alert("Invalid username or password");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(foundUser));
  location.href = "home.html";
}
