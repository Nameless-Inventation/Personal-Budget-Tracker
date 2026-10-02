import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Trash2, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PDFExportButton } from "@/components/PDFExportButton";
import { TransactionModal } from "@/components/TransactionModal";
import { createClient } from "@/utils/supabase/server";
import { deleteTransaction } from "@/app/actions";

export default async function TransactionsPage() {
  const supabase = await createClient();
  let rawTransactions: any[] = [];
  
  try {
    const { data } = await supabase.from('transactions').select('*, categories(name)').order('date', { ascending: false });
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

  // Map to a unified format for UI
  const transactions = (rawTransactions || []).map(t => ({
    ...t,
    category: t.categories?.name || 'Uncategorized',
    amount: t.type === 'expense' ? -Math.abs(t.amount) : Math.abs(t.amount)
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both relative z-10 h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm">Transactions</h1>
          <p className="text-muted-foreground font-medium">Manage and review your income and expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <PDFExportButton transactions={transactions} />
          <TransactionModal />
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <CardTitle className="text-foreground">Recent History</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground pl-9 focus-visible:ring-blue-500/50"
                />
              </div>
              <Button variant="outline" size="icon" className="border-border/50 bg-background/50 hover:bg-accent text-foreground shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No transactions found</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">You haven't recorded any transactions yet. Add your first income or expense to get started.</p>
              <TransactionModal />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground border-b border-border/50">Date</TableHead>
                  <TableHead className="text-muted-foreground border-b border-border/50">Description</TableHead>
                  <TableHead className="text-muted-foreground border-b border-border/50">Category</TableHead>
                  <TableHead className="text-right text-muted-foreground border-b border-border/50">Amount</TableHead>
                  <TableHead className="w-[100px] text-right border-b border-border/50"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-border/50 hover:bg-accent/50 transition-colors group">
                    <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors">{tx.date}</TableCell>
                    <TableCell className="font-medium text-foreground transition-colors">{tx.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-background/50 border-border/50 text-foreground">
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${tx.type === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground'}`}>
                      {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TransactionModal transaction={tx} />
                        <form action={async () => {
                          "use server"
                          await deleteTransaction(tx.id)
                        }}>
                          <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 hover:bg-red-500/20 hover:text-red-500 text-muted-foreground">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
