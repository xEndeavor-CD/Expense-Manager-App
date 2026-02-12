import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

const Settings = () => {
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    budget: true,
    weekly: false
  });

  const [appearance, setAppearance] = useState({
    theme: 'Light',
    currency: 'USD ($)'
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profile settings saved!');
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Container fluid className="py-4">
      <div className="page-header mb-4">
        <h2>Settings</h2>
        <p className="text-muted">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <h5 className="mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-person-circle text-primary"></i>
            Profile Settings
          </h5>
          <Form onSubmit={handleProfileSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit">Save Changes</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Notifications */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <h5 className="mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-bell text-primary"></i>
            Notifications
          </h5>

          <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
            <div>
              <h6 className="mb-1">Email Notifications</h6>
              <small className="text-muted">Receive expense summaries via email</small>
            </div>
            <Form.Check
              type="switch"
              checked={notifications.email}
              onChange={() => handleNotificationChange('email')}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
            <div>
              <h6 className="mb-1">Budget Alerts</h6>
              <small className="text-muted">Get notified when approaching budget limits</small>
            </div>
            <Form.Check
              type="switch"
              checked={notifications.budget}
              onChange={() => handleNotificationChange('budget')}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Weekly Reports</h6>
              <small className="text-muted">Receive weekly expense reports</small>
            </div>
            <Form.Check
              type="switch"
              checked={notifications.weekly}
              onChange={() => handleNotificationChange('weekly')}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Appearance */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <h5 className="mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-palette text-primary"></i>
            Appearance
          </h5>

          <Form.Group className="mb-3">
            <Form.Label>Theme</Form.Label>
            <Form.Select
              value={appearance.theme}
              onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Currency</Form.Label>
            <Form.Select
              value={appearance.currency}
              onChange={(e) => setAppearance({ ...appearance, currency: e.target.value })}
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Security */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <h5 className="mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock text-primary"></i>
            Security
          </h5>

          <div className="mb-3 pb-3 border-bottom">
            <h6>Change Password</h6>
          </div>

          <div>
            <h6>Enable Two-Factor Authentication</h6>
          </div>
        </Card.Body>
      </Card>

      {/* Data Management */}
      <Card>
        <Card.Body className="p-4">
          <h5 className="mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-database text-primary"></i>
            Data Management
          </h5>

          <div className="d-flex gap-2">
            <Button variant="primary">Export All Data</Button>
            <Button variant="danger">Delete All Expenses</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;