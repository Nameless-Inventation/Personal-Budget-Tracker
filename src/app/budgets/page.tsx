import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function BudgetsPage() {
  const supabase = await createClient();
  
  let budgets: any[] = [];
  let transactions: any[] = [];
  
  try {
    const [budgetsData, txData] = await Promise.all([
      supabase.from('budgets').select('*, categories(name, color)'),
      supabase.from('transactions').select('category_id, amount').eq('type', 'expense')
    ]);
    
    budgets = budgetsData.data || [];
    transactions = txData.data || [];
  } catch (e) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
      budgets = [
        { id: 1, categories: { name: "Housing", color: "bg-blue-500" }, amount: 15000, spent: 12000 },
        { id: 2, categories: { name: "Food", color: "bg-emerald-500" }, amount: 6000, spent: 5000 },
        { id: 3, categories: { name: "Transport", color: "bg-amber-500" }, amount: 2500, spent: 2000 },
        { id: 4, categories: { name: "Entertainment", color: "bg-rose-500" }, amount: 2000, spent: 3000 },
      ];
    }
  }

  // Calculate actual spent amount per budget category
  const formattedBudgets = budgets.map(b => {
    // If it's the mock data, it already has 'spent'
    let spent = b.spent; 
    
    // For real data, calculate from transactions
    if (spent === undefined) {
      spent = transactions
        .filter(t => t.category_id === b.category_id)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    }

    return {
      id: b.id,
      category: b.categories?.name || 'Unknown',
      color: b.categories?.color || 'bg-blue-500',
      spent: spent || 0,
      limit: b.amount
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both relative z-10 h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm">Budgets</h1>
          <p className="text-muted-foreground font-medium">Keep your spending in check.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Set Budget
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {formattedBudgets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-64 text-center px-4 bg-card/20 rounded-xl border border-dashed border-border/50">
             <h3 className="text-lg font-medium text-foreground mb-1">No budgets set</h3>
             <p className="text-muted-foreground mb-4">You haven't created any budgets yet.</p>
          </div>
        ) : formattedBudgets.map((b) => {
          const percent = Math.min((b.spent / b.limit) * 100, 100);
          const isOver = b.spent > b.limit;
          return (
            <Card key={b.id} className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl transition-all hover:bg-accent/20 hover:-translate-y-1">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-foreground text-lg">{b.category}</CardTitle>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${isOver ? 'bg-red-500/20 text-red-500 dark:text-red-400' : 'bg-secondary text-secondary-foreground'}`}>
                    ₹{b.spent.toLocaleString('en-IN')} / ₹{b.limit.toLocaleString('en-IN')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Usage</span>
                    <span className={isOver ? 'text-red-500 dark:text-red-400 font-bold' : 'text-foreground font-medium'}>
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border/50 p-[2px]">
                    <div 
                      className={`h-full rounded-full ${isOver ? 'bg-red-500' : (b.color || 'bg-blue-500')} transition-all duration-1000 ease-out`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {isOver && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-2 text-right">You have exceeded your limit by ₹{(b.spent - b.limit).toLocaleString('en-IN')}.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
