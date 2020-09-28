var mainPageList = null;
var settingsPageList = null;

function addEventListeners() {

	// add eventListener to hardwarebuttons
	window.addEventListener("tizenhwkey", hardwareButtonsListener);

	// add eventListener to popups lifecycle
	document.addEventListener("popupshow", popupShow, false);
	document.addEventListener("popuphide", popupHide, false);

	// add eventListener to popes lifecycle
	document.addEventListener("pagebeforeshow", pageBeforeShow);
	document.addEventListener("pagehide", pageHide);
	
}
function popupShow(event) {
	
	var popup = event.target;
//	console.log(popup.id);
	
}

function popupHide(event) {

	var popup = event.target;
//	console.log(popup.id);
	
	destroyPopup(popup);

}

function pageBeforeShow(event) {
	switch (event.target.id) {
		case "main":
			initMainPage(event.target);
			break;
		case "settings":
			initSettingsPage(event.target);
			break;
		default:
			console.log("page is not defined: " + event.target.id);
			break;
	}
}

function pageHide(event) {
	switch (event.target.id) {
		case "main":
			deinitMainPage(event.target);
			break;
		case "settings":
			deinitSettingsPage(event.target);
			break;
		default:
			console.log("page is not defined: " + event.target.id);
			break;
	}
}

function initMainPage(page){
	var listView = page.querySelector(".ui-listview");
	
	if(isUserLoggedIn()){
		createActionList(listView);
	} else {
		document.getElementById('main-login-button').addEventListener('click', loginButtonClickListener);
	}

	mainPageList = tau.widget.Listview(listView);
}

function deinitMainPage(){
	if(	document.getElementById('main-login-button')){
		document.getElementById('main-login-button').removeEventListener('click', loginButtonClickListener);		
	}
	if(mainPageList){
		mainPageList.destroy();
	}
}

function loginButtonClickListener(event) {
	console.log(event.target.id + "clicked");
	
	if(getConnectionUrl() && getUsername() && getPassword()){
		loginRequest(getConnectionUrl(), getUsername(), getPassword());
	} else {
		showFailurePopup("Login data is not full");
	}
}

function initSettingsPage(page){

	
	document.getElementById('settings-save-button').addEventListener('click', saveSettingsButtonClickListener);
//	settingsPageList = tau.widget.Listview(page.querySelector(".ui-listview"));
}

function deinitSettingsPage(){
	document.getElementById('settings-save-button').removeEventListener('click', saveSettingsButtonClickListener);
//	if(settingsPageList){
//		settingsPageList.destroy();
//	}
}

function saveSettingsButtonClickListener(event){
	console.log(event.target.id + "clicked");
	
	var url = document.getElementById('settings-url').value;
	var username = document.getElementById('settings-usermane').value;
	var password = document.getElementById('settings-password').value;
	
	if (url && username && password){
		
		setConnectionUrl(url);
		setUsername(username);
		setPassword(password);
		
		showGreetingsPopup("OK");
		
		event.target.removeEventListener('click', saveSettingsButtonClickListener);
		
		setTimeout(function() {
			tau.changePage('main');
		}, 2000);
	
	} else {
		showFailurePopup("Fill in all fields to save");
	}
}

function hardwareButtonsListener (ev) {
	
	var activePopup = null,
		page = null,
		pageId = "";

	if (ev.keyName === "back") {
		activePopup = document.querySelector(".ui-popup-active");
		page = document.querySelector(".ui-page-active");
		pageId = page ? page.id : "";

		if (pageId === "main" && !activePopup) {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		} else {
			window.history.back();
		}
	}
}


function createActionList(listView){

	var actionList = JSON.parse(getAlloowedActions());
	
	if(listView && actionList){
		listView.innerHTML = '';
		actionList.forEach( function(element){
			addActionItem(listView, element);
		});
	}
	
}

function addActionItem(listView, element){
	var listItem = createActionListItem(element);
	listItem.addEventListener('click', function() {
		onActionItemClicked(element.action);
	}, true	);

	listView.appendChild(listItem);
}

function createActionListItem(element){
	var wrapperDiv = document.createElement('div');
	wrapperDiv.innerHTML = fillActionTemplateWithData(element);
	
	return wrapperDiv.firstChild;
	
}

function fillActionTemplateWithData(element){
	return listItemTemplate
		.replace("%header%", element.name)
		.replace("%text%", element.type)
		.replace("%itemId%", element.id);
}

function onActionItemClicked(actionName){
	actionRequest(actionName);
}

function actionRequest(actionName) {

	showProgressPopup();
	
	var requestUrl = getConnectionUrl() + '?username=' + getUsername() + '&password=' + getPassword() + '&action=' + actionName;
	console.log(requestUrl);
	performRequest(requestUrl, onActionSuccess, onActionFailed)
	
}

function onActionSuccess(message){
	closePopup('progressPopup');
	
	var serverResponseObject;
	
	try {
		serverResponseObject = JSON.parse(message);		
	} catch (e) {
		console.error(e);
	}
	
	if(serverResponseObject){
		showGreetingsPopup(serverResponseObject.message)
	} else {
		showFailurePopup("failed to parse server response");
		return;
	}
}

function onActionFailed(message){

	
	closePopup('progressPopup');
	
	showFailurePopup("failed to perform action, error: " + message);
}

function init(){
	addEventListeners();
}

init();
	