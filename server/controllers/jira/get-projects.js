import axios  from 'axios';
import dotenv from 'dotenv'
dotenv.config();
const username = process.env.ATLASSIAN_USERNAME
const password = process.env.ATLASSIAN_API_KEY
const domain = process.env.DOMAIN


//Gets all issues in a particular project using the Jira Cloud REST API
export async function getProjects(req,res) {

  try {
    const auth = {
      username: req.body.username,
      password: req.body.token
    };
    
    const baseUrl = 'https://' + req.body.domaine + '.atlassian.net';

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/3/project/recent',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);
    console.log(response.data)
    return res.json(response.data);
  } catch (error) {
    console.log('error: ', error.response.data.errors);

    // Return the error message in the response
    return res.status(400).json({ error: error.response.data.errors });
  }
}

