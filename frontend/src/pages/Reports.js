import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { expenseAPI } from '../services/api';

const COLORS = {
  'Bills & Utilities': '#2563eb',
  'Shopping': '#8b5cf6',
  'Education': '#ec4899',
  'Food & Dining': '#f59e0b',
  'Entertainment': '#10b981',
  'Healthcare': '#06b6d4',
  'Transportation': '#6366f1'
};

const Reports = () => {
  const [stats, setStats] = useState({
    monthTotal: 0,
    avgDaily: 0,
    categoryBreakdown: []
  });
  const [dateRange, setDateRange] = useState({
    from: '2026-02-01',
    to: '2026-02-10'
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await expenseAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const pieChartData = stats.categoryBreakdown.map(item => ({
    name: item._id,
    value: item.total
  }));

  const totalAmount = stats.categoryBreakdown.reduce((sum, item) => sum + item.total, 0);

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div className="page-header">
          <h2>Reports</h2>
          <p className="text-muted">Analyze your spending patterns</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2">
          <i className="bi bi-download"></i>
          Export Report
        </Button>
      </div>

      {/* Date Filter */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-calendar3 fs-4 text-primary"></i>
            <Form.Label className="mb-0">From</Form.Label>
            <Form.Control
              type="date"
              style={{ maxWidth: '180px' }}
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
            <Form.Label className="mb-0">To</Form.Label>
            <Form.Control
              type="date"
              style={{ maxWidth: '180px' }}
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
            <Button variant="primary" className="ms-auto">Apply Filter</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={4}>
          <Card className="stat-card">
            <Card.Body>
              <p className="text-muted small mb-1">Total Spent</p>
              <h3 className="mb-1">${stats.monthTotal.toFixed(2)}</h3>
              <small className="text-danger">↑ 15% vs last period</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="stat-card">
            <Card.Body>
              <p className="text-muted small mb-1">Average Transaction</p>
              <h3 className="mb-1">${stats.avgDaily}</h3>
              <small className="text-muted">Per transaction</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="stat-card">
            <Card.Body>
              <p className="text-muted small mb-1">Top Category</p>
              <h3 className="mb-1">{stats.categoryBreakdown[0]?._id || 'N/A'}</h3>
              <small className="text-muted">
                ${stats.categoryBreakdown[0]?.total.toFixed(2) || '0.00'}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Distribution Chart */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-4">Category Distribution</h5>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
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
              No data available
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <Card.Body>
          <h5 className="mb-4">Category Breakdown</h5>
          {stats.categoryBreakdown.map((item) => {
            const percentage = totalAmount > 0 ? (item.total / totalAmount * 100).toFixed(1) : 0;
            return (
              <div key={item._id} className="d-flex align-items-center gap-3 mb-3">
                <div 
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: COLORS[item._id],
                    borderRadius: '2px',
                    flexShrink: 0
                  }}
                ></div>
                <div style={{ minWidth: '150px' }}>
                  <small>{item._id}</small>
                </div>
                <div className="flex-grow-1">
                  <div 
                    className="progress" 
                    style={{ height: '8px' }}
                  >
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: COLORS[item._id]
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ minWidth: '80px', textAlign: 'right' }}>
                  <strong>${item.total.toFixed(2)}</strong>
                </div>
                <div style={{ minWidth: '50px', textAlign: 'right' }}>
                  <small className="text-muted">{percentage}%</small>
                </div>
              </div>
            );
          })}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reports;