import axios from 'axios'

const botPassWord = 'toplegalpassword123!@'
const url = '${url}'

let queue


export const setHeaderToken = (token) => {
        
   return {
      headers: {
         Authorization: `Bearer ${token}`
      }
   }
}

export const getUsers = async (token) => {
    
   try {
      const response = await axios.get(`${url}/users`, setHeaderToken(token))
   
      return response
         
   } catch(err) {
         
      return err
   } 
}


export const sendNotification = async (token, userId) => {
   // /teams/{teamId}/sendActivityNotification
   
   try {
      const user = await axios.post(`${url}/users/${userId}/teamwork/sendActivityNotification`,
      {
         topic: {
         source: 'text',
         value: 'Deployment Approvals Channel',
         webUrl: 'https://teams.microsoft.com/l/message/19:448cfd2ac2a7490a9084a9ed14cttr78c@thread.skype/1605223780000?tenantId=c8b1bf45-3834-4ecf-971a-b4c755ee677d&  groupId=d4c2a937-f097-435a-bc91-5c1683ca7245&parentMessageId=1605223771864&teamName=Approvals&channelName=Azure%20DevOps&createdTime=1605223780000'
         },
         activityType: 'deploymentApprovalRequired',
         previewText: {
            content: 'New deployment requires your approval'
         },
         templateParameters: [
            {
               name: 'deploymentId',
               value: '6788662'
            }
         ]
         
      },
      setHeaderToken(token)
      )

      return user.data.id
         
   } catch(err) {
         
      return err
   } 
}

export const getAdminId = async (token, adminEmail) => {
    
   try {
      const user = await getUserByEmail(token, adminEmail)

      return user.data.id
         
   } catch(err) {
         
      return err
   } 
}


export const createChat = async (token, ids = []) => {
   try {
      
      const members = ids.map(id => {
         return {
         '@odata.type': '#microsoft.graph.aadUserConversationMember',
         roles: ['owner'],
         'user@odata.bind': `${url}/users('${id}')`
         }
      })
      
      const chat = {
         chatType: 'oneOnOne',
         members: members
      }
         
      return await axios.post(`${url}/chats`, chat ,setHeaderToken(token))
         
   } catch(err) {
         
      return err
   } 
}

export const getUserByEmail = async (token, email) => {
   try {
         
      return await axios.get(`${url}/users/${email}`, setHeaderToken(token))
         
   } catch(err) {
         
      return err
   } 
}

export const createGroup = async (token, ownerId) => {
  
   clearTimeout(queue)
   
   let groupName = 'TopLegal' 
      
   try {
      const allUserIds = await getAllOrgUsers(token)
      const groupConfig = {
         "displayName":  groupName || new Date(),
         "mailNickname":  `${groupName}-${Date.now()}`,
         "description":  "Top Legal Notification Channel",    
         "owners@odata.bind":  [                              
            `${url}/users/${ownerId}`,
            // `${url}/users/17e8f68b-96d6-4edb-a6c7-6c115a999b10`,
            // '${url}/users/28e51b9c-ecff-4ea1-8515-1cc6faa9f0ee'
         ],
         "members@odata.bind": allUserIds.data.value.filter( 
         (user, index) => index < 19
         ).map(user => `${url}/users/${user.id}`),
         "groupTypes":  [ "Unified" ],
         "mailEnabled":  "true",
         "securityEnabled":  "false"
      }
      
      
      const group = await axios.post(`${url}/groups`, groupConfig, setHeaderToken(token))
      
      let team
      
      queue = setTimeout(async () => {
         team = await axios.post(
         `${url}/teams`, 
         {
            "template@odata.bind": `${url}/teamsTemplates('standard')`,
            "group@odata.bind": `${url}/groups('${group.data.id}')`
         },
         setHeaderToken(token)
         ) 
      }, 1000 * 60 * 15)
      
      
      return {
         ok: true,
         message: 'Creating Team...',
         group,
         team
      }
      
      
   } catch (err) {
         
      return err
   } 
}

