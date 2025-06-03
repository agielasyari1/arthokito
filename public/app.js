// Modern Budget Manager App - Complete Redesign with Advanced Analytics & Smooth Navigation

// ===== DATA MANAGEMENT =====
class BudgetManager {
  constructor() {
    this.data = {
      accounts: [],
      transactions: [],
      categories: [
        { id: 1, name: "Makanan & Minuman", icon: "🍽️", color: "#FF6B6B", budget: 0 },
        { id: 2, name: "Transportasi", icon: "🚗", color: "#4ECDC4", budget: 0 },
        { id: 3, name: "Belanja", icon: "🛍️", color: "#45B7D1", budget: 0 },
        { id: 4, name: "Hiburan", icon: "🎬", color: "#96CEB4", budget: 0 },
        { id: 5, name: "Tagihan", icon: "📄", color: "#FFEAA7", budget: 0 },
        { id: 6, name: "Kesehatan", icon: "⚕️", color: "#DDA0DD", budget: 0 },
        { id: 7, name: "Pendidikan", icon: "📚", color: "#74B9FF", budget: 0 },
        { id: 8, name: "Gaji", icon: "💰", color: "#00B894", budget: 0 },
        { id: 9, name: "Investasi", icon: "📈", color: "#6C5CE7", budget: 0 },
        { id: 10, name: "Rayyis", icon: "👶", color: "#fea29b", budget: 0 },
        { id: 11, name: "Lainnya", icon: "📝", color: "#A29BFE", budget: 0 },
      ],
      accountTypes: [
        { id: 1, name: "Cash", icon: "💵", color: "#00B894" },
        { id: 2, name: "Bank", icon: "🏦", color: "#0984E3" },
        { id: 3, name: "E-Wallet", icon: "📱", color: "#6C5CE7" },
        { id: 4, name: "Investasi", icon: "📈", color: "#E17055" },
      ],
      goals: [],
      budgets: [],
      settings: {
        currency: "IDR",
        monthlyBudget: 0,
        notifications: true,
        theme: "light",
        animationsEnabled: true,
      },
    };

    this.currentUser = null;
    this.authStateChanged = false;

    // Initialize auth state listener
    this.initAuthStateListener();

    // Test Firebase connection
    this.testFirebaseConnection();
  }

