const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

exports.handler = async function () {
  try {
    const data = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data.results),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
