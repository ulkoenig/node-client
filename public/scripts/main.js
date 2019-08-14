const ssourl = document.querySelector('#ssourl');
const realm = document.querySelector('#realm');
const client = document.querySelector('#client');
const redirect = document.querySelector('#redirect');
const submitSetting = document.querySelector('#submitsetting');
const form = document.querySelector('form');
const loginpage = document.querySelector('#login-page');
const indexpage = document.querySelector('#index-page');
// Stop the form from submitting when a button is pressed

// All staff for index page
if (typeof (indexpage) != 'undefined' && indexpage != null) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });

  submitSetting.addEventListener('click', function () {

    // store the entered name in web storage
    localStorage.setItem('ssourl', ssourl.value);
    localStorage.setItem('realm', realm.value);
    localStorage.setItem('client', client.value);
    localStorage.setItem('redirect', redirect.value);

    document.querySelector('#login').href = "/login";
    document.querySelector('#login').className = "active";

    // run nameDisplayCheck() to sort out displaying the personalised greetings and updating the form display
  });
}

// All staff for login page

if (typeof (loginpage) != 'undefined' && loginpage != null) {
  // get values from local storage
  const realmClass = document.querySelector('.realm-class');
  const accessCode = document.querySelector('.access-code');

  let ls_ssourl= localStorage.getItem('ssourl');
  let ls_realm = localStorage.getItem('realm');
  let ls_client = localStorage.getItem('client');
  let ls_redirect = localStorage.getItem('redirect');

  realmClass.textContent = ls_realm;
  
  document.querySelector('#get-access-token').href = "/bla?" + 
  'realm=' + ls_realm +
  '+code=' + accessCode.outerText;
  document.querySelector('#get-access-token').className = "active";

}
