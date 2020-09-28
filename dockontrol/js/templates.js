const progressPopupTemplate = `<div class="ui-popup" id="progressPopup">
		<div class="ui-popup-content">
			<div class="small-processing-container">
				<div onclick="closeCurrentPopup(this);" class="ui-processing"
					style="-webkit-transform: scale(1.08); position: relative;">
				</div>
			</div>
		</div>
	</div>`;
	
const greetingsPopupTemplate= `<div class="ui-popup greetingsPopup" id="greetingsPopup">
		<div class="ui-popup-content" id="text"></div>
	</div>`;

const failurePopupTemplate= `<div class="ui-popup failurePopup" id="failurePopup">
		<div class="ui-popup-content" id="text"></div>
	</div>`;
	
const logoutButtonTemplate = '<li><a id="main-logout-button">Logout</a></li>';

const listItemTemplate = '<li id=%itemId% class="li-has-multiline">	<a>%header%<span class="ui-li-sub-text li-text-sub">%text%</span></a>	</li>';