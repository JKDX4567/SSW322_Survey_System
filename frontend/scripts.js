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

async function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;
  const email = document.getElementById("register-email").value.trim();

  if (!username || !password || !email) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch("http://127.0.0.1:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  alert("Registered successfully! Please log in.");
  showLogin();
}

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    console.log("Raw response:", res); // ADD THIS

    const data = await res.json();

    if (!res.ok) {
      console.log("Login failed:", data); // ADD THIS
      return alert(data.message || "Login failed.");
    }

    localStorage.setItem("currentUser", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    location.href = "home.html";
  } catch (err) {
    console.error("Network error during login:", err); // ADD THIS
    alert("Could not connect to server.");
  }
}


function getToken() {
  return localStorage.getItem("token");
}