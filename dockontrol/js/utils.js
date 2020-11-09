

var CONNECTION_URL_KEY = "connection_url_key";
var USER_NAME_KEY = "user_name_key";
var USER_PASSWORD_KEY = "user_password_key";
var ACTIONS_LIST_KEY = "actions_list_key";
var DEFAULT_TIMEOUT_KEY = "default_timeout_key";
var DEFAULT_TIMEOUT_VALUE = "15000";


function setDefaultTimeout(timeout) {
	window.localStorage.setItem(DEFAULT_TIMEOUT_KEY, timeout);
	if(tizen.preference.exists(DEFAULT_TIMEOUT_KEY)){
		tizen.preference.remove(DEFAULT_TIMEOUT_KEY);
	}
	
	tizen.preference.setValue(DEFAULT_TIMEOUT_KEY, timeout);
}

function setConnectionUrl(url){
	if(tizen.preference.exists(CONNECTION_URL_KEY)){
		tizen.preference.remove(CONNECTION_URL_KEY);
	}
	
	tizen.preference.setValue(CONNECTION_URL_KEY, url);
}

function setUsername(username){
	if(tizen.preference.exists(USER_NAME_KEY)){
		tizen.preference.remove(USER_NAME_KEY);
	}
	
	tizen.preference.setValue(USER_NAME_KEY, username);
}

function setPassword(password){
	if(tizen.preference.exists(USER_PASSWORD_KEY)){
		tizen.preference.remove(USER_PASSWORD_KEY);
	}
	
	tizen.preference.setValue(USER_PASSWORD_KEY, password);
}

function getDefaultTimeout(){
	
	return Number(
			tizen.preference.exists(DEFAULT_TIMEOUT_KEY) ? 
					(tizen.preference.getValue(DEFAULT_TIMEOUT_KEY) ? tizen.preference.getValue(DEFAULT_TIMEOUT_KEY) : DEFAULT_TIMEOUT_VALUE)
					: DEFAULT_TIMEOUT_VALUE
						);
	
}

function getConnectionUrl(){
	var url;

	if(tizen.preference.exists(CONNECTION_URL_KEY)){
		url = tizen.preference.getValue(CONNECTION_URL_KEY);
	}
	
	if(!url){
		return null;
	}
	
	return url + (url.search(/\/$/i) ? '' : '/') + 'api.php';
}

function getUsername(){
	if(tizen.preference.exists(USER_NAME_KEY)){
		var userName = tizen.preference.getValue(USER_NAME_KEY);
		return  userName ? userName : null;
	}
	return null;
}

function getPassword(){
	if(tizen.preference.exists(USER_PASSWORD_KEY)){
		var password = tizen.preference.getValue(USER_PASSWORD_KEY);
		return  password ? password : null;
	}
	return null;
}

function setAllowedActions(actionsArray) {

//	window.localStorage.setItem(ACTIONS_LIST_KEY, JSON.stringify(actionsArray));
	
	if(tizen.preference.exists(ACTIONS_LIST_KEY)){
		tizen.preference.remove(ACTIONS_LIST_KEY);
	}
	
	tizen.preference.setValue(ACTIONS_LIST_KEY, JSON.stringify(actionsArray));
}

function deleteAllowedActions() {
	window.localStorage.removeItem(ACTIONS_LIST_KEY);
	
	if(tizen.preference.exists(ACTIONS_LIST_KEY)){
		tizen.preference.remove(ACTIONS_LIST_KEY);
	}
}

function getAllowedActions() {
	
	if(tizen.preference.exists(ACTIONS_LIST_KEY)){
		var allowedActions = tizen.preference.getValue(ACTIONS_LIST_KEY);
		return  allowedActions ? allowedActions : null;
	}
	return null;
	
}

function isUserLoggedIn(){
	return getAllowedActions() !== null;
}

function performRequest(requestUrl, onSuccess, onFailure) {
	
	var xmlHttp = new XMLHttpRequest();
	
    xmlHttp.onload = function() { 
    	
        if (xmlHttp.status === 200){
        	
        		onSuccess(xmlHttp.responseText);
        		
        } else {
       		onFailure(xmlHttp.statusText);
        }
    };
    
    xmlHttp.ontimeout = function() {	onFailure("timeout");};
    
    xmlHttp.open("GET", requestUrl, true); // true for asynchronous 
    
    xmlHttp.timeout = getDefaultTimeout();
    
    xmlHttp.send();
}

function now() {
	return Date.now();
	
}

function _func_() {
	return arguments.callee.caller.name;
}

function showProgressPopup(){
	
	var currentPage = document.querySelector(".ui-page-active");
	var popup = createElement(progressPopupTemplate);
	
	currentPage.appendChild(popup);
	tau.widget.Popup(popup).open();
	
	setTimeout(function closewProgressPopupByTimeout(){
		if(popup){
			closeCurrentPopup(popup);			
		}
	}, 20000);
	
}
function showFailurePopup(message){
	
	var currentPage = document.querySelector(".ui-page-active");
	var popup = createElement(failurePopupTemplate);
	
	popup.querySelector('p').innerHTML = message;
	
	currentPage.appendChild(popup);
	tau.widget.Popup(popup).open();
	
	setTimeout(function closewFailurePopupByTimeout(){
		if(popup){
			closeCurrentPopup(popup);			
		}
	}, 2000);
}

function showGreetingsPopup(message){
	
	var currentPage = document.querySelector(".ui-page-active");
	var popup = createElement(greetingsPopupTemplate);
	
	popup.querySelector('p').innerHTML = message;
	
	currentPage.appendChild(popup);
	tau.widget.Popup(popup).open();
	
	setTimeout(function closewGreetingsPopupByTimeout(){
		if(popup){
			closeCurrentPopup(popup);			
		}
	}, 2000);
}

function createElement(template){
	
	var wrapperDiv = document.createElement('div');
	wrapperDiv.innerHTML = template;
	
	return wrapperDiv.firstChild;
	
}

function closePopup(popupName){

	console.log(Date.now() + " " +  _func_() + " " + popupName);
	var popup = document.getElementById(popupName);
	
	if(!popup) {
		return;
	}
	setTimeout(function closewGreetingsPopupByTimeout(){
		if(popup){
			closeCurrentPopup(popup);			
		}
	}, 0);
	
}

function closeCurrentPopup(element){
	
	if(element instanceof Event){
		element = element.target;
	}
	
	var popup = element.closest(".ui-popup");
	tau.widget.Popup(popup).close();

}

function destroyPopup(element){
	
	console.log(Date.now() + " " +  _func_() + " " + element.id);
	
	if(element.parentNode){
		
		var previousElement = element.previousSibling;
		
		if(previousElement && previousElement.classList.contains("ui-popup-overlay")){
			previousElement.outerHTML = '';
		}
		
		element.outerHTML = '';
		
	}
	
	element = null;
}