export const getAllOrgUsers = async token => {
   try {
      
      return await axios.get(`${url}/users`, setHeaderToken(token))
   } catch (err) {
      
      return err
   }
}


export const createTeam = async (token, userId) => {
  
   // Todo - We need to use the tenant Admin ID
   
   try {
      const allUserIds = await getAllOrgUsers(token)
      const teamConfig = {
         "template@odata.bind": `${url}/teamsTemplates('standard')`,
         "displayName": "Top Legal",
         "description": "Top Legal Notification Channel",
         members: [
         {
            '@odata.type':'#microsoft.graph.aadUserConversationMember',
            roles: [
               'owner'
            ],
            'user@odata.bind': `${url}/users('${userId}')`
         }
         ]
      }
      
      
      
      const team = await axios.post(`${url}/teams`, teamConfig, setHeaderToken(token))
      const addedTeam = await addTeamMember(token, team.headers.location.split('\'')[1], allUserIds)
      
      return team
         
   } catch(err) {

      return err
   } 
}


export const addTeamMember = async ( token, teamId, memberIds ) => {
  
   try {
      
      const addedUser = await axios.post(
         `${url}/teams/${teamId}/members`,
         {
         '@odata.type': '#microsoft.graph.aadUserConversationMember',
         roles: ['member'],
         'user@odata.bind': `${url}/users('${memberIds.data.value[5].id}')`
         },
         setHeaderToken(token)
      )
      
      return addedUser
      
   } catch (err) {

      return err
   }
}


export const getToken = async (tenant) => {
   try {
      const response = await axios.get(`http://localhost:3000/?tenant=${tenant}`)
   
      return response.data.access_token
   } catch(err) {
         
      return err
   } 
}

export const createUser = async (token, domainName, tenant) => {
   const user = {
         accountEnabled: true,
         displayName: 'Gizmo',
         mailNickname: 'Gizmo',
         userPrincipalName: `gizmo.${Date.now()}@${domainName}`,
         passwordProfile: {
            forceChangePasswordNextSignIn: false,
            password: botPassWord
         }
   }
   try {
         
      return await axios.post(
         `${url}/users`,
         user,
         setHeaderToken(token))
         
   } catch(err) {
         
      return err
   } 
}

export const getGroups = async (token) => {
   try {
         
      return await axios.get(
         `${url}/groups?$select=id,resourceProvisioningOptions`,
         setHeaderToken(token)
      )
         
   } catch(err) {
         
      return err
   } 
}


export const createChannel = async (userConsentedToken, userId, teamId) => {
   // ${url}/teams/{team-id}/channels
   try {
         
      const channel = {
         '@odata.type': '#Microsoft.Graph.channel',
         displayName: 'Top Legal Notification',
         description: 'This channel is where you\'ll receive all the updates regarding your contracts',
         membershipType: 'private',
         members:[
         {
            '@odata.type':'#microsoft.graph.aadUserConversationMember',
            'user@odata.bind':`${url}/users('${userId}')`,
            roles: ['owner']
         }
         ]
      };
      
      
      return await axios.post(`${url}/teams/${teamId}/channels`, channel, setHeaderToken(userConsentedToken))
         
   } catch(err) {
         
      return err
   } 
}




export const getTenantDomain = async (token) => {
   // ${url}/organization
   try {
         
      const tenantObj = await axios.get(`${url}/organization`, setHeaderToken(token))

      return tenantObj.data.value[0].verifiedDomains[0].name
   } catch(err) {
         
      return err
   } 
  
}

export const getMyTeamsId = async (userConsentToken, teamName) => {
  
   try {
      const teams = await axios.get(`${url}/me/joinedTeams`, setHeaderToken(userConsentToken))
      const myTeam = teams.data.filter(team => team.displayName === teamName)
      
      // Todo - must return the team ID
      
      return {
         teams,
         myTeam
      }
   } catch (err) {
      
      return err
   }
}


