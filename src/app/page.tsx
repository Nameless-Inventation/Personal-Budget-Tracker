import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { SpendingPieChart, SpendingBarChart } from "@/components/DashboardCharts";
import { createClient } from "@/utils/supabase/server";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export default async function Dashboard() {
  const supabase = await createClient();
  let rawTransactions: any[] = [];
  
  try {
    const { data } = await supabase.from('transactions').select('*, categories(name)').order('date', { ascending: true });
    rawTransactions = data || [];
  } catch (e) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
      rawTransactions = [
        { id: 1, date: "2026-10-02", description: "Whole Foods Market", categories: { name: "Groceries" }, amount: -12450.00, type: "expense" },
        { id: 2, date: "2026-10-01", description: "Monthly Salary", categories: { name: "Income" }, amount: 425000.00, type: "income" },
        { id: 3, date: "2026-09-28", description: "Uber Rides", categories: { name: "Transport" }, amount: -3420.00, type: "expense" },
        { id: 4, date: "2026-09-26", description: "Netflix Subscription", categories: { name: "Entertainment" }, amount: -1599.00, type: "expense" },
        { id: 5, date: "2026-09-25", description: "Shell Gas Station", categories: { name: "Transport" }, amount: -4500.00, type: "expense" }
      ];
    }
  }

  const transactions = rawTransactions || [];
  
  let totalIncome = 0;
  let totalExpenses = 0;
  
  const categoryTotals: Record<string, number> = {};
  const monthlyTotals: Record<string, number> = {};

  transactions.forEach(t => {
    const amount = Math.abs(t.amount);
    if (t.type === 'income') {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
      
      const catName = t.categories?.name || 'Uncategorized';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + amount;
      
      const monthStr = new Date(t.date).toLocaleString('default', { month: 'short' });
      monthlyTotals[monthStr] = (monthlyTotals[monthStr] || 0) + amount;
    }
  });

  const totalBalance = totalIncome - totalExpenses;
  
  const pieData = Object.keys(categoryTotals).map((name, i) => ({
    name,
    value: categoryTotals[name],
    color: COLORS[i % COLORS.length]
  })).sort((a, b) => b.value - a.value);

  const barData = Object.keys(monthlyTotals).map(name => ({
    name,
    spent: monthlyTotals[name]
  }));

  // Mock budget usage for now since we haven't wired up budgets form
  const budgetUsage = totalExpenses > 0 ? 54 : 0; 

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both relative z-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm">Dashboard</h1>
        <p className="text-muted-foreground font-medium">Here is an overview of your finances.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl transition-all hover:bg-accent/20 hover:-translate-y-1 hover:shadow-blue-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Total Balance</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Wallet className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">₹{totalBalance.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl transition-all hover:bg-accent/20 hover:-translate-y-1 hover:shadow-emerald-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Total Income</CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">₹{totalIncome.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl transition-all hover:bg-accent/20 hover:-translate-y-1 hover:shadow-rose-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Total Expenses</CardTitle>
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
              <TrendingDown className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">₹{totalExpenses.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl transition-all hover:bg-accent/20 hover:-translate-y-1 hover:shadow-purple-500/10 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Budget Usage</CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <DollarSign className="h-4 w-4 text-purple-500 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{budgetUsage}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card/50 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-foreground">Spending by Category</CardTitle>
            <CardDescription className="text-muted-foreground">Visual breakdown of where your money goes.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] border-t border-border/50 mt-4 p-6">
            <SpendingPieChart data={pieData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-card/50 backdrop-blur-xl border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-foreground">Spending Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Your monthly expenses over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] border-t border-border/50 mt-4 pt-6 pb-2 pl-0 pr-4">
            <SpendingBarChart data={barData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
