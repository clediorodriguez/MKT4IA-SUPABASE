
import { GoogleGenAI, Type, FunctionDeclaration, Tool, Schema } from "@google/genai";
import { CHAT_MODEL, IMAGE_MODEL, VIDEO_MODEL_FAST, SYSTEM_INSTRUCTION } from "../constants";

// Tool Definitions
const generateImageTool: FunctionDeclaration = {
  name: "generate_image",
  description: "Generate an image based on a prompt for the optical market context.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      prompt: {
        type: Type.STRING,
        description: "A detailed visual description of the image to generate (e.g., sunglasses on a beach, close up of eye).",
      },
      aspectRatio: {
        type: Type.STRING,
        description: "The aspect ratio. Options: '1:1' (Post), '9:16' (Story), '16:9' (Landscape). Default '1:1'.",
      },
    },
    required: ["prompt"],
  },
};

const generateVideoTool: FunctionDeclaration = {
  name: "generate_video",
  description: "Generate a video based on a prompt.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      prompt: {
        type: Type.STRING,
        description: "A detailed visual description of the video movement and subject.",
      },
    },
    required: ["prompt"],
  },
};

const composeImageTool: FunctionDeclaration = {
  name: "compose_image",
  description: "Advanced Image Fusion: Composes a final static image by integrating a described product/element into a specific scene/background.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      scenePrompt: {
        type: Type.STRING,
        description: "Description of the background scene, lighting, and atmosphere.",
      },
      elementDescription: {
        type: Type.STRING,
        description: "Description of the product or element to be fused into the scene (e.g. 'black aviator sunglasses').",
      },
    },
    required: ["scenePrompt", "elementDescription"],
  },
};

const composeMotionSceneTool: FunctionDeclaration = {
  name: "compose_motion_scene",
  description: "Advanced Motion Fusion: Creates a video integrating a product/element into a dynamic scene.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      scenePrompt: {
        type: Type.STRING,
        description: "Description of the motion, environment, and camera movement.",
      },
      elementDescription: {
        type: Type.STRING,
        description: "Description of the product/element to be featured in the video.",
      },
    },
    required: ["scenePrompt", "elementDescription"],
  },
};

// GEMINI FLOW TOOL
const runGeminiFlowTool: FunctionDeclaration = {
  name: "run_gemini_flow",
  description: "Orchestrates a complete marketing campaign. Generates a strategy, copy, and instructions to create multiple media assets (images/videos) in a single workflow.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      campaignName: {
        type: Type.STRING,
        description: "Name of the campaign (e.g., 'Summer Collection Launch').",
      },
      strategySummary: {
        type: Type.STRING,
        description: "Brief explanation of the marketing strategy.",
      },
      visualAssets: {
        type: Type.ARRAY,
        description: "List of visual assets to generate immediately.",
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["image", "video"] },
            prompt: { type: Type.STRING, description: "Prompt for the AI generator" },
            aspectRatio: { type: Type.STRING, description: "1:1 or 9:16" }
          },
          required: ["type", "prompt"]
        }
      },
      copywriting: {
        type: Type.OBJECT,
        properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING },
            hashtags: { type: Type.STRING }
        }
      }
    },
    required: ["campaignName", "visualAssets", "copywriting"]
  }
};

const tools: Tool[] = [
  { functionDeclarations: [generateImageTool, generateVideoTool, composeImageTool, composeMotionSceneTool, runGeminiFlowTool] }
];

// Initialize GenAI
const getAI = (apiKey?: string) => {
    const key = apiKey || process.env.API_KEY;
    if(!key) throw new Error("API Key not found");
    return new GoogleGenAI({ apiKey: key });
};

// Chat Service
export const createChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: tools,
    },
  });
};

// Image Generation Service
export const generateImageService = async (prompt: string, aspectRatio: string = "1:1"): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio as any, 
        }
      },
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }
    
    if (!imageUrl) throw new Error("No image generated.");
    return imageUrl;
  } catch (error) {
    console.error("Image gen error:", error);
    throw error;
  }
};

// Video Generation Service (Veo)
export const generateVideoService = async (prompt: string): Promise<string> => {
    // 1. Check/Get Key
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
        await window.aistudio.openSelectKey();
    }
    
    // Create new instance to ensure key injection if it was just selected
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // System injects the selected key here automatically

    try {
        let operation = await ai.models.generateVideos({
            model: VIDEO_MODEL_FAST,
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16' // Vertical for Stories/Reels by default
            }
        });

        // Polling
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("No video URI returned");

        // Fetch with key
        const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await videoResponse.blob();
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("Video gen error:", error);
        throw error;
    }
};
