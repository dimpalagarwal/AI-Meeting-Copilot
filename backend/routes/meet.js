import express from 'express';
import { summarizeAndExtract } from '../services/openai.js';
import { createJiraIssue } from '../services/jiraService.js';
import { sendAssigneeEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/transcript', async (req, res) => {
  try {
    const { transcript, pageUrl, timestamp } = req.body;
    // 1. Call OpenAI to get summary + tasks
    const result = await summarizeAndExtract(transcript);
    // result = { summary: "...", tasks: [{task, owner_name, owner_email, deadline, priority}, ...] }

    // 2. For each task create Jira issue & send email
    for (const t of result.tasks) {
      const jira = await createJiraIssue(t); // returns issue key/url
      await sendAssigneeEmail(t.owner_email, t, jira);
      // persist to DB (optional) ...
    }

    res.json({ ok: true, summary: result.summary, tasks: result.tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

export default router;
