import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { expenseAPI } from '../services/api';
import { format } from 'date-fns';

const COLORS = {
  'Bills & Utilities': '#2563eb',
  'Shopping': '#8b5cf6',
  'Education': '#ec4899',
  'Food & Dining': '#f59e0b',
  'Entertainment': '#10b981',
  'Healthcare': '#06b6d4',
  'Transportation': '#6366f1'
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayTotal: 0,
    monthTotal: 0,
    avgDaily: 0,
    totalTransactions: 0,
    categoryBreakdown: []
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, expensesRes] = await Promise.all([
        expenseAPI.getStats(),
        expenseAPI.getAll()
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (expensesRes.data.success) {
        setRecentExpenses(expensesRes.data.data.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = stats.categoryBreakdown.map(item => ({
    name: item._id,
    value: item.total
  }));

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="page-header mb-4">
        <h2>Dashboard</h2>
        <p className="text-muted">Overview of your expenses</p>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Today's Expenses</p>
                  <h3 className="mb-1">${stats.todayTotal.toFixed(2)}</h3>
                  <small className="text-danger">+12% from yesterday</small>
                </div>
                <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-calendar"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">This Month</p>
                  <h3 className="mb-1">${stats.monthTotal.toFixed(2)}</h3>
                  <small className="text-danger">+8% from last month</small>
                </div>
                <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-graph-up"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Average Daily</p>
                  <h3 className="mb-1">${stats.avgDaily}</h3>
                  <small className="text-muted">Per transaction</small>
                </div>
                <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-cash"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Total Transactions</p>
                  <h3 className="mb-1">{stats.totalTransactions}</h3>
                </div>
                <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-file-text"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Category Breakdown</h5>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#999'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">
                  No expense data available
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Recent Transactions</h5>
              {recentExpenses.length > 0 ? (
                <div className="recent-transactions">
                  {recentExpenses.map((expense) => (
                    <div key={expense._id} className="transaction-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                      <div>
                        <h6 className="mb-1">{expense.description}</h6>
                        <small className="text-muted">{expense.category}</small>
                      </div>
                      <div className="text-end">
                        <div className="text-danger fw-bold">-${expense.amount.toFixed(2)}</div>
                        <small className="text-muted">
                          {format(new Date(expense.date), 'MMM dd')}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  No recent transactions
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;