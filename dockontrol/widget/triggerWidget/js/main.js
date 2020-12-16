var CONNECTION_URL_KEY = "connection_url_key";
var USER_NAME_KEY = "user_name_key";
var USER_PASSWORD_KEY = "user_password_key";
var ACTIONS_LIST_KEY = "actions_list_key";
var DEFAULT_TIMEOUT_KEY = "default_timeout_key";
var DEFAULT_TIMEOUT_VALUE = "15000";

var MAX_ITEM_COUNT = 8;

var SCREEN_CENTER = {'x': 180, 'y': 180};

var SIX_ELEMENT_ORBIT_RADIUS = 120;
var SIX_ELEMENT_ELEMENT_RADIUS = 55;

var EIGHT_ELEMENT_ORBIT_RADIUS = 130;
var EIGHT_ELEMENT_CENTRAL_ELEMENT_RADIUS = 80;
var EIGHT_ELEMENT_TRIGGER_ELEMENT_RADIUS = 45;

window.onload = function() {
	configureWidgetUi(getAllowedActions());

	document.addEventListener('visibilitychange', visibilitychange);
	tizen.preference.setChangeListener(ACTIONS_LIST_KEY, updateWidgetUi);
};

function visibilitychange() {
    if (document.visibilityState === 'visible') {
		configureWidgetUi(getAllowedActions());
    }
}

function updateWidgetUi(data){
	configureWidgetUi(data.value);
}

function configureWidgetUi(allowedActions){

	var triggerContainer = document.getElementById('triggerContainer');
	var launchMainAppButton = document.getElementById('launchMainApp');

	if(launchMainAppButton){
		
		var centralItemSize = 2 * (allowedActionsCount < 7 ? SIX_ELEMENT_ELEMENT_RADIUS : EIGHT_ELEMENT_CENTRAL_ELEMENT_RADIUS);
		
		launchMainAppButton.style.height = centralItemSize + 'px';
		launchMainAppButton.style.width = centralItemSize + 'px';
			
		launchMainAppButton.style.top = (SCREEN_CENTER.x - centralItemSize / 2) + 'px';
		launchMainAppButton.style.left = (SCREEN_CENTER.y - centralItemSize / 2) + 'px';
	}
	
	if(!allowedActions){
		launchMainAppButton.style.height = 360 + 'px';
		launchMainAppButton.style.width = 360 + 'px';
			
		launchMainAppButton.style.top = 0 + 'px';
		launchMainAppButton.style.left = 0 + 'px';

		return;
	}
	
	if(!triggerContainer){
		return;
	}
	
	var allowedActionsArray;
	
	try {
		allowedActionsArray = JSON.parse(allowedActions);
	} catch (e) {
		console.error(e);
		return;
	}
	
	var allowedActionsCount = allowedActionsArray.length < MAX_ITEM_COUNT ? allowedActionsArray.length :  MAX_ITEM_COUNT;
	
	var orbitRadius = allowedActionsCount < 7 ? SIX_ELEMENT_ORBIT_RADIUS : EIGHT_ELEMENT_ORBIT_RADIUS;
	var elementRadius = allowedActionsCount < 7 ? SIX_ELEMENT_ELEMENT_RADIUS : EIGHT_ELEMENT_TRIGGER_ELEMENT_RADIUS;
	
	var images = document.getElementById('imageContainer').children;
	
	//max number of elements controlled here with "i < MAX_ITEM_COUNT"
	for(var i = 0; i < allowedActionsCount && i < MAX_ITEM_COUNT; i++){
		
		var positioningDetails = {
				x: SCREEN_CENTER.x - Math.round(Math.cos(2 * Math.PI / allowedActionsCount * i) * orbitRadius) - elementRadius, 
				// FIXME some magic, without it all elements are shifted 130 pixels to the right (130 - is position of first element). 
				// That totally needs some investigation and reporting to Samsung. Since that happens only in widget  (see widgetProto.js in main app)
				// UPDATE that was fixed when items received inner <p> tag. keeping it for now to investigate later
//				y: SCREEN_CENTER.y + Math.round(Math.sin(2 * Math.PI / allowedActionsCount * i) * orbitRadius) - elementRadius - (i === 0 ? 0 : 130), 
				y: SCREEN_CENTER.y + Math.round(Math.sin(2 * Math.PI / allowedActionsCount * i) * orbitRadius) - elementRadius, 
				size: elementRadius * 2,
			};
			
	    addTriggerButtonOnUi(triggerContainer, allowedActionsArray[i], positioningDetails, images[i]);
	    
	}
	
}

