import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
// Make sure to add GEMINI_API_KEY to your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { exerciseName } = await request.json();

  if (!exerciseName) {
    return Response.json(
      { error: "Exercise name is required" },
      { status: 400 } // Changed to 400 (Bad Request) as 404 is usually for 'Not Found'
    );
  }

  const prompt = `
You are a fitness coach.
You are given an exercise, provide clear instructions on how to perform the exercise. 
Include if any equipment is required.
Explain the exercise in detail and for a beginner.

The exercise name is: ${exerciseName}

Keep it short and concise. Use markdown formatting.

Use the following format:

## Equipment Required

## Instructions

### Tips

### Variations

### Safety

Keep spacing between the headings and the content.
Always use headings and subheadings.
`;

  try {
    // Select the model (gemini-1.5-flash is fast and cheap, similar to gpt-4o-mini)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Response:", text);

    return Response.json({
      message: text,
    });
  } catch (error) {
    console.error("Error fetching AI guidance:", error);
    return Response.json(
      { error: "Error fetching AI guidance" },
      { status: 500 }
    );
  }
}
