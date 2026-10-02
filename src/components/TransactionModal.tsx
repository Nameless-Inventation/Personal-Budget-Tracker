"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTransaction, editTransaction } from "@/app/actions";

export function TransactionModal({ transaction }: { transaction?: any }) {
  const [open, setOpen] = useState(false);
  const isEdit = !!transaction;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEdit ? (
        <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-muted-foreground h-8 w-8">
           <Edit2 className="w-4 h-4" />
        </DialogTrigger>
      ) : (
        <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 h-9 px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the details of your transaction." : "Record a new income or expense. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form action={async (formData) => {
           if (isEdit) {
             await editTransaction(transaction.id, formData);
           } else {
             await addTransaction(formData);
           }
           setOpen(false);
        }}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input id="description" name="description" placeholder="Amazon, Salary, etc." className="col-span-3 bg-background/50" required defaultValue={transaction?.description} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount (₹)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" placeholder="500" className="col-span-3 bg-background/50" required defaultValue={transaction ? Math.abs(transaction.amount) : undefined} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" name="category" placeholder="Groceries, Rent, etc." className="col-span-3 bg-background/50" required defaultValue={transaction?.categories?.name || transaction?.category} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <select id="type" name="type" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue={transaction?.type || "expense"}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Input id="date" name="date" type="date" className="col-span-3 bg-background/50" required defaultValue={transaction?.date || new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">Save Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