export const sendPrivateMessage = async (userToken, channelId, teamId) => {
   // https://graph.microsoft.com/beta/users/{user-id}/chats/{chat-id}/messages
   // ${url}/teams/{team-id}/channels/{channel-id}/messages
   
   
   
   const url = `${url}/teams/${teamId}/channels/${channelId}/messages`
   try {
         
      return await axios.post(
         url,
         {
         "body": {
               "content": "Hello world"
         }
         },
         setHeaderToken(userToken)
      )
         
   } catch(err) {
         
      return err
   } 
}

export const _silentLogin = async ({email, tenant}) => {
  
   try {
         
      return await axios.get(
         `http://localhost:3000/mslogin?tenant=${tenant}&email=${email}&passWord=${botPassWord}`
      )
         
   } catch(err) {
         
      return err
   } 
}



// import { getToken } from "./authConfig";

// // Create an authentication provider
// const authProvider = {
//     getAccessToken: async () => {
//       // Call getToken in auth.js
//       const token = await getToken();
//       // console.log(token)
//       // sessionStorage.setItem('token', token);
//       return token
//     }
// };


// // Initialize the Graph client
// const graphClient = MicrosoftGraph.Client.initWithMiddleware({authProvider});

// export async function getUser() {
//     return await graphClient
//       .api('/me')
//       // Only get the fields used by the app
//       .select('*')
//       .get();
// }

// async function getUserByEmail(email) {
//   if(!email) return
//   return await graphClient
//     .api(`/users/${email}`)
//     // Only get the fields used by the app
//     .select('*')
//     .get();
// }

// export async function createChannel(
//   teamID = '',
//   displayName = 'Private',
//   membershipType = 'standard',
//   description = '',
//   email = ''
// ) {
//   // if(!email) return
//   if(!teamID) {
//     // The Teams ID
//     teamID = 'fccffdeb-f9ca-4ba8-b0b8-4438afccb3da' // should get this as a preference
//   }
//   // 19:f9c3e7b12035421f9a84ae5e4fa8ec71@thread.tacv2
//   try {
//     /**
//     * @description This block is only used for getting the required fields as user inputs
//     */
//     displayName = prompt('Type Channel\'s Display Name')
//     membershipType = prompt('Type [ "standard" | "private" ]')
//     description = prompt('Type channel\'s Description')
//     email = prompt('Type the member\'s email you want to add to the channel')

//     /** ================================================================================ */

//     const adminUserId = 'efcc98eb-c34b-4bb0-9339-856d2e37dbb4'

//     const invitedUser = await getUserByEmail(email)

//     const channelConfig = {
//       "@odata.type": "#Microsoft.Teams.Core.channel",
//       membershipType,
//       displayName,
//       description,
//       members: [
//         {
//           "@odata.type":"#microsoft.graph.aadUserConversationMember",
//           "user@odata.bind":`${url}/users('${adminUserId}')`,
//           "roles":["owner"]
//         },
//         {
//           "@odata.type":"#microsoft.graph.aadUserConversationMember",
//           "user@odata.bind":`${url}/users('${invitedUser.id}')`,
//           "roles":["member"]
//         }
//       ]
//     }

//     const response = await graphClient
//       .api(`/teams/${teamID}/channels`)
//       .post(channelConfig);
      
//     console.log({'Team ID: ': teamID, channelData: response})
//   } catch (error) {
//     updatePage(Views.error, {
//       message: 'Error getting events',
//       debug: error
//     });
//   }
// }

// export async function sendMessage(
//   teamID = '',
//   channelId = '',
//   content = ''
// ) {
//   /**
//     * @description This block is only used for getting the required fields as user inputs
//     */
//     teamID = prompt('Type Channel\'s Display Name')
//     channelId = prompt('Type [ "standard" | "private" ]')
//     content = prompt('Type your message')
//   /** ================================================================================ */
//   const response = await graphClient
//     .api(`/teams/${teamID}/channels/${channelId}/messages`)
//     .post({body: {content}});
// }


// async function getTeams() {
//   const user = JSON.parse(sessionStorage.getItem('graphUser'));
//   const token = sessionStorage.getItem('token');


//   try {
//     let response = await graphClient
//       .api('/me/joinedTeams')
//       .get();

//     console.log(response)
//   } catch (error) {
//     console.log(error)
//   }
// }
