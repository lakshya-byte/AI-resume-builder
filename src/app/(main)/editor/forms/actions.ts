"use server";

import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  workExperience,
} from "@/lib/validation";
import openai from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { canUseAITools } from "@/lib/permissions";

export async function generateSummary(input: GenerateSummaryInput) {
  
  const {userId} = await auth()

  if(!userId){
    throw new Error("User not found");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if(!canUseAITools(subscriptionLevel)){
    throw new Error("Upgrade to use AI tools");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are a resume builder assistant. You are given a job title and a list of work experience, educations, and skills. You need to generate a professional summary for a resume.only return the summary, no other text.keep it short and concise.
    `;

  const userMessage = `
    please generate a summary for the following job title and information:
        Job Title: ${jobTitle || "N/A"}
        Work Experience: ${workExperiences?.map((exp) => `${exp.position} at ${exp.company} from ${exp.startDate} to ${exp.endDate} - ${exp.description}`).join(", ") || "N/A"}
        Educations: ${educations?.map((edu) => `${edu.degree} at ${edu.school} from ${edu.startDate} to ${edu.endDate}`).join(", ") || "N/A"}
        Skills: ${skills?.join(", ") || "N/A"}
    `;
  console.log("userMessage", userMessage);
  console.log("systemMessage", systemMessage);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiResponse = response.choices[0].message.content;
  if (!aiResponse) {
    throw new Error("failed to generate response");
  }
  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const {userId} = await auth()

  if(!userId){
    throw new Error("User not found");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if(!canUseAITools(subscriptionLevel)){
    throw new Error("Upgrade to use AI tools");
  }


  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `You are an expert in resume writing. You are given a description of a work experience and you need to generate a single work experience that is relevant to the description.must ashere to the following structure.you can omit any fields that cant be inferred from the description, but dont add any fields that arent relevant to the description.
    Job title: <job title>
    Company: <company name>
    Start date: <format yyyy-mm-dd>(only if the description mentions a start date   )
    End date: <format yyyy-mm-dd>(only if the description mentions an end date)
    Description: <description>`;

  const userMessage = `Generate a work experience that is relevant to the description.
    The description is: ${description}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiResponse = response.choices[0].message.content;
  if (!aiResponse) {
    throw new Error("failed to generate response");
  }
  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    startDate: aiResponse.match(/Start date: (.*)/)?.[1] || "",
    endDate: aiResponse.match(/End date: (.*)/)?.[1] || "",
    description: aiResponse.match(/Description: (.*)/)?.[1] || "",
  } satisfies workExperience;
}

