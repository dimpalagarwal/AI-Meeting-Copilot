import fetch from 'node-fetch';

export async function createJiraIssue(task) {
  const JIRA_BASE = process.env.JIRA_BASE; // e.g. https://yourcompany.atlassian.net
  const JIRA_AUTH = process.env.JIRA_AUTH; // base64(user:api_token)
  const payload = {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY },
      summary: task.task,
      description: `Assigned by AI Meeting Assistant\n\nDetails: ${task.task}\nFrom meeting`,
      issuetype: { name: "Task" },
      // If assignee by email supported, otherwise use accountId mapping
      // "assignee": { "emailAddress": task.owner_email }
    }
  };

  const res = await fetch(`${JIRA_BASE}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${JIRA_AUTH}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  return data; 
}
