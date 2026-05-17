import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import { toast } from 'sonner';
import { useFinance } from '../context/FinanceContext';
import { PageWrapper } from '../animations/variants.jsx';
import { formatCurrency } from '../utils/formatters';
import { callGroq } from '../services/groqService';
import { extractOperations, cleanResponseText, executeOperations, buildOperationSummary } from '../services/aiOperationsService';

const SUGGESTED_QUESTIONS = [
  'How can I reduce my monthly expenses?',
  'Am I saving enough for retirement?',
  'Which budget category needs attention?',
  'How do I reach my emergency fund goal faster?',
  'What\'s my biggest spending category?',
  'Give me tips to boost my savings rate',
];

const TypingIndicator = () => (
  <div className="flex gap-1.5 px-4 py-3">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-violet-400/70"
      />
    ))}
  </div>
);

const MessageBubble = ({ message }) => {
  const isAI = message.role === 'assistant';

  const formatContent = (text) => {
    return text.split('**').map((part, i) => (
      i % 2 === 1
        ? <strong key={i} className="text-white font-semibold">{part}</strong>
        : <span key={i}>{part}</span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAI ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-emerald-500/20 border border-emerald-500/30'
      }`}>
        {isAI ? <Bot size={16} className="text-violet-400" /> : <User size={16} className="text-emerald-400" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isAI ? '' : 'text-right'}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isAI
            ? 'bg-white/[0.05] border border-white/[0.08] text-white/80 rounded-tl-sm'
            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-tr-sm'
        }`}>
          {isAI ? formatContent(message.content) : message.content}
        </div>
        <p className="text-white/25 text-[10px] mt-1 px-1">
          {message.timestamp instanceof Date
            ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
};

export const AIAssistant = () => {
  const { chatMessages, addChatMessage, totalIncome, totalExpenses, savingsRate, transactions, budgets, goals, addTransaction, updateTransaction, deleteTransaction, addBudget, updateBudget, deleteBudget, addGoal, updateGoal, deleteGoal, addBill, updateBill, deleteBill } = useFinance();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setInput('');
    setError(null);

    addChatMessage({ role: 'user', content: userMsg });
    setIsTyping(true);

    try {
      // Prepare financial context for AI
      const financialContext = {
        totalIncome,
        totalExpenses,
        savingsRate: parseFloat(savingsRate),
        netBalance: totalIncome - totalExpenses,
        transactionCount: transactions.length,
        budgetCount: budgets.length,
        goalCount: goals.length,
      };

      // Call Groq API (No rate limits on free tier!)
      const rawResponse = await callGroq(userMsg, financialContext);

      // Extract operations from response
      const operations = extractOperations(rawResponse);
      
      // Prepare context functions for operations
      const contextFunctions = {
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        addBill,
        updateBill,
        deleteBill,
      };

      // Execute operations if any
      let operationSummary = '';
      if (operations.length > 0) {
        const results = await executeOperations(operations, contextFunctions);
        operationSummary = buildOperationSummary(results);
      }

      // Clean response text and combine with operation summary
      const cleanedResponse = cleanResponseText(rawResponse);
      const finalResponse = operationSummary 
        ? `${cleanedResponse}\n\n${operationSummary}`
        : cleanedResponse;

      addChatMessage({ role: 'assistant', content: finalResponse });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to get AI response');
      console.error('Groq Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <PageWrapper>
      <div className="h-full flex flex-col lg:flex-row gap-5" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                <Bot size={20} className="text-violet-400" />
              </div>
              <div>
                <p className="text-white font-semibold">FinAI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-emerald-400 text-xs">Online · Ready to help</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-violet-400/70 text-xs bg-violet-500/10 px-2.5 py-1.5 rounded-full border border-violet-500/20">
                <span className="text-xs">✨</span>
                AI Powered
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {chatMessages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-violet-400" />
                </div>
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={isTyping}
                className="flex-shrink-0 text-xs px-3 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/55 hover:text-white/80 hover:border-white/[0.16] hover:bg-white/[0.07] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs"
            >
              {error}
            </motion.div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/[0.06]">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything about your finances..."
                className="input-glass flex-1"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel — Finance Summary */}
        <div className="lg:w-72 space-y-4">
          {/* Quick Stats */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">📊</span>
              <p className="text-white/70 text-sm font-medium">Your Snapshot</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Monthly Income', value: formatCurrency(totalIncome), color: 'text-emerald-400' },
                { label: 'Monthly Expenses', value: formatCurrency(totalExpenses), color: 'text-rose-400' },
                { label: 'Savings Rate', value: `${savingsRate}%`, color: 'text-violet-400' },
                { label: 'Net Savings', value: formatCurrency(totalIncome - totalExpenses), color: 'text-sky-400' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-white/40 text-xs">{stat.label}</span>
                  <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="glass-card p-4">
            <p className="text-white/70 text-sm font-medium mb-3">Suggested Questions</p>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="w-full text-left text-xs p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/80 hover:border-violet-500/25 hover:bg-violet-500/[0.04] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
