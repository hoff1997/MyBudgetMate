import { storage } from "./storage";
import { calculateNextPaymentDate } from "../shared/dateUtils";

export async function updateOverduePayments(): Promise<void> {
  try {
    const allEnvelopes = await storage.getEnvelopesByUserId(1);
    const today = new Date();
    
    for (const envelope of allEnvelopes) {
      if (envelope.nextPaymentDue && !envelope.isSpendingAccount) {
        const dueDate = new Date(envelope.nextPaymentDue);
        
        // If the due date has passed, calculate the next one
        if (dueDate <= today) {
          const nextDue = calculateNextPaymentDate(
            envelope.budgetFrequency || "monthly",
            dueDate
          );
          
          await storage.updateEnvelope(envelope.id, {
            nextPaymentDue: nextDue.toISOString()
          });
        }
      }
    }
  } catch (error) {
    console.error("Error updating overdue payments:", error);
  }
}

// Run the payment scheduler every hour
export function startPaymentScheduler(): void {
  // Run immediately on startup
  updateOverduePayments();
  
  // Then run every hour
  setInterval(() => {
    updateOverduePayments();
  }, 60 * 60 * 1000); // 1 hour in milliseconds
}