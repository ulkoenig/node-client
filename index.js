var express = require('express')
var fs = require('fs')
var _ = require('lodash')
//let okd = require('okd-runner')
let qs = require('querystring')
let oauth = require('./lib/oauth')
var jwt = require('jsonwebtoken');
let pages = require('./lib/pages')
// HS256 secrets are typically 128-bit random strings, for example hex-encoded:
let secret = "nfBg9oPKsSG7sLE5PtbdWH0gYkrmjfUVmbOAnhsLpBw" //Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

let env = {
  SSO: isSet(process.env['SSO']),
  WEB_CONTEXT: isSet(process.env['WEB_CONTEXT']),
  REALM: isSet(process.env['REALM']),
  CLIENT_ID: isSet(process.env['CLIENT_ID']),
  KC_IDP_HINT: isSet(process.env['KC_IDP_HINT']),
  REDIRECT_URL: isSet(process.env['REDIRECT_URL']),
  STEP: "",
  ACCESS_CODE: "",
  ACCESS_TOKEN: "",
  USER_DATA: "",
  JWT_TOKEN: "",
}

let page = fs.readFileSync(`./public/views/page.html`);

function isSet(val) {
  if (typeof val !== 'undefined' && val) {
    return val;
  } else {
    return "";
  }
}

var app = express()
const PORT = 8080

app.use(express.static('public'));

app.get('/', (req, res) => {
  env.STEP = "settings-tab"
  res.send(render(page, env))
})

app.get('/login', (req, res) => {
  // save for later using in env object
  env.ACCESS_CODE = req.query.code;
  env.STEP = "access-code-tab";
  res.send(render(page, env))
})

app.get('/logout', (req, res) => {
  // save for later using in env object
  //env.ACCESS_CODE = req.query.code;
  env.STEP = "settings-tab";
  let para = {
    realm: req.query.realm,
    sso: req.query.sso_url,
    redirect_uri: req.query.redirect_uri,
    web_context: req.query.web_context,
    refresh_token: req.query.refresh_token,
    access_token: req.query.access_token,
    client_id: req.query.client_id
  }
  oauth.logout(para)
      .then(function (resp) {
        res.send(render(page, env))
      })
      .catch(err => res.send(err))
})

app.get('/token', (req, res) => {
  console.log('Hallo in token', req.query);
  if (req.query.code) {
    let para = {
      realm: req.query.realm,
      sso: req.query.sso_url,
      code: req.query.code,
      client_id: req.query.client_id,
      redirect_uri: req.query.redirect_uri,
      web_context: req.query.web_context
    }
    console.log('para', para);
    oauth.exchangeToken(para)
      .then(function (resp) {
        // resp seams not a vaild JSON. Therefore thi stringify and parse fix this problem
        env.ACCESS_TOKEN = JSON.parse(JSON.stringify(resp));
        var jwt_token = jwt.decode(JSON.parse(resp).access_token, { json: true });
        env.JWT_TOKEN = JSON.stringify(jwt_token);
        console.log('jwt_token', jwt_token);
        // save access token in para for calling getUserInfo 
        para.access_token = JSON.parse(resp).access_token,
        oauth.getUserInfo(para)
          .then(function (data) {
            env.USER_DATA = data;
            env.STEP = 'access-token-tab'
            //let page = fs.readFileSync(`./public/views/page.html`)
            res.send(render(page, env))
          })
          .catch(err => res.send(err))

      })
      .catch(err => res.send(err))
  }
})





function render(page, ctx = {}) {
  return _.template(page)(ctx)
}






// convention over configuration -> 8080
var server = app.listen(PORT)

console.log(`listening for request in ${PORT}`)
