import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from 'lucide-react';

export default function DashboardOverview() {
  const { totalIncome, totalExpenses, remainingBalance, budgetLimit } = useFinance();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isOverBudget = budgetLimit > 0 && totalExpenses > budgetLimit;

  return (
    <div className="dashboard-grid">
      <div className="col-4">
        <div className="glass-card stat-card">
          <div className="icon-wrapper" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <TrendingUp size={24} />
          </div>
          <h3>Total Income</h3>
          <div className="value text-success">{formatCurrency(totalIncome)}</div>
        </div>
      </div>
      
      <div className="col-4">
        <div className="glass-card stat-card">
          <div className="icon-wrapper" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <TrendingDown size={24} />
          </div>
          <h3>Total Expenses</h3>
          <div className="value text-danger">{formatCurrency(totalExpenses)}</div>
        </div>
      </div>
      
      <div className="col-4">
        <div className="glass-card stat-card">
          <div className="icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' }}>
            <Wallet size={24} />
          </div>
          <h3>Remaining Balance</h3>
          <div className="value">{formatCurrency(remainingBalance)}</div>
        </div>
      </div>

      {isOverBudget && (
        <div className="col-12">
          <div className="budget-warning">
            <AlertTriangle size={24} />
            <div>
              <strong>Budget Exceeded!</strong> You have spent {formatCurrency(totalExpenses - budgetLimit)} over your monthly limit of {formatCurrency(budgetLimit)}.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
