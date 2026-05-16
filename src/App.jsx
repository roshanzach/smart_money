import { useState, useEffect } from 'react';
import { useFinance } from './context/FinanceContext';
import DashboardOverview from './components/DashboardOverview';
import TransactionForm from './components/TransactionForm';
import BudgetSettings from './components/BudgetSettings';
import Charts from './components/Charts';
import TransactionCalendar from './components/TransactionCalendar';
import TransactionList from './components/TransactionList';
import { generateReport } from './utils/reportGenerator';
import { Download, Loader2 } from 'lucide-react';
import LoginPage from './components/LoginPage';

function App() {
  const { fetchData } = useFinance();
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('smartMoney_token'));
  const [selectedDate, setSelectedDate] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleExport = async () => {
    setIsExporting(true);
    await generateReport('report-content', 'SmartMoney_Dashboard.pdf');
    setIsExporting(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Smart Money</h1>
        <div className="actions">
          <button 
            className="btn btn-outline" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={18} />}
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </header>

      <div id="report-content" className="report-content">
        <DashboardOverview />

        <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
          <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <TransactionForm />
            <BudgetSettings />
          </div>

          <div className="col-8">
            <Charts />
          </div>

          <div className="col-4">
            <TransactionCalendar 
              selectedDate={selectedDate} 
              setSelectedDate={setSelectedDate} 
            />
          </div>

          <div className="col-8">
            <TransactionList selectedDate={selectedDate} />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
