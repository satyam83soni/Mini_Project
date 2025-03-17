import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));



  //nkjsdhfjslfha
  namespace ExpenseTracker.Models
{
    public class User
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }

    public class Expense
    {
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
    }
}

//knsflhsfjdhsfkjshsdlf


using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Spectre.Console;
using ExpenseTracker.Models;
using ExpenseTracker.Services;

class Program
{
    static async Task Main()
    {
        var serviceProvider = new ServiceCollection()
            .AddSingleton<UserRepository>()
            .AddSingleton<ExpenseRepository>()
            .AddSingleton<ExpenseService>()
            .BuildServiceProvider();

        var userRepo = serviceProvider.GetRequiredService<UserRepository>();
        var expenseService = serviceProvider.GetRequiredService<ExpenseService>();

        User currentUser = null;

        while (currentUser == null)
        {
            var choice = AnsiConsole.Prompt(
                new SelectionPrompt<string>()
                    .Title("[blue]Welcome to Expense Tracker[/]!")
                    .PageSize(3)
                    .AddChoices("Login", "Register", "Exit"));

            switch (choice)
            {
                case "Login":
                    string loginUsername = AnsiConsole.Ask<string>("Enter [green]Username[/]: ");
                    string loginPassword = AnsiConsole.Prompt(new TextPrompt<string>("Enter [red]Password[/]: ").Secret());

                    currentUser = await userRepo.AuthenticateUserAsync(loginUsername, loginPassword);
                    AnsiConsole.MarkupLine(currentUser != null ? "[green]Login successful![/]" : "[red]Invalid credentials, try again.[/]");
                    break;

                case "Register":
                    string regUsername = AnsiConsole.Ask<string>("Choose a [green]Username[/]: ");
                    string regPassword = AnsiConsole.Prompt(new TextPrompt<string>("Choose a [red]Password[/]: ").Secret());

                    if (await userRepo.RegisterUserAsync(regUsername, regPassword))
                        AnsiConsole.MarkupLine("[green]Registration successful! Please log in.[/]");
                    else
                        AnsiConsole.MarkupLine("[red]Username already exists, try a different one.[/]");
                    break;

                case "Exit":
                    return;
            }
        }

        while (true)
        {
            var choice = AnsiConsole.Prompt(
                new SelectionPrompt<string>()
                    .Title("[blue]Expense Tracker Menu[/]")
                    .PageSize(6)
                    .AddChoices("Add Expense", "View My Expenses", "Filter Expenses", "Expense Summary", "Logout"));

            switch (choice)
            {
                case "Add Expense":
                    string description = AnsiConsole.Ask<string>("Enter [yellow]Description[/]: ");
                    decimal amount = AnsiConsole.Ask<decimal>("Enter [green]Amount[/]: ");
                    string category = AnsiConsole.Ask<string>("Enter [blue]Category[/]: ");
                    DateTime date = AnsiConsole.Ask<DateTime>("Enter [cyan]Date (YYYY-MM-DD)[/]: ");

                    await expenseService.AddExpenseAsync(currentUser, new Expense
                    {
                        Description = description,
                        Amount = amount,
                        Category = category,
                        Date = date
                    });

                    AnsiConsole.MarkupLine("[green]Expense added successfully![/]");
                    break;

                case "View My Expenses":
                    var expenses = await expenseService.GetAllExpensesAsync(currentUser);
                    ShowExpenseTable(expenses);
                    break;

                case "Filter Expenses":
                    var filterType = AnsiConsole.Prompt(
                        new SelectionPrompt<string>()
                            .Title("Filter by?")
                            .AddChoices("Category", "Date Range"));

                    if (filterType == "Category")
                    {
                        string filterCategory = AnsiConsole.Ask<string>("Enter [blue]Category[/]: ");
                        var filteredExpenses = await expenseService.GetExpensesByCategoryAsync(currentUser, filterCategory);
                        ShowExpenseTable(filteredExpenses);
                    }
                    else
                    {
                        DateTime startDate = AnsiConsole.Ask<DateTime>("Start [cyan]Date (YYYY-MM-DD)[/]: ");
                        DateTime endDate = AnsiConsole.Ask<DateTime>("End [cyan]Date (YYYY-MM-DD)[/]: ");
                        var dateFilteredExpenses = await expenseService.GetExpensesByDateRangeAsync(currentUser, startDate, endDate);
                        ShowExpenseTable(dateFilteredExpenses);
                    }
                    break;

                case "Expense Summary":
                    DateTime today = DateTime.Today;
                    DateTime monthStart = new DateTime(today.Year, today.Month, 1);
                    DateTime weekStart = today.AddDays(-(int)today.DayOfWeek);

                    decimal monthlyTotal = await expenseService.GetTotalExpenseAsync(currentUser, monthStart, today);
                    decimal weeklyTotal = await expenseService.GetTotalExpenseAsync(currentUser, weekStart, today);

                    var table = new Table().Border(TableBorder.Rounded);
                    table.AddColumn("[yellow]Time Period[/]");
                    table.AddColumn("[green]Total Spent ($)[/]");
                    table.AddRow("[blue]This Month[/]", $"[green]{monthlyTotal}[/]");
                    table.AddRow("[cyan]This Week[/]", $"[green]{weeklyTotal}[/]");
                    AnsiConsole.Write(table);
                    break;

                case "Logout":
                    AnsiConsole.MarkupLine("[yellow]Logging out...[/]");
                    return;
            }
        }
    }
}