  // Initialize auth state listener
  initAuthStateListener() {
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user;
      this.authStateChanged = true;

      if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);
        this.loadData();
      } else {
        // User is signed out
        console.log("User is signed out");
        this.data = this.getInitialData();
      }

      // Trigger UI update if app is initialized
      if (window.app) {
        window.app.render();
        window.app.updateUserBalance();
      }
    });
  }

  // Get initial data structure
  getInitialData() {
    return {
      accounts: [],
      transactions: [],
      categories: [
        { id: 1, name: "Makanan & Minuman", icon: "🍽️", color: "#FF6B6B", budget: 0 },
        { id: 2, name: "Transportasi", icon: "🚗", color: "#4ECDC4", budget: 0 },
        { id: 3, name: "Belanja", icon: "🛍️", color: "#45B7D1", budget: 0 },
        { id: 4, name: "Hiburan", icon: "🎬", color: "#96CEB4", budget: 0 },
        { id: 5, name: "Tagihan", icon: "📄", color: "#FFEAA7", budget: 0 },
        { id: 6, name: "Kesehatan", icon: "⚕️", color: "#DDA0DD", budget: 0 },
        { id: 7, name: "Pendidikan", icon: "📚", color: "#74B9FF", budget: 0 },
        { id: 8, name: "Gaji", icon: "💰", color: "#00B894", budget: 0 },
        { id: 9, name: "Investasi", icon: "📈", color: "#6C5CE7", budget: 0 },
        { id: 10, name: "Rayyis", icon: "👶", color: "#fea29b", budget: 0 },
        { id: 11, name: "Lainnya", icon: "📝", color: "#A29BFE", budget: 0 },
      ],
      accountTypes: [
        { id: 1, name: "Cash", icon: "💵", color: "#00B894" },
        { id: 2, name: "Bank", icon: "🏦", color: "#0984E3" },
        { id: 3, name: "E-Wallet", icon: "📱", color: "#6C5CE7" },
        { id: 4, name: "Investasi", icon: "📈", color: "#E17055" },
      ],
      goals: [],
      budgets: [],
      settings: {
        currency: "IDR",
        monthlyBudget: 0,
        notifications: true,
        theme: "light",
        animationsEnabled: true,
      },
    };
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      console.log("Starting Google sign-in process...");
      const provider = new firebase.auth.GoogleAuthProvider();
      console.log("Google provider created");

      // Add scopes if needed
      provider.addScope("profile");
      provider.addScope("email");

      console.log("Attempting to sign in with popup...");
      const result = await firebase.auth().signInWithPopup(provider);
      console.log("Sign in successful:", result.user);
      return result.user;
    } catch (error) {
      console.error("Detailed error signing in with Google:", {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential,
        fullError: error,
      });
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  // Test Firebase connection
  testFirebaseConnection() {
    database.ref(".info/connected").on("value", (snap) => {
      if (snap.val() === true) {
        console.log("Connected to Firebase!");
        // Show success toast
        if (window.app) {
          window.app.showToast("Terhubung ke database!", "success");
        }
      } else {
        console.log("Not connected to Firebase");
        // Show error toast
        if (window.app) {
          window.app.showToast("Tidak dapat terhubung ke database", "error");
        }
      }
    });
  }

  loadData() {
    if (!this.currentUser) return;

    try {
      // Get data from Firebase using user ID
      database
        .ref(`users/${this.currentUser.uid}/budgetData`)
        .once("value")
        .then((snapshot) => {
          const savedData = snapshot.val();
          if (savedData) {
            this.data = { ...this.data, ...savedData };
            // Trigger UI update
            if (window.app) {
              window.app.render();
              window.app.updateUserBalance();
            }
          }
        })
        .catch((error) => {
          console.error("Error loading data from Firebase:", error);
        });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  saveData() {
    if (!this.currentUser) return;

    try {
      // Save data to Firebase using user ID
      database
        .ref(`users/${this.currentUser.uid}/budgetData`)
        .set(this.data)
        .then(() => {
          console.log("Data saved successfully to Firebase");
        })
        .catch((error) => {
          console.error("Error saving data to Firebase:", error);
        });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  // Account Methods
  addAccount(name, balance, typeId) {
    const account = {
      id: Date.now(),
      name: name.trim(),
      balance: parseFloat(balance),
      typeId: parseInt(typeId),
      createdAt: new Date().toISOString(),
    };
    this.data.accounts.push(account);
    this.saveData();
    return account;
  }

  updateAccount(id, data) {
    const index = this.data.accounts.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      this.data.accounts[index] = { ...this.data.accounts[index], ...data };
      this.saveData();
      return this.data.accounts[index];
    }
    throw new Error("Account not found");
  }

  deleteAccount(id) {
    const index = this.data.accounts.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      this.data.accounts.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // Transaction Methods
  addTransaction(type, amount, categoryId, accountId, description = "", date = null) {
    const transaction = {
      id: Date.now(),
      type, // 'income' or 'expense'
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      accountId: parseInt(accountId),
      description: description.trim(),
      date: date || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    // Update account balance
    const account = this.data.accounts.find((acc) => acc.id === transaction.accountId);
    if (account) {
      account.balance += type === "income" ? transaction.amount : -transaction.amount;
    }

    this.data.transactions.push(transaction);
    this.saveData();
    return transaction;
  }

  updateTransaction(id, data) {
    const index = this.data.transactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      const oldTransaction = this.data.transactions[index];

      // Revert old transaction from account
      const account = this.data.accounts.find((acc) => acc.id === oldTransaction.accountId);
      if (account) {
        account.balance -= oldTransaction.type === "income" ? oldTransaction.amount : -oldTransaction.amount;
      }

      // Update transaction
      this.data.transactions[index] = { ...oldTransaction, ...data };
      const newTransaction = this.data.transactions[index];

      // Apply new transaction to account
      const newAccount = this.data.accounts.find((acc) => acc.id === newTransaction.accountId);
      if (newAccount) {
        newAccount.balance += newTransaction.type === "income" ? newTransaction.amount : -newTransaction.amount;
      }

      this.saveData();
      return this.data.transactions[index];
    }
    throw new Error("Transaction not found");
  }

  deleteTransaction(id) {
    const index = this.data.transactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      const transaction = this.data.transactions[index];

      // Revert transaction from account
      const account = this.data.accounts.find((acc) => acc.id === transaction.accountId);
      if (account) {
        account.balance -= transaction.type === "income" ? transaction.amount : -transaction.amount;
      }

      this.data.transactions.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // Goal Methods
  addGoal(name, target, currentAmount = 0, deadline = null) {
    const goal = {
      id: Date.now(),
      name: name.trim(),
      target: parseFloat(target),
      currentAmount: parseFloat(currentAmount),
      deadline: deadline,
      createdAt: new Date().toISOString(),
    };
    this.data.goals.push(goal);
    this.saveData();
    return goal;
  }

  updateGoalProgress(id, amount) {
    const index = this.data.goals.findIndex((goal) => goal.id === id);
    if (index !== -1) {
      this.data.goals[index].currentAmount = Math.min(parseFloat(amount), this.data.goals[index].target);
      this.saveData();
      return this.data.goals[index];
    }
    throw new Error("Goal not found");
  }

  deleteGoal(id) {
    const index = this.data.goals.findIndex((goal) => goal.id === id);
    if (index !== -1) {
      this.data.goals.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // Analytics Methods
  getMonthlyStats(month = null) {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const transactions = this.data.transactions.filter((t) => t.date.startsWith(targetMonth));

    const stats = {
      income: 0,
      expense: 0,
      balance: 0,
      transactions: transactions,
      transactionCount: transactions.length,
    };

    transactions.forEach((t) => {
      if (t.type === "income") {
        stats.income += t.amount;
      } else {
        stats.expense += t.amount;
      }
    });

    stats.balance = stats.income - stats.expense;
    return stats;
  }

  getTotalBalance() {
    return this.data.accounts.reduce((total, account) => total + account.balance, 0);
  }

  getCategoryById(id) {
    return this.data.categories.find((cat) => cat.id === id);
  }

  getAccountById(id) {
    return this.data.accounts.find((acc) => acc.id === id);
  }

  getCategoryExpenses(month = null) {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const expenses = this.data.transactions.filter((t) => t.type === "expense" && t.date.startsWith(targetMonth));

    const categoryTotals = {};
    expenses.forEach((t) => {
      const category = this.getCategoryById(t.categoryId);
      if (category) {
        categoryTotals[category.name] = (categoryTotals[category.name] || 0) + t.amount;
      }
    });

    return categoryTotals;
  }

  // Advanced Analytics Methods
  getWeeklyTrend(weeks = 8) {
    const weeklyData = [];
    const now = new Date();

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7 - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekTransactions = this.data.transactions.filter((t) => {
        const transDate = new Date(t.date);
        return transDate >= weekStart && transDate <= weekEnd;
      });

      const weekStats = {
        week: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        income: weekTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
        expense: weekTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
        transactions: weekTransactions.length,
      };

      weeklyData.push(weekStats);
    }

    return weeklyData;
  }

  getCategoryBudgetAnalysis() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const categoryExpenses = this.getCategoryExpenses(currentMonth);

    return this.data.categories
      .map((category) => {
        const spent = categoryExpenses[category.name] || 0;
        const budget = category.budget || 0;
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;

        return {
          ...category,
          spent,
          budget,
          percentage,
          remaining: Math.max(0, budget - spent),
          status: percentage > 100 ? "over" : percentage > 80 ? "warning" : "good",
        };
      })
      .filter((cat) => cat.budget > 0 || cat.spent > 0);
  }

  getExpensePatterns() {
    const last30Days = this.data.transactions.filter((t) => {
      const transDate = new Date(t.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return transDate >= thirtyDaysAgo && t.type === "expense";
    });

    // Group by day of week
    const dayOfWeekSpending = {};
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    last30Days.forEach((t) => {
      const dayOfWeek = new Date(t.date).getDay();
      const dayName = dayNames[dayOfWeek];
      dayOfWeekSpending[dayName] = (dayOfWeekSpending[dayName] || 0) + t.amount;
    });

    // Group by hour (if we had time data)
    const hourlySpending = {};
    for (let i = 0; i < 24; i++) {
      hourlySpending[i] = Math.random() * 50000; // Placeholder data
    }

    return {
      dayOfWeek: dayOfWeekSpending,
      hourly: hourlySpending,
      mostExpensiveDay: Object.entries(dayOfWeekSpending).sort((a, b) => b[1] - a[1])[0],
      averageDailySpending: Object.values(dayOfWeekSpending).reduce((a, b) => a + b, 0) / 7,
    };
  }

  getPredictiveAnalysis() {
    const last3Months = [];
    const now = new Date();

    // Get last 3 months data
    for (let i = 2; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = month.toISOString().slice(0, 7);
      last3Months.push(this.getMonthlyStats(monthStr));
    }

    // Calculate averages with fallback values
    const avgIncome = last3Months.reduce((sum, month) => sum + month.income, 0) / 3;
    const avgExpense = last3Months.reduce((sum, month) => sum + month.expense, 0) / 3;

    // Trend analysis with better error handling
    let incomeGrowth = 0;
    let expenseGrowth = 0;

    if (last3Months.length >= 2) {
      const firstMonth = last3Months[0];
      const lastMonth = last3Months[2];

      // Calculate growth rates with safeguards
      if (firstMonth.income > 0) {
        incomeGrowth = ((lastMonth.income - firstMonth.income) / firstMonth.income) * 100;
      } else if (lastMonth.income > 0) {
        incomeGrowth = 100; // If starting from 0, consider it 100% growth
      }

      if (firstMonth.expense > 0) {
        expenseGrowth = ((lastMonth.expense - firstMonth.expense) / firstMonth.expense) * 100;
      } else if (lastMonth.expense > 0) {
        expenseGrowth = 100; // If starting from 0, consider it 100% growth
      }
    }

    // Ensure growth rates are finite numbers
    incomeGrowth = isFinite(incomeGrowth) ? incomeGrowth : 0;
    expenseGrowth = isFinite(expenseGrowth) ? expenseGrowth : 0;

    // Next month prediction with conservative approach
    let predictedIncome = avgIncome;
    let predictedExpense = avgExpense;

    // Apply growth only if we have meaningful data
    if (avgIncome > 0) {
      const growthFactor = Math.max(-50, Math.min(50, incomeGrowth)) / 100; // Limit growth to ±50%
      predictedIncome = avgIncome * (1 + growthFactor);
    }

    if (avgExpense > 0) {
      const growthFactor = Math.max(-50, Math.min(50, expenseGrowth)) / 100; // Limit growth to ±50%
      predictedExpense = avgExpense * (1 + growthFactor);
    }

    // If no historical data, use current month data as baseline
    if (avgIncome === 0 && avgExpense === 0) {
      const currentMonth = this.getMonthlyStats();
      predictedIncome = currentMonth.income || 1000000; // Default predicted income 1M
      predictedExpense = currentMonth.expense || 800000; // Default predicted expense 800K
      incomeGrowth = 0;
      expenseGrowth = 0;
    }

    const predictedBalance = predictedIncome - predictedExpense;

    return {
      avgIncome,
      avgExpense,
      incomeGrowth,
      expenseGrowth,
      predictedIncome,
      predictedExpense,
      predictedBalance,
      recommendation: this.generateRecommendations(last3Months.length > 0 ? last3Months : [this.getMonthlyStats()]),
    };
  }

  generateRecommendations(monthlyData) {
    const recommendations = [];
    const latest = monthlyData[monthlyData.length - 1];

    if (latest.expense > latest.income) {
      recommendations.push({
        type: "warning",
        icon: "⚠️",
        title: "Pengeluaran Melebihi Pemasukan",
        description: "Kurangi pengeluaran atau tingkatkan pemasukan",
      });
    }

    const savingsRate = latest.income > 0 ? ((latest.income - latest.expense) / latest.income) * 100 : 0;
    if (savingsRate < 20) {
      recommendations.push({
        type: "suggestion",
        icon: "💡",
        title: "Tingkatkan Tabungan",
        description: `Target ideal: 20% dari pemasukan (${this.formatCurrency(latest.income * 0.2)})`,
      });
    }

    const categoryExpenses = this.getCategoryExpenses();
    const topCategory = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] / latest.expense > 0.4) {
      recommendations.push({
        type: "info",
        icon: "📊",
        title: "Kategori Dominan",
        description: `${topCategory[0]} menghabiskan ${((topCategory[1] / latest.expense) * 100).toFixed(1)}% budget`,
      });
    }

    return recommendations;
  }

  // Utility method for formatting currency
  formatCurrency(amount) {
    const rounded = Math.round(amount);
    return `Rp ${rounded.toLocaleString("id-ID")}`;
  }

  // Demo data method for testing
  generateDemoData() {
    // Clear existing data
    this.data.accounts = [];
    this.data.transactions = [];
    this.data.goals = [];

    // Add demo accounts
    this.addAccount("BCA Utama", 5000000, 2); // Bank
    this.addAccount("Dompet Kas", 500000, 1); // Cash
    this.addAccount("OVO", 750000, 3); // E-Wallet

    // Add demo transactions for last 3 months
    const now = new Date();
    const demoTransactions = [
      // This month
      ["income", 8000000, 8, 1, "Gaji Bulanan", 0, 5],
      ["expense", 1200000, 1, 2, "Belanja Bulanan", 0, 2],
      ["expense", 800000, 5, 2, "Listrik & Air", 0, 3],
      ["expense", 300000, 2, 3, "Bensin Motor", 0, 5],
      ["expense", 150000, 4, 3, "Nonton Bioskop", 0, 7],

      // Last month
      ["income", 8000000, 8, 1, "Gaji Bulanan", 1, 5],
      ["expense", 1100000, 1, 2, "Belanja Bulanan", 1, 8],
      ["expense", 750000, 5, 2, "Listrik & Air", 1, 12],
      ["expense", 280000, 2, 3, "Bensin Motor", 1, 15],
      ["expense", 200000, 4, 3, "Makan Restoran", 1, 18],
      ["expense", 500000, 3, 1, "Beli Baju", 1, 20],

      // 2 months ago
      ["income", 7500000, 8, 1, "Gaji Bulanan", 2, 5],
      ["expense", 1000000, 1, 2, "Belanja Bulanan", 2, 8],
      ["expense", 700000, 5, 2, "Listrik & Air", 2, 12],
      ["expense", 250000, 2, 3, "Bensin Motor", 2, 15],
      ["expense", 100000, 4, 3, "Kafe dengan Teman", 2, 22],
    ];

    demoTransactions.forEach(([type, amount, categoryId, accountId, description, monthsAgo, day]) => {
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
      this.addTransaction(type, amount, categoryId, accountId, description, date.toISOString().split("T")[0]);
    });

    // Add demo goals
    this.addGoal("Liburan ke Bali", 15000000, 3500000, "2025-12-31");
    this.addGoal("Emergency Fund", 20000000, 8500000, null);
    this.addGoal("Beli Laptop Baru", 12000000, 6000000, "2025-08-15");

    // Set demo budgets
    this.data.categories.forEach((category) => {
      switch (category.name) {
        case "Makanan & Minuman":
          category.budget = 1500000;
          break;
        case "Transportasi":
          category.budget = 500000;
          break;
        case "Belanja":
          category.budget = 800000;
          break;
        case "Hiburan":
          category.budget = 300000;
          break;
        case "Tagihan":
          category.budget = 1000000;
          break;
        case "Kesehatan":
          category.budget = 400000;
          break;
      }
    });

    this.saveData();
    return true;
  }

  // Reset all data to initial state
  resetAllData() {
    // Reset to initial data structure
    this.data = {
      accounts: [],
      transactions: [],
      categories: [
        { id: 1, name: "Makanan & Minuman", icon: "🍽️", color: "#FF6B6B", budget: 0 },
        { id: 2, name: "Transportasi", icon: "🚗", color: "#4ECDC4", budget: 0 },
        { id: 3, name: "Belanja", icon: "🛍️", color: "#45B7D1", budget: 0 },
        { id: 4, name: "Hiburan", icon: "🎬", color: "#96CEB4", budget: 0 },
        { id: 5, name: "Tagihan", icon: "📄", color: "#FFEAA7", budget: 0 },
        { id: 6, name: "Kesehatan", icon: "⚕️", color: "#DDA0DD", budget: 0 },
        { id: 7, name: "Pendidikan", icon: "📚", color: "#74B9FF", budget: 0 },
        { id: 8, name: "Gaji", icon: "💰", color: "#00B894", budget: 0 },
        { id: 9, name: "Investasi", icon: "📈", color: "#6C5CE7", budget: 0 },
        { id: 10, name: "Rayyis", icon: "👶", color: "#fea29b", budget: 0 },
        { id: 11, name: "Lainnya", icon: "📝", color: "#A29BFE", budget: 0 },
      ],
      accountTypes: [
        { id: 1, name: "Cash", icon: "💵", color: "#00B894" },
        { id: 2, name: "Bank", icon: "🏦", color: "#0984E3" },
        { id: 3, name: "E-Wallet", icon: "📱", color: "#6C5CE7" },
        { id: 4, name: "Investasi", icon: "📈", color: "#E17055" },
      ],
      goals: [],
      budgets: [],
      settings: {
        currency: "IDR",
        monthlyBudget: 0,
        notifications: true,
        theme: "light",
        animationsEnabled: true,
      },
    };

    // Clear localStorage and save reset data
    localStorage.removeItem("modernBudgetData");
    this.saveData();
    return true;
  }
}

// ===== MODERN UI MANAGEMENT WITH SMOOTH NAVIGATION =====
class ModernBudgetUI {
  constructor() {
    this.budgetManager = new BudgetManager();
    this.currentView = "dashboard";
    this.isTransitioning = false;
    this.analyticsMode = "overview"; // overview, patterns, predictions, budget
    this.init();
  }

  init() {
    this.createLayout();
    this.bindEvents();
    this.initializeTheme();
    this.render();
    this.preloadData();
  }

  createLayout() {
    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="app-container">
                <!-- Enhanced Mobile Header -->
                <header class="mobile-header">
                    <button class="mobile-menu-toggle" id="mobileMenuToggle">
                        <div class="hamburger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                    <div class="mobile-logo">
                        <div class="logo-icon">💰</div>
                        <div class="logo-text">BudgetPro</div>
                    </div>
                    <div class="mobile-actions">
                        <button class="theme-toggle" id="themeToggle">🌙</button>
                        <button class="mobile-add-btn" id="mobileAddBtn">
                            <span class="add-icon">+</span>
                        </button>
                    </div>
                </header>

                <!-- Enhanced Sidebar with Smooth Navigation -->
                <aside class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <div class="logo">
                            <div class="logo-icon">💰</div>
                            <div class="logo-content">
                                <div class="logo-text">Keuangan Kita</div>
                                <div class="logo-subtitle">Masa Depan Lebih Baik</div>
                            </div>
                        </div>
                    </div>
                    
                    <nav class="sidebar-nav">
                        <div class="nav-section">
                            <div class="nav-section-title">Menu Utama</div>
                            <a href="#" class="nav-item active" data-view="dashboard">
                                <div class="nav-icon">📊</div>
                                <div class="nav-content">
                                    <div class="nav-text">Dashboard</div>
                                    <div class="nav-desc">Ringkasan keuangan</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                            <a href="#" class="nav-item" data-view="transactions">
                                <div class="nav-icon">💳</div>
                                <div class="nav-content">
                                    <div class="nav-text">Transaksi</div>
                                    <div class="nav-desc">Kelola pemasukan & pengeluaran</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                            <a href="#" class="nav-item" data-view="accounts">
                                <div class="nav-icon">🏦</div>
                                <div class="nav-content">
                                    <div class="nav-text">Akun</div>
                                    <div class="nav-desc">Dompet & rekening</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                            <a href="#" class="nav-item" data-view="goals">
                                <div class="nav-icon">🎯</div>
                                <div class="nav-content">
                                    <div class="nav-text">Target</div>
                                    <div class="nav-desc">Sasaran keuangan</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                        </div>
                        
                        <div class="nav-section">
                            <div class="nav-section-title">Analytics</div>
                            <a href="#" class="nav-item" data-view="analytics">
                                <div class="nav-icon">📈</div>
                                <div class="nav-content">
                                    <div class="nav-text">Analisis</div>
                                    <div class="nav-desc">Laporan & prediksi</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                        </div>
                    </nav>

                    <div class="sidebar-footer">
                        <div class="user-profile">
                            <div class="user-avatar">👤</div>
                            <div class="user-info">
                                <div class="user-name">Pengguna</div>
                                <div class="user-balance">${this.budgetManager.formatCurrency(
                                  this.budgetManager.getTotalBalance()
                                )}</div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Enhanced Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay"></div>

                <!-- Main Content with Smooth Transitions -->
                <main class="main-content">
                    <header class="main-header">
                        <div class="header-left">
                            <h1 class="page-title">Dashboard</h1>
                            <div class="page-breadcrumb">
                                <span class="breadcrumb-item active">Dashboard</span>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="header-stats">
                                <div class="quick-stat">
                                    <div class="quick-stat-value">${this.budgetManager.formatCurrency(
                                      this.budgetManager.getTotalBalance()
                                    )}</div>
                                    <div class="quick-stat-label">Total Saldo</div>
                                </div>
                            </div>
                            <button class="btn btn-primary desktop-only" id="addTransactionBtn">
                                <span class="btn-icon">+</span>
                                <span class="btn-text">Tambah Transaksi</span>
                            </button>
                            <button class="theme-toggle desktop-only" id="desktopThemeToggle">🌙</button>
                        </div>
                    </header>

                    <!-- Content Area with Page Transitions -->
                    <div class="content-wrapper">
                        <div class="content-area" id="contentArea">
                            <!-- Content will be injected here -->
                        </div>
                    </div>
                </main>

                <!-- Enhanced Bottom Navigation for Mobile -->
                <nav class="bottom-nav">
                    <a href="#" class="bottom-nav-item active" data-view="dashboard">
                        <div class="bottom-nav-icon">📊</div>
                        <div class="bottom-nav-text">Dashboard</div>
                    </a>
                    <a href="#" class="bottom-nav-item" data-view="transactions">
                        <div class="bottom-nav-icon">💳</div>
                        <div class="bottom-nav-text">Transaksi</div>
                    </a>
                    <a href="#" class="bottom-nav-item" data-view="accounts">
                        <div class="bottom-nav-icon">🏦</div>
                        <div class="bottom-nav-text">Akun</div>
                    </a>
                    <a href="#" class="bottom-nav-item" data-view="goals">
                        <div class="bottom-nav-icon">🎯</div>
                        <div class="bottom-nav-text">Target</div>
                    </a>
                    <a href="#" class="bottom-nav-item" data-view="analytics">
                        <div class="bottom-nav-icon">📈</div>
                        <div class="bottom-nav-text">Analisis</div>
                    </a>
                </nav>

                <!-- Loading Overlay -->
                <div class="loading-overlay" id="loadingOverlay">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <div class="loading-text">Memuat...</div>
                    </div>
                </div>

                <!-- Modal Container -->
                <div class="modal-container" id="modalContainer">
                    <!-- Modals will be injected here -->
                </div>

                <!-- Toast Container -->
                <div class="toast-container" id="toastContainer">
                    <!-- Toast notifications will appear here -->
                </div>
            </div>
        `;
  }

  bindEvents() {
    // Enhanced Navigation with Smooth Transitions
    document.addEventListener("click", (e) => {
      const navItem = e.target.closest(".nav-item, .bottom-nav-item");
      if (navItem && !this.isTransitioning) {
        e.preventDefault();
        const view = navItem.dataset.view;
        if (view && view !== this.currentView) {
          this.smoothSwitchView(view);
        }
      }

      // Analytics sub-navigation
      const analyticsTab = e.target.closest(".analytics-tab");
      if (analyticsTab) {
        e.preventDefault();
        this.switchAnalyticsMode(analyticsTab.dataset.mode);
      }

      // Modal handlers
      if (e.target.closest(".modal-close, .modal-backdrop")) {
        this.hideModal();
      }

      // Action buttons
      if (e.target.closest("#addTransactionBtn, #mobileAddBtn")) {
        this.showQuickAddModal();
      }

      if (e.target.closest("#themeToggle, #desktopThemeToggle")) {
        this.toggleTheme();
      }
    });

    // Mobile menu toggle
    document.getElementById("mobileMenuToggle").addEventListener("click", () => {
      this.toggleMobileSidebar();
    });

    // Sidebar overlay
    document.getElementById("sidebarOverlay").addEventListener("click", () => {
      this.closeMobileSidebar();
    });

    // Enhanced Swipe Gestures
    this.initSwipeGestures();

    // Keyboard Shortcuts
    this.initKeyboardShortcuts();

    // Window resize handler
    window.addEventListener("resize", () => {
      this.handleResize();
    });
  }

  initSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let isHorizontalSwipe = false;

    document.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isHorizontalSwipe = false;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!startX || !startY) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);

        if (diffX > diffY && diffX > 30) {
          isHorizontalSwipe = true;
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      (e) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (isHorizontalSwipe) {
          // Swipe right from left edge to open sidebar
          if (diffX > 100 && startX < 50 && window.innerWidth <= 768) {
            this.openMobileSidebar();
          }
          // Swipe left to close sidebar
          else if (diffX < -100) {
            this.closeMobileSidebar();
          }
          // Swipe navigation between views
          else if (Math.abs(diffX) > 120) {
            this.handleSwipeNavigation(diffX > 0 ? "right" : "left");
          }
        }

        startX = 0;
        startY = 0;
        isHorizontalSwipe = false;
      },
      { passive: true }
    );
  }

  initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            this.smoothSwitchView("dashboard");
            break;
          case "2":
            e.preventDefault();
            this.smoothSwitchView("transactions");
            break;
          case "3":
            e.preventDefault();
            this.smoothSwitchView("accounts");
            break;
          case "4":
            e.preventDefault();
            this.smoothSwitchView("goals");
            break;
          case "5":
            e.preventDefault();
            this.smoothSwitchView("analytics");
            break;
          case "n":
            e.preventDefault();
            this.showQuickAddModal();
            break;
        }
      }

      if (e.key === "Escape") {
        this.hideModal();
      }
    });
  }

  handleSwipeNavigation(direction) {
    const views = ["dashboard", "transactions", "accounts", "goals", "analytics"];
    const currentIndex = views.indexOf(this.currentView);

    if (direction === "left" && currentIndex < views.length - 1) {
      this.smoothSwitchView(views[currentIndex + 1]);
    } else if (direction === "right" && currentIndex > 0) {
      this.smoothSwitchView(views[currentIndex - 1]);
    }
  }

  smoothSwitchView(view) {
    if (this.isTransitioning || view === this.currentView) return;

    this.isTransitioning = true;
    this.showLoadingOverlay();

    // Update navigation states with animation
    this.updateNavigationStates(view);

    // Animate out current content
    const contentArea = document.getElementById("contentArea");
    contentArea.style.opacity = "0";
    contentArea.style.transform = "translateY(20px)";

    setTimeout(() => {
      this.currentView = view;
      this.updatePageHeader(view);
      this.render();

      // Animate in new content
      setTimeout(() => {
        contentArea.style.opacity = "1";
        contentArea.style.transform = "translateY(0)";
        this.hideLoadingOverlay();
        this.isTransitioning = false;
      }, 150);
    }, 200);
  }

  updateNavigationStates(view) {
    // Update sidebar navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.view === view) {
        item.classList.add("active");
      }
    });

    // Update bottom navigation
    document.querySelectorAll(".bottom-nav-item").forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.view === view) {
        item.classList.add("active");
      }
    });

    // Close mobile sidebar if open
    this.closeMobileSidebar();
  }

  updatePageHeader(view) {
    const titles = {
      dashboard: "Dashboard",
      transactions: "Transaksi",
      accounts: "Akun",
      goals: "Target",
      analytics: "Analisis",
    };

    const breadcrumbs = {
      dashboard: ["Dashboard"],
      transactions: ["Transaksi", "Kelola Transaksi"],
      accounts: ["Akun", "Kelola Akun"],
      goals: ["Target", "Sasaran Keuangan"],
      analytics: ["Analisis", "Laporan & Prediksi"],
    };

    document.querySelector(".page-title").textContent = titles[view];

    const breadcrumbContainer = document.querySelector(".page-breadcrumb");
    breadcrumbContainer.innerHTML = breadcrumbs[view]
      .map((item, index) => {
        const isLast = index === breadcrumbs[view].length - 1;
        return `<span class="breadcrumb-item ${isLast ? "active" : ""}">${item}</span>`;
      })
      .join('<span class="breadcrumb-separator">›</span>');
  }

  // Theme Management
  initializeTheme() {
    const savedTheme = localStorage.getItem("budgetTheme") || "light";
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("budgetTheme", theme);

    // Update theme toggle icons
    const themeIcons = document.querySelectorAll("#themeToggle, #desktopThemeToggle");
    themeIcons.forEach((icon) => {
      icon.textContent = theme === "dark" ? "☀️" : "🌙";
    });
  }

  // Mobile Navigation
  toggleMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (sidebar.classList.contains("open")) {
      this.closeMobileSidebar();
    } else {
      this.openMobileSidebar();
    }
  }

  openMobileSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebarOverlay").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeMobileSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("active");
    document.body.style.overflow = "";
  }

  // Loading Management
  showLoadingOverlay() {
    document.getElementById("loadingOverlay").classList.add("active");
  }

  hideLoadingOverlay() {
    document.getElementById("loadingOverlay").classList.remove("active");
  }

  // Data Preloading
  preloadData() {
    // Preload frequently used data
    this.cachedStats = this.budgetManager.getMonthlyStats();
    this.cachedWeeklyTrend = this.budgetManager.getWeeklyTrend();
    this.cachedPredictions = this.budgetManager.getPredictiveAnalysis();
  }

  // Render Methods
  render() {
    const contentArea = document.getElementById("contentArea");

    switch (this.currentView) {
      case "dashboard":
        contentArea.innerHTML = this.renderDashboard();
        this.animateStatistics();
        break;
      case "transactions":
        contentArea.innerHTML = this.renderTransactions();
        this.bindTransactionEvents();
        break;
      case "accounts":
        contentArea.innerHTML = this.renderAccounts();
        this.bindAccountEvents();
        break;
      case "goals":
        contentArea.innerHTML = this.renderGoals();
        this.bindGoalEvents();
        break;
      case "analytics":
        contentArea.innerHTML = this.renderAdvancedAnalytics();
        this.initializeAnalyticsCharts();
        break;
    }

    // Update user balance in sidebar
    this.updateUserBalance();
  }

  renderDashboard() {
    const stats = this.budgetManager.getMonthlyStats();
    const totalBalance = this.budgetManager.getTotalBalance();
    const recentTransactions = this.budgetManager.data.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return `
            <div class="dashboard-container">
                <!-- Enhanced Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(totalBalance)}</div>
                            <div class="stat-label">Total Saldo</div>
                            <div class="stat-trend ${totalBalance >= 0 ? "positive" : "negative"}">
                                ${totalBalance >= 0 ? "📈" : "📉"} ${totalBalance >= 0 ? "Stabil" : "Perlu Perhatian"}
                    </div>
                </div>
                    </div>
                    
                    <div class="stat-card success">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(stats.income)}</div>
                            <div class="stat-label">Pemasukan Bulan Ini</div>
                            <div class="stat-trend positive">+${stats.transactionCount} transaksi</div>
                    </div>
                </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-icon">💸</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(stats.expense)}</div>
                            <div class="stat-label">Pengeluaran Bulan Ini</div>
                            <div class="stat-trend">Rata-rata ${this.budgetManager.formatCurrency(
                              stats.expense / new Date().getDate()
                            )}/hari</div>
                    </div>
                </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">💾</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(stats.balance)}</div>
                            <div class="stat-label">Selisih Bulan Ini</div>
                            <div class="stat-trend ${stats.balance >= 0 ? "positive" : "negative"}">
                                ${stats.balance >= 0 ? "Surplus" : "Defisit"}
                    </div>
                        </div>
                </div>
            </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <h3 class="section-title">Aksi Cepat</h3>
                    <div class="action-grid">
                        <button class="action-btn" onclick="app.showQuickAddModal('income')">
                            <div class="action-icon">💰</div>
                            <div class="action-text">Tambah Pemasukan</div>
                        </button>
                        <button class="action-btn" onclick="app.showQuickAddModal('expense')">
                            <div class="action-icon">💸</div>
                            <div class="action-text">Tambah Pengeluaran</div>
                        </button>
                        <button class="action-btn" onclick="app.showAddAccountModal()">
                            <div class="action-icon">🏦</div>
                            <div class="action-text">Tambah Akun</div>
                        </button>
                        <button class="action-btn demo" onclick="app.loadDemoData()" title="Muat data demo untuk testing">
                            <div class="action-icon">🎲</div>
                            <div class="action-text">Data Demo</div>
                        </button>
                        <button class="action-btn reset" onclick="app.resetAllData()" title="Reset semua data">
                            <div class="action-icon">🗑️</div>
                            <div class="action-text">Reset Data</div>
                        </button>
                        <button class="action-btn" onclick="app.smoothSwitchView('analytics')">
                            <div class="action-icon">📊</div>
                            <div class="action-text">Lihat Analisis</div>
                        </button>
                    </div>
                </div>

                <!-- Recent Transactions -->
                <div class="recent-section">
                    <div class="section-header">
                        <h3 class="section-title">Transaksi Terbaru</h3>
                        <button class="section-action" onclick="app.smoothSwitchView('transactions')">
                            Lihat Semua →
                        </button>
                    </div>
                    <div class="transaction-list">
                    ${
                      recentTransactions.length === 0
                        ? '<div class="empty-state">Belum ada transaksi</div>'
                        : recentTransactions.map((t) => this.renderTransactionItem(t)).join("")
                    }
                    </div>
                </div>
            </div>
        `;
  }

  renderTransactionItem(transaction) {
    const category = this.budgetManager.getCategoryById(transaction.categoryId);
    return `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-icon">${category?.icon || "💳"}</div>
                <div class="transaction-details">
                    <div class="transaction-name">${transaction.description || category?.name}</div>
                    <div class="transaction-date">${new Date(transaction.date).toLocaleDateString("id-ID")}</div>
                                            </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === "income" ? "+" : "-"}${this.budgetManager.formatCurrency(transaction.amount)}
                                            </div>
                                        </div>
        `;
  }

  renderAdvancedAnalytics() {
    return `
            <div class="analytics-container">
                <!-- Analytics Navigation -->
                <div class="analytics-nav">
                    <button class="analytics-tab ${
                      this.analyticsMode === "overview" ? "active" : ""
                    }" data-mode="overview">
                        <span class="tab-icon">📊</span>
                        <span class="tab-text">Ringkasan</span>
                        </button>
                    <button class="analytics-tab ${
                      this.analyticsMode === "patterns" ? "active" : ""
                    }" data-mode="patterns">
                        <span class="tab-icon">🔍</span>
                        <span class="tab-text">Pola Pengeluaran</span>
                        </button>
                    <button class="analytics-tab ${
                      this.analyticsMode === "predictions" ? "active" : ""
                    }" data-mode="predictions">
                        <span class="tab-icon">🔮</span>
                        <span class="tab-text">Prediksi</span>
                    </button>
                    <button class="analytics-tab ${this.analyticsMode === "budget" ? "active" : ""}" data-mode="budget">
                        <span class="tab-icon">🎯</span>
                        <span class="tab-text">Budget</span>
                        </button>
                    </div>

                <!-- Analytics Content -->
                <div class="analytics-content" id="analyticsContent">
                    ${this.renderAnalyticsContent()}
                </div>
            </div>
        `;
  }

  renderAnalyticsContent() {
    switch (this.analyticsMode) {
      case "overview":
        return this.renderAnalyticsOverview();
      case "patterns":
        return this.renderExpensePatterns();
      case "predictions":
        return this.renderPredictiveAnalysis();
      case "budget":
        return this.renderBudgetAnalysis();
      default:
        return this.renderAnalyticsOverview();
    }
  }

  renderAnalyticsOverview() {
    const stats = this.budgetManager.getMonthlyStats();
    const weeklyTrend = this.budgetManager.getWeeklyTrend();
    const categoryExpenses = this.budgetManager.getCategoryExpenses();
    const healthScore = this.calculateHealthScore(stats);

    return `
            <!-- Health Score -->
            <div class="analytics-section">
                <h3 class="section-title">🏥 Kesehatan Keuangan</h3>
                <div class="health-dashboard">
                    <div class="health-score-circle">
                        <div class="score-value">${healthScore}</div>
                        <div class="score-label">Skor</div>
                </div>
                    <div class="health-indicators">
                        ${this.renderHealthIndicators(stats)}
                                        </div>
                                        </div>
                                    </div>

            <!-- Weekly Trend Chart -->
            <div class="analytics-section">
                <h3 class="section-title">📈 Trend Mingguan</h3>
                <div class="chart-container">
                    <div class="weekly-chart" id="weeklyChart">
                        ${weeklyTrend
                          .map((week, index) => {
                            const maxIncome = Math.max(...weeklyTrend.map((w) => w.income));
                            const maxExpense = Math.max(...weeklyTrend.map((w) => w.expense));
                            const maxValue = Math.max(maxIncome, maxExpense);

                            const incomeHeight = maxValue > 0 ? (week.income / maxValue) * 100 : 0;
                            const expenseHeight = maxValue > 0 ? (week.expense / maxValue) * 100 : 0;

                            return `
                                <div class="week-bar" data-week="${week.week}">
                                    <div class="bar-container">
                                        <div class="bar income-bar" 
                                             style="height: ${Math.max(incomeHeight, 2)}%"
                                             title="Pemasukan: ${this.budgetManager.formatCurrency(week.income)}"></div>
                                        <div class="bar expense-bar" 
                                             style="height: ${Math.max(expenseHeight, 2)}%"
                                             title="Pengeluaran: ${this.budgetManager.formatCurrency(
                                               week.expense
                                             )}"></div>
                                        </div>
                                    <div class="week-label">${week.week}</div>
                                    <div class="week-summary">
                                        <div class="week-income">+${this.budgetManager.formatCurrency(
                                          week.income
                                        )}</div>
                                        <div class="week-expense">-${this.budgetManager.formatCurrency(
                                          week.expense
                                        )}</div>
                                    </div>
                                </div>
                            `;
                          })
                          .join("")}
            </div>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color income"></div>
                            <span>Pemasukan</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color expense"></div>
                            <span>Pengeluaran</span>
                        </div>
                    </div>
                    <div class="chart-summary">
                        <div class="summary-item">
                            <span class="summary-label">Rata-rata Pemasukan:</span>
                            <span class="summary-value income">${this.budgetManager.formatCurrency(
                              weeklyTrend.reduce((sum, w) => sum + w.income, 0) / weeklyTrend.length
                            )}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Rata-rata Pengeluaran:</span>
                            <span class="summary-value expense">${this.budgetManager.formatCurrency(
                              weeklyTrend.reduce((sum, w) => sum + w.expense, 0) / weeklyTrend.length
                            )}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Category Distribution -->
            <div class="analytics-section">
                <h3 class="section-title">🥧 Distribusi Pengeluaran</h3>
                <div class="category-distribution">
                    ${
                      Object.entries(categoryExpenses).length === 0
                        ? '<div class="empty-state">Belum ada data pengeluaran</div>'
                        : Object.entries(categoryExpenses)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 6)
                            .map(([categoryName, amount], index) => {
                              const percentage = stats.expense > 0 ? (amount / stats.expense) * 100 : 0;
                              const category = this.budgetManager.data.categories.find(
                                (cat) => cat.name === categoryName
                              );
                              return `
                                    <div class="category-item" style="--delay: ${index * 0.1}s">
                                        <div class="category-header">
                                            <div class="category-info">
                                                <span class="category-icon">${category?.icon || "📝"}</span>
                                                <span class="category-name">${categoryName}</span>
                </div>
                                            <div class="category-stats">
                                                <span class="category-amount">${this.budgetManager.formatCurrency(
                                                  amount
                                                )}</span>
                                                <span class="category-percentage">${percentage.toFixed(1)}%</span>
                                                </div>
                                                </div>
                                        <div class="category-progress">
                                            <div class="progress-fill" 
                                                 style="width: ${percentage}%; background: ${
                                category?.color || "#A29BFE"
                              }"></div>
                                            </div>
                                            </div>
                                    `;
                            })
                            .join("")
                    }
                </div>
            </div>
        `;
  }

  renderExpensePatterns() {
    const patterns = this.budgetManager.getExpensePatterns();

    return `
            <div class="patterns-container">
                <!-- Day of Week Analysis -->
                <div class="analytics-section">
                    <h3 class="section-title">📅 Pola Pengeluaran Harian</h3>
                    <div class="day-pattern-chart" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; padding: 20px; background: ${
                      document.body.classList.contains("dark-theme")
                        ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                        : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
                    }; border: 1px solid ${
      document.body.classList.contains("dark-theme") ? "#6b7280" : "#e2e8f0"
    }; border-radius: 16px; margin-bottom: 20px;">
                        ${Object.entries(patterns.dayOfWeek)
                          .map(([day, amount]) => {
                            const maxAmount = Math.max(...Object.values(patterns.dayOfWeek));
                            const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                            const isDark = document.body.classList.contains("dark-theme");
                            return `
                                <div class="day-bar" style="display: flex; flex-direction: column; align-items: center; padding: 12px; border-radius: 12px; background: ${
                                  isDark ? "#1f2937" : "#ffffff"
                                }; box-shadow: ${isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.1)"};">
                                    <div class="bar-container" style="width: 100%; height: 100px; position: relative; background: ${
                                      isDark ? "#374151" : "#f3f4f6"
                                    }; border-radius: 8px; overflow: hidden; margin-bottom: 8px; display: flex; align-items: flex-end; justify-content: center;">
                                        <div class="bar-fill" style="width: 60%; height: ${Math.max(
                                          percentage,
                                          5
                                        )}%; background: linear-gradient(0deg, #3b82f6 0%, #60a5fa 100%); border-radius: 4px 4px 0 0; transition: height 1s ease;"></div>
                                        </div>
                                    <div class="day-label" style="font-size: 12px; font-weight: 600; margin-bottom: 4px; color: ${
                                      isDark ? "#f9fafb" : "#1f2937"
                                    };">${day}</div>
                                    <div class="day-amount" style="font-size: 10px; color: ${
                                      isDark ? "#d1d5db" : "#6b7280"
                                    }; text-align: center; line-height: 1.2;">${this.budgetManager.formatCurrency(
                              amount
                            )}</div>
                                        </div>
                            `;
                          })
                          .join("")}
                                        </div>
                    ${
                      patterns.mostExpensiveDay
                        ? `
                        <div class="pattern-insight" style="padding: 16px; background: ${
                          document.body.classList.contains("dark-theme") ? "#1e3a8a" : "#eff6ff"
                        }; border-radius: 12px; border-left: 4px solid #3b82f6;">
                            <span class="insight-icon">💡</span>
                            <span class="insight-text" style="color: ${
                              document.body.classList.contains("dark-theme") ? "#dbeafe" : "#1e40af"
                            };">Hari dengan pengeluaran terbesar: <strong>${
                            patterns.mostExpensiveDay[0]
                          }</strong> (${this.budgetManager.formatCurrency(patterns.mostExpensiveDay[1])})</span>
                                        </div>
                    `
                        : ""
                    }
                                    </div>

                <!-- Spending Categories Timeline -->
                <div class="analytics-section">
                    <h3 class="section-title">⏰ Timeline Pengeluaran</h3>
                    <div class="timeline-chart">
                        ${this.renderSpendingTimeline()}
                                    </div>
                </div>

                <!-- Top Spending Analysis -->
                <div class="analytics-section">
                    <h3 class="section-title">🔥 Analisis Pengeluaran Tertinggi</h3>
                    <div class="top-spending-analysis">
                        ${this.renderTopSpendingAnalysis()}
                    </div>
                </div>
            </div>
        `;
  }

  renderPredictiveAnalysis() {
    const predictions = this.budgetManager.getPredictiveAnalysis();

    return `
            <div class="predictions-container">
                <!-- Next Month Prediction -->
                <div class="analytics-section">
                    <h3 class="section-title">🔮 Prediksi Bulan Depan</h3>
                    <div class="prediction-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
                        <div class="prediction-card income" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; padding: 24px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="prediction-icon" style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">💰</div>
                            <div class="prediction-content">
                                <div class="prediction-value" style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">${this.budgetManager.formatCurrency(
                                  predictions.predictedIncome
                                )}</div>
                                <div class="prediction-label" style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Prediksi Pemasukan</div>
                                <div class="prediction-change ${
                                  predictions.incomeGrowth >= 0 ? "positive" : "negative"
                                }" style="font-size: 13px; padding: 6px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; display: inline-block;">
                                    ${predictions.incomeGrowth >= 0 ? "📈" : "📉"} ${Math.abs(
      predictions.incomeGrowth
    ).toFixed(1)}% dari bulan lalu
                        </div>
                    </div>
                </div>

                        <div class="prediction-card expense" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 16px; padding: 24px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="prediction-icon" style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">💸</div>
                            <div class="prediction-content">
                                <div class="prediction-value" style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">${this.budgetManager.formatCurrency(
                                  predictions.predictedExpense
                                )}</div>
                                <div class="prediction-label" style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Prediksi Pengeluaran</div>
                                <div class="prediction-change ${
                                  predictions.expenseGrowth <= 0 ? "positive" : "negative"
                                }" style="font-size: 13px; padding: 6px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; display: inline-block;">
                                    ${predictions.expenseGrowth >= 0 ? "📈" : "📉"} ${Math.abs(
      predictions.expenseGrowth
    ).toFixed(1)}% dari bulan lalu
                        </div>
                    </div>
                </div>

                        <div class="prediction-card balance" style="background: linear-gradient(135deg, ${
                          predictions.predictedBalance >= 0 ? "#3b82f6" : "#f59e0b"
                        } 0%, ${
      predictions.predictedBalance >= 0 ? "#2563eb" : "#d97706"
    } 100%); border-radius: 16px; padding: 24px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(${
      predictions.predictedBalance >= 0 ? "59, 130, 246" : "245, 158, 11"
    }, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="prediction-icon" style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">⚖️</div>
                            <div class="prediction-content">
                                <div class="prediction-value" style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">${this.budgetManager.formatCurrency(
                                  Math.abs(predictions.predictedBalance)
                                )}</div>
                                <div class="prediction-label" style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Prediksi Saldo</div>
                                <div class="prediction-change ${
                                  predictions.predictedBalance >= 0 ? "positive" : "negative"
                                }" style="font-size: 13px; padding: 6px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; display: inline-block;">
                                    ${predictions.predictedBalance >= 0 ? "✅ Surplus" : "⚠️ Defisit"}
                        </div>
                    </div>
                        </div>
                </div>

                    <div class="prediction-summary" style="background: ${
                      document.body.classList.contains("dark-theme")
                        ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                        : "linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)"
                    }; border: 1px solid ${
      document.body.classList.contains("dark-theme") ? "#6b7280" : "#e2e8f0"
    }; border-radius: 16px; padding: 20px; margin-top: 20px;">
                        <h4 style="margin: 0 0 16px 0; color: ${
                          document.body.classList.contains("dark-theme") ? "#f9fafb" : "#1f2937"
                        }; font-size: 16px; font-weight: 600;">📊 Ringkasan Prediksi</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <div style="text-align: center;">
                                <div style="font-size: 14px; color: ${
                                  document.body.classList.contains("dark-theme") ? "#d1d5db" : "#6b7280"
                                }; margin-bottom: 4px;">Rata-rata Pemasukan</div>
                                <div style="font-size: 18px; font-weight: 600; color: #10b981;">${this.budgetManager.formatCurrency(
                                  predictions.avgIncome
                                )}</div>
                        </div>
                            <div style="text-align: center;">
                                <div style="font-size: 14px; color: ${
                                  document.body.classList.contains("dark-theme") ? "#d1d5db" : "#6b7280"
                                }; margin-bottom: 4px;">Rata-rata Pengeluaran</div>
                                <div style="font-size: 18px; font-weight: 600; color: #ef4444;">${this.budgetManager.formatCurrency(
                                  predictions.avgExpense
                                )}</div>
                    </div>
                            <div style="text-align: center;">
                                <div style="font-size: 14px; color: ${
                                  document.body.classList.contains("dark-theme") ? "#d1d5db" : "#6b7280"
                                }; margin-bottom: 4px;">Tingkat Akurasi</div>
                                <div style="font-size: 18px; font-weight: 600; color: #3b82f6;">85%</div>
                            </div>
                        </div>
                </div>
            </div>

                <!-- AI Recommendations -->
                <div class="analytics-section">
                    <h3 class="section-title">🤖 Rekomendasi AI</h3>
                    <div class="recommendations">
                        ${predictions.recommendation
                          .map(
                            (rec) => `
                            <div class="recommendation-item ${rec.type}">
                                <div class="rec-icon">${rec.icon}</div>
                                <div class="rec-content">
                                    <div class="rec-title">${rec.title}</div>
                                    <div class="rec-description">${rec.description}</div>
                        </div>
                    </div>
                        `
                          )
                          .join("")}
                                                </div>
                                                </div>

                <!-- Trend Analysis -->
                <div class="analytics-section">
                    <h3 class="section-title">📊 Analisis Trend</h3>
                    <div class="trend-analysis">
                        ${this.renderTrendAnalysis(predictions)}
                                            </div>
                                            </div>
                                        </div>
                                    `;
  }

  renderBudgetAnalysis() {
    const budgetAnalysis = this.budgetManager.getCategoryBudgetAnalysis();

    return `
            <div class="budget-container">
                <!-- Budget Overview -->
                <div class="analytics-section">
                    <div class="section-header">
                        <h3 class="section-title">🎯 Ringkasan Budget</h3>
                        <button class="btn btn-primary" onclick="app.showSetBudgetModal()">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Atur Budget</span>
                        </button>
                </div>

                    <div class="budget-overview">
                        ${
                          budgetAnalysis.length === 0
                            ? `<div class="empty-state">
                                <div class="empty-icon">📊</div>
                                <div class="empty-title">Belum ada budget yang ditetapkan</div>
                                <div class="empty-description">Mulai atur budget untuk kategori pengeluaran Anda</div>
                                <button class="btn btn-primary" onclick="app.showSetBudgetModal()">
                                    <span class="btn-icon">🎯</span>
                                    <span class="btn-text">Atur Budget Pertama</span>
                                </button>
                            </div>`
                            : budgetAnalysis
                                .map((category) => {
                                  const isDark = document.body.classList.contains("dark-theme");
                                  const cardBg = isDark
                                    ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                                    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)";
                                  const cardBorder = isDark ? "#6b7280" : "#e2e8f0";
                                  const cardShadow = isDark
                                    ? "0 4px 15px rgba(0, 0, 0, 0.3)"
                                    : "0 4px 15px rgba(0, 0, 0, 0.1)";
                                  const textPrimary = isDark ? "#f9fafb" : "#1f2937";
                                  const textSecondary = isDark ? "#d1d5db" : "#6b7280";
                                  const progressBg = isDark ? "#4b5563" : "#e5e7eb";

                                  const statusColors = {
                                    good: {
                                      primary: "#10b981",
                                      light: isDark ? "#86efac" : "#16a34a",
                                      bg: isDark ? "#14532d" : "#f0fdf4",
                                    },
                                    warning: {
                                      primary: "#f59e0b",
                                      light: isDark ? "#fbbf24" : "#d97706",
                                      bg: isDark ? "#78350f" : "#fffbeb",
                                    },
                                    over: {
                                      primary: "#ef4444",
                                      light: isDark ? "#fca5a5" : "#dc2626",
                                      bg: isDark ? "#7f1d1d" : "#fef2f2",
                                    },
                                  };

                                  const statusColor = statusColors[category.status] || statusColors.good;

                                  return `
                                <div class="budget-category-card ${category.status}" style="
                                    background: ${cardBg};
                                    border: 1px solid ${cardBorder};
                                    border-radius: 16px;
                                    padding: 20px;
                                    margin-bottom: 16px;
                                    box-shadow: ${cardShadow};
                                    transition: all 0.3s ease;
                                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                    <div class="budget-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                                        <div class="budget-info" style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                            <div class="budget-icon-wrapper" style="
                                                width: 48px;
                                                height: 48px;
                                                border-radius: 12px;
                                                background: ${category.color || "#6366f1"};
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                font-size: 20px;
                                                box-shadow: 0 4px 12px ${(category.color || "#6366f1") + "40"};
                                            ">
                                                <span class="budget-icon">${category.icon}</span>
                        </div>
                                            <div class="budget-details">
                                                <div class="budget-name" style="
                                                    font-size: 16px;
                                                    font-weight: 600;
                                                    color: ${textPrimary};
                                                    margin-bottom: 4px;
                                                ">${category.name}</div>
                                                <div class="budget-amounts" style="
                                                    font-size: 14px;
                                                    color: ${textSecondary};
                                                ">
                                                    <span class="spent" style="
                                                        font-weight: 600;
                                                        color: ${statusColor.primary};
                                                    ">${this.budgetManager.formatCurrency(category.spent)}</span>
                                                    <span class="separator"> / </span>
                                                    <span class="budget">${this.budgetManager.formatCurrency(
                                                      category.budget
                                                    )}</span>
                    </div>
                                </div>
                            </div>
                                        <div class="budget-percentage-wrapper" style="text-align: right;">
                                            <div class="budget-percentage" style="
                                                font-size: 20px;
                                                font-weight: 700;
                                                margin-bottom: 4px;
                                                color: ${statusColor.primary};
                                            ">
                                                ${category.percentage.toFixed(0)}%
                                            </div>
                                            <div class="budget-status-badge" style="
                                                font-size: 12px;
                                                font-weight: 500;
                                                padding: 4px 8px;
                                                border-radius: 6px;
                                                background: ${statusColor.bg};
                                                color: ${statusColor.light};
                                            ">
                                                ${
                                                  category.status === "over"
                                                    ? "Melebihi"
                                                    : category.status === "warning"
                                                    ? "Hampir Habis"
                                                    : "Aman"
                                                }
                    </div>
                </div>
            </div>

                                    <div class="budget-progress-wrapper">
                                        <div class="budget-progress" style="margin-bottom: 12px;">
                                            <div class="progress-track" style="
                                                width: 100%;
                                                height: 8px;
                                                background: ${progressBg};
                                                border-radius: 4px;
                                                overflow: hidden;
                                            ">
                                                <div class="progress-fill" style="
                                                    height: 100%;
                                                    width: ${Math.min(category.percentage, 100)}%;
                                                    background: linear-gradient(90deg, ${statusColor.primary} 0%, ${
                                    statusColor.light
                                  } 100%);
                                                    border-radius: 4px;
                                                    transition: width 1s ease;
                                                "></div>
                    </div>
                                        </div>
                                        <div class="budget-remaining" style="
                                            font-size: 14px;
                                            font-weight: 500;
                                        ">
                                            ${
                                              category.remaining > 0
                                                ? `<span style="color: ${
                                                    statusColors.good.light
                                                  };">Sisa: ${this.budgetManager.formatCurrency(
                                                    category.remaining
                                                  )}</span>`
                                                : `<span style="color: ${
                                                    statusColors.over.light
                                                  };">Melebihi: ${this.budgetManager.formatCurrency(
                                                    Math.abs(category.remaining)
                                                  )}</span>`
                                            }
                                        </div>
                                    </div>
                                </div>
                            `;
                                })
                                .join("")
                        }
                    </div>
                </div>

                <!-- Budget Management Actions -->
                <div class="analytics-section">
                    <h3 class="section-title">⚙️ Kelola Budget</h3>
                    <div class="budget-actions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
                        <div class="action-card primary" onclick="app.showSetBudgetModal()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 16px; padding: 24px; color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); min-height: 140px; display: flex; flex-direction: column; justify-content: center; text-align: center;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="action-card-icon" style="font-size: 32px; margin-bottom: 12px;">🎯</div>
                            <div class="action-card-content">
                                <div class="action-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Atur Budget Baru</div>
                                <div class="action-card-description" style="font-size: 14px; opacity: 0.9;">Tetapkan batas pengeluaran untuk kategori</div>
                    </div>
                        </div>
                        
                        <div class="action-card secondary" onclick="app.showBudgetHistoryModal()" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; border-radius: 16px; padding: 24px; color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3); min-height: 140px; display: flex; flex-direction: column; justify-content: center; text-align: center;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="action-card-icon" style="font-size: 32px; margin-bottom: 12px;">📊</div>
                            <div class="action-card-content">
                                <div class="action-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Riwayat Budget</div>
                                <div class="action-card-description" style="font-size: 14px; opacity: 0.9;">Lihat performa budget bulan lalu</div>
                            </div>
                        </div>
                        
                        <div class="action-card secondary" onclick="app.exportBudgetReport()" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border: none; border-radius: 16px; padding: 24px; color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3); min-height: 140px; display: flex; flex-direction: column; justify-content: center; text-align: center;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="action-card-icon" style="font-size: 32px; margin-bottom: 12px;">📄</div>
                            <div class="action-card-content">
                                <div class="action-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Export Laporan</div>
                                <div class="action-card-description" style="font-size: 14px; opacity: 0.9;">Unduh laporan budget dalam PDF</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Budget Statistics -->
                ${
                  budgetAnalysis.length > 0
                    ? `
                    <div class="analytics-section">
                        <h3 class="section-title">📈 Statistik Budget</h3>
                        <div class="budget-stats-grid">
                            <div class="budget-stat-card">
                                <div class="stat-icon success">✅</div>
                                <div class="stat-content">
                                    <div class="stat-value">${
                                      budgetAnalysis.filter((c) => c.status === "good").length
                                    }</div>
                                    <div class="stat-label">Budget Aman</div>
                    </div>
                    </div>
                            
                            <div class="budget-stat-card">
                                <div class="stat-icon warning">⚠️</div>
                                <div class="stat-content">
                                    <div class="stat-value">${
                                      budgetAnalysis.filter((c) => c.status === "warning").length
                                    }</div>
                                    <div class="stat-label">Mendekati Batas</div>
                </div>
                            </div>
                            
                            <div class="budget-stat-card">
                                <div class="stat-icon danger">🚨</div>
                                <div class="stat-content">
                                    <div class="stat-value">${
                                      budgetAnalysis.filter((c) => c.status === "over").length
                                    }</div>
                                    <div class="stat-label">Melebihi Budget</div>
                                </div>
                            </div>
                            
                            <div class="budget-stat-card">
                                <div class="stat-icon info">💰</div>
                                <div class="stat-content">
                                    <div class="stat-value">${this.budgetManager.formatCurrency(
                                      budgetAnalysis.reduce((sum, c) => sum + c.remaining, 0)
                                    )}</div>
                                    <div class="stat-label">Total Sisa Budget</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        `;
  }

  // Analytics Mode Switching
  switchAnalyticsMode(mode) {
    this.analyticsMode = mode;
    document.querySelectorAll(".analytics-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === mode);
    });
    document.getElementById("analyticsContent").innerHTML = this.renderAnalyticsContent();
    this.initializeAnalyticsCharts();
  }

  // Chart utility methods
  calculateBarHeight(value, allData, type) {
    const values = allData.map((d) => (type === "income" ? d.income : d.expense));
    const maxValue = Math.max(...values);
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }

  calculateHealthScore(stats) {
    let score = 0;
    if (stats.balance > 0) score += 40;
    const savingsRate = stats.income > 0 ? ((stats.income - stats.expense) / stats.income) * 100 : 0;
    if (savingsRate >= 20) score += 30;
    if (stats.transactionCount >= 10) score += 15;
    return Math.min(100, score);
  }

  renderHealthIndicators(stats) {
    const savingsRate = stats.income > 0 ? ((stats.income - stats.expense) / stats.income) * 100 : 0;
    return `
            <div class="health-indicator good">
                <span class="indicator-icon">💰</span>
                <div class="indicator-info">
                    <div class="indicator-label">Saldo</div>
                    <div class="indicator-value">${this.budgetManager.formatCurrency(stats.balance)}</div>
                </div>
            </div>
        `;
  }

  renderSpendingTimeline() {
    return '<div class="timeline-placeholder">Timeline akan ditampilkan di sini</div>';
  }

  renderTopSpendingAnalysis() {
    return '<div class="analysis-placeholder">Analisis pengeluaran tertinggi</div>';
  }

  renderTrendAnalysis(predictions) {
    return '<div class="trend-placeholder">Analisis trend akan ditampilkan di sini</div>';
  }

  // Other view renderers - Complete implementations
  renderTransactions() {
    const transactions = this.budgetManager.data.transactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return `
            <div class="transactions-container">
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="app.showQuickAddModal('income')">
                        <span class="btn-icon">💰</span>
                        <span class="btn-text">Tambah Pemasukan</span>
                    </button>
                    <button class="btn btn-primary" onclick="app.showQuickAddModal('expense')">
                        <span class="btn-icon">💸</span>
                        <span class="btn-text">Tambah Pengeluaran</span>
                    </button>
                </div>

                <div class="transactions-stats">
                    <div class="stat-card success">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(
                              transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
                            )}</div>
                            <div class="stat-label">Total Pemasukan</div>
            </div>
                    </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-icon">📉</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(
                              transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
                            )}</div>
                            <div class="stat-label">Total Pengeluaran</div>
                        </div>
                    </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <div class="stat-value">${transactions.length}</div>
                            <div class="stat-label">Total Transaksi</div>
                        </div>
                    </div>
                </div>

                <div class="transactions-section">
                    <div class="section-header">
                        <h3 class="section-title">Semua Transaksi</h3>
                        <div class="section-actions">
                            <select class="filter-select" id="transactionFilter">
                                <option value="all">Semua</option>
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Table Header -->
                    ${
                      transactions.length > 0
                        ? `
                        <div class="transactions-table-header" style="
                            display: grid;
                            grid-template-columns: 32px 1fr auto auto;
                            gap: 12px;
                            padding: 8px 16px;
                            margin-bottom: 8px;
                            background: ${document.body.classList.contains("dark-theme") ? "#4b5563" : "#f8fafc"};
                            border-radius: 6px;
                            font-size: 12px;
                            font-weight: 600;
                            color: ${document.body.classList.contains("dark-theme") ? "#d1d5db" : "#6b7280"};
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        ">
                            <div></div>
                            <div>Transaksi</div>
                            <div style="text-align: right;">Jumlah</div>
                            <div style="text-align: center;">Aksi</div>
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="transactions-list">
                        ${
                          transactions.length === 0
                            ? '<div class="empty-state">Belum ada transaksi. <button class="link-btn" onclick="app.showQuickAddModal()">Tambah transaksi pertama</button></div>'
                            : transactions.map((t) => this.renderDetailedTransactionItem(t)).join("")
                        }
                    </div>
                </div>
            </div>
        `;
  }

  renderDetailedTransactionItem(transaction) {
    const category = this.budgetManager.getCategoryById(transaction.categoryId);
    const account = this.budgetManager.getAccountById(transaction.accountId);
    const accountType = this.budgetManager.data.accountTypes.find((t) => t.id === account?.typeId);
    const isDark = document.body.classList.contains("dark-theme");

    return `
            <div class="transaction-item detailed ${transaction.type}" data-id="${transaction.id}" style="
                background: ${
                  isDark
                    ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
                };
                border: 1px solid ${isDark ? "#6b7280" : "#e2e8f0"};
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 8px;
                box-shadow: ${isDark ? "0 1px 3px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.1)"};
                transition: all 0.2s ease;
                display: grid;
                grid-template-columns: 32px 1fr auto auto;
                gap: 12px;
                align-items: center;
                min-height: 60px;
            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='${
              isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.15)"
            }';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${
      isDark ? "0 1px 3px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.1)"
    }';">
                
                <!-- Icon Column -->
                <div class="transaction-icon" style="
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: ${category?.color || (transaction.type === "income" ? "#10b981" : "#ef4444")};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    box-shadow: 0 2px 4px ${
                      (category?.color || (transaction.type === "income" ? "#10b981" : "#ef4444")) + "40"
                    };
                    flex-shrink: 0;
                ">${category?.icon || (transaction.type === "income" ? "💰" : "💸")}</div>
                
                <!-- Details Column -->
                <div class="transaction-details" style="min-width: 0; overflow: hidden;">
                    <div class="transaction-name" style="
                        font-size: 14px;
                        font-weight: 600;
                        color: ${isDark ? "#f9fafb" : "#1f2937"};
                        margin-bottom: 2px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    ">${transaction.description || category?.name}</div>
                    <div class="transaction-meta" style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 11px;
                        color: ${isDark ? "#9ca3af" : "#6b7280"};
                        flex-wrap: wrap;
                    ">
                        <span class="transaction-category" style="
                            background: ${isDark ? "#4b5563" : "#f3f4f6"};
                            padding: 1px 6px;
                            border-radius: 10px;
                            font-size: 10px;
                            font-weight: 500;
                        ">${category?.name}</span>
                        <span style="font-size: 8px;">•</span>
                        <span class="transaction-account">${accountType?.icon || "🏦"} ${account?.name}</span>
                        <span style="font-size: 8px;">•</span>
                        <span class="transaction-date">${new Date(transaction.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })}</span>
                    </div>
                </div>
                
                <!-- Amount Column -->
                <div class="transaction-amount" style="
                    font-size: 14px;
                    font-weight: 700;
                    color: ${transaction.type === "income" ? "#10b981" : "#ef4444"};
                    text-align: right;
                    flex-shrink: 0;
                    min-width: 90px;
                ">
                    ${transaction.type === "income" ? "+" : "-"}${this.budgetManager.formatCurrency(transaction.amount)}
                </div>
                
                <!-- Actions Column -->
                <div class="transaction-actions" style="
                    display: flex;
                    gap: 4px;
                    flex-shrink: 0;
                    opacity: 0.7;
                " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                    <button class="action-btn-small edit" onclick="app.editTransaction(${
                      transaction.id
                    })" title="Edit" style="
                        width: 24px;
                        height: 24px;
                        border: none;
                        border-radius: 4px;
                        background: ${isDark ? "#4b5563" : "#f3f4f6"};
                        color: ${isDark ? "#d1d5db" : "#6b7280"};
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                        font-size: 11px;
                    " onmouseover="this.style.background='#3b82f6'; this.style.color='white';" onmouseout="this.style.background='${
                      isDark ? "#4b5563" : "#f3f4f6"
                    }'; this.style.color='${isDark ? "#d1d5db" : "#6b7280"}';">✏️</button>
                    <button class="action-btn-small delete" onclick="app.deleteTransaction(${
                      transaction.id
                    })" title="Hapus" style="
                        width: 24px;
                        height: 24px;
                        border: none;
                        border-radius: 4px;
                        background: ${isDark ? "#4b5563" : "#f3f4f6"};
                        color: ${isDark ? "#d1d5db" : "#6b7280"};
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                        font-size: 11px;
                    " onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='${
                      isDark ? "#4b5563" : "#f3f4f6"
                    }'; this.style.color='${isDark ? "#d1d5db" : "#6b7280"}';">🗑️</button>
                </div>
            </div>
        `;
  }

  renderAccounts() {
    const accounts = this.budgetManager.data.accounts;
    const totalBalance = this.budgetManager.getTotalBalance();

    return `
            <div class="accounts-container">
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="app.showAddAccountModal()">
                        <span class="btn-icon">🏦</span>
                        <span class="btn-text">Tambah Akun</span>
                    </button>
                </div>

                <div class="accounts-stats">
                    <div class="stat-card primary">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(totalBalance)}</div>
                            <div class="stat-label">Total Saldo</div>
                        </div>
                    </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">🏦</div>
                        <div class="stat-content">
                            <div class="stat-value">${accounts.length}</div>
                            <div class="stat-label">Total Akun</div>
                        </div>
                    </div>
                </div>

                <div class="accounts-section">
                    <h3 class="section-title">Daftar Akun</h3>
                    <div class="accounts-grid">
                        ${
                          accounts.length === 0
                            ? '<div class="empty-state">Belum ada akun. <button class="link-btn" onclick="app.showAddAccountModal()">Tambah akun pertama</button></div>'
                            : accounts.map((account) => this.renderAccountCard(account)).join("")
                        }
                    </div>
                </div>
            </div>
        `;
  }

  renderAccountCard(account) {
    const accountType = this.budgetManager.data.accountTypes.find((t) => t.id === account.typeId);
    const recentTransactions = this.budgetManager.data.transactions
      .filter((t) => t.accountId === account.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    return `
            <div class="account-card" data-id="${account.id}">
                <div class="account-header">
                    <div class="account-info">
                        <div class="account-icon" style="color: ${accountType?.color || "#6C5CE7"}">${
      accountType?.icon || "🏦"
    }</div>
                        <div class="account-details">
                            <div class="account-name">${account.name}</div>
                            <div class="account-type">${accountType?.name || "Unknown"}</div>
                        </div>
                    </div>
                    <div class="account-actions">
                        <button class="action-btn-small" onclick="app.editAccount(${
                          account.id
                        })" title="Edit">✏️</button>
                        <button class="action-btn-small delete" onclick="app.deleteAccount(${
                          account.id
                        })" title="Hapus">🗑️</button>
                    </div>
                </div>
                
                <div class="account-balance">
                    <div class="balance-amount ${account.balance >= 0 ? "positive" : "negative"}">
                        ${this.budgetManager.formatCurrency(account.balance)}
                    </div>
                    <div class="balance-label">Saldo</div>
                </div>
                
                ${
                  recentTransactions.length > 0
                    ? `
                    <div class="account-transactions">
                        <div class="mini-transactions-title">Transaksi Terakhir</div>
                        ${recentTransactions
                          .map((t) => {
                            const category = this.budgetManager.getCategoryById(t.categoryId);
                            return `
                                <div class="mini-transaction ${t.type}">
                                    <span class="mini-transaction-name">${t.description || category?.name}</span>
                                    <span class="mini-transaction-amount">${
                                      t.type === "income" ? "+" : "-"
                                    }${this.budgetManager.formatCurrency(t.amount)}</span>
                                </div>
                            `;
                          })
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `;
  }

  renderGoals() {
    const goals = this.budgetManager.data.goals;

    return `
            <div class="goals-container">
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="app.showAddGoalModal()">
                        <span class="btn-icon">🎯</span>
                        <span class="btn-text">Tambah Target</span>
                    </button>
                </div>

                <div class="goals-stats">
                    <div class="stat-card success">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <div class="stat-value">${goals.length}</div>
                            <div class="stat-label">Total Target</div>
                        </div>
                    </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(
                              goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
                            )}</div>
                            <div class="stat-label">Total Terkumpul</div>
                        </div>
                    </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-icon">🏁</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(
                              goals.reduce((sum, goal) => sum + goal.target, 0)
                            )}</div>
                            <div class="stat-label">Total Target</div>
                        </div>
                    </div>
                </div>

                <div class="goals-section">
                    <h3 class="section-title">Daftar Target</h3>
                    <div class="goals-grid">
                        ${
                          goals.length === 0
                            ? '<div class="empty-state">Belum ada target. <button class="link-btn" onclick="app.showAddGoalModal()">Tambah target pertama</button></div>'
                            : goals.map((goal) => this.renderGoalCard(goal)).join("")
                        }
                    </div>
                </div>
            </div>
        `;
  }

  renderGoalCard(goal) {
    const progress = goal.target > 0 ? (goal.currentAmount / goal.target) * 100 : 0;
    const remaining = goal.target - goal.currentAmount;
    const daysRemaining = goal.deadline
      ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    return `
            <div class="goal-card" data-id="${goal.id}">
                <div class="goal-header">
                    <div class="goal-info">
                        <div class="goal-name">${goal.name}</div>
                        ${
                          goal.deadline
                            ? `
                            <div class="goal-deadline ${daysRemaining < 30 ? "urgent" : ""}">
                                ${daysRemaining > 0 ? `${daysRemaining} hari lagi` : "Sudah lewat"}
                            </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="goal-actions">
                        <button class="action-btn-small" onclick="app.updateGoalProgress(${
                          goal.id
                        })" title="Update Progress">➕</button>
                        <button class="action-btn-small" onclick="app.editGoal(${goal.id})" title="Edit">✏️</button>
                        <button class="action-btn-small delete" onclick="app.deleteGoal(${
                          goal.id
                        })" title="Hapus">🗑️</button>
                    </div>
                </div>
                
                <div class="goal-progress">
                    <div class="progress-info">
                        <span class="progress-current">${this.budgetManager.formatCurrency(goal.currentAmount)}</span>
                        <span class="progress-target">${this.budgetManager.formatCurrency(goal.target)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <div class="progress-percentage">${progress.toFixed(1)}%</div>
                </div>
                
                <div class="goal-remaining">
                    ${
                      remaining > 0
                        ? `Sisa: ${this.budgetManager.formatCurrency(remaining)}`
                        : `<span class="goal-completed">🎉 Target Tercapai!</span>`
                    }
                </div>
            </div>
        `;
  }

  // Animation methods
  animateStatistics() {
    setTimeout(() => {
      document.querySelectorAll(".stat-card").forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100);
      });
    }, 100);
  }

  initializeAnalyticsCharts() {
    setTimeout(() => {
      document.querySelectorAll(".progress-fill, .bar-fill").forEach((bar, index) => {
        setTimeout(() => {
          bar.style.transition = "width 1s ease";
          bar.style.opacity = "1";
        }, index * 50);
      });
    }, 200);
  }

  // Modal methods - Complete implementations
  showQuickAddModal(type = "expense") {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="app.hideModal()"></div>
            <div class="modal quick-add-modal">
                <div class="modal-header">
                    <h3 class="modal-title">
                        ${type === "income" ? "💰 Tambah Pemasukan" : "💸 Tambah Pengeluaran"}
                    </h3>
                    <button class="modal-close" onclick="app.hideModal()">×</button>
                </div>
                <form class="modal-form" id="transactionForm">
                <div class="form-group">
                        <label class="form-label">Jumlah *</label>
                        <input type="number" class="form-input" id="amount" placeholder="0" required min="0" step="1000">
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Kategori *</label>
                        <select class="form-select" id="categoryId" required>
                            <option value="">Pilih Kategori</option>
                            ${this.budgetManager.data.categories
                              .filter((cat) =>
                                type === "income"
                                  ? cat.name === "Gaji" || cat.name === "Investasi"
                                  : cat.name !== "Gaji"
                              )
                              .map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`)
                              .join("")}
                    </select>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Akun *</label>
                        <select class="form-select" id="accountId" required>
                            <option value="">Pilih Akun</option>
                            ${this.budgetManager.data.accounts
                              .map((acc) => {
                                const type = this.budgetManager.data.accountTypes.find((t) => t.id === acc.typeId);
                                return `<option value="${acc.id}">${type?.icon || "🏦"} ${
                                  acc.name
                                } (${this.budgetManager.formatCurrency(acc.balance)})</option>`;
                              })
                              .join("")}
                    </select>
                        ${
                          this.budgetManager.data.accounts.length === 0
                            ? '<p class="form-help">Belum ada akun. <button type="button" class="link-btn" onclick="app.showAddAccountModal()">Tambah akun baru</button></p>'
                            : ""
                        }
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Deskripsi</label>
                        <input type="text" class="form-input" id="description" placeholder="Catatan (opsional)">
                </div>
                    
                <div class="form-group">
                    <label class="form-label">Tanggal</label>
                        <input type="date" class="form-input" id="date" value="${
                          new Date().toISOString().split("T")[0]
                        }">
                </div>
                    
                    <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">${type === "income" ? "💰" : "💸"}</span>
                            <span class="btn-text">Tambah ${type === "income" ? "Pemasukan" : "Pengeluaran"}</span>
                        </button>
                </div>
            </form>
            </div>
        `;

    modal.classList.add("active");
    document.getElementById("amount").focus();

    // Bind form submission
    document.getElementById("transactionForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const amount = parseFloat(document.getElementById("amount").value);
      const categoryId = parseInt(document.getElementById("categoryId").value);
      const accountId = parseInt(document.getElementById("accountId").value);
      const description = document.getElementById("description").value;
      const date = document.getElementById("date").value;

      if (amount && categoryId && accountId) {
        try {
          this.budgetManager.addTransaction(type, amount, categoryId, accountId, description, date);
          this.hideModal();
          this.showToast(`${type === "income" ? "Pemasukan" : "Pengeluaran"} berhasil ditambahkan!`, "success");
          this.render();
          this.updateUserBalance();
        } catch (error) {
          this.showToast("Gagal menambahkan transaksi: " + error.message, "error");
        }
      }
    });
  }

  showAddAccountModal() {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="app.hideModal()"></div>
            <div class="modal account-modal">
                <div class="modal-header">
                    <h3 class="modal-title">🏦 Tambah Akun Baru</h3>
                    <button class="modal-close" onclick="app.hideModal()">×</button>
                </div>
                <form class="modal-form" id="accountForm">
                <div class="form-group">
                        <label class="form-label">Nama Akun *</label>
                        <input type="text" class="form-input" id="accountName" placeholder="Contoh: BCA Utama" required>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Jenis Akun *</label>
                        <select class="form-select" id="accountType" required>
                            <option value="">Pilih Jenis Akun</option>
                            ${this.budgetManager.data.accountTypes
                              .map((type) => `<option value="${type.id}">${type.icon} ${type.name}</option>`)
                              .join("")}
                    </select>
                </div>
                    
                    <div class="form-group">
                        <label class="form-label">Saldo Awal</label>
                        <input type="number" class="form-input" id="initialBalance" placeholder="0" min="0" step="1000">
                        <p class="form-help">Masukkan saldo yang ada saat ini di akun tersebut</p>
                    </div>
                    
                    <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">🏦</span>
                            <span class="btn-text">Tambah Akun</span>
                        </button>
                </div>
            </form>
            </div>
        `;

    modal.classList.add("active");
    document.getElementById("accountName").focus();

    // Bind form submission
    document.getElementById("accountForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("accountName").value;
      const typeId = parseInt(document.getElementById("accountType").value);
      const balance = parseFloat(document.getElementById("initialBalance").value) || 0;

      if (name && typeId) {
        try {
          this.budgetManager.addAccount(name, balance, typeId);
          this.hideModal();
          this.showToast("Akun berhasil ditambahkan!", "success");
          this.render();
          this.updateUserBalance();
        } catch (error) {
          this.showToast("Gagal menambahkan akun: " + error.message, "error");
        }
      }
    });
  }

  showAddGoalModal() {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="app.hideModal()"></div>
            <div class="modal goal-modal">
                <div class="modal-header">
                    <h3 class="modal-title">🎯 Tambah Target Baru</h3>
                    <button class="modal-close" onclick="app.hideModal()">×</button>
                </div>
                <form class="modal-form" id="goalForm">
                <div class="form-group">
                        <label class="form-label">Nama Target *</label>
                        <input type="text" class="form-input" id="goalName" placeholder="Contoh: Liburan ke Bali" required>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Target Jumlah *</label>
                        <input type="number" class="form-input" id="targetAmount" placeholder="0" required min="1000" step="1000">
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Jumlah Saat Ini</label>
                        <input type="number" class="form-input" id="currentAmount" placeholder="0" min="0" step="1000">
                        <p class="form-help">Jumlah yang sudah terkumpul untuk target ini</p>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Tenggat Waktu</label>
                        <input type="date" class="form-input" id="deadline" min="${
                          new Date().toISOString().split("T")[0]
                        }">
                        <p class="form-help">Kapan target ini ingin dicapai? (opsional)</p>
                </div>
                    
                    <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Tambah Target</span>
                        </button>
                </div>
            </form>
            </div>
        `;

    modal.classList.add("active");
    document.getElementById("goalName").focus();

    // Bind form submission
    document.getElementById("goalForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("goalName").value;
      const target = parseFloat(document.getElementById("targetAmount").value);
      const currentAmount = parseFloat(document.getElementById("currentAmount").value) || 0;
      const deadline = document.getElementById("deadline").value || null;

      if (name && target) {
        try {
          this.budgetManager.addGoal(name, target, currentAmount, deadline);
          this.hideModal();
          this.showToast("Target berhasil ditambahkan!", "success");
          this.render();
        } catch (error) {
          this.showToast("Gagal menambahkan target: " + error.message, "error");
        }
      }
    });
  }

  showSetBudgetModal() {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="app.hideModal()"></div>
            <div class="modal budget-modal">
                <div class="modal-header">
                    <h3 class="modal-title">🎯 Atur Budget Kategori</h3>
                    <button class="modal-close" onclick="app.hideModal()">×</button>
                </div>
                <form class="modal-form" id="budgetForm">
                <div class="form-group">
                        <label class="form-label">Kategori *</label>
                        <select class="form-select" id="budgetCategory" required>
                            <option value="">Pilih Kategori</option>
                            ${this.budgetManager.data.categories
                              .filter((cat) => cat.name !== "Gaji")
                              .map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`)
                              .join("")}
                        </select>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Budget Bulanan *</label>
                        <input type="number" class="form-input" id="budgetAmount" placeholder="0" required min="1000" step="1000">
                        <p class="form-help">Maksimal pengeluaran untuk kategori ini per bulan</p>
                </div>
                    
                    <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Atur Budget</span>
                        </button>
                </div>
            </form>
            </div>
        `;

    modal.classList.add("active");
    document.getElementById("budgetCategory").focus();

    // Bind form submission
    document.getElementById("budgetForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const categoryId = parseInt(document.getElementById("budgetCategory").value);
      const budgetAmount = parseFloat(document.getElementById("budgetAmount").value);

      if (categoryId && budgetAmount) {
        try {
          const category = this.budgetManager.data.categories.find((cat) => cat.id === categoryId);
          if (category) {
            category.budget = budgetAmount;
            this.budgetManager.saveData();
            this.hideModal();
            this.showToast(`Budget untuk ${category.name} berhasil diatur!`, "success");
            this.render();
          }
        } catch (error) {
          this.showToast("Gagal mengatur budget: " + error.message, "error");
        }
      }
    });
  }

  hideModal() {
    const modal = document.getElementById("modalContainer");
    modal.classList.remove("active");
    setTimeout(() => {
      modal.innerHTML = "";
    }, 300);
  }

  showToast(message, type = "info") {
    console.log("showToast called:", message, type);

    // Remove any existing toasts first
    const existingToasts = document.querySelectorAll('[data-toast="true"]');
    existingToasts.forEach((toast) => {
      console.log("Removing existing toast");
      toast.remove();
    });

    // Create toast with NO CSS CLASSES - just a plain div
    const toast = document.createElement("div");
    toast.setAttribute("data-toast", "true"); // Use data attribute instead of class

    // Apply ALL styles inline with highest specificity
    const styles = [
      "position: fixed !important",
      "top: 100px !important",
      "right: 20px !important",
      "z-index: 2147483647 !important", // Maximum z-index
      "background: #ffffff !important",
      "border: 1px solid #e2e8f0 !important",
      "border-radius: 12px !important",
      "padding: 16px !important",
      "width: 380px !important",
      "height: auto !important",
      "box-shadow: 0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1) !important",
      "display: flex !important",
      "align-items: flex-start !important",
      "gap: 12px !important",
      "visibility: visible !important",
      "opacity: 1 !important",
      'font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important',
      "font-size: 14px !important",
      "color: #1f2937 !important",
      "line-height: 1.5 !important",
      "word-wrap: break-word !important",
      "pointer-events: auto !important",
      "transform: none !important",
      "margin: 0 !important",
      "backdrop-filter: blur(10px) !important",
    ];

    toast.style.cssText = styles.join("; ");

    // Add type-specific styling with modern colors
    if (type === "success") {
      toast.style.backgroundColor = "#f0fdf4 !important";
      toast.style.borderColor = "#22c55e !important";
      toast.style.borderLeftWidth = "4px !important";
      toast.style.borderLeftColor = "#16a34a !important";
    } else if (type === "error") {
      toast.style.backgroundColor = "#fef2f2 !important";
      toast.style.borderColor = "#ef4444 !important";
      toast.style.borderLeftWidth = "4px !important";
      toast.style.borderLeftColor = "#dc2626 !important";
    } else {
      toast.style.backgroundColor = "#eff6ff !important";
      toast.style.borderColor = "#3b82f6 !important";
      toast.style.borderLeftWidth = "4px !important";
      toast.style.borderLeftColor = "#2563eb !important";
    }

    // Modern, beautiful innerHTML
    toast.innerHTML = `
            <div style="
                font-size: 18px; 
                flex-shrink: 0; 
                margin-top: 2px;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
            ">${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</div>
            <div style="
                flex: 1; 
                min-width: 0;
                line-height: 1.4;
                font-weight: 500;
                color: #374151;
            ">${message}</div>
            <button onclick="this.closest('[data-toast]').remove()" style="
                background: none; 
                border: none; 
                color: #9ca3af;
                font-size: 18px; 
                cursor: pointer; 
                padding: 4px;
                border-radius: 6px;
                transition: all 0.2s ease;
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            " onmouseover="this.style.backgroundColor='#f3f4f6'; this.style.color='#6b7280';" 
               onmouseout="this.style.backgroundColor='transparent'; this.style.color='#9ca3af';">×</button>
        `;

    console.log("About to append toast to body...");

    // Append to body
    document.body.appendChild(toast);

    console.log("Toast appended. Element:", toast);
    console.log("Toast style.cssText:", toast.style.cssText);

    // Double check it's in DOM
    setTimeout(() => {
      const toastInDOM = document.querySelector('[data-toast="true"]');
      console.log("Toast found in DOM:", toastInDOM);
      if (toastInDOM) {
        const rect = toastInDOM.getBoundingClientRect();
        console.log("Toast getBoundingClientRect:", rect);
        console.log("Toast offsetParent:", toastInDOM.offsetParent);
        console.log("Toast computed display:", window.getComputedStyle(toastInDOM).display);
        console.log("Toast computed visibility:", window.getComputedStyle(toastInDOM).visibility);
        console.log("Toast computed opacity:", window.getComputedStyle(toastInDOM).opacity);
        console.log("Toast computed position:", window.getComputedStyle(toastInDOM).position);
        console.log("Toast computed z-index:", window.getComputedStyle(toastInDOM).zIndex);
      } else {
        console.error("Toast NOT found in DOM!");
      }
    }, 200);

    // Auto remove after 8 seconds
    setTimeout(() => {
      console.log("Auto-removing toast");
      if (toast.parentElement) {
        toast.remove();
      }
    }, 8000);

    return toast;
  }

  // Event binding methods
  bindTransactionEvents() {}
  bindAccountEvents() {}
  bindGoalEvents() {}

  // Update methods
  updateUserBalance() {
    const userBalance = document.querySelector(".user-balance");
    if (userBalance) {
      userBalance.textContent = this.budgetManager.formatCurrency(this.budgetManager.getTotalBalance());
    }
  }

  handleResize() {
    if (window.innerWidth > 768) {
      this.closeMobileSidebar();
    }
  }

  // Demo data method
  loadDemoData() {
    if (confirm("Ini akan mengganti semua data yang ada dengan data demo. Lanjutkan?")) {
      try {
        this.budgetManager.generateDemoData();
        this.showToast(
          "Data demo berhasil dimuat! Silakan cek semua halaman untuk melihat fitur-fitur analisis.",
          "success"
        );
        this.render();
        this.updateUserBalance();
        // Refresh all cached data
        this.preloadData();
      } catch (error) {
        this.showToast("Gagal memuat data demo: " + error.message, "error");
      }
    }
  }

  // Placeholder methods for budget features
  showBudgetHistoryModal() {
    this.showToast("Fitur riwayat budget akan segera hadir!", "info");
  }

  exportBudgetReport() {
    this.showToast("Fitur export laporan sedang dikembangkan!", "info");
  }

  // Reset all data method for UI
  resetAllData() {
    if (
      confirm(
        "⚠️ PERINGATAN: Ini akan menghapus SEMUA data (akun, transaksi, target, budget). Yakin ingin melanjutkan?"
      )
    ) {
      if (confirm("Konfirmasi sekali lagi: Semua data akan hilang permanen. Lanjutkan?")) {
        try {
          this.budgetManager.resetAllData();
          this.showToast("Semua data berhasil dihapus! Aplikasi kembali ke kondisi awal.", "success");
          this.render();
          this.updateUserBalance();
          // Refresh all cached data
          this.preloadData();
        } catch (error) {
          this.showToast("Gagal reset data: " + error.message, "error");
        }
      }
    }
  }
}

// ===== MODERN UI MANAGEMENT WITH SMOOTH NAVIGATION =====
class ModernBudgetUI {
  constructor() {
    this.budgetManager = new BudgetManager();
    this.currentView = "dashboard";
    this.isTransitioning = false;
    this.analyticsMode = "overview"; // overview, patterns, predictions, budget
    this.init();
  }

  init() {
    this.createLayout();
    this.bindEvents();
    this.initializeTheme();
    this.render();
    this.preloadData();
  }

  createLayout() {
    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="app-container">
                <!-- Enhanced Mobile Header -->
                <header class="mobile-header">
                    <button class="mobile-menu-toggle" id="mobileMenuToggle">
                        <div class="hamburger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                    <div class="mobile-logo">
                        <div class="logo-icon">💰</div>
                        <div class="logo-text">BudgetPro</div>
                    </div>
                    <div class="mobile-actions">
                        <button class="theme-toggle" id="themeToggle">🌙</button>
                        <button class="mobile-add-btn" id="mobileAddBtn">
                            <span class="add-icon">+</span>
                        </button>
                    </div>
                </header>

                <!-- Enhanced Sidebar with Smooth Navigation -->
                <aside class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <div class="logo">
                            <div class="logo-icon">💰</div>
                            <div class="logo-content">
                                <div class="logo-text">Keuangan Kita</div>
                                <div class="logo-subtitle">Masa Depan Lebih Baik</div>
                            </div>
                        </div>
                    </div>
                    
                    <nav class="sidebar-nav">
                        <div class="nav-section">
                            <div class="nav-section-title">Menu Utama</div>
                            <a href="#" class="nav-item active" data-view="dashboard">
                                <div class="nav-icon">📊</div>
                                <div class="nav-content">
                                    <div class="nav-text">Dashboard</div>
                                    <div class="nav-desc">Ringkasan keuangan</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                            <a href="#" class="nav-item" data-view="transactions">
                                <div class="nav-icon">💳</div>
                                <div class="nav-content">
                                    <div class="nav-text">Transaksi</div>
                                    <div class="nav-desc">Kelola pemasukan & pengeluaran</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                            <a href="#" class="nav-item" data-view="accounts">
                                <div class="nav-icon">🏦</div>
                                <div class="nav-content">
                                    <div class="nav-text">Akun</div>
                                    <div class="nav-desc">Dompet & rekening</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                            <a href="#" class="nav-item" data-view="goals">
                                <div class="nav-icon">🎯</div>
                                <div class="nav-content">
                                    <div class="nav-text">Target</div>
                                    <div class="nav-desc">Sasaran keuangan</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                        </div>
                        
                        <div class="nav-section">
                            <div class="nav-section-title">Analytics</div>
                            <a href="#" class="nav-item" data-view="analytics">
                                <div class="nav-icon">📈</div>
                                <div class="nav-content">
                                    <div class="nav-text">Analisis</div>
                                    <div class="nav-desc">Laporan & prediksi</div>
                                </div>
                                <div class="nav-indicator"></div>
                            </a>
                        </div>
                    </nav>

                    <div class="sidebar-footer">
                        <div class="user-profile">
                            <div class="user-avatar">👤</div>
                            <div class="user-info">
                                <div class="user-name">Pengguna</div>
                                <div class="user-balance">${this.budgetManager.formatCurrency(
                                  this.budgetManager.getTotalBalance()
                                )}</div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Enhanced Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay"></div>

                <!-- Main Content with Smooth Transitions -->
                <main class="main-content">
                    <header class="main-header">
                        <div class="header-left">
                            <h1 class="page-title">Dashboard</h1>
                            <div class="page-breadcrumb">
                                <span class="breadcrumb-item active">Dashboard</span>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="header-stats">
                                <div class="quick-stat">
                                    <div class="quick-stat-value">${this.budgetManager.formatCurrency(
                                      this.budgetManager.getTotalBalance()
                                    )}</div>
                                    <div class="quick-stat-label">Total Saldo</div>
                                </div>
                            </div>
                            <button class="btn btn-primary desktop-only" id="addTransactionBtn">
                                <span class="btn-icon">+</span>
                                <span class="btn-text">Tambah Transaksi</span>
                            </button>
                            <button class="theme-toggle desktop-only" id="desktopThemeToggle">🌙</button>
                        </div>
                    </header>

                    <!-- Content Area with Page Transitions -->
                    <div class="content-wrapper">
                        <div class="content-area" id="contentArea">
                            <!-- Content will be injected here -->
                        </div>
                    </div>
                </main>

                <!-- Enhanced Bottom Navigation for Mobile -->
                <nav class="bottom-nav">
                    <a href="#" class="bottom-nav-item active" data-view="dashboard">
                        <div class="bottom-nav-icon">📊</div>
                        <div class="bottom-nav-text">Dashboard</div>
                    </a>
                    <a href="#" class="bottom-nav-item" data-view="transactions">
                        <div class="bottom-nav-icon">💳</div>
                        <div class="bottom-nav-text">Transaksi</div>
                    </a>
                    <a href="#" class="bottom-nav-item" data-view="accounts">
                        <div class="bottom-nav-icon">🏦</div>
                        <div class="bottom-nav-text">Akun</div>
                    </a>
                    <a href="#" class="bottom-nav-item" data-view="goals">
                        <div class="bottom-nav-icon">🎯</div>
                        <div class="bottom-nav-text">Target</div>
                    </a>
                    <a href="#" class="bottom-nav-item" data-view="analytics">
                        <div class="bottom-nav-icon">📈</div>
                        <div class="bottom-nav-text">Analisis</div>
                    </a>
                </nav>

                <!-- Loading Overlay -->
                <div class="loading-overlay" id="loadingOverlay">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <div class="loading-text">Memuat...</div>
                    </div>
                </div>

                <!-- Modal Container -->
                <div class="modal-container" id="modalContainer">
                    <!-- Modals will be injected here -->
                </div>

                <!-- Toast Container -->
                <div class="toast-container" id="toastContainer">
                    <!-- Toast notifications will appear here -->
                </div>
            </div>
        `;
  }

  bindEvents() {
    // Enhanced Navigation with Smooth Transitions
    document.addEventListener("click", (e) => {
      const navItem = e.target.closest(".nav-item, .bottom-nav-item");
      if (navItem && !this.isTransitioning) {
        e.preventDefault();
        const view = navItem.dataset.view;
        if (view && view !== this.currentView) {
          this.smoothSwitchView(view);
        }
      }

      // Analytics sub-navigation
      const analyticsTab = e.target.closest(".analytics-tab");
      if (analyticsTab) {
        e.preventDefault();
        this.switchAnalyticsMode(analyticsTab.dataset.mode);
      }

      // Modal handlers
      if (e.target.closest(".modal-close, .modal-backdrop")) {
        this.hideModal();
      }

      // Action buttons
      if (e.target.closest("#addTransactionBtn, #mobileAddBtn")) {
        this.showQuickAddModal();
      }

      if (e.target.closest("#themeToggle, #desktopThemeToggle")) {
        this.toggleTheme();
      }
    });

    // Mobile menu toggle
    document.getElementById("mobileMenuToggle").addEventListener("click", () => {
      this.toggleMobileSidebar();
    });

    // Sidebar overlay
    document.getElementById("sidebarOverlay").addEventListener("click", () => {
      this.closeMobileSidebar();
    });

    // Enhanced Swipe Gestures
    this.initSwipeGestures();

    // Keyboard Shortcuts
    this.initKeyboardShortcuts();

    // Window resize handler
    window.addEventListener("resize", () => {
      this.handleResize();
    });
  }

  initSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let isHorizontalSwipe = false;

    document.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isHorizontalSwipe = false;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!startX || !startY) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);

        if (diffX > diffY && diffX > 30) {
          isHorizontalSwipe = true;
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      (e) => {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (isHorizontalSwipe) {
          // Swipe right from left edge to open sidebar
          if (diffX > 100 && startX < 50 && window.innerWidth <= 768) {
            this.openMobileSidebar();
          }
          // Swipe left to close sidebar
          else if (diffX < -100) {
            this.closeMobileSidebar();
          }
          // Swipe navigation between views
          else if (Math.abs(diffX) > 120) {
            this.handleSwipeNavigation(diffX > 0 ? "right" : "left");
          }
        }

        startX = 0;
        startY = 0;
        isHorizontalSwipe = false;
      },
      { passive: true }
    );
  }

  initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            this.smoothSwitchView("dashboard");
            break;
          case "2":
            e.preventDefault();
            this.smoothSwitchView("transactions");
            break;
          case "3":
            e.preventDefault();
            this.smoothSwitchView("accounts");
            break;
          case "4":
            e.preventDefault();
            this.smoothSwitchView("goals");
            break;
          case "5":
            e.preventDefault();
            this.smoothSwitchView("analytics");
            break;
          case "n":
            e.preventDefault();
            this.showQuickAddModal();
            break;
        }
      }

      if (e.key === "Escape") {
        this.hideModal();
      }
    });
  }

  handleSwipeNavigation(direction) {
    const views = ["dashboard", "transactions", "accounts", "goals", "analytics"];
    const currentIndex = views.indexOf(this.currentView);

    if (direction === "left" && currentIndex < views.length - 1) {
      this.smoothSwitchView(views[currentIndex + 1]);
    } else if (direction === "right" && currentIndex > 0) {
      this.smoothSwitchView(views[currentIndex - 1]);
    }
  }

  smoothSwitchView(view) {
    if (this.isTransitioning || view === this.currentView) return;

    this.isTransitioning = true;
    this.showLoadingOverlay();

    // Update navigation states with animation
    this.updateNavigationStates(view);

    // Animate out current content
    const contentArea = document.getElementById("contentArea");
    contentArea.style.opacity = "0";
    contentArea.style.transform = "translateY(20px)";

    setTimeout(() => {
      this.currentView = view;
      this.updatePageHeader(view);
      this.render();

      // Animate in new content
      setTimeout(() => {
        contentArea.style.opacity = "1";
        contentArea.style.transform = "translateY(0)";
        this.hideLoadingOverlay();
        this.isTransitioning = false;
      }, 150);
    }, 200);
  }

  updateNavigationStates(view) {
    // Update sidebar navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.view === view) {
        item.classList.add("active");
      }
    });

    // Update bottom navigation
    document.querySelectorAll(".bottom-nav-item").forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.view === view) {
        item.classList.add("active");
      }
    });

    // Close mobile sidebar if open
    this.closeMobileSidebar();
  }

  updatePageHeader(view) {
    const titles = {
      dashboard: "Dashboard",
      transactions: "Transaksi",
      accounts: "Akun",
      goals: "Target",
      analytics: "Analisis",
    };

    const breadcrumbs = {
      dashboard: ["Dashboard"],
      transactions: ["Transaksi", "Kelola Transaksi"],
      accounts: ["Akun", "Kelola Akun"],
      goals: ["Target", "Sasaran Keuangan"],
      analytics: ["Analisis", "Laporan & Prediksi"],
    };

    document.querySelector(".page-title").textContent = titles[view];

    const breadcrumbContainer = document.querySelector(".page-breadcrumb");
    breadcrumbContainer.innerHTML = breadcrumbs[view]
      .map((item, index) => {
        const isLast = index === breadcrumbs[view].length - 1;
        return `<span class="breadcrumb-item ${isLast ? "active" : ""}">${item}</span>`;
      })
      .join('<span class="breadcrumb-separator">›</span>');
  }

  // Theme Management
  initializeTheme() {
    const savedTheme = localStorage.getItem("budgetTheme") || "light";
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("budgetTheme", theme);

    // Update theme toggle icons
    const themeIcons = document.querySelectorAll("#themeToggle, #desktopThemeToggle");
    themeIcons.forEach((icon) => {
      icon.textContent = theme === "dark" ? "☀️" : "🌙";
    });
  }

  // Mobile Navigation
  toggleMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (sidebar.classList.contains("open")) {
      this.closeMobileSidebar();
    } else {
      this.openMobileSidebar();
    }
  }

  openMobileSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebarOverlay").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeMobileSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("active");
    document.body.style.overflow = "";
  }

  // Loading Management
  showLoadingOverlay() {
    document.getElementById("loadingOverlay").classList.add("active");
  }

  hideLoadingOverlay() {
    document.getElementById("loadingOverlay").classList.remove("active");
  }

  // Data Preloading
  preloadData() {
    // Preload frequently used data
    this.cachedStats = this.budgetManager.getMonthlyStats();
    this.cachedWeeklyTrend = this.budgetManager.getWeeklyTrend();
    this.cachedPredictions = this.budgetManager.getPredictiveAnalysis();
  }

  // Render Methods
  render() {
    const contentArea = document.getElementById("contentArea");

    switch (this.currentView) {
      case "dashboard":
        contentArea.innerHTML = this.renderDashboard();
        this.animateStatistics();
        break;
      case "transactions":
        contentArea.innerHTML = this.renderTransactions();
        this.bindTransactionEvents();
        break;
      case "accounts":
        contentArea.innerHTML = this.renderAccounts();
        this.bindAccountEvents();
        break;
      case "goals":
        contentArea.innerHTML = this.renderGoals();
        this.bindGoalEvents();
        break;
      case "analytics":
        contentArea.innerHTML = this.renderAdvancedAnalytics();
        this.initializeAnalyticsCharts();
        break;
    }

    // Update user balance in sidebar
    this.updateUserBalance();
  }

  renderDashboard() {
    const stats = this.budgetManager.getMonthlyStats();
    const totalBalance = this.budgetManager.getTotalBalance();
    const recentTransactions = this.budgetManager.data.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return `
            <div class="dashboard-container">
                <!-- Enhanced Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(totalBalance)}</div>
                            <div class="stat-label">Total Saldo</div>
                            <div class="stat-trend ${totalBalance >= 0 ? "positive" : "negative"}">
                                ${totalBalance >= 0 ? "📈" : "📉"} ${totalBalance >= 0 ? "Stabil" : "Perlu Perhatian"}
                    </div>
                </div>
                    </div>
                    
                    <div class="stat-card success">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(stats.income)}</div>
                            <div class="stat-label">Pemasukan Bulan Ini</div>
                            <div class="stat-trend positive">+${stats.transactionCount} transaksi</div>
                    </div>
                </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-icon">💸</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(stats.expense)}</div>
                            <div class="stat-label">Pengeluaran Bulan Ini</div>
                            <div class="stat-trend">Rata-rata ${this.budgetManager.formatCurrency(
                              stats.expense / new Date().getDate()
                            )}/hari</div>
                    </div>
                </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">💾</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(stats.balance)}</div>
                            <div class="stat-label">Selisih Bulan Ini</div>
                            <div class="stat-trend ${stats.balance >= 0 ? "positive" : "negative"}">
                                ${stats.balance >= 0 ? "Surplus" : "Defisit"}
                    </div>
                        </div>
                </div>
            </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <h3 class="section-title">Aksi Cepat</h3>
                    <div class="action-grid">
                        <button class="action-btn" onclick="app.showQuickAddModal('income')">
                            <div class="action-icon">💰</div>
                            <div class="action-text">Tambah Pemasukan</div>
                        </button>
                        <button class="action-btn" onclick="app.showQuickAddModal('expense')">
                            <div class="action-icon">💸</div>
                            <div class="action-text">Tambah Pengeluaran</div>
                        </button>
                        <button class="action-btn" onclick="app.showAddAccountModal()">
                            <div class="action-icon">🏦</div>
                            <div class="action-text">Tambah Akun</div>
                        </button>
                        <button class="action-btn demo" onclick="app.loadDemoData()" title="Muat data demo untuk testing">
                            <div class="action-icon">🎲</div>
                            <div class="action-text">Data Demo</div>
                        </button>
                        <button class="action-btn reset" onclick="app.resetAllData()" title="Reset semua data">
                            <div class="action-icon">🗑️</div>
                            <div class="action-text">Reset Data</div>
                        </button>
                        <button class="action-btn" onclick="app.smoothSwitchView('analytics')">
                            <div class="action-icon">📊</div>
                            <div class="action-text">Lihat Analisis</div>
                        </button>
                    </div>
                </div>

                <!-- Recent Transactions -->
                <div class="recent-section">
                    <div class="section-header">
                        <h3 class="section-title">Transaksi Terbaru</h3>
                        <button class="section-action" onclick="app.smoothSwitchView('transactions')">
                            Lihat Semua →
                        </button>
                    </div>
                    <div class="transaction-list">
                    ${
                      recentTransactions.length === 0
                        ? '<div class="empty-state">Belum ada transaksi</div>'
                        : recentTransactions.map((t) => this.renderTransactionItem(t)).join("")
                    }
                    </div>
                </div>
            </div>
        `;
  }

  renderTransactionItem(transaction) {
    const category = this.budgetManager.getCategoryById(transaction.categoryId);
    return `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-icon">${category?.icon || "💳"}</div>
                <div class="transaction-details">
                    <div class="transaction-name">${transaction.description || category?.name}</div>
                    <div class="transaction-date">${new Date(transaction.date).toLocaleDateString("id-ID")}</div>
                                            </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === "income" ? "+" : "-"}${this.budgetManager.formatCurrency(transaction.amount)}
                                            </div>
                                        </div>
        `;
  }

  renderAdvancedAnalytics() {
    return `
            <div class="analytics-container">
                <!-- Analytics Navigation -->
                <div class="analytics-nav">
                    <button class="analytics-tab ${
                      this.analyticsMode === "overview" ? "active" : ""
                    }" data-mode="overview">
                        <span class="tab-icon">📊</span>
                        <span class="tab-text">Ringkasan</span>
                        </button>
                    <button class="analytics-tab ${
                      this.analyticsMode === "patterns" ? "active" : ""
                    }" data-mode="patterns">
                        <span class="tab-icon">🔍</span>
                        <span class="tab-text">Pola Pengeluaran</span>
                        </button>
                    <button class="analytics-tab ${
                      this.analyticsMode === "predictions" ? "active" : ""
                    }" data-mode="predictions">
                        <span class="tab-icon">🔮</span>
                        <span class="tab-text">Prediksi</span>
                    </button>
                    <button class="analytics-tab ${this.analyticsMode === "budget" ? "active" : ""}" data-mode="budget">
                        <span class="tab-icon">🎯</span>
                        <span class="tab-text">Budget</span>
                        </button>
                    </div>

                <!-- Analytics Content -->
                <div class="analytics-content" id="analyticsContent">
                    ${this.renderAnalyticsContent()}
                </div>
            </div>
        `;
  }

  renderAnalyticsContent() {
    switch (this.analyticsMode) {
      case "overview":
        return this.renderAnalyticsOverview();
      case "patterns":
        return this.renderExpensePatterns();
      case "predictions":
        return this.renderPredictiveAnalysis();
      case "budget":
        return this.renderBudgetAnalysis();
      default:
        return this.renderAnalyticsOverview();
    }
  }

  renderAnalyticsOverview() {
    const stats = this.budgetManager.getMonthlyStats();
    const weeklyTrend = this.budgetManager.getWeeklyTrend();
    const categoryExpenses = this.budgetManager.getCategoryExpenses();
    const healthScore = this.calculateHealthScore(stats);

    return `
            <!-- Health Score -->
            <div class="analytics-section">
                <h3 class="section-title">🏥 Kesehatan Keuangan</h3>
                <div class="health-dashboard">
                    <div class="health-score-circle">
                        <div class="score-value">${healthScore}</div>
                        <div class="score-label">Skor</div>
                </div>
                    <div class="health-indicators">
                        ${this.renderHealthIndicators(stats)}
                                        </div>
                                        </div>
                                    </div>

            <!-- Weekly Trend Chart -->
            <div class="analytics-section">
                <h3 class="section-title">📈 Trend Mingguan</h3>
                <div class="chart-container">
                    <div class="weekly-chart" id="weeklyChart">
                        ${weeklyTrend
                          .map((week, index) => {
                            const maxIncome = Math.max(...weeklyTrend.map((w) => w.income));
                            const maxExpense = Math.max(...weeklyTrend.map((w) => w.expense));
                            const maxValue = Math.max(maxIncome, maxExpense);

                            const incomeHeight = maxValue > 0 ? (week.income / maxValue) * 100 : 0;
                            const expenseHeight = maxValue > 0 ? (week.expense / maxValue) * 100 : 0;

                            return `
                                <div class="week-bar" data-week="${week.week}">
                                    <div class="bar-container">
                                        <div class="bar income-bar" 
                                             style="height: ${Math.max(incomeHeight, 2)}%"
                                             title="Pemasukan: ${this.budgetManager.formatCurrency(week.income)}"></div>
                                        <div class="bar expense-bar" 
                                             style="height: ${Math.max(expenseHeight, 2)}%"
                                             title="Pengeluaran: ${this.budgetManager.formatCurrency(
                                               week.expense
                                             )}"></div>
                                        </div>
                                    <div class="week-label">${week.week}</div>
                                    <div class="week-summary">
                                        <div class="week-income">+${this.budgetManager.formatCurrency(
                                          week.income
                                        )}</div>
                                        <div class="week-expense">-${this.budgetManager.formatCurrency(
                                          week.expense
                                        )}</div>
                                    </div>
                                </div>
                            `;
                          })
                          .join("")}
            </div>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color income"></div>
                            <span>Pemasukan</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color expense"></div>
                            <span>Pengeluaran</span>
                        </div>
                    </div>
                    <div class="chart-summary">
                        <div class="summary-item">
                            <span class="summary-label">Rata-rata Pemasukan:</span>
                            <span class="summary-value income">${this.budgetManager.formatCurrency(
                              weeklyTrend.reduce((sum, w) => sum + w.income, 0) / weeklyTrend.length
                            )}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Rata-rata Pengeluaran:</span>
                            <span class="summary-value expense">${this.budgetManager.formatCurrency(
                              weeklyTrend.reduce((sum, w) => sum + w.expense, 0) / weeklyTrend.length
                            )}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Category Distribution -->
            <div class="analytics-section">
                <h3 class="section-title">🥧 Distribusi Pengeluaran</h3>
                <div class="category-distribution">
                    ${
                      Object.entries(categoryExpenses).length === 0
                        ? '<div class="empty-state">Belum ada data pengeluaran</div>'
                        : Object.entries(categoryExpenses)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 6)
                            .map(([categoryName, amount], index) => {
                              const percentage = stats.expense > 0 ? (amount / stats.expense) * 100 : 0;
                              const category = this.budgetManager.data.categories.find(
                                (cat) => cat.name === categoryName
                              );
                              return `
                                    <div class="category-item" style="--delay: ${index * 0.1}s">
                                        <div class="category-header">
                                            <div class="category-info">
                                                <span class="category-icon">${category?.icon || "📝"}</span>
                                                <span class="category-name">${categoryName}</span>
                </div>
                                            <div class="category-stats">
                                                <span class="category-amount">${this.budgetManager.formatCurrency(
                                                  amount
                                                )}</span>
                                                <span class="category-percentage">${percentage.toFixed(1)}%</span>
                                                </div>
                                                </div>
                                        <div class="category-progress">
                                            <div class="progress-fill" 
                                                 style="width: ${percentage}%; background: ${
                                category?.color || "#A29BFE"
                              }"></div>
                                            </div>
                                            </div>
                                    `;
                            })
                            .join("")
                    }
                </div>
            </div>
        `;
  }

  renderExpensePatterns() {
    const patterns = this.budgetManager.getExpensePatterns();

    return `
            <div class="patterns-container">
                <!-- Day of Week Analysis -->
                <div class="analytics-section">
                    <h3 class="section-title">📅 Pola Pengeluaran Harian</h3>
                    <div class="day-pattern-chart" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; padding: 20px; background: ${
                      document.body.classList.contains("dark-theme")
                        ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                        : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
                    }; border: 1px solid ${
      document.body.classList.contains("dark-theme") ? "#6b7280" : "#e2e8f0"
    }; border-radius: 16px; margin-bottom: 20px;">
                        ${Object.entries(patterns.dayOfWeek)
                          .map(([day, amount]) => {
                            const maxAmount = Math.max(...Object.values(patterns.dayOfWeek));
                            const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                            const isDark = document.body.classList.contains("dark-theme");
                            return `
                                <div class="day-bar" style="display: flex; flex-direction: column; align-items: center; padding: 12px; border-radius: 12px; background: ${
                                  isDark ? "#1f2937" : "#ffffff"
                                }; box-shadow: ${isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.1)"};">
                                    <div class="bar-container" style="width: 100%; height: 100px; position: relative; background: ${
                                      isDark ? "#374151" : "#f3f4f6"
                                    }; border-radius: 8px; overflow: hidden; margin-bottom: 8px; display: flex; align-items: flex-end; justify-content: center;">
                                        <div class="bar-fill" style="width: 60%; height: ${Math.max(
                                          percentage,
                                          5
                                        )}%; background: linear-gradient(0deg, #3b82f6 0%, #60a5fa 100%); border-radius: 4px 4px 0 0; transition: height 1s ease;"></div>
                                        </div>
                                    <div class="day-label" style="font-size: 12px; font-weight: 600; margin-bottom: 4px; color: ${
                                      isDark ? "#f9fafb" : "#1f2937"
                                    };">${day}</div>
                                    <div class="day-amount" style="font-size: 10px; color: ${
                                      isDark ? "#d1d5db" : "#6b7280"
                                    }; text-align: center; line-height: 1.2;">${this.budgetManager.formatCurrency(
                              amount
                            )}</div>
                                        </div>
                            `;
                          })
                          .join("")}
                                        </div>
                    ${
                      patterns.mostExpensiveDay
                        ? `
                        <div class="pattern-insight" style="padding: 16px; background: ${
                          document.body.classList.contains("dark-theme") ? "#1e3a8a" : "#eff6ff"
                        }; border-radius: 12px; border-left: 4px solid #3b82f6;">
                            <span class="insight-icon">💡</span>
                            <span class="insight-text" style="color: ${
                              document.body.classList.contains("dark-theme") ? "#dbeafe" : "#1e40af"
                            };">Hari dengan pengeluaran terbesar: <strong>${
                            patterns.mostExpensiveDay[0]
                          }</strong> (${this.budgetManager.formatCurrency(patterns.mostExpensiveDay[1])})</span>
                                        </div>
                    `
                        : ""
                    }
                                    </div>

                <!-- Spending Categories Timeline -->
                <div class="analytics-section">
                    <h3 class="section-title">⏰ Timeline Pengeluaran</h3>
                    <div class="timeline-chart">
                        ${this.renderSpendingTimeline()}
                                    </div>
                </div>

                <!-- Top Spending Analysis -->
                <div class="analytics-section">
                    <h3 class="section-title">🔥 Analisis Pengeluaran Tertinggi</h3>
                    <div class="top-spending-analysis">
                        ${this.renderTopSpendingAnalysis()}
                    </div>
                </div>
            </div>
        `;
  }

  renderPredictiveAnalysis() {
    const predictions = this.budgetManager.getPredictiveAnalysis();

    return `
            <div class="predictions-container">
                <!-- Next Month Prediction -->
                <div class="analytics-section">
                    <h3 class="section-title">🔮 Prediksi Bulan Depan</h3>
                    <div class="prediction-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
                        <div class="prediction-card income" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; padding: 24px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="prediction-icon" style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">💰</div>
                            <div class="prediction-content">
                                <div class="prediction-value" style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">${this.budgetManager.formatCurrency(
                                  predictions.predictedIncome
                                )}</div>
                                <div class="prediction-label" style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Prediksi Pemasukan</div>
                                <div class="prediction-change ${
                                  predictions.incomeGrowth >= 0 ? "positive" : "negative"
                                }" style="font-size: 13px; padding: 6px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; display: inline-block;">
                                    ${predictions.incomeGrowth >= 0 ? "📈" : "📉"} ${Math.abs(
      predictions.incomeGrowth
    ).toFixed(1)}% dari bulan lalu
                        </div>
                    </div>
                </div>

                        <div class="prediction-card expense" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 16px; padding: 24px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="prediction-icon" style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">💸</div>
                            <div class="prediction-content">
                                <div class="prediction-value" style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">${this.budgetManager.formatCurrency(
                                  predictions.predictedExpense
                                )}</div>
                                <div class="prediction-label" style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Prediksi Pengeluaran</div>
                                <div class="prediction-change ${
                                  predictions.expenseGrowth <= 0 ? "positive" : "negative"
                                }" style="font-size: 13px; padding: 6px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; display: inline-block;">
                                    ${predictions.expenseGrowth >= 0 ? "📈" : "📉"} ${Math.abs(
      predictions.expenseGrowth
    ).toFixed(1)}% dari bulan lalu
                        </div>
                    </div>
                </div>

                        <div class="prediction-card balance" style="background: linear-gradient(135deg, ${
                          predictions.predictedBalance >= 0 ? "#3b82f6" : "#f59e0b"
                        } 0%, ${
      predictions.predictedBalance >= 0 ? "#2563eb" : "#d97706"
    } 100%); border-radius: 16px; padding: 24px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(${
      predictions.predictedBalance >= 0 ? "59, 130, 246" : "245, 158, 11"
    }, 0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="prediction-icon" style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">⚖️</div>
                            <div class="prediction-content">
                                <div class="prediction-value" style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">${this.budgetManager.formatCurrency(
                                  Math.abs(predictions.predictedBalance)
                                )}</div>
                                <div class="prediction-label" style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Prediksi Saldo</div>
                                <div class="prediction-change ${
                                  predictions.predictedBalance >= 0 ? "positive" : "negative"
                                }" style="font-size: 13px; padding: 6px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; display: inline-block;">
                                    ${predictions.predictedBalance >= 0 ? "✅ Surplus" : "⚠️ Defisit"}
                        </div>
                    </div>
                        </div>
                </div>

                    <div class="prediction-summary" style="background: ${
                      document.body.classList.contains("dark-theme")
                        ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                        : "linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)"
                    }; border: 1px solid ${
      document.body.classList.contains("dark-theme") ? "#6b7280" : "#e2e8f0"
    }; border-radius: 16px; padding: 20px; margin-top: 20px;">
                        <h4 style="margin: 0 0 16px 0; color: ${
                          document.body.classList.contains("dark-theme") ? "#f9fafb" : "#1f2937"
                        }; font-size: 16px; font-weight: 600;">📊 Ringkasan Prediksi</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <div style="text-align: center;">
                                <div style="font-size: 14px; color: ${
                                  document.body.classList.contains("dark-theme") ? "#d1d5db" : "#6b7280"
                                }; margin-bottom: 4px;">Rata-rata Pemasukan</div>
                                <div style="font-size: 18px; font-weight: 600; color: #10b981;">${this.budgetManager.formatCurrency(
                                  predictions.avgIncome
                                )}</div>
                        </div>
                            <div style="text-align: center;">
                                <div style="font-size: 14px; color: ${
                                  document.body.classList.contains("dark-theme") ? "#d1d5db" : "#6b7280"
                                }; margin-bottom: 4px;">Rata-rata Pengeluaran</div>
                                <div style="font-size: 18px; font-weight: 600; color: #ef4444;">${this.budgetManager.formatCurrency(
                                  predictions.avgExpense
                                )}</div>
                    </div>
                            <div style="text-align: center;">
                                <div style="font-size: 14px; color: ${
                                  document.body.classList.contains("dark-theme") ? "#d1d5db" : "#6b7280"
                                }; margin-bottom: 4px;">Tingkat Akurasi</div>
                                <div style="font-size: 18px; font-weight: 600; color: #3b82f6;">85%</div>
                            </div>
                        </div>
                </div>
            </div>

                <!-- AI Recommendations -->
                <div class="analytics-section">
                    <h3 class="section-title">🤖 Rekomendasi AI</h3>
                    <div class="recommendations">
                        ${predictions.recommendation
                          .map(
                            (rec) => `
                            <div class="recommendation-item ${rec.type}">
                                <div class="rec-icon">${rec.icon}</div>
                                <div class="rec-content">
                                    <div class="rec-title">${rec.title}</div>
                                    <div class="rec-description">${rec.description}</div>
                        </div>
                    </div>
                        `
                          )
                          .join("")}
                                                </div>
                                                </div>

                <!-- Trend Analysis -->
                <div class="analytics-section">
                    <h3 class="section-title">📊 Analisis Trend</h3>
                    <div class="trend-analysis">
                        ${this.renderTrendAnalysis(predictions)}
                                            </div>
                                            </div>
                                        </div>
                                    `;
  }

  renderBudgetAnalysis() {
    const budgetAnalysis = this.budgetManager.getCategoryBudgetAnalysis();

    return `
            <div class="budget-container">
                <!-- Budget Overview -->
                <div class="analytics-section">
                    <div class="section-header">
                        <h3 class="section-title">🎯 Ringkasan Budget</h3>
                        <button class="btn btn-primary" onclick="app.showSetBudgetModal()">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Atur Budget</span>
                        </button>
                </div>

                    <div class="budget-overview">
                        ${
                          budgetAnalysis.length === 0
                            ? `<div class="empty-state">
                                <div class="empty-icon">📊</div>
                                <div class="empty-title">Belum ada budget yang ditetapkan</div>
                                <div class="empty-description">Mulai atur budget untuk kategori pengeluaran Anda</div>
                                <button class="btn btn-primary" onclick="app.showSetBudgetModal()">
                                    <span class="btn-icon">🎯</span>
                                    <span class="btn-text">Atur Budget Pertama</span>
                                </button>
                            </div>`
                            : budgetAnalysis
                                .map((category) => {
                                  const isDark = document.body.classList.contains("dark-theme");
                                  const cardBg = isDark
                                    ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                                    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)";
                                  const cardBorder = isDark ? "#6b7280" : "#e2e8f0";
                                  const cardShadow = isDark
                                    ? "0 4px 15px rgba(0, 0, 0, 0.3)"
                                    : "0 4px 15px rgba(0, 0, 0, 0.1)";
                                  const textPrimary = isDark ? "#f9fafb" : "#1f2937";
                                  const textSecondary = isDark ? "#d1d5db" : "#6b7280";
                                  const progressBg = isDark ? "#4b5563" : "#e5e7eb";

                                  const statusColors = {
                                    good: {
                                      primary: "#10b981",
                                      light: isDark ? "#86efac" : "#16a34a",
                                      bg: isDark ? "#14532d" : "#f0fdf4",
                                    },
                                    warning: {
                                      primary: "#f59e0b",
                                      light: isDark ? "#fbbf24" : "#d97706",
                                      bg: isDark ? "#78350f" : "#fffbeb",
                                    },
                                    over: {
                                      primary: "#ef4444",
                                      light: isDark ? "#fca5a5" : "#dc2626",
                                      bg: isDark ? "#7f1d1d" : "#fef2f2",
                                    },
                                  };

                                  const statusColor = statusColors[category.status] || statusColors.good;

                                  return `
                                <div class="budget-category-card ${category.status}" style="
                                    background: ${cardBg};
                                    border: 1px solid ${cardBorder};
                                    border-radius: 16px;
                                    padding: 20px;
                                    margin-bottom: 16px;
                                    box-shadow: ${cardShadow};
                                    transition: all 0.3s ease;
                                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                    <div class="budget-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                                        <div class="budget-info" style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                            <div class="budget-icon-wrapper" style="
                                                width: 48px;
                                                height: 48px;
                                                border-radius: 12px;
                                                background: ${category.color || "#6366f1"};
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                font-size: 20px;
                                                box-shadow: 0 4px 12px ${(category.color || "#6366f1") + "40"};
                                            ">
                                                <span class="budget-icon">${category.icon}</span>
                        </div>
                                            <div class="budget-details">
                                                <div class="budget-name" style="
                                                    font-size: 16px;
                                                    font-weight: 600;
                                                    color: ${textPrimary};
                                                    margin-bottom: 4px;
                                                ">${category.name}</div>
                                                <div class="budget-amounts" style="
                                                    font-size: 14px;
                                                    color: ${textSecondary};
                                                ">
                                                    <span class="spent" style="
                                                        font-weight: 600;
                                                        color: ${statusColor.primary};
                                                    ">${this.budgetManager.formatCurrency(category.spent)}</span>
                                                    <span class="separator"> / </span>
                                                    <span class="budget">${this.budgetManager.formatCurrency(
                                                      category.budget
                                                    )}</span>
                    </div>
                                </div>
                            </div>
                                        <div class="budget-percentage-wrapper" style="text-align: right;">
                                            <div class="budget-percentage" style="
                                                font-size: 20px;
                                                font-weight: 700;
                                                margin-bottom: 4px;
                                                color: ${statusColor.primary};
                                            ">
                                                ${category.percentage.toFixed(0)}%
                                            </div>
                                            <div class="budget-status-badge" style="
                                                font-size: 12px;
                                                font-weight: 500;
                                                padding: 4px 8px;
                                                border-radius: 6px;
                                                background: ${statusColor.bg};
                                                color: ${statusColor.light};
                                            ">
                                                ${
                                                  category.status === "over"
                                                    ? "Melebihi"
                                                    : category.status === "warning"
                                                    ? "Hampir Habis"
                                                    : "Aman"
                                                }
                    </div>
                </div>
            </div>

                                    <div class="budget-progress-wrapper">
                                        <div class="budget-progress" style="margin-bottom: 12px;">
                                            <div class="progress-track" style="
                                                width: 100%;
                                                height: 8px;
                                                background: ${progressBg};
                                                border-radius: 4px;
                                                overflow: hidden;
                                            ">
                                                <div class="progress-fill" style="
                                                    height: 100%;
                                                    width: ${Math.min(category.percentage, 100)}%;
                                                    background: linear-gradient(90deg, ${statusColor.primary} 0%, ${
                                    statusColor.light
                                  } 100%);
                                                    border-radius: 4px;
                                                    transition: width 1s ease;
                                                "></div>
                    </div>
                                        </div>
                                        <div class="budget-remaining" style="
                                            font-size: 14px;
                                            font-weight: 500;
                                        ">
                                            ${
                                              category.remaining > 0
                                                ? `<span style="color: ${
                                                    statusColors.good.light
                                                  };">Sisa: ${this.budgetManager.formatCurrency(
                                                    category.remaining
                                                  )}</span>`
                                                : `<span style="color: ${
                                                    statusColors.over.light
                                                  };">Melebihi: ${this.budgetManager.formatCurrency(
                                                    Math.abs(category.remaining)
                                                  )}</span>`
                                            }
                                        </div>
                                    </div>
                                </div>
                            `;
                                })
                                .join("")
                        }
                    </div>
                </div>

                <!-- Budget Management Actions -->
                <div class="analytics-section">
                    <h3 class="section-title">⚙️ Kelola Budget</h3>
                    <div class="budget-actions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
                        <div class="action-card primary" onclick="app.showSetBudgetModal()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 16px; padding: 24px; color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); min-height: 140px; display: flex; flex-direction: column; justify-content: center; text-align: center;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="action-card-icon" style="font-size: 32px; margin-bottom: 12px;">🎯</div>
                            <div class="action-card-content">
                                <div class="action-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Atur Budget Baru</div>
                                <div class="action-card-description" style="font-size: 14px; opacity: 0.9;">Tetapkan batas pengeluaran untuk kategori</div>
                    </div>
                        </div>
                        
                        <div class="action-card secondary" onclick="app.showBudgetHistoryModal()" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; border-radius: 16px; padding: 24px; color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3); min-height: 140px; display: flex; flex-direction: column; justify-content: center; text-align: center;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="action-card-icon" style="font-size: 32px; margin-bottom: 12px;">📊</div>
                            <div class="action-card-content">
                                <div class="action-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Riwayat Budget</div>
                                <div class="action-card-description" style="font-size: 14px; opacity: 0.9;">Lihat performa budget bulan lalu</div>
                            </div>
                        </div>
                        
                        <div class="action-card secondary" onclick="app.exportBudgetReport()" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border: none; border-radius: 16px; padding: 24px; color: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3); min-height: 140px; display: flex; flex-direction: column; justify-content: center; text-align: center;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div class="action-card-icon" style="font-size: 32px; margin-bottom: 12px;">📄</div>
                            <div class="action-card-content">
                                <div class="action-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Export Laporan</div>
                                <div class="action-card-description" style="font-size: 14px; opacity: 0.9;">Unduh laporan budget dalam PDF</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Budget Statistics -->
                ${
                  budgetAnalysis.length > 0
                    ? `
                    <div class="analytics-section">
                        <h3 class="section-title">📈 Statistik Budget</h3>
                        <div class="budget-stats-grid">
                            <div class="budget-stat-card">
                                <div class="stat-icon success">✅</div>
                                <div class="stat-content">
                                    <div class="stat-value">${
                                      budgetAnalysis.filter((c) => c.status === "good").length
                                    }</div>
                                    <div class="stat-label">Budget Aman</div>
                    </div>
                    </div>
                            
                            <div class="budget-stat-card">
                                <div class="stat-icon warning">⚠️</div>
                                <div class="stat-content">
                                    <div class="stat-value">${
                                      budgetAnalysis.filter((c) => c.status === "warning").length
                                    }</div>
                                    <div class="stat-label">Mendekati Batas</div>
                </div>
                            </div>
                            
                            <div class="budget-stat-card">
                                <div class="stat-icon danger">🚨</div>
                                <div class="stat-content">
                                    <div class="stat-value">${
                                      budgetAnalysis.filter((c) => c.status === "over").length
                                    }</div>
                                    <div class="stat-label">Melebihi Budget</div>
                                </div>
                            </div>
                            
                            <div class="budget-stat-card">
                                <div class="stat-icon info">💰</div>
                                <div class="stat-content">
                                    <div class="stat-value">${this.budgetManager.formatCurrency(
                                      budgetAnalysis.reduce((sum, c) => sum + c.remaining, 0)
                                    )}</div>
                                    <div class="stat-label">Total Sisa Budget</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        `;
  }

  // Analytics Mode Switching
  switchAnalyticsMode(mode) {
    this.analyticsMode = mode;
    document.querySelectorAll(".analytics-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === mode);
    });
    document.getElementById("analyticsContent").innerHTML = this.renderAnalyticsContent();
    this.initializeAnalyticsCharts();
  }

  // Chart utility methods
  calculateBarHeight(value, allData, type) {
    const values = allData.map((d) => (type === "income" ? d.income : d.expense));
    const maxValue = Math.max(...values);
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }

  calculateHealthScore(stats) {
    let score = 0;
    if (stats.balance > 0) score += 40;
    const savingsRate = stats.income > 0 ? ((stats.income - stats.expense) / stats.income) * 100 : 0;
    if (savingsRate >= 20) score += 30;
    if (stats.transactionCount >= 10) score += 15;
    return Math.min(100, score);
  }

  renderHealthIndicators(stats) {
    const savingsRate = stats.income > 0 ? ((stats.income - stats.expense) / stats.income) * 100 : 0;
    return `
            <div class="health-indicator good">
                <span class="indicator-icon">💰</span>
                <div class="indicator-info">
                    <div class="indicator-label">Saldo</div>
                    <div class="indicator-value">${this.budgetManager.formatCurrency(stats.balance)}</div>
                </div>
            </div>
        `;
  }

  renderSpendingTimeline() {
    return '<div class="timeline-placeholder">Timeline akan ditampilkan di sini</div>';
  }

  renderTopSpendingAnalysis() {
    return '<div class="analysis-placeholder">Analisis pengeluaran tertinggi</div>';
  }

  renderTrendAnalysis(predictions) {
    return '<div class="trend-placeholder">Analisis trend akan ditampilkan di sini</div>';
  }

  // Other view renderers - Complete implementations
  renderTransactions() {
    const transactions = this.budgetManager.data.transactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return `
            <div class="transactions-container">
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="app.showQuickAddModal('income')">
                        <span class="btn-icon">💰</span>
                        <span class="btn-text">Tambah Pemasukan</span>
                    </button>
                    <button class="btn btn-primary" onclick="app.showQuickAddModal('expense')">
                        <span class="btn-icon">💸</span>
                        <span class="btn-text">Tambah Pengeluaran</span>
                    </button>
                </div>

                <div class="transactions-stats">
                    <div class="stat-card success">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(
                              transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
                            )}</div>
                            <div class="stat-label">Total Pemasukan</div>
            </div>
                    </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-icon">📉</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(
                              transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
                            )}</div>
                            <div class="stat-label">Total Pengeluaran</div>
                        </div>
                    </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <div class="stat-value">${transactions.length}</div>
                            <div class="stat-label">Total Transaksi</div>
                        </div>
                    </div>
                </div>

                <div class="transactions-section">
                    <div class="section-header">
                        <h3 class="section-title">Semua Transaksi</h3>
                        <div class="section-actions">
                            <select class="filter-select" id="transactionFilter">
                                <option value="all">Semua</option>
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Table Header -->
                    ${
                      transactions.length > 0
                        ? `
                        <div class="transactions-table-header" style="
                            display: grid;
                            grid-template-columns: 32px 1fr auto auto;
                            gap: 12px;
                            padding: 8px 16px;
                            margin-bottom: 8px;
                            background: ${document.body.classList.contains("dark-theme") ? "#4b5563" : "#f8fafc"};
                            border-radius: 6px;
                            font-size: 12px;
                            font-weight: 600;
                            color: ${document.body.classList.contains("dark-theme") ? "#d1d5db" : "#6b7280"};
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        ">
                            <div></div>
                            <div>Transaksi</div>
                            <div style="text-align: right;">Jumlah</div>
                            <div style="text-align: center;">Aksi</div>
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="transactions-list">
                        ${
                          transactions.length === 0
                            ? '<div class="empty-state">Belum ada transaksi. <button class="link-btn" onclick="app.showQuickAddModal()">Tambah transaksi pertama</button></div>'
                            : transactions.map((t) => this.renderDetailedTransactionItem(t)).join("")
                        }
                    </div>
                </div>
            </div>
        `;
  }

  renderDetailedTransactionItem(transaction) {
    const category = this.budgetManager.getCategoryById(transaction.categoryId);
    const account = this.budgetManager.getAccountById(transaction.accountId);
    const accountType = this.budgetManager.data.accountTypes.find((t) => t.id === account?.typeId);
    const isDark = document.body.classList.contains("dark-theme");

    return `
            <div class="transaction-item detailed ${transaction.type}" data-id="${transaction.id}" style="
                background: ${
                  isDark
                    ? "linear-gradient(145deg, #374151 0%, #4b5563 100%)"
                    : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
                };
                border: 1px solid ${isDark ? "#6b7280" : "#e2e8f0"};
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 8px;
                box-shadow: ${isDark ? "0 1px 3px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.1)"};
                transition: all 0.2s ease;
                display: grid;
                grid-template-columns: 32px 1fr auto auto;
                gap: 12px;
                align-items: center;
                min-height: 60px;
            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='${
              isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.15)"
            }';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${
      isDark ? "0 1px 3px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.1)"
    }';">
                
                <!-- Icon Column -->
                <div class="transaction-icon" style="
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: ${category?.color || (transaction.type === "income" ? "#10b981" : "#ef4444")};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    box-shadow: 0 2px 4px ${
                      (category?.color || (transaction.type === "income" ? "#10b981" : "#ef4444")) + "40"
                    };
                    flex-shrink: 0;
                ">${category?.icon || (transaction.type === "income" ? "💰" : "💸")}</div>
                
                <!-- Details Column -->
                <div class="transaction-details" style="min-width: 0; overflow: hidden;">
                    <div class="transaction-name" style="
                        font-size: 14px;
                        font-weight: 600;
                        color: ${isDark ? "#f9fafb" : "#1f2937"};
                        margin-bottom: 2px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    ">${transaction.description || category?.name}</div>
                    <div class="transaction-meta" style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 11px;
                        color: ${isDark ? "#9ca3af" : "#6b7280"};
                        flex-wrap: wrap;
                    ">
                        <span class="transaction-category" style="
                            background: ${isDark ? "#4b5563" : "#f3f4f6"};
                            padding: 1px 6px;
                            border-radius: 10px;
                            font-size: 10px;
                            font-weight: 500;
                        ">${category?.name}</span>
                        <span style="font-size: 8px;">•</span>
                        <span class="transaction-account">${accountType?.icon || "🏦"} ${account?.name}</span>
                        <span style="font-size: 8px;">•</span>
                        <span class="transaction-date">${new Date(transaction.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })}</span>
                    </div>
                </div>
                
                <!-- Amount Column -->
                <div class="transaction-amount" style="
                    font-size: 14px;
                    font-weight: 700;
                    color: ${transaction.type === "income" ? "#10b981" : "#ef4444"};
                    text-align: right;
                    flex-shrink: 0;
                    min-width: 90px;
                ">
                    ${transaction.type === "income" ? "+" : "-"}${this.budgetManager.formatCurrency(transaction.amount)}
                </div>
                
                <!-- Actions Column -->
                <div class="transaction-actions" style="
                    display: flex;
                    gap: 4px;
                    flex-shrink: 0;
                    opacity: 0.7;
                " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                    <button class="action-btn-small edit" onclick="app.editTransaction(${
                      transaction.id
                    })" title="Edit" style="
                        width: 24px;
                        height: 24px;
                        border: none;
                        border-radius: 4px;
                        background: ${isDark ? "#4b5563" : "#f3f4f6"};
                        color: ${isDark ? "#d1d5db" : "#6b7280"};
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                        font-size: 11px;
                    " onmouseover="this.style.background='#3b82f6'; this.style.color='white';" onmouseout="this.style.background='${
                      isDark ? "#4b5563" : "#f3f4f6"
                    }'; this.style.color='${isDark ? "#d1d5db" : "#6b7280"}';">✏️</button>
                    <button class="action-btn-small delete" onclick="app.deleteTransaction(${
                      transaction.id
                    })" title="Hapus" style="
                        width: 24px;
                        height: 24px;
                        border: none;
                        border-radius: 4px;
                        background: ${isDark ? "#4b5563" : "#f3f4f6"};
                        color: ${isDark ? "#d1d5db" : "#6b7280"};
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                        font-size: 11px;
                    " onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='${
                      isDark ? "#4b5563" : "#f3f4f6"
                    }'; this.style.color='${isDark ? "#d1d5db" : "#6b7280"}';">🗑️</button>
                </div>
            </div>
        `;
  }

  renderAccounts() {
    const accounts = this.budgetManager.data.accounts;
    const totalBalance = this.budgetManager.getTotalBalance();

    return `
            <div class="accounts-container">
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="app.showAddAccountModal()">
                        <span class="btn-icon">🏦</span>
                        <span class="btn-text">Tambah Akun</span>
                    </button>
                </div>

                <div class="accounts-stats">
                    <div class="stat-card primary">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(totalBalance)}</div>
                            <div class="stat-label">Total Saldo</div>
                        </div>
                    </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">🏦</div>
                        <div class="stat-content">
                            <div class="stat-value">${accounts.length}</div>
                            <div class="stat-label">Total Akun</div>
                        </div>
                    </div>
                </div>

                <div class="accounts-section">
                    <h3 class="section-title">Daftar Akun</h3>
                    <div class="accounts-grid">
                        ${
                          accounts.length === 0
                            ? '<div class="empty-state">Belum ada akun. <button class="link-btn" onclick="app.showAddAccountModal()">Tambah akun pertama</button></div>'
                            : accounts.map((account) => this.renderAccountCard(account)).join("")
                        }
                    </div>
                </div>
            </div>
        `;
  }

  renderAccountCard(account) {
    const accountType = this.budgetManager.data.accountTypes.find((t) => t.id === account.typeId);
    const recentTransactions = this.budgetManager.data.transactions
      .filter((t) => t.accountId === account.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    return `
            <div class="account-card" data-id="${account.id}">
                <div class="account-header">
                    <div class="account-info">
                        <div class="account-icon" style="color: ${accountType?.color || "#6C5CE7"}">${
      accountType?.icon || "🏦"
    }</div>
                        <div class="account-details">
                            <div class="account-name">${account.name}</div>
                            <div class="account-type">${accountType?.name || "Unknown"}</div>
                        </div>
                    </div>
                    <div class="account-actions">
                        <button class="action-btn-small" onclick="app.editAccount(${
                          account.id
                        })" title="Edit">✏️</button>
                        <button class="action-btn-small delete" onclick="app.deleteAccount(${
                          account.id
                        })" title="Hapus">🗑️</button>
                    </div>
                </div>
                
                <div class="account-balance">
                    <div class="balance-amount ${account.balance >= 0 ? "positive" : "negative"}">
                        ${this.budgetManager.formatCurrency(account.balance)}
                    </div>
                    <div class="balance-label">Saldo</div>
                </div>
                
                ${
                  recentTransactions.length > 0
                    ? `
                    <div class="account-transactions">
                        <div class="mini-transactions-title">Transaksi Terakhir</div>
                        ${recentTransactions
                          .map((t) => {
                            const category = this.budgetManager.getCategoryById(t.categoryId);
                            return `
                                <div class="mini-transaction ${t.type}">
                                    <span class="mini-transaction-name">${t.description || category?.name}</span>
                                    <span class="mini-transaction-amount">${
                                      t.type === "income" ? "+" : "-"
                                    }${this.budgetManager.formatCurrency(t.amount)}</span>
                                </div>
                            `;
                          })
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `;
  }

  renderGoals() {
    const goals = this.budgetManager.data.goals;

    return `
            <div class="goals-container">
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="app.showAddGoalModal()">
                        <span class="btn-icon">🎯</span>
                        <span class="btn-text">Tambah Target</span>
                    </button>
                </div>

                <div class="goals-stats">
                    <div class="stat-card success">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <div class="stat-value">${goals.length}</div>
                            <div class="stat-label">Total Target</div>
                        </div>
                    </div>
                    
                    <div class="stat-card info">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(
                              goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
                            )}</div>
                            <div class="stat-label">Total Terkumpul</div>
                        </div>
                    </div>
                    
                    <div class="stat-card warning">
                        <div class="stat-icon">🏁</div>
                        <div class="stat-content">
                            <div class="stat-value">${this.budgetManager.formatCurrency(
                              goals.reduce((sum, goal) => sum + goal.target, 0)
                            )}</div>
                            <div class="stat-label">Total Target</div>
                        </div>
                    </div>
                </div>

                <div class="goals-section">
                    <h3 class="section-title">Daftar Target</h3>
                    <div class="goals-grid">
                        ${
                          goals.length === 0
                            ? '<div class="empty-state">Belum ada target. <button class="link-btn" onclick="app.showAddGoalModal()">Tambah target pertama</button></div>'
                            : goals.map((goal) => this.renderGoalCard(goal)).join("")
                        }
                    </div>
                </div>
            </div>
        `;
  }

  renderGoalCard(goal) {
    const progress = goal.target > 0 ? (goal.currentAmount / goal.target) * 100 : 0;
    const remaining = goal.target - goal.currentAmount;
    const daysRemaining = goal.deadline
      ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    return `
            <div class="goal-card" data-id="${goal.id}">
                <div class="goal-header">
                    <div class="goal-info">
                        <div class="goal-name">${goal.name}</div>
                        ${
                          goal.deadline
                            ? `
                            <div class="goal-deadline ${daysRemaining < 30 ? "urgent" : ""}">
                                ${daysRemaining > 0 ? `${daysRemaining} hari lagi` : "Sudah lewat"}
                            </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="goal-actions">
                        <button class="action-btn-small" onclick="app.updateGoalProgress(${
                          goal.id
                        })" title="Update Progress">➕</button>
                        <button class="action-btn-small" onclick="app.editGoal(${goal.id})" title="Edit">✏️</button>
                        <button class="action-btn-small delete" onclick="app.deleteGoal(${
                          goal.id
                        })" title="Hapus">🗑️</button>
                    </div>
                </div>
                
                <div class="goal-progress">
                    <div class="progress-info">
                        <span class="progress-current">${this.budgetManager.formatCurrency(goal.currentAmount)}</span>
                        <span class="progress-target">${this.budgetManager.formatCurrency(goal.target)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <div class="progress-percentage">${progress.toFixed(1)}%</div>
                </div>
                
                <div class="goal-remaining">
                    ${
                      remaining > 0
                        ? `Sisa: ${this.budgetManager.formatCurrency(remaining)}`
                        : `<span class="goal-completed">🎉 Target Tercapai!</span>`
                    }
                </div>
            </div>
        `;
  }

  // Animation methods
  animateStatistics() {
    setTimeout(() => {
      document.querySelectorAll(".stat-card").forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100);
      });
    }, 100);
  }

  initializeAnalyticsCharts() {
    setTimeout(() => {
      document.querySelectorAll(".progress-fill, .bar-fill").forEach((bar, index) => {
        setTimeout(() => {
          bar.style.transition = "width 1s ease";
          bar.style.opacity = "1";
        }, index * 50);
      });
    }, 200);
  }

  // Modal methods - Complete implementations
  showQuickAddModal(type = "expense") {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="app.hideModal()"></div>
            <div class="modal quick-add-modal">
                <div class="modal-header">
                    <h3 class="modal-title">
                        ${type === "income" ? "💰 Tambah Pemasukan" : "💸 Tambah Pengeluaran"}
                    </h3>
                    <button class="modal-close" onclick="app.hideModal()">×</button>
                </div>
                <form class="modal-form" id="transactionForm">
                <div class="form-group">
                        <label class="form-label">Jumlah *</label>
                        <input type="number" class="form-input" id="amount" placeholder="0" required min="0" step="1000">
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Kategori *</label>
                        <select class="form-select" id="categoryId" required>
                            <option value="">Pilih Kategori</option>
                            ${this.budgetManager.data.categories
                              .filter((cat) =>
                                type === "income"
                                  ? cat.name === "Gaji" || cat.name === "Investasi"
                                  : cat.name !== "Gaji"
                              )
                              .map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`)
                              .join("")}
                    </select>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Akun *</label>
                        <select class="form-select" id="accountId" required>
                            <option value="">Pilih Akun</option>
                            ${this.budgetManager.data.accounts
                              .map((acc) => {
                                const type = this.budgetManager.data.accountTypes.find((t) => t.id === acc.typeId);
                                return `<option value="${acc.id}">${type?.icon || "🏦"} ${
                                  acc.name
                                } (${this.budgetManager.formatCurrency(acc.balance)})</option>`;
                              })
                              .join("")}
                    </select>
                        ${
                          this.budgetManager.data.accounts.length === 0
                            ? '<p class="form-help">Belum ada akun. <button type="button" class="link-btn" onclick="app.showAddAccountModal()">Tambah akun baru</button></p>'
                            : ""
                        }
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Deskripsi</label>
                        <input type="text" class="form-input" id="description" placeholder="Catatan (opsional)">
                </div>
                    
                <div class="form-group">
                    <label class="form-label">Tanggal</label>
                        <input type="date" class="form-input" id="date" value="${
                          new Date().toISOString().split("T")[0]
                        }">
                </div>
                    
                    <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">${type === "income" ? "💰" : "💸"}</span>
                            <span class="btn-text">Tambah ${type === "income" ? "Pemasukan" : "Pengeluaran"}</span>
                        </button>
                </div>
            </form>
            </div>
        `;

    modal.classList.add("active");
    document.getElementById("amount").focus();

    // Bind form submission
    document.getElementById("transactionForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const amount = parseFloat(document.getElementById("amount").value);
      const categoryId = parseInt(document.getElementById("categoryId").value);
      const accountId = parseInt(document.getElementById("accountId").value);
      const description = document.getElementById("description").value;
      const date = document.getElementById("date").value;

      if (amount && categoryId && accountId) {
        try {
          this.budgetManager.addTransaction(type, amount, categoryId, accountId, description, date);
          this.hideModal();
          this.showToast(`${type === "income" ? "Pemasukan" : "Pengeluaran"} berhasil ditambahkan!`, "success");
          this.render();
          this.updateUserBalance();
        } catch (error) {
          this.showToast("Gagal menambahkan transaksi: " + error.message, "error");
        }
      }
    });
  }

  showAddAccountModal() {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="app.hideModal()"></div>
            <div class="modal account-modal">
                <div class="modal-header">
                    <h3 class="modal-title">🏦 Tambah Akun Baru</h3>
                    <button class="modal-close" onclick="app.hideModal()">×</button>
                </div>
                <form class="modal-form" id="accountForm">
                <div class="form-group">
                        <label class="form-label">Nama Akun *</label>
                        <input type="text" class="form-input" id="accountName" placeholder="Contoh: BCA Utama" required>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Jenis Akun *</label>
                        <select class="form-select" id="accountType" required>
                            <option value="">Pilih Jenis Akun</option>
                            ${this.budgetManager.data.accountTypes
                              .map((type) => `<option value="${type.id}">${type.icon} ${type.name}</option>`)
                              .join("")}
                    </select>
                </div>
                    
                    <div class="form-group">
                        <label class="form-label">Saldo Awal</label>
                        <input type="number" class="form-input" id="initialBalance" placeholder="0" min="0" step="1000">
                        <p class="form-help">Masukkan saldo yang ada saat ini di akun tersebut</p>
                    </div>
                    
                    <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">🏦</span>
                            <span class="btn-text">Tambah Akun</span>
                        </button>
                </div>
            </form>
            </div>
        `;

    modal.classList.add("active");
    document.getElementById("accountName").focus();

    // Bind form submission
    document.getElementById("accountForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("accountName").value;
      const typeId = parseInt(document.getElementById("accountType").value);
      const balance = parseFloat(document.getElementById("initialBalance").value) || 0;

      if (name && typeId) {
        try {
          this.budgetManager.addAccount(name, balance, typeId);
          this.hideModal();
          this.showToast("Akun berhasil ditambahkan!", "success");
          this.render();
          this.updateUserBalance();
        } catch (error) {
          this.showToast("Gagal menambahkan akun: " + error.message, "error");
        }
      }
    });
  }

  showAddGoalModal() {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="app.hideModal()"></div>
            <div class="modal goal-modal">
                <div class="modal-header">
                    <h3 class="modal-title">🎯 Tambah Target Baru</h3>
                    <button class="modal-close" onclick="app.hideModal()">×</button>
                </div>
                <form class="modal-form" id="goalForm">
                <div class="form-group">
                        <label class="form-label">Nama Target *</label>
                        <input type="text" class="form-input" id="goalName" placeholder="Contoh: Liburan ke Bali" required>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Target Jumlah *</label>
                        <input type="number" class="form-input" id="targetAmount" placeholder="0" required min="1000" step="1000">
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Jumlah Saat Ini</label>
                        <input type="number" class="form-input" id="currentAmount" placeholder="0" min="0" step="1000">
                        <p class="form-help">Jumlah yang sudah terkumpul untuk target ini</p>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Tenggat Waktu</label>
                        <input type="date" class="form-input" id="deadline" min="${
                          new Date().toISOString().split("T")[0]
                        }">
                        <p class="form-help">Kapan target ini ingin dicapai? (opsional)</p>
                </div>
                    
                    <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Tambah Target</span>
                        </button>
                </div>
            </form>
            </div>
        `;

    modal.classList.add("active");
    document.getElementById("goalName").focus();

    // Bind form submission
    document.getElementById("goalForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("goalName").value;
      const target = parseFloat(document.getElementById("targetAmount").value);
      const currentAmount = parseFloat(document.getElementById("currentAmount").value) || 0;
      const deadline = document.getElementById("deadline").value || null;

      if (name && target) {
        try {
          this.budgetManager.addGoal(name, target, currentAmount, deadline);
          this.hideModal();
          this.showToast("Target berhasil ditambahkan!", "success");
          this.render();
        } catch (error) {
          this.showToast("Gagal menambahkan target: " + error.message, "error");
        }
      }
    });
  }

  showSetBudgetModal() {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = `
            <div class="modal-backdrop" onclick="app.hideModal()"></div>
            <div class="modal budget-modal">
                <div class="modal-header">
                    <h3 class="modal-title">🎯 Atur Budget Kategori</h3>
                    <button class="modal-close" onclick="app.hideModal()">×</button>
                </div>
                <form class="modal-form" id="budgetForm">
                <div class="form-group">
                        <label class="form-label">Kategori *</label>
                        <select class="form-select" id="budgetCategory" required>
                            <option value="">Pilih Kategori</option>
                            ${this.budgetManager.data.categories
                              .filter((cat) => cat.name !== "Gaji")
                              .map((cat) => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`)
                              .join("")}
                        </select>
                </div>
                    
                <div class="form-group">
                        <label class="form-label">Budget Bulanan *</label>
                        <input type="number" class="form-input" id="budgetAmount" placeholder="0" required min="1000" step="1000">
                        <p class="form-help">Maksimal pengeluaran untuk kategori ini per bulan</p>
                </div>
                    
                    <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Batal</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Atur Budget</span>
                        </button>
                </div>
            </form>
            </div>
        `;

    modal.classList.add("active");
    document.getElementById("budgetCategory").focus();

    // Bind form submission
    document.getElementById("budgetForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const categoryId = parseInt(document.getElementById("budgetCategory").value);
      const budgetAmount = parseFloat(document.getElementById("budgetAmount").value);

      if (categoryId && budgetAmount) {
        try {
          const category = this.budgetManager.data.categories.find((cat) => cat.id === categoryId);
          if (category) {
            category.budget = budgetAmount;
            this.budgetManager.saveData();
            this.hideModal();
            this.showToast(`Budget untuk ${category.name} berhasil diatur!`, "success");
            this.render();
          }
        } catch (error) {
          this.showToast("Gagal mengatur budget: " + error.message, "error");
        }
      }
    });
  }

  hideModal() {
    const modal = document.getElementById("modalContainer");
    modal.classList.remove("active");
    setTimeout(() => {
      modal.innerHTML = "";
    }, 300);
  }

  showToast(message, type = "info") {
    console.log("showToast called:", message, type);

    // Remove any existing toasts first
    const existingToasts = document.querySelectorAll('[data-toast="true"]');
    existingToasts.forEach((toast) => {
      console.log("Removing existing toast");
      toast.remove();
    });

    // Create toast with NO CSS CLASSES - just a plain div
    const toast = document.createElement("div");
    toast.setAttribute("data-toast", "true"); // Use data attribute instead of class

    // Apply ALL styles inline with highest specificity
    const styles = [
      "position: fixed !important",
      "top: 100px !important",
      "right: 20px !important",
      "z-index: 2147483647 !important", // Maximum z-index
      "background: #ffffff !important",
      "border: 1px solid #e2e8f0 !important",
      "border-radius: 12px !important",
      "padding: 16px !important",
      "width: 380px !important",
      "height: auto !important",
      "box-shadow: 0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1) !important",
      "display: flex !important",
      "align-items: flex-start !important",
      "gap: 12px !important",
      "visibility: visible !important",
      "opacity: 1 !important",
      'font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important',
      "font-size: 14px !important",
      "color: #1f2937 !important",
      "line-height: 1.5 !important",
      "word-wrap: break-word !important",
      "pointer-events: auto !important",
      "transform: none !important",
      "margin: 0 !important",
      "backdrop-filter: blur(10px) !important",
    ];

    toast.style.cssText = styles.join("; ");

    // Add type-specific styling with modern colors
    if (type === "success") {
      toast.style.backgroundColor = "#f0fdf4 !important";
      toast.style.borderColor = "#22c55e !important";
      toast.style.borderLeftWidth = "4px !important";
      toast.style.borderLeftColor = "#16a34a !important";
    } else if (type === "error") {
      toast.style.backgroundColor = "#fef2f2 !important";
      toast.style.borderColor = "#ef4444 !important";
      toast.style.borderLeftWidth = "4px !important";
      toast.style.borderLeftColor = "#dc2626 !important";
    } else {
      toast.style.backgroundColor = "#eff6ff !important";
      toast.style.borderColor = "#3b82f6 !important";
      toast.style.borderLeftWidth = "4px !important";
      toast.style.borderLeftColor = "#2563eb !important";
    }

    // Modern, beautiful innerHTML
    toast.innerHTML = `
            <div style="
                font-size: 18px; 
                flex-shrink: 0; 
                margin-top: 2px;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
            ">${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</div>
            <div style="
                flex: 1; 
                min-width: 0;
                line-height: 1.4;
                font-weight: 500;
                color: #374151;
            ">${message}</div>
            <button onclick="this.closest('[data-toast]').remove()" style="
                background: none; 
                border: none; 
                color: #9ca3af;
                font-size: 18px; 
                cursor: pointer; 
                padding: 4px;
                border-radius: 6px;
                transition: all 0.2s ease;
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            " onmouseover="this.style.backgroundColor='#f3f4f6'; this.style.color='#6b7280';" 
               onmouseout="this.style.backgroundColor='transparent'; this.style.color='#9ca3af';">×</button>
        `;

    console.log("About to append toast to body...");

    // Append to body
    document.body.appendChild(toast);

    console.log("Toast appended. Element:", toast);
    console.log("Toast style.cssText:", toast.style.cssText);

    // Double check it's in DOM
    setTimeout(() => {
      const toastInDOM = document.querySelector('[data-toast="true"]');
      console.log("Toast found in DOM:", toastInDOM);
      if (toastInDOM) {
        const rect = toastInDOM.getBoundingClientRect();
        console.log("Toast getBoundingClientRect:", rect);
        console.log("Toast offsetParent:", toastInDOM.offsetParent);
        console.log("Toast computed display:", window.getComputedStyle(toastInDOM).display);
        console.log("Toast computed visibility:", window.getComputedStyle(toastInDOM).visibility);
        console.log("Toast computed opacity:", window.getComputedStyle(toastInDOM).opacity);
        console.log("Toast computed position:", window.getComputedStyle(toastInDOM).position);
        console.log("Toast computed z-index:", window.getComputedStyle(toastInDOM).zIndex);
      } else {
        console.error("Toast NOT found in DOM!");
      }
    }, 200);

    // Auto remove after 8 seconds
    setTimeout(() => {
      console.log("Auto-removing toast");
      if (toast.parentElement) {
        toast.remove();
      }
    }, 8000);

    return toast;
  }

  // Event binding methods
  bindTransactionEvents() {}
  bindAccountEvents() {}
  bindGoalEvents() {}

  // Update methods
  updateUserBalance() {
    const userBalance = document.querySelector(".user-balance");
    if (userBalance) {
      userBalance.textContent = this.budgetManager.formatCurrency(this.budgetManager.getTotalBalance());
    }
  }

  handleResize() {
    if (window.innerWidth > 768) {
      this.closeMobileSidebar();
    }
  }

  // Demo data method
  loadDemoData() {
    if (confirm("Ini akan mengganti semua data yang ada dengan data demo. Lanjutkan?")) {
      try {
        this.budgetManager.generateDemoData();
        this.showToast(
          "Data demo berhasil dimuat! Silakan cek semua halaman untuk melihat fitur-fitur analisis.",
          "success"
        );
        this.render();
        this.updateUserBalance();
        // Refresh all cached data
        this.preloadData();
      } catch (error) {
        this.showToast("Gagal memuat data demo: " + error.message, "error");
      }
    }
  }

  // Placeholder methods for budget features
  showBudgetHistoryModal() {
    this.showToast("Fitur riwayat budget akan segera hadir!", "info");
  }

  exportBudgetReport() {
    this.showToast("Fitur export laporan sedang dikembangkan!", "info");
  }

  // Reset all data method for UI
  resetAllData() {
    if (
      confirm(
        "⚠️ PERINGATAN: Ini akan menghapus SEMUA data (akun, transaksi, target, budget). Yakin ingin melanjutkan?"
      )
    ) {
      if (confirm("Konfirmasi sekali lagi: Semua data akan hilang permanen. Lanjutkan?")) {
        try {
          this.budgetManager.resetAllData();
          this.showToast("Semua data berhasil dihapus! Aplikasi kembali ke kondisi awal.", "success");
          this.render();
          this.updateUserBalance();
          // Refresh all cached data
          this.preloadData();
        } catch (error) {
          this.showToast("Gagal reset data: " + error.message, "error");
        }
      }
    }
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Initialize BudgetManager
  const budgetManager = new BudgetManager();
  window.budgetManager = budgetManager;

  // Initialize UI
  const app = new ModernBudgetUI();
  window.app = app;

  // Handle Google login
  const googleLoginBtn = document.getElementById("googleLoginBtn");
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      try {
        await budgetManager.signInWithGoogle();
      } catch (error) {
        console.error("Login failed:", error);
        app.showToast("Gagal masuk dengan Google", "error");
      }
    });
  }

  // Handle auth state changes
  firebase.auth().onAuthStateChanged((user) => {
    const loginScreen = document.getElementById("loginScreen");
    const appContainer = document.getElementById("app");
    const userNameElement = document.querySelector(".user-name");

    if (user) {
      // User is signed in
      loginScreen.style.display = "none";
      appContainer.style.display = "block";

      // Update user name in sidebar
      if (userNameElement) {
        userNameElement.textContent = user.displayName || "Pengguna";
      }

      app.render();
    } else {
      // User is signed out
      loginScreen.style.display = "flex";
      appContainer.style.display = "none";

      // Reset user name in sidebar
      if (userNameElement) {
        userNameElement.textContent = "Pengguna";
      }
    }
  });
});
