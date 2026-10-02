"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PDFExportButton({ transactions }: { transactions: any[] }) {
  const handleExport = (interval: string) => {
    const doc = new jsPDF();
    
    const totalSpent = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    
    const categoryTotals: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    });
    const topCategory = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a])[0] || 'N/A';

    doc.setFontSize(18);
    doc.text(`Smart Financial Report (${interval})`, 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);
    
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text("Executive Summary", 14, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(80);
    // Use 'Rs.' for jsPDF as the default font does not support the Unicode rupee symbol
    doc.text(`Total Income: Rs. ${totalIncome.toLocaleString('en-IN')}`, 14, 48);
    doc.text(`Total Expenses: Rs. ${totalSpent.toLocaleString('en-IN')}`, 14, 54);
    doc.text(`Net Savings: Rs. ${(totalIncome - totalSpent).toLocaleString('en-IN')}`, 14, 60);
    doc.text(`Top Spending Category: ${topCategory} (Rs. ${categoryTotals[topCategory]?.toLocaleString('en-IN') || 0})`, 14, 66);

    autoTable(doc, {
      startY: 75,
      head: [["Date", "Description", "Category", "Amount"]],
      body: transactions.map(t => [
        t.date, 
        t.description, 
        t.category, 
        `${t.amount > 0 ? '+' : ''}Rs. ${t.amount.toLocaleString('en-IN')}`
      ]),
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`tracker_${interval.toLowerCase()}_report.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background shadow-sm h-9 px-4 py-2 border-border/50 bg-background/50 hover:bg-accent text-foreground">
        <Download className="w-4 h-4 mr-2" />
        Export Report
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card/80 backdrop-blur-xl border-border/50">
        <DropdownMenuItem onClick={() => handleExport('Monthly')} className="cursor-pointer hover:bg-accent focus:bg-accent">Monthly Report</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('Quarterly')} className="cursor-pointer hover:bg-accent focus:bg-accent">Quarterly Report</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('Yearly')} className="cursor-pointer hover:bg-accent focus:bg-accent">Yearly Report</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

