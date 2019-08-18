const qs = require('querystring')
const request = require('request')

function exchangeToken(para) {
  let params = {
    grant_type: 'authorization_code',
    code: para.code,
    client_id: para.client_id,
    redirect_uri: para.redirect_uri,
  }
  let URL = para.sso +
    '/' + para.web_context +
    '/realms/' + para.realm +
    '/protocol/openid-connect/token'

  let options = {
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
      "content-type": "application/json",
    },
    url: URL,
    form: params,
  }

  // Assuming your Keycloak server is using HTTPS
  return new Promise((resolve, reject) => {
    request(options,
      function (error, resp, body) {
        if (error)
          console.log(`error->${error}`)

        if (error) {
          console.log(`Error validating token: ${error}`)
          reject(`Error validating token: ${error}`)
        } else {
          console.log('response: ok')
          console.log('body: ', body)
          console.log('headers: ', resp.headers)
          resolve(body)
        }
      })
  })
}

function getUserInfo(para) {
  console.log("get user info with access token: ", para);
  const token = para.access_token;
  console.log("Now i get the token: ", token);

  let URL = para.sso +
    '/' + para.web_context +
    '/realms/' + para.realm +
    '/protocol/openid-connect/userinfo'

  let options = {
    method: 'GET',
    rejectUnauthorized: false,
    headers: {
      "Authorization": "Bearer " + token
    },
    url: URL
  }
  // Assuming your Keycloak server is using HTTPS
  return new Promise((resolve, reject) => {
    request(options,
      function (error, resp, body) {
        if (error)
          console.log(`error->${error}`)

        if (error) {
          console.log(`Error get user info with access token: ${error}`)
          reject(`Error get user info with access token: ${error}`)
        } else {
          console.log('response: ok')
          console.log('body: ', body)
          console.log('headers: ', resp.headers)
          resolve(body)
        }
      })
  })
}

function logout(para) {
  let params = {
    refresh_token: para.refresh_token,
    client_id: para.client_id
  }
  let URL = para.sso +
    '/' + para.web_context +
    '/realms/' + para.realm +
    '/protocol/openid-connect/logout'

  let options = {
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
      "content-type": "application/json",
      "Authorization": "Bearer " + para.access_token
    },
    url: URL,
    form: params,
  }
  console.log('Logout options', options);
  // Assuming your Keycloak server is using HTTPS
  return new Promise((resolve, reject) => {
    request(options,
      function (error, resp, body) {
        if (error)
          console.log(`error->${error}`)

        if (error) {
          console.log(`Logout error validating token: ${error}`)
          reject(`Logout error validating token: ${error}`)
        } else {
          console.log('Logout response: ok')
          console.log('Logout body: ', body)
          console.log('Logout headers: ', resp.headers)
          resolve(body)
        }
      })
  })
}




module.exports = { exchangeToken, getUserInfo, logout }
