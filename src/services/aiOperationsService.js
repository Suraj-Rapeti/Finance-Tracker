/**
 * AI Operations Service
 * Handles parsing AI responses for operations and executing them
 */

export const OPERATION_TYPES = {
  ADD_TRANSACTION: 'add_transaction',
  ADD_BUDGET: 'add_budget',
  ADD_GOAL: 'add_goal',
  ADD_BILL: 'add_bill',
  UPDATE_TRANSACTION: 'update_transaction',
  UPDATE_BUDGET: 'update_budget',
  DELETE_TRANSACTION: 'delete_transaction',
};

/**
 * Extract operations from AI response (JSON embedded in response)
 * Expected format: {"operations": [{"type": "...", "data": {...}}]}
 */
export const extractOperations = (aiResponse) => {
  try {
    // Look for JSON block in response
    const jsonMatch = aiResponse.match(/\{[\s\S]*"operations"[\s\S]*\}/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed.operations) ? parsed.operations : [];
  } catch (error) {
    console.log('No operations found in response');
    return [];
  }
};

/**
 * Clean response text by removing JSON blocks
 */
export const cleanResponseText = (response) => {
  return response.replace(/\{[\s\S]*"operations"[\s\S]*\}/g, '').trim();
};

/**
 * Execute operations using provided context functions
 */
export const executeOperations = async (operations, contextFunctions) => {
  const results = [];

  for (const operation of operations) {
    try {
      let result = {
        type: operation.type,
        success: false,
        message: '',
      };

      switch (operation.type) {
        case OPERATION_TYPES.ADD_TRANSACTION:
          if (!contextFunctions.addTransaction) throw new Error('addTransaction not available');
          await contextFunctions.addTransaction(operation.data);
          result.success = true;
          result.message = `✅ Added ${operation.data.type} of ₹${operation.data.amount}`;
          break;

        case OPERATION_TYPES.ADD_BUDGET:
          if (!contextFunctions.addBudget) throw new Error('addBudget not available');
          await contextFunctions.addBudget(operation.data);
          result.success = true;
          result.message = `✅ Created budget for ${operation.data.category}`;
          break;

        case OPERATION_TYPES.ADD_GOAL:
          if (!contextFunctions.addGoal) throw new Error('addGoal not available');
          await contextFunctions.addGoal(operation.data);
          result.success = true;
          result.message = `✅ Created goal: ${operation.data.goal_name}`;
          break;

        case OPERATION_TYPES.ADD_BILL:
          if (!contextFunctions.addBill) throw new Error('addBill not available');
          await contextFunctions.addBill(operation.data);
          result.success = true;
          result.message = `✅ Added bill: ${operation.data.title}`;
          break;

        case OPERATION_TYPES.UPDATE_TRANSACTION:
          if (!contextFunctions.updateTransaction) throw new Error('updateTransaction not available');
          await contextFunctions.updateTransaction(operation.data.id, operation.data.updates);
          result.success = true;
          result.message = `✅ Updated transaction`;
          break;

        case OPERATION_TYPES.UPDATE_BUDGET:
          if (!contextFunctions.updateBudget) throw new Error('updateBudget not available');
          await contextFunctions.updateBudget(operation.data.id, operation.data.updates);
          result.success = true;
          result.message = `✅ Updated budget`;
          break;

        case OPERATION_TYPES.DELETE_TRANSACTION:
          if (!contextFunctions.deleteTransaction) throw new Error('deleteTransaction not available');
          await contextFunctions.deleteTransaction(operation.data.id);
          result.success = true;
          result.message = `✅ Deleted transaction`;
          break;

        default:
          result.message = `❌ Unknown operation: ${operation.type}`;
      }

      results.push(result);
    } catch (error) {
      results.push({
        type: operation.type,
        success: false,
        message: `❌ Failed: ${error.message}`,
      });
    }
  }

  return results;
};

/**
 * Build operation confirmation message
 */
export const buildOperationSummary = (results) => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  let summary = '';
  if (successful.length > 0) {
    summary += successful.map(r => r.message).join('\n');
  }
  if (failed.length > 0) {
    if (summary) summary += '\n\n';
    summary += failed.map(r => r.message).join('\n');
  }

  return summary;
};
