import { NextResponse } from 'next/server';
import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request) {
  try {
    const { imageBase64 } = await request.json();

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "anthropic/claude-3-opus-20240229",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              },
              {
                type: "text",
                text: "Analyze this image and provide a JSON object with the following structure: { items: [{ name: string, quantity: number }] }. The 'items' array should contain objects representing each distinct item visible in the image, with its name and estimated quantity. In the event that the image being analyzed is not an item or object that would be found in a pantry, please return a JSON object with the following structure: { error: string }. The 'error' string should contain a message explaining why the image would not be found in a pantry. It's important to note here that items in a pantry are not necessarily food items, but rather any item or object that would be found in a pantry. The image may depict a person, a pet, a plant, or any other item or object that would not be found in a pantry but may contain them. For example, if a person takes a photo of themselves holding three green bananas, we can safely assume and add the three banas to the JSON object as an item. In the same train of thought, if a person takes a photo of their hand holding a fruit or vegetable, we can safely assume and add the fruit or vegetable to the JSON object as an item. All human-related items should be ignored in the image and should mainly focus on items that would be found in a pantry. This means if a hand exists in the image with a kiwi fruit, we can add the kiwi fruit to the JSON object as an item, but we should ignore the hand."
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.choices[0].message.content.includes("error")) {
      console.error("Error analyzing image", { error: response.data.choices[0].message.content })
      return NextResponse.json({ error: response.data.choices[0].message.content }, { status: 400 });
    }

    const analysis = JSON.parse(response.data.choices[0].message.content);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Error analyzing image' }, { status: 500 });
  }
}
