// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://beaker.testmonitor.com/';

test.describe('Landing Page', () => {
  test('displays landing page with correct title', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Beaker/);
    await expect(page.locator('h1:has-text("Welcome to Beaker")')).toBeVisible();
  });

  test('navigates to login page when clicking Get Started', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('button:has-text("Get Started")');
    await expect(page.locator('h2')).toContainText('Sign In');
  });

  test('displays TestMonitor attribution link', async ({ page }) => {
    await page.goto(BASE_URL);
    const tmLink = page.locator('a[href="https://www.testmonitor.com"]');
    await expect(tmLink).toBeVisible();
    await expect(tmLink).toHaveText('TestMonitor');
  });
});

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('button:has-text("Get Started")');
  });

  test('has correct login page heading', async ({ page }) => {
    // This test will FAIL due to typo bug
    await expect(page.locator('h2')).toContainText('Sign In to Beaker');
  });

  test('displays email and password fields', async ({ page }) => {
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('logs in with valid credentials', async ({ page }) => {
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('#appPage h1')).toContainText('Beaker');
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('rejects password shorter than 4 characters', async ({ page }) => {
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'abc');
    await page.click('button[type="submit"]');
    await expect(page.locator('#loginError')).toBeVisible();
  });

  test('navigates to password reset page', async ({ page }) => {
    await page.click('a:has-text("Forgot your password?")');
    await expect(page.locator('#resetPage h2')).toContainText('Reset Password');
  });
});

test.describe('Password Reset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('button:has-text("Get Started")');
    await page.click('a:has-text("Forgot your password?")');
  });

  test('successfully sends password reset link', async ({ page }) => {
    // This test will FAIL due to bug - always shows error
    await page.fill('#resetEmail', 'test@example.com');
    await page.click('button:has-text("Send Reset Link")');
    await expect(page.locator('#resetError')).not.toBeVisible();
  });

  test('shows error message when reset fails', async ({ page }) => {
    // This test will PASS - the bug makes it always show error
    await page.fill('#resetEmail', 'test@example.com');
    await page.click('button:has-text("Send Reset Link")');
    await expect(page.locator('#resetError')).toBeVisible();
    await expect(page.locator('#resetError')).toContainText('Unable to process your request');
  });
});

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('button:has-text("Get Started")');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
  });

  test('displays empty task list initially', async ({ page }) => {
    await expect(page.locator('#taskList')).toContainText('No tasks yet');
  });

  test('adds a new task', async ({ page }) => {
    await page.fill('#taskInput', 'Write test cases');
    await page.click('#addTaskBtn');
    await expect(page.locator('.task-item')).toContainText('Write test cases');
  });

  test('shows correct task count', async ({ page }) => {
    // This test will FAIL due to off-by-one bug
    await page.fill('#taskInput', 'First task');
    await page.click('#addTaskBtn');
    await expect(page.locator('#taskCount')).toHaveText('1');
  });

  test('adds task with Enter key', async ({ page }) => {
    // This test will FAIL - Enter key doesn't work
    await page.fill('#taskInput', 'Test with Enter key');
    await page.press('#taskInput', 'Enter');
    await expect(page.locator('.task-item')).toContainText('Test with Enter key');
  });

  test('completes a task', async ({ page }) => {
    await page.fill('#taskInput', 'Task to complete');
    await page.click('#addTaskBtn');
    await page.locator('.task-item input[type="checkbox"]').check();
    await expect(page.locator('.task-item span').first()).toHaveClass(/line-through/);
  });

  test('deletes a task', async ({ page }) => {
    // This test will FAIL - delete doesn't actually remove from array
    await page.fill('#taskInput', 'Task to delete');
    await page.click('#addTaskBtn');
    await page.click('button:has-text("Delete")');
    await expect(page.locator('.task-item')).not.toBeVisible();
  });

  test('filters active tasks correctly', async ({ page }) => {
    // This test will FAIL - filter logic is reversed
    await page.fill('#taskInput', 'Active task');
    await page.click('#addTaskBtn');
    await page.fill('#taskInput', 'Completed task');
    await page.click('#addTaskBtn');

    // Complete the second task
    await page.locator('.task-item').nth(1).locator('input[type="checkbox"]').check();

    // Filter to show only active tasks
    await page.click('button[data-filter="active"]');
    await expect(page.locator('.task-item')).toHaveCount(1);
    await expect(page.locator('.task-item')).toContainText('Active task');
  });

  test('adds tasks with different priorities', async ({ page }) => {
    await page.fill('#taskInput', 'High priority task');
    await page.selectOption('#prioritySelect', 'high');
    await page.click('#addTaskBtn');

    await expect(page.locator('.task-item')).toContainText('high');
  });

  test('clears completed tasks', async ({ page }) => {
    // This test will FAIL - clear completed has wrong logic
    await page.fill('#taskInput', 'Task 1');
    await page.click('#addTaskBtn');
    await page.fill('#taskInput', 'Task 2');
    await page.click('#addTaskBtn');

    // Complete first task
    await page.locator('.task-item').first().locator('input[type="checkbox"]').check();

    await page.click('#clearCompleted');
    await expect(page.locator('.task-item')).toHaveCount(1);
    await expect(page.locator('.task-item')).toContainText('Task 2');
  });
});

test.describe('Logout Flow', () => {
  test('logs out and returns to landing page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('button:has-text("Get Started")');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    await page.click('button:has-text("Logout")');
    await expect(page.locator('#landingPage h1')).toContainText('Welcome to Beaker');
  });
});