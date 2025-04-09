function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function getSurveys() {
    return JSON.parse(localStorage.getItem('surveys') || '[]');
}

function getSurveyById(id) {
    const surveys = getSurveys();
    return surveys.find(s => s.id === id);
}

function saveSurveyResponse(surveyId, responseData) {
    const surveys = getSurveys();
    const index = surveys.findIndex(s => s.id === surveyId);
    if (index !== -1) {
        if (!Array.isArray(surveys[index].responses)) {
            surveys[index].responses = [];
        }
        surveys[index].responses.push(responseData);
        localStorage.setItem('surveys', JSON.stringify(surveys));
    }
}
