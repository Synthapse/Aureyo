import { Client } from '@notionhq/client';

// Initialize client
const NOTION_TOKEN = "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";
const notion = new Client({ auth: NOTION_TOKEN });

const databaseId = "1a6529bf8e0880bb84e2f39ae118fed0"

async function getDatabase() {
    const response = await notion.databases.query({
        database_id: databaseId,
    });
    return response.results;
}

export const getUsers = async () => {
	const listUsersResponse = await notion.users.list({})
    console.log(listUsersResponse)
}

const DATABASE_ID = "1a6529bf8e0880bb84e2f39ae118fed0";

export async function getNotionData() {
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({}) // optional filters can go here
  });

  const data = await res.json();
  console.log(data);
  return data;
}