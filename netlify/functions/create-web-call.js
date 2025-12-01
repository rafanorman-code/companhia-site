// netlify/functions/create-web-call.js

// Node 18+ no Netlify já tem fetch global

exports.handler = async (event) => {
  // Só permite POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      console.error("RETELL_API_KEY não configurada no Netlify");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "RETELL_API_KEY não configurada" }),
      };
    }

    // Seu agente do Companhia
    const agentId = "agent_087b8a84fdc535a0974c9bb0f7";

    const response = await fetch(
      "https://api.retellai.com/v2/create-web-call",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          // metadata: { user_id: "..." } se quiser mandar depois
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da Retell:", data);
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Erro ao criar web call na Retell",
          details: data,
        }),
      };
    }

    const { access_token, call_id } = data;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ access_token, call_id }),
    };
  } catch (err) {
    console.error("Erro no create-web-call:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Erro interno ao criar web call" }),
    };
  }
};
