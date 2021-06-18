const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')


/**
 * ===============================================================================================
 * @description Natively using the express url encoding and json, if you're using 
 * body-parser, just disregard these statements
 * ===============================================================================================
 */

app.use(express.urlencoded({extended: true}))
app.use(express.json())


const allowedOrigins = ['http://localhost:3000',
                      'https://a1b251c40bda4be989edbacd43fc5211.vfs.cloud9.eu-central-1.amazonaws.com'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// app.use(apiConfig)

/** ============================================================================================ */


/**
 * ===============================================================================================
 * @description Gets the authorization token via graph api
 * @param tenant typeof String - The tenant Azure AD
 * @returns {
 *      ...omitted axios reponse properties,
 *      data: {
 *          access_token: String,
 *          expires_in: Number,
 *          ext_expires_in: NUmber,
 *          token_type: String
 *      }
 * }
 * 
 * @todo Provide the endpoint based on the existing routing logic
 * ===============================================================================================
 */

    // This endpoint is used for localhost testing
    // Please replace this endpoint value based on your existing routing logic
    const endPoint = '/'


    app.get(endPoint, ( req, res ) => {

        /**
         * ===============================================================================================
         * @description Application variables
         * @todo Replace the values with the production Application variables found in Azure AD
         * ===============================================================================================
         */
        const CLIENT_ID = '1532d011-aec0-416e-9100-52387bea73ff' // Bob's App
        const CLIENT_SECRET = 'eki4_HS0k.mbREk1i.yNUj2G8S~0dj.3R5' // Bob's Secret

        /** ============================================================================================ */


        // /**
        //  * ===============================================================================================
        //  * @description These statements should go to its own middleware function
        //  * @todo Add the production URI inside ALLOWED_ORIGINS array
        //  * ===============================================================================================
        //  */

        // // Allowed url to access MS token Authorization endpoint
        // const ALLOWED_ORIGINS = [
        //     'localhost',
        //     'https://a1b251c40bda4be989edbacd43fc5211.vfs.cloud9.eu-central-1.amazonaws.com'
        // ]

        // // Deconstructing origin from headers
        // const { origin } = req.headers

        // // Checking if origin exist in ALLOWED_ORIGINS
        // // If not, use the first index which is localhost
        // const allowedOrigins = (ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : ALLOWED_ORIGINS[0]

        // // Assigning headers
        // res.header('Access-Control-Allow-Origin', allowedOrigins)
        // res.header(
        //     'Access-Control-Allow-Headers',
        //     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        // )

        // // Handles OPTIONS pre flight fetch
        // if(req.method === 'OPTIONS'){
        //     res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PUT', 'PATCH', 'GET', 'DELETE')
        //     return res.status(200).json({})
        // }
        // /** ============================================================================================ */

        // Deconstructing tenant from query
        const { tenant } = req.query

        // Declare the urlencoded params
        const qs = `client_id=${CLIENT_ID}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
            
        axios({
            method: 'post',
            url: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
            data: qs
        })
        .then(response => {
            // console.log(response) // You can add your logger here
            res
                .status(response.status)
                .json(response.data)
        })
        .catch(err => {
            console.log(err) // You can add your logger here
            res
                .status(err.response.status)
                .json({'Error': err})
        })
    })

/** ============================================================================================ */


app.get('/mslogin', (req, res) => {
    /**
     * ===============================================================================================
     * @description Application variables
     * @todo Replace the values with the production Application variables found in Azure AD
     * ===============================================================================================
     */
    const CLIENT_ID = '1532d011-aec0-416e-9100-52387bea73ff' // Bob's App
    const CLIENT_SECRET = 'eki4_HS0k.mbREk1i.yNUj2G8S~0dj.3R5' // Bob's Secret

    /** ============================================================================================ */


    /**
     * ===============================================================================================
     * @description These statements should go to its own middleware function
     * @todo Add the production URI inside ALLOWED_ORIGINS array
     * ===============================================================================================
     */

    // // Allowed url to access MS token Authorization endpoint
    // const ALLOWED_ORIGINS = [
    //     '*',
    // ]

    // // Deconstructing origin from headers
    // const { origin } = req.headers

    // // Checking if origin exist in ALLOWED_ORIGINS
    // // If not, use the first index which is localhost
    // const allowedOrigins = (ALLOWED_ORIGINS.indexOf(origin) >= 0) ? origin : ALLOWED_ORIGINS[0]

    // // Assigning headers
    // res.header('Access-Control-Allow-Origin', allowedOrigins)
    // res.header(
    //     'Access-Control-Allow-Headers',
    //     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    // )

    // // Handles OPTIONS pre flight fetch
    // if(req.method === 'OPTIONS'){
    //     res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PUT', 'PATCH', 'GET', 'DELETE')
    //     return res.status(200).json({})
    // }
    // /** ============================================================================================ */

    const { email, passWord, tenant } = req.query
    // const { email, passWord, tenant } = req.body

    console.log(decodeURIComponent(passWord))
    console.log(passWord)

    // Declare the urlencoded params
    const qs = `client_id=${CLIENT_ID}&scope=user.read%20openid%20profile%20offline_access&username=${email}&password=${passWord}&client_secret=${CLIENT_SECRET}&grant_type=password`
            
    axios({
        method: 'post',
        url: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
        data: qs
    })
    .then(response => {
        // console.log(response) // You can add your logger here
        res
            .status(response.status)
            .json(response.data)
    })
    .catch(err => {
        console.log(err) // You can add your logger here
        res
            .status(err.response.status)
            .json({'Error': err})
    })


})

app.listen(3000, () => console.log('http://localhost:3000'))