//njkhgyukgjhj

using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using ExpenseTracker.Models;

namespace ExpenseTracker.Services
{
    public class UserRepository
    {
        private const string FilePath = "Data/users.json";

        public async Task<List<User>> LoadUsersAsync()
        {
            if (!File.Exists(FilePath)) return new List<User>();
            var json = await File.ReadAllTextAsync(FilePath);
            return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
        }

        public async Task SaveUsersAsync(List<User> users)
        {
            var json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(FilePath, json);
        }

        public async Task<User> AuthenticateUserAsync(string username, string password)
        {
            var users = await LoadUsersAsync();
            return users.Find(u => u.Username == username && u.PasswordHash == password);
        }

        public async Task<bool> RegisterUserAsync(string username, string password)
        {
            var users = await LoadUsersAsync();
            if (users.Exists(u => u.Username == username)) return false;
            users.Add(new User { Username = username, PasswordHash = password });
            await SaveUsersAsync(users);
            return true;
        }
    }

    public class ExpenseRepository
    {
        private const string FilePath = "Data/expenses.json";

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

    public class ExpenseService
    {
        private readonly ExpenseRepository _expenseRepository;

        public ExpenseService(ExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        public async Task AddExpenseAsync(User user, Expense expense)
        {
            var expenses = await _expenseRepository.LoadExpensesAsync();
            expenses.Add(expense);
            await _expenseRepository.SaveExpensesAsync(expenses);
        }

        public async Task<List<Expense>> GetAllExpensesAsync(User user)
        {
            return await _expenseRepository.LoadExpensesAsync();
        }

        public async Task<List<Expense>> GetExpensesByCategoryAsync(User user, string category)
        {
            var expenses = await _expenseRepository.LoadExpensesAsync();
            return expenses.FindAll(e => e.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<List<Expense>> GetExpensesByDateRangeAsync(User user, DateTime start, DateTime end)
        {
            var expenses = await _expenseRepository.LoadExpensesAsync();
            return expenses.FindAll(e => e.Date >= start && e.Date <= end);
        }

        public async Task<decimal> GetTotalExpenseAsync(User user, DateTime start, DateTime end)
        {
            var expenses = await GetExpensesByDateRangeAsync(user, start, end);
            return expenses.Sum(e => e.Amount);
        }
    }
}


//gjgkgjh
using System;
using Spectre.Console;

namespace ExpenseTracker.Utilities
{
    public static class ValidationHelper
    {
        public static decimal GetValidAmount()
        {
            while (true)
            {
                decimal amount = AnsiConsole.Ask<decimal>("Enter a valid [green]amount[/]: ");
                if (amount > 0) return amount;
                AnsiConsole.MarkupLine("[red]Invalid amount. Must be greater than zero.[/]");
            }
        }

        public static DateTime GetValidDate()
        {
            while (true)
            {
                string dateString = AnsiConsole.Ask<string>("Enter [blue]date (YYYY-MM-DD)[/]: ");
                if (DateTime.TryParse(dateString, out DateTime date)) return date;
                AnsiConsole.MarkupLine("[red]Invalid date format. Please enter in YYYY-MM-DD format.[/]");
            }
        }
    }
}



//hjhjgkhghk
