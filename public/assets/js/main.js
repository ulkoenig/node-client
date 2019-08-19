const ssoUrl = document.querySelector('#sso-url');
const webContext = document.querySelector('#web-context');
const realm = document.querySelector('#realm');
const clientId = document.querySelector('#client-id');
const kcIdpHint = document.querySelector('#kc-idp-hint');
const redirectUrl = document.querySelector('#redirect-url');
const responseType = document.querySelector('#response-type');
const scope = document.querySelector('#scope');
const state = document.querySelector('#state');

const form = document.querySelector('#index-form');

const settingsTab = document.querySelector('#settings-tab');
const codeTab = document.querySelector('#code-tab');
const tokenTab = document.querySelector('#token-tab');
const dataTab = document.querySelector('#data-tab');
const step = document.body.id;

// Initial tabs first
const tabClass = "tab-pane fade";
const tabActive = " show active";
const tabLinkClass = "nav-link";
const tabLinkClassActive = " active";

// save state of Settings
// saved, reset or loaded
const DEFAULT = 'DEFAULT';
const RESET = 'RESET';
const SAVED = 'SAVED';
const LOADED = 'LOADED';
let pageState = DEFAULT;

if (step == "settings-tab") {
  pageState = localStorage.getItem('pageState');
  if (pageState == SAVED) {
    loadSetting();
    //localStorage.setItem('pageState', LOADED);
  } else {
    localStorage.setItem('pageState', DEFAULT);
  }
  $('#myTab a[href="#settings"]').tab('show') // Select tab by name
  // set href for title link
  let HREF = window.location.href;
  localStorage.setItem('ssoTestClientHref', HREF)
  document.querySelector('#sso-header-link').href = HREF;
} else if (step == "access-code-tab") {
  pageState = localStorage.getItem('pageState');
  if (pageState == SAVED) {
    loadSetting();
  }
  $('[href="#access-code"]').tab('show');
  document.querySelector('#sso-header-link').href = localStorage.getItem('ssoTestClientHref');
  //prettyPrint('access-code-response','#resp-access-code');

  // get values from local storage
  const accessCode = document.getElementById('resp-access-code');

  let ls_ssourl = localStorage.getItem('ssoUrl');
  let ls_realm = localStorage.getItem('realm');
  let ls_client = localStorage.getItem('clientId');
  let ls_redirect = localStorage.getItem('redirectUrl');
  let ls_webcontext = localStorage.getItem('webContext');

  var params = {
    realm: ls_realm,
    sso_url: ls_ssourl,
    code: accessCode.innerHTML,
    client_id: ls_client,
    redirect_uri: ls_redirect,
    web_context: ls_webcontext
  };

  var esc = encodeURIComponent;
  var query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  document.querySelector('#get-access-token').href = "/token?" + query;
} else if (step == "access-token-tab") {
  pageState = localStorage.getItem('pageState');
  if (pageState == SAVED) {
    loadSetting();
  }

  $('[href="#access-token"]').tab('show');
  document.querySelector('#sso-header-link').href = localStorage.getItem('ssoTestClientHref');
  prettyPrint('access-token-response', '#resp-access-token');
  prettyPrint('jwt-token', '#resp-jwt-token');
  prettyPrint('user-data-response', '#resp-user-data');

  // Lets generate URL for logout.
  let token = JSON.parse(document.querySelector('#resp-access-token').innerHTML);


  let ls_ssourl = localStorage.getItem('ssoUrl');
  let ls_webcontext = localStorage.getItem('webContext');
  let ls_realm = localStorage.getItem('realm');
  let ls_client = localStorage.getItem('clientId');
  let ls_redirect = localStorage.getItem('redirectUrl');

  // activate Logout button
  setLogoutButton(ls_ssourl, ls_webcontext, ls_realm, ls_client, ls_redirect, token.access_token, token.refresh_token);

} else if (step == "user-data") {
  pageState = localStorage.getItem('pageState');
  if (pageState == SAVED) {
    loadSetting();
  }
  $('[href="#user-data"]').tab('show');
  document.querySelector('#sso-header-link').href = localStorage.getItem('ssoTestClientHref');
  prettyPrint('user-data-response', '#resp-user-data');
}

