import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BusinessInfo {
  id: number;
  name: string;
  type: string;
  address?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    console.log(`Authenticated user: ${userId}`);

    const { query, businesses } = await req.json() as { 
      query: string; 
      businesses: BusinessInfo[] 
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a local business discovery AI for Bulawayo, Zimbabwe. Your job is to understand natural language queries and match them to available businesses.

Given a user's search query and a list of businesses, you must:
1. Understand the user's intent (what kind of place, atmosphere, occasion they want)
2. Match relevant businesses from the provided list
3. Return your selections with a brief, friendly explanation

IMPORTANT: You can ONLY return businesses from the provided list. Do not make up businesses.

Available business types include: banking, telecom, government, education, retail, healthcare, restaurant, fast_food, tourism, automotive, hotel, entertainment, pharmacy, beauty, business_services

When matching:
- "date night" → restaurants, hotels, entertainment
- "work/laptop/study" → cafes (if available), business_services, quiet places
- "family friendly" → retail, restaurants, tourism
- "quick food" → fast_food
- "official/documents" → government, banking
- "health/medical" → healthcare, pharmacy`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `User query: "${query}"

Available businesses:
${businesses.map(b => `- ID: ${b.id}, Name: "${b.name}", Type: ${b.type}, Address: ${b.address || 'N/A'}`).join('\n')}

Return a JSON object with:
{
  "results": [{ "id": <business_id> }, ...],
  "explanation": "<friendly 1-2 sentence explanation of your selections>"
}

Only include businesses that genuinely match the user's intent. If nothing matches well, return an empty results array with an explanation.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_search_results",
              description: "Return the matched businesses and explanation",
              parameters: {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" }
                      },
                      required: ["id"]
                    }
                  },
                  explanation: { type: "string" }
                },
                required: ["results", "explanation"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_search_results" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Fallback: try to parse from content
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return new Response(jsonMatch[0], {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ results: [], explanation: "I couldn't understand that query." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
