# OpenAI API Integration Setup

## 🔧 Getting Your OpenAI API Key

1. **Create OpenAI Account** (if you don't have one)
   - Go to https://platform.openai.com/signup
   - Sign up with your email

2. **Get API Key**
   - Go to https://platform.openai.com/account/api-keys
   - Click "Create new secret key"
   - Copy the key (save it somewhere safe - you won't see it again!)

3. **Set Up Environment Variable**
   - In the project root (`d:/Finance Tracker/finance-tracker/`)
   - Create a file named `.env.local`
   - Add this line:
     ```
     VITE_OPENAI_API_KEY=sk-your_actual_api_key_here
     ```
   - Replace `sk-your_actual_api_key_here` with your actual API key

4. **Restart Dev Server**
   - Kill the current `npm run dev` process (Ctrl+C)
   - Run `npm run dev` again
   - The app should now load the API key from .env.local

---

## ✅ Testing the AI Assistant

1. Navigate to the **AI Assistant** page
2. Ask any question about your finances, e.g.:
   - "How can I reduce my expenses?"
   - "What's my savings rate?"
   - "Tips to improve my budget?"
3. The AI will respond with personalized advice based on your financial data

---

## 💰 API Costs

- **GPT-3.5 Turbo**: ~$0.0015 per message (very cheap)
- **Monthly Budget**: With $5-10/month, you can have 1000-3000+ conversations
- Monitor usage at: https://platform.openai.com/account/usage/overview

---

## 🔒 Security Notes

- **Never** commit `.env.local` to git (it's in `.gitignore`)
- Keep your API key private
- Monitor your API usage regularly to avoid surprise charges
- Set spending limits in OpenAI account settings if needed

---

## 🐛 Troubleshooting

**"Invalid OpenAI API key"**
- Check your API key is correct
- Verify the key starts with `sk-`
- Restart the dev server after adding `.env.local`

**"Network error"**
- Check your internet connection
- Verify OpenAI API is accessible

**"Rate limit exceeded"**
- Wait a moment and try again
- Check your API usage limits

---

## 📝 What the AI Knows About You

The AI assistant receives your real-time financial context:
- Monthly income & expenses
- Savings rate
- Net balance
- Number of transactions, budgets, and goals

This enables highly personalized financial advice! 💡
