import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendAssigneeEmail(to, task, jiraResponse) {
  const subject = `New task assigned: ${task.task}`;
  const body = `Hi ${task.owner_name || ''},

You have a new task from the meeting:
- Task: ${task.task}
- Deadline: ${task.deadline || 'Not specified'}
- Jira: ${jiraResponse?.key ? process.env.JIRA_BASE + '/browse/' + jiraResponse.key : 'Created'}

Meeting Summary:
${jiraResponse?.fields?.description || ''}

Regards,
AI Meeting Assistant`;

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text: body });
}