function addTriggerButtonOnUi(container, item, positioningDetails, image){
	
	var button = getTriggerButton(item, positioningDetails);
	
	button.addEventListener('click', function() {
//		button.style.color = 'red';
//		setTimeout(function() {
//			button.style.color = 'white';
//		}, 2500);
		sendTriggerRequest(item.action);
	});
	
	container.appendChild(button);
	
	setImageBelowButton(positioningDetails, image);
	
	image.id = item.action;
	
	image.addEventListener('click', function() {
		sendTriggerRequest(item.action);
	});
}

function getTriggerButton(item, positioningDetails){
	var button = document.createElement('div');
	
	button.classList.add("widgetTriggerButton");
	
	button.style.height = positioningDetails.size + 'px';
	button.style.width = positioningDetails.size + 'px';
	
	button.style.top = positioningDetails.x + 'px';
	button.style.left = positioningDetails.y + 'px';
	
	var text = getButtonText(item);

	button.appendChild(text);
	
	return button;
}

function getButtonText(item){
	
	var text = document.createElement('p');
	text.textContent = item.name;
	
	return text;
	
}

function setImageBelowButton(positioningDetails, image){

	image.height = (positioningDetails.size);
	image.width = (positioningDetails.size);
	
	image.style.height = (positioningDetails.size + 20) + 'px';
	image.style.width = (positioningDetails.size + 20) + 'px';
	
	image.style.top = (positioningDetails.x - 10) + 'px';
	image.style.left = (positioningDetails.y - 10) + 'px';
	
	image.style.display = 'block';
	
	return image;
}

function sendTriggerRequest(target) {

	if(!target){
		document.getElementById(target).style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
		setTimeout(function() {
			document.getElementById(target).style.backgroundColor = 'transparent';
		}, 1500);
		return;
	}

	document.getElementById(target).style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
	var requestUrl = getConnectionUrl() + '?username=' + getUsername() + '&password=' + getPassword() + '&action=' + target;
	console.log(requestUrl);
	
	performRequest(requestUrl, onTriggerSuccess, onTriggerFailed, target);

	
}

function onTriggerSuccess(message, target){
//	closePopup('progressPopup');

	document.getElementById(target).style.backgroundColor = 'blue';
	var serverResponseObject;
		
	try {
		serverResponseObject = JSON.parse(message);		
	} catch (e) {
		console.error(e);
	}

	
	if(serverResponseObject){
		document.getElementById(target).style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
		setTimeout(function() {
			document.getElementById(target).style.backgroundColor = 'transparent';
		}, 1500);
	} else {
		document.getElementById(target).style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
		setTimeout(function() {
			document.getElementById(target).style.backgroundColor = 'transparent';
		}, 1500);
		return;
	}
}

function onTriggerFailed(message, target){

	document.getElementById(target).style.backgroundColor = 'blue';
	document.getElementById(target).style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
	setTimeout(function() {
		document.getElementById(target).style.backgroundColor = 'transparent';
	}, 1500);
}

function performRequest(requestUrl, onSuccess, onFailure, target) {
	
	
	var xmlHttp = new XMLHttpRequest();
	
    xmlHttp.onload = function() { 
    	
        if (xmlHttp.status === 200){
        	
        		onSuccess(xmlHttp.responseText, target);
        		
        } else {
       		onFailure(xmlHttp.statusText, target);
        }
    };
    
    xmlHttp.ontimeout = function() {	onFailure("timeout", target);};
    
    xmlHttp.open("GET", requestUrl, true); // true for asynchronous 
    
    xmlHttp.timeout = getDefaultTimeout();

    xmlHttp.send();
	document.getElementById(target).style.backgroundColor = 'white';
}

function launchMainApp(){
	tizen.application.launch('dlHoBQcFYO.dockontrol', null);
}

function getAllowedActions() {

	if(tizen.preference.exists(ACTIONS_LIST_KEY)){
		var allowedActions = tizen.preference.getValue(ACTIONS_LIST_KEY);
		return  allowedActions ? allowedActions : null;
	}
	return null;
	
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
