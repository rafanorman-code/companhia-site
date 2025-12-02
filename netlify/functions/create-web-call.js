// netlify/functions/create-web-call.js

exports.handler = async (event) => {
  // Se for GET, só mostra debug das envs
  if (event.httpMethod === "GET") {
    const apiKey = process.env.RETELL_API_KEY || null;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey ? apiKey.slice(0, 10) : null,
        envKeys: Object.keys(process.env),
      }),
    };
  }

  // Só permite POST para uso normal
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      console.error("RETELL_API_KEY não configurada");
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "RETELL_API_KEY não configurada" }),
      };
    }

    const agentId = "agent_087b8a84fdc535a0974c9bb0f7";

    const response = await fetch(
      "https://api.retellai.com/v2/create-web-call",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: agentId }),
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
