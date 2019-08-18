var fs = require('fs')
var _ = require('lodash')

function buildHeader() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" >
  <head>
    <title>Client Simulation</title>
    <link rel="stylesheet" href="assets/css/bootstrap-material-design.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script type="text/javascript" src="assets/js/bootstrap-material-design.js"></script>
    <script type="text/javascript" src="assets/js/main.js" defer></script>
    <link rel="stylesheet" type="text/css" href="assets/css/styles.css">
    </head>`
}

function indexBody() {
  return  `<body>
  
  <div class="row">
    <div class="col-3"></div>
    <div class="col-6">

        <h1 id="index-page">Client Simulation</h1>
        <div class="card" style="background-color: #e6e6e6;">
          <div class="card-body">
        <div class="card">
          <div class="card-body">
            Default values are from the enviroment.
            Change values if needed and than press login button.
        </div>
        </div>
        <div class="card" style="margin-top: 10px;">
          <div class="card-body">
        <form id="index-form">
        <div class="form-group">
        <label for="sso">Keycloak URI</label> 
        <input type="text" class="form-control" value="${process.env['SSO']}" id="sso-url">
        </div>
        <div class="form-group">
        <label for="sso">Realm</label> 
        <input type="text" class="form-control" value="${process.env['REALM']}" id="realm">
        </div>
        <div class="form-group">
        <label for="sso">Client</label> 
        <input type="text" class="form-control" value="${process.env['CLIENT_ID']}" id="client-id">
        </div>
        <div class="form-group">
        <label for="sso">Provider ID / kc_idp_hint</label>
        <input type="text" class="form-control" value="${process.env['KC_IDP_HINT']}" id="kc-idp-hint">
        </div>
        <div class="form-group">
        <label for="sso">Redirect URL</label>
        <input type="text" class="form-control" value="${process.env['REDIRECT_URL']}" id="redirect-url">
        </div>
        <div class="form-group">
        <label for="sso">Rsponse Type</label>
        <input type="text" class="form-control" value="code" id="response-type">
        </div>
        <div class="form-group">
        <label for="sso">Scope</label>
        <input type="text" class="form-control" value="my-scope" id="scope">
        </div>
        <div class="form-group">
        <label for="sso">State</label>
        <input type="text" class="form-control" value="state123" id="state">
        </div>
        <input id="submitsetting" type="submit" value="Save Settings">
        </form>
        <a id="login" href="www.telekom.de" class="disabled">Login</a>
        </div>
        </div>  
        </div>
        </div>    
        <br>
    </div>
    </div>    
  </body>
</html>`
}

function loginBody({ CODE }) {
  return `<body>
            <div class="row">
              <div class="col-3"></div>
              <div class="col-6">

                <h1 id="login-page">Client Simulation</h1>
                <div class="card" style="background-color: #e6e6e6;">
                  <div class="card-body">
                  <div class="card">
                    <div class="card-body">
                      Login succesful
                    </div>
                  </div>
                  <div class="card" style="margin-top: 10px;">
                    <div class="card-body">        
                      Realm:<br>
                      <div class="realm-class">realm not set</div>
                      <div class="code">
                      Access code:<br>
                      <div class="access-code">${CODE}</div>
                    </div>
                      <a id="get-access-token" href="" class="disabled">Get Access Token</a>
                    </div>
                  </div>
                </div>  
              </div>
            </div>        
          </body>
        </html>`  
}

function tokenBody(resp) {
  console.log('In tokenBody function new', resp);
  return `<body>
            <div class="row">
              <div class="col-3"></div>
              <div class="col-6">

                <h1 id="token-page">Client Simulation</h1>
                <div class="card" style="background-color: #e6e6e6;">
                  <div class="card-body">
                  <div class="card">
                    <div class="card-body">
                      Token
                    </div>
                  </div>
                  <div class="card" style="margin-top: 10px;">
                    <div class="card-body">        
                      Realm:<br>
                      <div class="realm-class"></div>
                      <div class="code">
                      Access code:<br>
                      <div class="bearar-token"></div>
                    </div>
                      <a id="get-access-token" href="" class="disabled">Get Access Token</a>
                    </div>
                  </div>
                </div>  
              </div>
            </div>        
          </body>
        </html>`  
}

function buildIndexPage(ctx = {}) {
    console.log('Hallo env', ctx)
    //let header = buildHeader()
    //let body = indexBody()
    //return header + body
    return fs.readFileSync(`./public/views/_header.html`) +
       _.template(fs.readFileSync(`./public/views/index.html`))(ctx) +
       fs.readFileSync(`./public/views/_footer.html`)


}

function buildLoginPage({ CODE }) {
  let header = buildHeader()
  let body = loginBody( { CODE })
  return header + body
}

function buildTokenPage( { RESP }) {
  let header = buildHeader()
  let boy = tokenBody( { RESP })
  return header + body

}

module.exports = { buildIndexPage, buildLoginPage, buildTokenPage }
