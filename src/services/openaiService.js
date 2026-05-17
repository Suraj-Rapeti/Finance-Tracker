import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for frontend usage
});

const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const callOpenAI = async (userMessage, financialContext, retryCount = 0) => {
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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I could not process your request.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your .env file configuration.');
    } else if (error.status === 429) {
      // Rate limit error - implement retry with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Rate limited. Retrying in ${delayMs}ms...`);
        await delay(delayMs);
        return callOpenAI(userMessage, financialContext, retryCount + 1);
      } else {
        throw new Error('Rate limit exceeded. Please wait a few moments and try again. Consider upgrading your OpenAI plan for higher limits.');
      }
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw new Error(error.message || 'Failed to get AI response. Please try again.');
  }
};
