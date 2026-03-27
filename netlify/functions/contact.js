const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { companyName, contactName, phone, serviceType, message } = JSON.parse(event.body);

    if (!companyName || !contactName || !phone || !serviceType) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "필수 항목을 입력해주세요." }) };
    }

    const serviceTypes = Array.isArray(serviceType) ? serviceType : serviceType.split(", ");

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          "업체명": {
            title: [{ text: { content: companyName } }],
          },
          "담당자명": {
            rich_text: [{ text: { content: contactName } }],
          },
          "연락처": {
            phone_number: phone,
          },
          "서비스유형": {
            multi_select: serviceTypes.map((type) => ({ name: type.trim() })),
          },
          "문의내용": {
            rich_text: [{ text: { content: message || "" } }],
          },
          "상태": {
            select: { name: "신규" },
          },
          "접수일시": {
            date: { start: new Date().toISOString() },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Notion API error:", JSON.stringify(errorData));
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Notion 저장에 실패했습니다." }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "문의가 접수되었습니다." }) };
  } catch (error) {
    console.error("Function error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "서버 오류가 발생했습니다." }) };
  }
};
