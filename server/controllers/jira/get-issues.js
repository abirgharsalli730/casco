import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

const usernameEnv = process.env.ATLASSIAN_USERNAME
const password = process.env.ATLASSIAN_API_KEY
const domain = process.env.DOMAIN
//Gets all issues in a particular project using the Jira Cloud REST API
export async function getIssues(req, res) {
  const auth = {
    username: req.body.username,
    password: password
  };
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';
    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/search',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);
    console.log(response.data)
    const issues = response.data.issues;
    return res.json(issues);
  } catch (error) {
    console.log('error: ')
    console.log(error.response)
    res.json(error.response)
  }
}
// Function to get the accountId of a user by display name
export async function getAccountIdByDisplayName(displayName) {
  try {
    console.log(displayName)
    const response = await axios.get('https://' + domain + '.atlassian.net' + '/rest/api/3/user/search', {
      params: {
        query: displayName
      },
      auth: {
        username: usernameEnv,
        password: password // Jira API token
      }
    });
    // Assuming the first user returned in the search results is the one you're looking for
    if (response.data && response.data[0]) {
      return response.data[0].accountId;


    }
    else
      return null
  } catch (error) {
    console.error('Error fetching user accountId:', error);
    throw error;
  }
}
// Function to get issues created by a user
export async function getIssuesByCreator(req, res) {
  try {
    const accountId = await getAccountIdByDisplayName(req.body.displayName);
    if (accountId) {
      const response = await axios.get('https://' + domain + '.atlassian.net' + '/rest/api/3/search', {
        params: {
          jql: `creator=${accountId}`,
          fields: 'summary,status' // Add any other fields you need
        },
        auth: {
          username: usernameEnv,
          password: password
        }
      });
      return res.json(response.data.issues);
    }
    return res.json("user not found")
  } catch (error) {
    console.error('Error fetching issues by creator:', error);
    throw error; 
  }
}
export async function getCurrentUser() {
  try {
    // Make a request to the Jira API to get information about the current user
    const response = await axios.get(`https://${domain}.atlassian.net/rest/api/3/myself`, {
      headers: {
        'Accept': 'application/json'
      },
      auth: {
        username: usernameEnv,
        password: password // Jira API token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function getAssignedIssues(req, res) {
  try {
    const currentUser = await getCurrentUser();
    const currentUserAccountId = currentUser.accountId;
    console.log(currentUserAccountId)
    // Make a request to the Jira API to get issues assigned to the current user
    const response = await axios.get(`https://${domain}.atlassian.net/rest/api/3/search?jql=assignee=${currentUserAccountId}`, {
      headers: {
        'Accept': 'application/json'
      },
      auth: {
        username: usernameEnv,
        password: password // Jira API token
      }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching assigned issues:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function getIssueByID(issueKey) {
  try {
    const baseUrl = 'https://' + domain + '.atlassian.net';
    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/issue/' + issueKey,
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}

export async function getIssusByProject(req, res) {
  try {
    const projectKey = req.body.project;
    const issusType = req.body.type
    // Make a request to the Jira API to get issues assigned to the current user
    const response = await axios.get(`https://${req.body.domaine}.atlassian.net/rest/api/3/search?jql=project=${projectKey} AND type =${issusType}`, {
      headers: {
        'Accept': 'application/json'
      },
      auth: {
        username: req.body.username,
        password: req.body.token  // Jira API token
      }
    });
    console.log(response.data);
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching assigned issues:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to count occurrences of specific tag values
function countTagOccurrences(xmlContent, tagName, possibleValues) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const occurrences = {};
        // Initialize occurrences with possible values
        possibleValues.forEach(value => {
          occurrences[value] = 0;
        });
        const issues = result.issues.issue;
        issues.forEach(issue => {
          const value = issue[tagName]?.[0];
          if (value && possibleValues.includes(value)) {
            occurrences[value]++;
          }
        });
        console.log(`Occurrences for ${tagName}:`, occurrences);
        resolve(occurrences);
      }
    });
  });
}
// Function to convert data to CSV format
function convertToCSV(data) {
  let issuesTab = [];
  for (const issue of data) {
    const issueId = issue.id;
    const issueKey = issue.key;
    let issueData = {
      id: issueId,
      key: issueKey,
      summary: issue.fields.summary,
      projectName: issue.fields.project.name,
      createdBy: issue.fields.creator.displayName,
      createdTime: issue.fields.created,
      issuetype: issue.fields.issuetype.name,
      assignee: issue.fields.assignee.displayName,
    };
    // Check the selected option field to include in CSV
    if (issue.fields.issuetype.name === 'Customer') {
      issueData = {
        ...issueData,
        IssueLink1: issue.fields.customfield_10069?.value || '',
        linkedissue1: issue.fields.customfield_10070 || '',
        priority: issue.fields.customfield_10047?.value || '',
        functional: issue.fields.customfield_10071?.value || '',
        customerDocumentName: issue.fields.customfield_10048 || '',
        customerDocumentVersion: issue.fields.customfield_10049 || '',
        customerDocumentReference: issue.fields.customfield_10050 || '',
        requirementAllocation: issue.fields.customfield_10051?.value || '',
        compliance: issue.fields.customfield_10052?.value || '',
        status: issue.fields.customfield_10053?.value || '',
        release: issue.fields.customfield_10066 || '',
      };
    } else if (issue.fields.issuetype.name === 'System') {
      issueData = {
        ...issueData,
        IssueLink1: issue.fields.customfield_10067?.value || '',
        linkedissue1: issue.fields.customfield_10068 || '',
        IssueLink2: issue.fields.customfield_10084?.value || '',
        linkedissue2: issue.fields.customfield_10070 || '',
        priority: issue.fields.customfield_10054?.value || '',
        fuSaASILLevel: issue.fields.customfield_10055?.value || '',
        components: issue.fields.customfield_10056 || '',
        functional: issue.fields.customfield_10057?.value || '',
        requirementAllocation: issue.fields.customfield_10058?.value || '',
        feasible: issue.fields.customfield_10059?.value || '',
        verifiable: issue.fields.customfield_10060?.value || '',
        verificationCriteria: issue.fields.customfield_10061 || '',
        buildPriority: issue.fields.customfield_10062?.value || '',
        riskItem: issue.fields.customfield_10063?.value || '',
        status: issue.fields.customfield_10065?.value || '',
        release: issue.fields.customfield_10064 || '',
      };
    } else if (issue.fields.issuetype.name === 'Task') {
      issueData = {
        ...issueData,
        IssueLink1: issue.fields.customfield_10084?.value || '',
        linkedissue1: issue.fields.customfield_10085 || '',
        IssueLink2: issue.fields.customfield_10069?.value || '',
        linkedissue2:  issue.fields.customfield_10070 || '',
        priority: issue.fields.customfield_10072?.value || '',
        fuSaASILLevel: issue.fields.customfield_10073?.value || '',
        components: issue.fields.customfield_10074 || '',
        functional: issue.fields.customfield_10075?.value || '',
        requirementAllocation: issue.fields.customfield_10076?.value || '',
        feasible: issue.fields.customfield_10077?.value || '',
        verifiable: issue.fields.customfield_10078?.value || '',
        verificationCriteria: issue.fields.customfield_10079 || '',
        buildPriority: issue.fields.customfield_10080?.value || '',
        riskItem: issue.fields.customfield_10081?.value || '',
        status: issue.fields.customfield_10083?.value || '',
        release: issue.fields.customfield_10082 || '',
      };
    } else if (issue.fields.issuetype.name === 'Software') {
      issueData = {
        ...issueData,
        IssueLink1: issue.fields.customfield_10084?.value || '',
        linkedissue1: issue.fields.customfield_10085 || '',
        IssueLink2: issue.fields.customfield_10069?.value || '',
        linkedissue2:  issue.fields.customfield_10070 || '',
        priority: issue.fields.customfield_10047?.value || '',
        fuSaASILLevel: issue.fields.customfield_10055?.value || '',
        components: issue.fields.customfield_10039 || '',
        verificationCriteria: issue.fields.customfield_10044 || '',
        reviewer: issue.fields.customfield_10068 || '',
        RequirementType: issue.fields.customfield_10057?.value || '',
        feasible: issue.fields.customfield_10059?.value || '',
        OriginalEstimate: issue.fields.customfield_10079 || '',
        RemainingEstimate: issue.fields.customfield_10061 || '',
        status: issue.fields.customfield_10053?.value || '',
      };
    }
    issuesTab.push(issueData);
  }
  const header = Object.keys(issuesTab[0]).join(',') + '\n';
  const rows = issuesTab.map(obj => Object.values(obj).join(',')).join('\n');
  return header + rows;
}
// Function to convert data to XML format
function convertToXML(data) {
  const builder = new xml2js.Builder();
  const issues = {
    issues: {
      issue: data.map(issue => {
        const issueData = {
          id: issue.id,
          key: issue.key,
          summary: issue.fields.summary,
          description: issue.fields.description?.content?.[0]?.content?.[0]?.text || '',
          projectName: issue.fields.project.name,
          createdBy: issue.fields.creator.displayName,
          createdTime: issue.fields.created,
          issuetype: issue.fields.issuetype.name,
          assignee: issue.fields.assignee.displayName,
        };
        if (issue.fields.issuetype.name === 'Customer') {
          issueData.IssueLink1 = issue.fields.customfield_10069?.value || '',
            issueData.linkedissue1 = issue.fields.customfield_10070 || '',
            issueData.priority = issue.fields.customfield_10047?.value || '';
          issueData.functional = issue.fields.customfield_10071?.value || '';
          issueData.customerDocumentName = issue.fields.customfield_10048 || '';
          issueData.customerDocumentVersion = issue.fields.customfield_10049 || '';
          issueData.customerDocumentReference = issue.fields.customfield_10050 || '';
          issueData.requirementAllocation = issue.fields.customfield_10051?.value || '';
          issueData.compliance = issue.fields.customfield_10052?.value || '';
          issueData.status = issue.fields.customfield_10053?.value || '';
          issueData.release = issue.fields.customfield_10066 || '';
        } else if (issue.fields.issuetype.name === 'System') {
          issueData.IssueLink1= issue.fields.customfield_10067?.value || '',
          issueData.linkedissue1= issue.fields.customfield_10068 || '',
          issueData.IssueLink2= issue.fields.customfield_10084?.value || '',
          issueData.linkedissue2= issue.fields.customfield_10070 || '',
          issueData.priority = issue.fields.customfield_10054?.value || '';
          issueData.fuSaASILLevel = issue.fields.customfield_10055?.value || '';
          issueData.components = issue.fields.customfield_10056 || '';
          issueData.functional = issue.fields.customfield_10057?.value || '';
          issueData.requirementAllocation = issue.fields.customfield_10058?.value || '';
          issueData.feasible = issue.fields.customfield_10059?.value || '';
          issueData.verifiable = issue.fields.customfield_10060?.value || '';
          issueData.verificationCriteria = issue.fields.customfield_10061 || '';
          issueData.buildPriority = issue.fields.customfield_10062?.value || '';
          issueData.riskItem = issue.fields.customfield_10063?.value || '';
          issueData.release = issue.fields.customfield_10064 || '';
          issueData.status = issue.fields.customfield_10065?.value || '';
        } else if (issue.fields.issuetype.name === 'Task') {
          issueData.IssueLink1= issue.fields.customfield_10084?.value || '';
          issueData.linkedissue1= issue.fields.customfield_10085 || '';
          issueData.IssueLink2= issue.fields.customfield_10069?.value || '';
          issueData.linkedissue2=  issue.fields.customfield_10070 || '';
          issueData.priority = issue.fields.customfield_10072?.value || '';
          issueData.fuSaASILLevel = issue.fields.customfield_10073?.value || '';
          issueData.components = issue.fields.customfield_10074 || '';
          issueData.functional = issue.fields.customfield_10075?.value || '';
          issueData.requirementAllocation = issue.fields.customfield_10076?.value || '';
          issueData.feasible = issue.fields.customfield_10077?.value || '';
          issueData.verifiable = issue.fields.customfield_10078?.value || '';
          issueData.verificationCriteria = issue.fields.customfield_10079 || '';
          issueData.buildPriority = issue.fields.customfield_10080?.value || '';
          issueData.riskItem = issue.fields.customfield_10081?.value || '';
          issueData.status = issue.fields.customfield_10083?.value || '';
          issueData.release = issue.fields.customfield_10082 || '';
        } else if (issue.fields.issuetype.name === 'Software') {
          issueData.IssueLink1= issue.fields.customfield_10084?.value || '';
          issueData.linkedissue1= issue.fields.customfield_10085 || '';
          issueData.IssueLink2= issue.fields.customfield_10069?.value || '';
          issueData.linkedissue2=  issue.fields.customfield_10070 || '';
          issueData.priority = issue.fields.customfield_10047?.value || '';
          issueData.fuSaASILLevel = issue.fields.customfield_10055?.value || '';
          issueData.components = issue.fields.customfield_10039 || '';
          issueData.verificationCriteria = issue.fields.customfield_10044 || '';
          issueData.reviewer = issue.fields.customfield_10068 || '';
          issueData.RequirementType = issue.fields.customfield_10057?.value || '';
          issueData.feasible = issue.fields.customfield_10059?.value || '';
          issueData.OriginalEstimate = issue.fields.customfield_10079 || '';
          issueData.RemainingEstimate = issue.fields.customfield_10061 || '';
          issueData.status = issue.fields.customfield_10053?.value || '';
        }
        return issueData;
      })
    }
  };
  return builder.buildObject(issues);
}
export async function saveAsCSVandXML(req, res) {
  try {
    const csvContent = convertToCSV(req.body.data);
    const xmlContent = convertToXML(req.body.data);
    console.log(req.body.data);
    const folderPath = `projects/${req.params.name}/${req.body.data[0].fields.issuetype.name}`;
    const csvFilePath = path.join(folderPath, `${req.body.data[0].fields.issuetype.name}.csv`);
    const xmlFilePath = path.join(folderPath, `${req.body.data[0].fields.issuetype.name}.xml`);
    const resultsFilePath = path.join(folderPath, `${req.body.data[0].fields.issuetype.name}_results.json`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    fs.writeFileSync(csvFilePath, csvContent);
    fs.writeFileSync(xmlFilePath, xmlContent);
    console.log(`Data saved as ${req.body.data[0].fields.project.name}`);

    //Calculation for software
    if (req.body.data[0].fields.issuetype.name === 'Software') {
      // Count occurrences for the 'reqtype' tag
      const RequirementTypeTagName = 'RequirementType';
      const RequirementTypePossibleValues = ['Functional', 'Non-Functional', 'Information'];
      const RequirementTypeOccurrences = await countTagOccurrences(xmlContent, RequirementTypeTagName, RequirementTypePossibleValues);
      // Count occurrences for the 'priority' tag
      const priorityTagName = 'priority';
      const priorityPossibleValues = ['Minor', 'Blocker', 'Critical', 'Major', 'Trivial'];
      const priorityOccurrences = await countTagOccurrences(xmlContent, priorityTagName, priorityPossibleValues);

      // Count occurrences for the 'assignee' tag
      const assigneeTagName = 'assignee';
      const assigneePossibleValues = ['Abir Gharsalli', 'Nouha Rouis', 'Rahma Fkaier'];
      const assigneeOccurrences = await countTagOccurrences(xmlContent, assigneeTagName, assigneePossibleValues);

       // Count occurrences for the 'status' tag
       const statusTagName = 'status';
      const statusValues = ['Open', 'Defining', 'Anaalyzing', 'Review', 'Rejected', 'Accepted'];
      const statusOccurrences = await countTagOccurrences(xmlContent, statusTagName, statusValues);
      const resultsContent = {
        RequirementTypeTagNameOccurrences: RequirementTypeOccurrences,
        priorityTagNameOccurrences: priorityOccurrences,
        assigneeTagNameOccurrences: assigneeOccurrences,
        statusOccurrences : statusOccurrences 
      };
      // Write results to a new file
      fs.writeFileSync(resultsFilePath, JSON.stringify(resultsContent));
    }


    //calculation for system and task
    if (req.body.data[0].fields.issuetype.name === 'System' || req.body.data[0].fields.issuetype.name === 'Task') {
      // Count occurrences for the 'functional' tag
      const functionalTagName = 'functional';
      const functionalPossibleValues = ['Functional', 'Non-Functional', 'Information'];
      const functionalOccurrences = await countTagOccurrences(xmlContent, functionalTagName, functionalPossibleValues);
      // Count occurrences for the 'priority' tag
      const priorityTagName = 'priority';
      const priorityPossibleValues = ['Minor', 'Blocker', 'Critical', 'Major', 'Trivial'];
      const priorityOccurrences = await countTagOccurrences(xmlContent, priorityTagName, priorityPossibleValues);
      // Count occurrences for the 'status' tag
      const statusTagName = 'status';
      const statusValues = ['Open', 'system definition ', 'analysis', 'system requirement review', 'complete'];
      const statusOccurrences = await countTagOccurrences(xmlContent, statusTagName, statusValues);

      // Count occurrences for the 'status' tag
       const assigneeTagName = 'assignee';
       const assigneeValues = ['Abir Gharsalli', 'Nouha ROUIS', 'Rahma FKAIER'];
       const assigneeOccurrences = await countTagOccurrences(xmlContent, assigneeTagName, assigneeValues);

      const resultsContent = {
        functionalTagNameOccurrences: functionalOccurrences,
        priorityTagNameOccurrences: priorityOccurrences,
        statusOccurrences: statusOccurrences,
        assigneeOccurrences: assigneeOccurrences,
      };
      // Write results to a new file
      fs.writeFileSync(resultsFilePath, JSON.stringify(resultsContent));
    }


    //calculation for customer
    if (req.body.data[0].fields.issuetype.name === 'Customer') {
      // Count occurrences for the 'functional' tag
      const functionalTagName = 'functional';
      const functionalPossibleValues = ['Functional', 'Non-Functional', 'Information'];
      const functionalOccurrences = await countTagOccurrences(xmlContent, functionalTagName, functionalPossibleValues);
      // Count occurrences for the 'priority' tag
      const priorityTagName = 'priority';
      const priorityPossibleValues = ['Minor', 'Blocker', 'Critical', 'Major', 'Trivial'];
      const priorityOccurrences = await countTagOccurrences(xmlContent, priorityTagName, priorityPossibleValues);
      // Count occurrences for the 'RequirementAllocation' tag
      const RequirementAllocationTagName = 'requirementAllocation';
      const RequirementAllocationValues = ['Hardware', 'Software', 'Mechanical', 'Systems', 'Manufacturing', 'Program Management'];
      const RequirementAllocationOccurrences = await countTagOccurrences(xmlContent, RequirementAllocationTagName, RequirementAllocationValues);
      // Count occurrences for the 'status' tag
      const statusTagName = 'status';
      const statusValues = ['Open', 'customer requirement review', 'reject customer requirement', 'complete'];
      const statusOccurrences = await countTagOccurrences(xmlContent, statusTagName, statusValues);
      // Count occurrences for the 'compliance' tag
      const complianceTagName = 'compliance';
      const complianceValues = ['Accept', 'Accept with comment', 'reject', 'unclear'];
      const complianceOccurrences = await countTagOccurrences(xmlContent, complianceTagName, complianceValues);
      const resultsContent = {
        functionalTagNameOccurrences: functionalOccurrences,
        priorityTagNameOccurrences: priorityOccurrences,
        RequirementAllocation: RequirementAllocationOccurrences,
        statusOccurrences: statusOccurrences,
        complianceOccurrences: complianceOccurrences
      };
      // Write results to a new file


      fs.writeFileSync(resultsFilePath, JSON.stringify(resultsContent));
    }
    res.json({
      msg: "Save success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}