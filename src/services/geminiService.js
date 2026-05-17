import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Rate limit settings for Gemini free tier (60 requests/minute)
const MAX_RETRIES = 1; // Only 1 retry to conserve quota
const INITIAL_RETRY_DELAY = 3000; // Wait 3 seconds before retry

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const callGemini = async (userMessage, financialContext, retryCount = 0) => {
  try {
    const systemPrompt = `You are FinAI, a professional financial advisor AI assistant. You help users manage their personal finances with personalized advice based on their financial data.

Current Financial Context:
- Monthly Income: ₹${financialContext.totalIncome.toLocaleString()}
- Monthly Expenses: ₹${financialContext.totalExpenses.toLocaleString()}
- Net Balance: ₹${financialContext.netBalance.toLocaleString()}
- Savings Rate: ${financialContext.savingsRate}%
- Total Transactions: ${financialContext.transactionCount || 0}
- Active Budgets: ${financialContext.budgetCount || 0}
- Financial Goals: ${financialContext.goalCount || 0}

Provide practical, actionable financial advice based on their specific situation. Be encouraging but realistic. Ask clarifying questions if needed.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return text || 'I apologize, but I could not process your request.';
  } catch (error) {
    console.error('Gemini API error:', error);

    // Check if it's a rate limit error (429 or quota exceeded)
    const isRateLimitError = 
      error.message?.includes('429') || 
      error.message?.includes('rate') || 
      error.message?.includes('quota') ||
      error.message?.includes('RESOURCE_EXHAUSTED');

    if (isRateLimitError && retryCount < MAX_RETRIES) {
      // Simple backoff for free tier - wait longer to respect quota
      const delaySec = Math.ceil(INITIAL_RETRY_DELAY / 1000);
      
      console.log(`Rate limit hit. Waiting ${delaySec}s before retry (${retryCount + 1}/${MAX_RETRIES})...`);
      await delay(INITIAL_RETRY_DELAY);
      return callGemini(userMessage, financialContext, retryCount + 1);
    } else if (isRateLimitError) {
      // No more retries - inform user
      throw new Error(
        'Rate limit reached (60 requests/minute). Please wait 1-2 minutes before sending another message.'
      );
    }

    // Handle API key errors
    if (error.message?.includes('API key') || error.message?.includes('INVALID_ARGUMENT')) {
      throw new Error('Invalid Gemini API key. Please check your .env file configuration.');
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.message?.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    }

    throw new Error(error.message || 'Failed to get AI response. Please try again.');
  }
};
