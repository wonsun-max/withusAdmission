declare var process: { env: Record<string, string | undefined> };

export async function parseDocumentWithUpstage(file: File) {
  const apiKey = process.env.UPSTAGE_API_KEY;
  const model = process.env.UPSTAGE_DOCUMENT_MODEL || "document-parse-v1";
  
  if (!apiKey) {
    throw new Error("UPSTAGE_API_KEY is not configured");
  }

  const formData = new FormData();
  formData.append("document", file);

  const response = await fetch(`https://api.upstage.ai/v1/document-ai/document-parse`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Upstage API error: ${response.status} ${errorBody}`);
  }

  return response.json();
}