function loadSetting() {
  document.querySelector('#sso-url').value = localStorage.getItem('ssoUrl');
  document.querySelector('#web-context').value = localStorage.getItem('webContext');
  document.querySelector('#realm').value = localStorage.getItem('realm');
  document.querySelector('#client-id').value = localStorage.getItem('clientId');
  document.querySelector('#kc-idp-hint').value = localStorage.getItem('kcIdpHint');
  document.querySelector('#redirect-url').value = localStorage.getItem('redirectUrl');
  document.querySelector('#response-type').value = localStorage.getItem('responseType');
  document.querySelector('#scope').value = localStorage.getItem('scope');
  document.querySelector('#state').value = localStorage.getItem('state');
  document.querySelector('#sso-info').innerHTML = localStorage.getItem('loginURL');


}

function removeLocalStorage() {
  localStorage.removeItem('ssoUrl');
  localStorage.removeItem('webContext');
  localStorage.removeItem('realm');
  localStorage.removeItem('responseType');
  localStorage.removeItem('clientId');
  localStorage.removeItem('scope');
  localStorage.removeItem('redirectUrl');
  localStorage.removeItem('kcIdpHint');
  localStorage.removeItem('state');
  localStorage.removeItem('pageState');
}

function resetSetting() {
  removeLocalStorage();
  location.reload();
}

window.addEventListener("beforeunload", function (event) {
  //removeLocalStorage();
});

function submitSetting() {
  // store the entered name in web storage
  localStorage.setItem('ssoUrl', ssoUrl.value);
  localStorage.setItem('webContext', webContext.value);
  localStorage.setItem('realm', realm.value);
  localStorage.setItem('responseType', responseType.value);
  localStorage.setItem('clientId', clientId.value);
  localStorage.setItem('scope', scope.value);
  localStorage.setItem('redirectUrl', redirectUrl.value);
  localStorage.setItem('kcIdpHint', kcIdpHint.value);
  localStorage.setItem('state', state.value);
  localStorage.setItem('pageState', SAVED);


  var params = {
    response_type: responseType.value,
    client_id: clientId.value,
    scope: scope.value,
    state: state.value,
    redirect_uri: redirectUrl.value
  };

  let kcIdpHintValue = kcIdpHint.value;
  if (kcIdpHintValue.length > 0) {
    params.kc_idp_hint = kcIdpHintValue;
  }

  var esc = encodeURIComponent;
  var query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  let loginURL = ssoUrl.value +
    "/" + webContext.value +
    "/realms/" + realm.value +
    "/protocol/openid-connect/auth?" + query;
  localStorage.setItem('loginURL', loginURL);

  document.querySelector('#sso-info').innerHTML = 'URL:<br>' + loginURL;
  document.querySelector('#login').href = loginURL;
  document.querySelector('#login').className = "btn btn-primary";




};

function prettyPrint(parent, id) {
  var ugly = document.querySelector(id).innerHTML;
  console.log(ugly);
  var obj = JSON.parse(ugly);
  var pretty = JSON.stringify(obj, undefined, 4);
  document.querySelector(id).innerHTML = pretty;
  for (var key in obj) {
    addElement(parent, key, obj[key]);
  }
};

function gotoUserData() {
  $('[href="#user-data"]').tab('show');
}

function gotoSettings() {
  $('[href="#settings"]').tab('show');
}

function setLogoutButton(ssourl, webcontext, realm, client, redirect, access_token, refresh_token) {
  // Now the Logout button
  let params = {
    sso_url: ssourl,
    web_context: webcontext,
    realm: realm,
    client_id: client,
    redirect_uri: redirect,
    access_token: access_token,
    refresh_token: refresh_token
  }
  var esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  var items = document.getElementsByClassName('sso-logout-button');
  for (var i = 0; i < items.length; i++) {
    items[i].className = "btn btn-primary sso-logout-button";
    items[i].href = '/logout?' + query;
  }
}



/* add 
** <div class="form-group">
** <label for="sso-url">RHSSO URI</label>
** <input type="text" class="form-control" value="${ SSO }" id="sso-url">
** </div>
*/
function addElement(parent, key, value) {
  var divKey = document.createElement("div");
  divKey.className = "json-key";
  divKey.innerHTML = key;

  var divVal = document.createElement("div");
  divVal.className = "json-value";
  // Roles a object with array
  if ( typeof divVal == 'object' ){
    divKey.className = "json-key elm-oject";
    document.getElementById(parent).appendChild(divKey);
    addObject(parent,divVal);

    
  } else {
    divVal.innerHTML = value;
    document.getElementById(parent).appendChild(divKey);
    document.getElementById(parent).appendChild(divVal);
  }

}

function addObject(parent, oby){
  for (var key in obj) {
    if ( typeof divVal == 'object' ){
      
    }else{
      
    }
  }
}