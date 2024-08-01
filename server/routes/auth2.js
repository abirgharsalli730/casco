
import axios  from 'axios';
import express from "express";
const router = express.Router();


router.post('/auth', (req, res) => {
    var action = req.query.action;
    res.cookie('action', action, { maxAge: 900000, httpOnly: true });
    
    var scope= (process.env.GET_REFRESH_TOKEN == 1)? "offline_access ": "";
    console.log("\n in /auth, starting get code");
    console.log('action:' + action);
    switch(action) {
        case "user_id_api":
            scope += "read:me read:account";
            break;
        case "confluence_api":
            scope += "read:confluence-content.summary write:confluence-content read:confluence-space.summary write:confluence-space write:confluence-file read:confluence-props manage:confluence-configuration read:confluence-content.all write:confluence-props search:confluence read:confluence-content.permission read:confluence-groups write:confluence-groups readonly:content.attachment:confluence read:confluence-user";
        case "jira_svc_desk_api":
            scope += "read:servicedesk-request manage:servicedesk-customer write:servicedesk-request read:servicemanagement-insight-objects";
            break;
        case "jira_platform_rest_api":
            scope += "read:jira-user read:jira-work write:jira-work";
    }
    

        var url ="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id="
        + process.env.CLIENT_ID +
        "&scope="+ encodeURIComponent(scope) +
        "&redirect_uri=" + encodeURIComponent(process.env.HOST_NAME) +
        "&state="+  encodeURIComponent(process.env.MY_BOUND_VALUE) +"&response_type=code&prompt=consent"

        console.log("url: " + url);

    res.json({url}
    );
  });

export async  function getToquenFromCode(code) {
/*  const body = {
    'grant_type': 'authorization_code',
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
    'code': code,
    'redirect_uri': process.env.HOST_NAME 
  };*/
  const opts = { headers: { accept: 'application/json', 'Content-Type': 'application/json',     
'Authorization': 'Basic ' + btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET)
} };
  console.log("\n in /oauth-callback");
  console.log("code: " + code);
  console.log("body: ");

  console.log(opts);
  const clientId =  process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.HOST_NAME ;

const tokenEndpoint = 'https://auth.atlassian.com/oauth/token';

const params = new URLSearchParams();
params.append('grant_type', 'authorization_code');
params.append('client_id', clientId);
params.append('client_secret', clientSecret);
params.append('code', code);
params.append('redirect_uri', redirectUri);
  try{
    const _res = await  axios.post(tokenEndpoint, params)
   
    var token = _res.data.access_token;
    var refresh_token = (_res.data.refresh_token)? _res.data.refresh_token : "";
    

    console.log("\n in /oauth-callback, GET Token");
    console.log("response data: ");
    console.log(_res.data);
    return({token, refresh_token});
  }
 catch(err){
    console.log(err)
    return null
 }


};



export    const accessible_resource = async (token) => {
    var url="https://api.atlassian.com/oauth/token/accessible-resources";
    // console.log("token: " + token)
    console.log("\n in /accessible-resources\n GET Header:");
    const opts = { headers: { accept: 'application/json',  'Authorization': 'Bearer ' + token} };
    console.log(opts);
     try{
   return await axios
        .get(url, opts)
     }
     catch(err){
        console.log(err)
        return null
     }
  
}
router.post('/generatetoken' ,async (req, res) => {
    const data = await getToquenFromCode(req.body.code);
    if(data &&  data.token){
        res.json( { token: data.token});

    }
    else {
        res.status(500).send({msg : "token not found"})
    }
}
)
router.post('/get-issus', async (req, res) => {


   
   const token = req.body.token
   const projectKey =req.body.project
   const dataResource = await accessible_resource(token)
   if(dataResource.data && dataResource.data.length >0){
    const profileId = dataResource.data[0].id
console.log("test ok")
  
    var url=`https://api.atlassian.com/ex/jira/${profileId}/rest/api/3/search?jql=project=${projectKey}`;
    // console.log("token: " + token)
    console.log("\n in /accessible-resources\n GET Header:");
    const opts = { headers: { accept: 'application/json',  'Authorization': 'Bearer ' + token} };
    console.log(opts);
    
    axios
        .get(url, opts)
        .then((response) => {
            console.log("response.data: ");
            console.log(response.data);
            res.json( {issues: response.data.issues, token: token});
        })
        .catch((err) => res.status(500).json({ err: err.message }));
    }
    else {
        res.status(500).send({msg : "dataResource not found"})
    }
}

);

