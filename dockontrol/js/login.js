

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
		if(serverResponseObject.status === "ok"){
			showGreetingsPopup(serverResponseObject.status) 
			setAllowedActions(serverResponseObject.allowed_actions);
			setDefaultTimeout(serverResponseObject.config.timeout * 1000);
			
		} else {
			onLoginFailed(serverResponseObject.message);
		}
	
		setTimeout(function (){
			location.reload();
		}, 1900);
		
	} else {
		
		showFailurePopup("failed to parse server response");

		setTimeout(function (){
			location.reload();
		}, 1900);
	}
	
	
}

function onLoginFailed(message) {
	
	closePopup('progressPopup');
	
	showFailurePopup("failed to login, error: " + message);
	
}

function logoutUser(){
	
	showGreetingsPopup('ok');setTimeout(function (){
		location.reload();
	}, 1900);
}
