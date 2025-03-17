import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}





//kejgkjdsgkdsfjkgkkdsgkdf
using System;

public class Expense
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
    public string Category { get; set; }
}



/////fkjhsjdgfuewllhfw

using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

public class ExpenseRepository
{
    private const string FilePath = "expenses.json";

    public async Task<List<Expense>> LoadExpensesAsync()
    {
        if (!File.Exists(FilePath)) return new List<Expense>();
        var json = await File.ReadAllTextAsync(FilePath);
        return JsonSerializer.Deserialize<List<Expense>>(json) ?? new List<Expense>();
    }

    public async Task SaveExpensesAsync(List<Expense> expenses)
    {
        var json = JsonSerializer.Serialize(expenses, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(FilePath, json);
    }
}


// ,smnfklhegejgkdg

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ExpenseService
{
    private readonly ExpenseRepository _repository;

    public ExpenseService(ExpenseRepository repository)
    {
        _repository = repository;
    }

    public async Task AddExpenseAsync(Expense expense)
    {
        var expenses = await _repository.LoadExpensesAsync();
        expenses.Add(expense);
        await _repository.SaveExpensesAsync(expenses);
    }

    public async Task<List<Expense>> GetAllExpensesAsync() => await _repository.LoadExpensesAsync();

    public async Task<List<Expense>> GetExpensesByCategoryAsync(string category)
    {
        var expenses = await _repository.LoadExpensesAsync();
        return expenses.Where(e => e.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    public async Task<decimal> GetTotalExpenseAsync()
    {
        var expenses = await _repository.LoadExpensesAsync();
        return expenses.Sum(e => e.Amount);
    }
}


//smngljhgkdsngsdf


using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

class Program
{
    static async Task Main()
    {
        var serviceProvider = new ServiceCollection()
            .AddSingleton<ExpenseRepository>()
            .AddSingleton<ExpenseService>()
            .BuildServiceProvider();

        var expenseService = serviceProvider.GetRequiredService<ExpenseService>();

        while (true)
        {
            Console.WriteLine("\nExpense Tracker:");
            Console.WriteLine("1. Add Expense");
            Console.WriteLine("2. View Expenses");
            Console.WriteLine("3. View Expenses by Category");
            Console.WriteLine("4. Get Total Expenses");
            Console.WriteLine("5. Exit");
            Console.Write("Choose an option: ");
            var choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    Console.Write("Description: ");
                    string description = Console.ReadLine();
                    Console.Write("Amount: ");
                    decimal amount = decimal.Parse(Console.ReadLine());
                    Console.Write("Category: ");
                    string category = Console.ReadLine();

                    await expenseService.AddExpenseAsync(new Expense
                    {
                        Description = description,
                        Amount = amount,
                        Category = category
                    });

                    Console.WriteLine("Expense added successfully.");
                    break;

                case "2":
                    var expenses = await expenseService.GetAllExpensesAsync();
                    foreach (var exp in expenses)
                        Console.WriteLine($"{exp.Date.ToShortDateString()} | {exp.Category} | {exp.Description} | ${exp.Amount}");
                    break;

                case "3":
                    Console.Write("Enter category: ");
                    string filterCategory = Console.ReadLine();
                    var filteredExpenses = await expenseService.GetExpensesByCategoryAsync(filterCategory);
                    foreach (var exp in filteredExpenses)
                        Console.WriteLine($"{exp.Date.ToShortDateString()} | {exp.Description} | ${exp.Amount}");
                    break;

                case "4":
                    decimal total = await expenseService.GetTotalExpenseAsync();
                    Console.WriteLine($"Total Expenses: ${total}");
                    break;

                case "5":
                    return;

                default:
                    Console.WriteLine("Invalid choice, try again.");
                    break;
            }
        }
    }
}

