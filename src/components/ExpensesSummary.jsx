import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchData } from "../helpers";
import { aiService } from "../services/aiService";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensesSummary = () => {
  const [chartData, setChartData] = useState({});
  const [aiRecommendations, setAiRecommendations] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const budgets = fetchData("budgets") || [];
    const expenses = fetchData("expenses") || [];

    const budgetLabels = budgets.map((budget) => budget.name);
    const budgetSpent = budgets.map((budget) => {
      return expenses
        .filter((expense) => expense.budgetId === budget.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
    });

    setChartData({
      labels: budgetLabels,
      datasets: [
        {
          label: "Expenses Distribution",
          data: budgetSpent,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    });

    const fetchAIRecommendations = async () => {
      try {
        setIsLoading(true);
        
        // Use the aiService instead of directly calling the model
        const insights = await aiService.getFinancialInsights(budgets, expenses);
        
        // Process the response
        if (insights && insights.fullResponse) {
          setAiRecommendations(insights.fullResponse);
        } else if (insights && insights.error) {
          setAiRecommendations(`Unable to generate recommendations: ${insights.error}`);
        } else {
          setAiRecommendations("No recommendations available at this time.");
        }
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        setAiRecommendations("Sorry, we couldn't generate recommendations at the moment.");
      } finally {
        setIsLoading(false);
      }
    };

    if (budgets.length > 0 && expenses.length > 0) {
      fetchAIRecommendations();
    } else {
      setIsLoading(false);
      setAiRecommendations("Add budgets and expenses to see AI recommendations.");
    }
  }, []);

  return (
    <div
      className="expenses-summary"
      style={{
        fontFamily: "var(--font-family, Arial, sans-serif)",
        padding: "var(--space-lg, 20px)",
        backgroundColor: "var(--color-surface, #f4f6f9)",
        width: "100%",
      }}
    >
      <h2 style={{ textAlign: "center", color: "var(--color-text, #333)", marginBottom: "var(--space-md, 20px)" }}>
        Expense Summary
      </h2>

      <div
        className="content-wrapper"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "var(--space-md, 20px)",
          flexWrap: "wrap",
        }}
      >
        <div
          className="chart-container"
          style={{
            flex: "1 1 45%",
            maxWidth: "50%",
            height: "auto",
            padding: "var(--space-md, 20px)",
            backgroundColor: "var(--color-background, #fff)",
            borderRadius: "var(--border-radius-lg, 10px)",
            boxShadow: "var(--shadow-md, 0 4px 10px rgba(0, 0, 0, 0.1))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <p style={{ textAlign: "center", color: "var(--color-text-secondary, #666)" }}>Loading chart...</p>
          ) : (
            <Pie
              data={chartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          )}
        </div>

        <div
          className="ai-recommendations"
          style={{
            flex: "1 1 45%",
            maxWidth: "50%",
            height: "auto",
            padding: "var(--space-md, 20px)",
            backgroundColor: "var(--color-background, #fff)",
            borderRadius: "var(--border-radius-lg, 10px)",
            boxShadow: "var(--shadow-md, 0 4px 10px rgba(0, 0, 0, 0.1))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3
            style={{ color: "var(--color-text-secondary, #555)", textAlign: "center", marginBottom: "var(--space-md, 20px)" }}
          >
            AI Recommendations
          </h3>

          {isLoading ? (
            <p style={{ textAlign: "center", color: "var(--color-text-secondary, #666)" }}>
              Loading recommendations...
            </p>
          ) : (
            <div
              style={{
                lineHeight: "1.6",
                color: "var(--color-text, #444)",
                textAlign: "left",
              }}
            >
              {aiRecommendations ? (
                aiRecommendations.split("\n").map((line, index) => (
                  <p key={index} style={{ margin: "5px 0" }}>
                    {line}
                  </p>
                ))
              ) : (
                <p style={{ textAlign: "center" }}>No recommendations available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesSummary;
