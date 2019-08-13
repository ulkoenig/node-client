var express = require('express');
let qs = require('querystring');
let path = require('path');

var app = express();
const PORT = 8080;

function buildURL() {

  const realm = 'demo-1'

  let params = qs.stringify({
    response_type: 'code',
    client_id: 'my-client',
    scope: 'my-scope',
    state: 'state123',
    redirect_uri: `${process.env['ROUTE'] || 'URL_NOT_FOUND'}login`
  })

  return `https://${process.env['SSO']}/auth/realms/${realm}/protocol/openid-connect/auth?${params}`
}

function buildLoginPage({ URL }) {
  return `<!DOCTYPE HTML>
            <html>
              <head>
                <title>Hello OAuth2</title>
                <script type="text/javascript" src="scripts/main.js" defer></script>
                <link rel="stylesheet" type="text/css" href="assets/styles.css">
              </head>
              <body>
                <h1> Register </h1>
                <form>
                  <label for="ssourl">RHSSO URL:</label>
                  <input id="ssourl" type="text" required="">
                  <label for="realm">Realm:</label>
                  <input id="realm" type="text" required="">
                  <label for="client">Client:</label>
                  <input id="client" type="text" required="">
                  <label for="redirect">Redirect URL:</label>
                  <input id="redirect" type="text" required="">
                  
                  <input id="submitsetting" type="submit" value="Save">
                </form>

                <a id="login" href="${URL}" class="disabled">Login</a>
              </body>
            </html>`
}

app.use(express.static('public'));

app.get('/', (req, res) => {
  //let page = buildLoginPage({ URL: buildURL() })
  //res.send(page)
  res.sendFile(path.join(__dirname + '/public/views/index.html'));
})

app.get('/login', (req, res) => {

  console.log(localStorage.getItem('realm'));


  res.send(`<h1>Willkommen!</h1>`)
  
})

// convention over configuration -> 8080
var server = app.listen(PORT)

console.log(`listening for request in ${PORT}`)