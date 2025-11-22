import fetch from 'node-fetch';
export async function summarizeAndExtract(transcript) {
  const prompt = `You are a helpful assistant. Given the meeting transcript below,
produce a JSON object with:
1) "summary": short 3-5 bullet summary string.
2) "tasks": an array of action items where each item has:
   - "task": short task title
   - "owner_name": name if present, otherwise null
   - "owner_email": try to infer email from corporate domain if available; otherwise null
   - "deadline": date if present (ISO or natural)
   - "priority": low/medium/high if inferred

Return ONLY valid JSON.

Transcript:
"""${transcript}"""`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800
    })
  });
  const data = await res.json();
  // parse data.choices[0].message.content as JSON
  const text = data.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(text);
  return parsed;
}
