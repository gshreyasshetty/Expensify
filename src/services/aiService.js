import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-1.5-flash";

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096,
};

export const aiService = {
  getFinancialInsights: async (budgets = [], expenses = []) => {
    const MAX_RETRIES = 2;
    let retryCount = 0;

    const executeWithRetry = async () => {
      try {
        if (!budgets.length || !expenses.length) {
          return null;
        }

        if (!API_KEY || !genAI) {
          console.error("API key is missing");
          return {
            error: "API key is missing. Please add your Gemini API key to your environment variables.",
            timestamp: Date.now()
          };
        }

        const model = genAI.getGenerativeModel({
          model: MODEL,
          generationConfig
        });

        const expensesByBudget = {};
        expenses.forEach(expense => {
          if (!expensesByBudget[expense.budgetId]) {
            expensesByBudget[expense.budgetId] = [];
          }
          expensesByBudget[expense.budgetId].push(expense);
        });

        const budgetUtilization = budgets.map(budget => {
          const budgetExpenses = expensesByBudget[budget.id] || [];
          const spent = budgetExpenses.reduce((total, expense) => total + expense.amount, 0);
          return {
            id: budget.id,
            name: budget.name,
            allocated: budget.amount,
            spent,
            remaining: budget.amount - spent,
            percentUtilized: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
            expenses: budgetExpenses.map(e => ({
              name: e.name,
              amount: e.amount,
              date: new Date(e.createdAt).toISOString().split('T')[0]
            }))
          };
        });

        const totalBudgeted = budgetUtilization.reduce((sum, b) => sum + b.allocated, 0);
        const totalSpent = budgetUtilization.reduce((sum, b) => sum + b.spent, 0);

        if (totalBudgeted === 0 || totalSpent === 0) {
          return {
            error: "Not enough financial data to generate insights. Please add more budgets and expenses.",
            timestamp: Date.now()
          };
        }

        const simplifiedData = budgetUtilization.map(b => ({
          name: b.name,
          allocated: b.allocated,
          spent: b.spent,
          remaining: b.remaining,
          percentUtilized: b.percentUtilized,
          expenseCount: b.expenses.length
        }));

        const prompt = `
          As a professional financial advisor in the Expensify personal budgeting app, provide specific, actionable insights based on the user's actual financial data:
          Budget Utilization Data:
          ${JSON.stringify(simplifiedData, null, 2)}
          Provide the following sections, with concise, personalized content that demonstrates deep analysis of patterns:
          Overall Financial Assessment: A brief, data-driven assessment of the user's financial situation. Focus on specific patterns you observe (2-3 sentences).
          Budget-Specific Insights: Provide targeted advice for each individual budget category. Focus on the categories with the highest spending or most concerning patterns. Be specific about what the data shows.
          Savings Opportunities: Identify 2 very specific areas where the user could save money based on their actual spending patterns, not generic advice.
          Investment Suggestions: If there are surplus funds, suggest practical investment approaches appropriate for their specific financial situation.
          Financial Health Score: Rate the user's financial health on a scale of 1-10 based on their budget management, with clear justification for the score.
          IMPORTANT FORMATTING INSTRUCTIONS:
          - DO NOT use numbering (like "1.", "2.") before section titles
          - Start each section with just the title followed by a colon (e.g., "Overall Financial Assessment:")
          - Use short, direct sentences and avoid filler text
          - Use bullet points (•) for lists, not asterisks
          - Don't leave excessive space between bullet points - make the content compact
          - When referring to specific budget categories, use bold text by placing the name between ** (e.g., **Groceries**)
          - For Financial Health Score, just provide the number out of 10 and a brief explanation
          - Don't end with ellipses or trailing comments
        `;

        console.log("Sending request to AI model...");
        console.log("Model:", MODEL);
        console.log("Config:", generationConfig);

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        if (!response || response.trim() === '') {
          throw new Error("Empty response from AI model");
        }

        console.log("Response received, processing...");

        const scoreRegex = /Financial Health Score:?\s*(\d+(?:\.\d+)?)[\/\s]*10/i;
        const scoreMatch = response.match(scoreRegex);
        const financialScore = scoreMatch ? parseFloat(scoreMatch[1]) : null;

        const cleanResponse = response
          .replace(/Financial Health Score:.+?(?:\d+\/10|\d+\s*out of\s*10).*?$/s, (match) => {
            return match.split(/\.\s*[A-Z]/)[0] + '.';
          })
          .replace(/^\s*\d+\.\s*/gm, '')
          .replace(/([.!?])\s*(Overall Financial Assessment|Budget-Specific Insights|Savings Opportunities|Investment Suggestions|Financial Health Score):/g, '$1\n\n$2:')
          .replace(/^\s*\*\s*(.+)$/gm, '• $1')
          .replace(/\n\s*•/g, '\n•')
          .replace(/\n{3,}/g, '\n\n')
          .replace(/\.{3,}$/gm, '.')
          .replace(/(Overall Financial Assessment|Budget-Specific Insights|Savings Opportunities|Investment Suggestions|Financial Health Score):\s*\n+/g, '$1:\n')
          .replace(/(\d+\/10)([^.])([^.]*)$/, '$1.$3');

        const sections = cleanResponse.split(/\n\s*\n/)
          .filter(section => section.trim() !== '')
          .map(section => section.trim());

        return {
          fullResponse: cleanResponse,
          financialScore,
          sections,
          timestamp: Date.now()
        };
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Retry attempt ${retryCount} for AI insights generation`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return executeWithRetry();
        }

        console.error("Error generating AI insights:", error);

        let errorMessage = "Unable to generate financial insights";
        let detailedError = error.message || "Unknown error";

        if (error.message && error.message.includes("GoogleGenerativeAI Error")) {
          if (error.message.includes("Invalid JSON payload")) {
            errorMessage = "API configuration error. Please contact support.";
          } else if (error.message.includes("403")) {
            errorMessage = "API access denied. Please check your API key.";
          } else if (error.message.includes("404")) {
            errorMessage = "AI model not found. The model may be unavailable or incorrect.";
          } else {
            errorMessage = "AI service error. Please try again later.";
          }
        } else if (error.message && error.message.includes("API key")) {
          errorMessage = "API authentication error. Please try again later.";
        } else if (error.message && error.message.includes("timeout")) {
          errorMessage = "Connection timeout. Please check your internet connection and try again.";
        } else if (error.message && error.message.includes("Empty response")) {
          errorMessage = "AI model returned an empty response. Please try again with more complete financial data.";
        } else if (error.name === "AbortError") {
          errorMessage = "Request was aborted. Please try again later.";
        } else if (error.name === "TypeError" && error.message.includes("fetch")) {
          errorMessage = "Network error. Please check your internet connection.";
        }

        return {
          error: errorMessage,
          detailedError: detailedError,
          timestamp: Date.now()
        };
      }
    };

    return executeWithRetry();
  }
};