router.post('/get-project', async (req, res) => {


   
    const token = req.body.token
    const dataResource = await accessible_resource(token)
    if(dataResource.data && dataResource.data.length >0){
     const profileId = dataResource.data[0].id
 
   
     var url=`https://api.atlassian.com/ex/jira/${profileId}/rest/api/3/project`;
     // console.log("token: " + token)
     console.log("\n in /accessible-resources\n GET Header:");
     const opts = { headers: { accept: 'application/json',  'Authorization': 'Bearer ' + token} };
     console.log(opts);
     
     axios
         .get(url, opts)
         .then((response) => {
             console.log("response.data: ");
             console.log(response.data);
             res.json( {project: response.data, token: token});
         })
         .catch((err) => res.status(500).json({ err: err.message }));
     }
     else {
         res.status(500).send({msg : "dataResource not found"})
     }
 }
 
 );

router.post('/appstart', (req, res) => {
    var action = req.body.action;
    const token = req.body.token;
    const opts = { headers: { accept: 'application/json',  'Authorization': 'Bearer ' + token} };
    const payload = JSON.parse(req.body.payload);
    const submit_value = req.body.submit;
    if (submit_value == "Refresh token") {
        action = 'refresh-token';
    }

    console.log("action: " + action);
    console.log("req.body.payload ");
    console.log(payload);
    var cloud_id = '';
    var server = '';
    payload.forEach((entry) => {
        if (entry.name == process.env.DOMAIN) {
            cloud_id = entry.id;
            server = entry.url;
        }
    });
    var url = method = '';
    switch (action) {
        case 'user_id_api':
            url = 'https://api.atlassian.com/me';
            axios
                .get(url, opts)
                .then((response) => {
                    console.log("response.data: ");
                    console.log(response.data);
                    res.json( {data: JSON.stringify(response.data)});
                })
                .catch((err) => res.status(500).json({ err: err.message }));
            break;
        case "confluence_api":
            // only testing confluence space api 
            url = 'https://api.atlassian.com/ex/confluence/'+ cloud_id + '/rest/api/space';

            // code below is untested
            axios
                .get(url, opts)
                .then((response) => {
                    console.log("response.data: ");
                    console.log(response.data);
                    res.json({data: JSON.stringify(response.data)});
                })
                .catch((err) => res.status(500).json({ err: err.message }));

        case "jira_svc_desk_api":
            scope = "read:servicedesk-request manage:servicedesk-customer write:servicedesk-request read:servicemanagement-insight-objects";
            console.log("jira_svc_desk_api is not covered.");
            res.sendFile(path.join(__dirname, '/static/done.html'));
            break;
        case "jira_platform_rest_api":
            url = 'https://api.atlassian.com/ex/jira/'+ cloud_id + '/rest/api/2/project';

            axios
                .get(url, opts)
                .then((response) => {
                    console.log("\n in /appstart, GET Jira API results:");
                    console.log("response.data: ");
                    console.log(response.data);
                    res.json({data: JSON.stringify(response.data)});
                })
                .catch((err) => res.status(500).json({ err: err.message }));
            break;
        case 'refresh-token':
            var refresh_token = req.cookies['refresh_token'];
            const body = {
                'grant_type': 'refresh_token',
                'client_id': process.env.CLIENT_ID,
                'client_secret': process.env.CLIENT_SECRET,
                'refresh_token': refresh_token
            };
            const opts2 = { headers: { accept: 'application/json', 'Content-Type': 'application/json' } };
            console.log("body:");
            console.log(body);
            
            axios
                .post('https://auth.atlassian.com/oauth/token', body, opts2)
                .then((_res) => {
                    var access_token = _res.data.access_token
                    var refresh_token = _res.data.refresh_token
                    console.log("\n in /appstart, GET Refresh Token");
                    console.log("response data: ");
                    console.log(_res.data);
                    
                    res.json({token : access_token , refresh_token});
                })
                .catch((err) => {
                    console.log(err.response.data);
                    res.status(err.response.status).json(err.response.data);
                });

    }
});
  
export default router;