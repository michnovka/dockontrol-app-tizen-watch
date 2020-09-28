

function loginRequest (url, username, password){
	showProgressPopup();
	performRequest(url + '?username=' + username + '&password=' + password + '&action=app_login', onLoginSuccess, onLoginFailed);
}

function onLoginSuccess(message) {

	closePopup('progressPopup');
	
	var serverResponseObject;
	
	try {
		serverResponseObject = JSON.parse(message);		
	} catch (e) {
		console.error(e);
	}
	
	if(serverResponseObject){
		setTimeout(function (){
			location.reload();
		}, 1900);
		showGreetingsPopup(serverResponseObject.status)
	} else {
		showFailurePopup("failed to parse server response");
		return;
	}
	
	setAlloowedActions(serverResponseObject.allowed_actions);
	
	setDefaultTimeout(serverResponseObject.config.timeout * 1000);
	
}

function onLoginFailed(message) {
	
	closePopup('progressPopup');
	
	showFailurePopup("failed to login, error: " + message);
	
}

function logoutUser(){
	window.localStorage.clear();

	showGreetingsPopup('ok');
}
