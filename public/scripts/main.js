const ssourl = document.querySelector('#ssourl');
const realm = document.querySelector('#realm');
const client = document.querySelector('#client');
const redirect = document.querySelector('#redirect');
const submitSetting = document.querySelector('#submitsetting');
const form = document.querySelector('form');

// Stop the form from submitting when a button is pressed
form.addEventListener('submit', function(e) {
  e.preventDefault();
});

submitSetting.addEventListener('click', function() {
  // store the entered name in web storage
  localStorage.setItem('ssourl', ssourl.value);
  localStorage.setItem('realm', realm.value);
  localStorage.setItem('client', client.value);
  localStorage.setItem('redirect', redirect.value);

  document.querySelector('#login').href="www.google.de";
  document.querySelector('#login').className="active";
  
  // run nameDisplayCheck() to sort out displaying the personalised greetings and updating the form display
});

