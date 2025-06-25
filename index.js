import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const systemTemplate = "Come up with a {difficulty} recipe for the following dish. Just keep it strictly to instructions.";

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash",
    temperature: 0
});

// call 1
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{dish}"],
]);
const promptValue = await promptTemplate.invoke({
    difficulty: "advanced",
    dish: "ham and cheese sandwich",
});
const response = await model.invoke(promptValue);
console.log(`${response.content}\n`);

// chained call
const systemTemplate2 = `Take this recipe:\n${response.content} and modify it to accomodate the following dietary restriction. Just keep it strictly to instructions and mention the dietary restriction at the top.`;
const promptTemplate2 = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate2],
  ["user", "{restriction}"],
]);
const promptValue2 = await promptTemplate2.invoke({
    restriction: "dairy",
});
const response2 = await model.invoke(promptValue2);
console.log(`${response2.content}`);