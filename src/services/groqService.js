import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Required for frontend usage
});

export const callGroq = async (userMessage, financialContext) => {
  try {
    const systemPrompt = `You are FinAI, a professional financial advisor AI assistant. You help users manage their personal finances with personalized advice based on their financial data.

IMPORTANT - YOU CAN PERFORM OPERATIONS:
If the user asks you to create/add/update financial data, you MUST respond with operations in JSON format.

Current Financial Context:
- Monthly Income: ₹${financialContext.totalIncome.toLocaleString()}
- Monthly Expenses: ₹${financialContext.totalExpenses.toLocaleString()}
- Net Balance: ₹${financialContext.netBalance.toLocaleString()}
- Savings Rate: ${financialContext.savingsRate}%
- Total Transactions: ${financialContext.transactionCount || 0}
- Active Budgets: ${financialContext.budgetCount || 0}
- Financial Goals: ${financialContext.goalCount || 0}

OPERATION INSTRUCTIONS:
When user requests to ADD/CREATE/UPDATE data, include a JSON block like this:
{
  "operations": [
    {
      "type": "add_transaction",
      "data": {"amount": 500, "category": "Food", "type": "expense", "payment_method": "Cash", "title": "Groceries", "date": "2024-01-15"}
    }
  ]
}

Available operations:
- "add_transaction": {amount, category, type(income/expense), payment_method, title, date}
- "add_budget": {category, limit_amount, month}
- "add_goal": {goal_name, target_amount, deadline}
- "add_bill": {title, amount, category, dueDate}
- "update_transaction": {id, updates{}}
- "delete_transaction": {id}

ALWAYS include your conversational response BEFORE the JSON block.
For example: "Great! I've added your expense. Let me help you track this... {"operations": [...]}"

Provide practical, actionable financial advice based on their specific situation. Be encouraging but realistic.`;

    const response = await groq.chat.completions.create({
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
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I could not process your request.';
  } catch (error) {
    console.error('Groq API error:', error);

    // Handle API key errors
    if (error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Invalid Groq API key. Please check your .env file configuration.');
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.message?.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    }

    // Groq has no rate limits on free tier, so this shouldn't happen
    if (error.message?.includes('429') || error.message?.includes('rate')) {
      throw new Error('Unexpected rate limit. Please try again in a moment.');
    }

    throw new Error(error.message || 'Failed to get AI response. Please try again.');
  }
};
