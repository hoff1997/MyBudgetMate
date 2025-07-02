import { storage } from "./storage";

// Calculate next payment date based on frequency
export function calculateNextPaymentDate(currentDate: Date, frequency: string): Date {
  const nextDate = new Date(currentDate);
  
  switch (frequency) {
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "fortnightly":
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "quarterly":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case "annually":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 7); // Default to weekly
  }
  
  return nextDate;
}

// Check and update overdue payment dates
export async function updateOverduePaymentDates(): Promise<void> {
  try {
    const allUsers = await storage.getAllUsers();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison

    for (const user of allUsers) {
      const envelopes = await storage.getEnvelopesByUserId(user.id);
      
      for (const envelope of envelopes) {
        if (envelope.nextPaymentDue && envelope.budgetFrequency) {
          const dueDate = new Date(envelope.nextPaymentDue);
          dueDate.setHours(0, 0, 0, 0);
          
          // If the due date has passed, advance it
          if (dueDate <= today) {
            const newDueDate = calculateNextPaymentDate(dueDate, envelope.budgetFrequency);
            
            await storage.updateEnvelope(envelope.id, {
              nextPaymentDue: newDueDate,
            });
            
            console.log(`Advanced payment date for envelope ${envelope.name} (ID: ${envelope.id}) from ${dueDate.toISOString().split('T')[0]} to ${newDueDate.toISOString().split('T')[0]}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating overdue payment dates:', error);
  }
}

// Start the date advancement scheduler
export function startDateAdvancementScheduler(): void {
  // Run immediately on startup
  updateOverduePaymentDates();
  
  // Run every hour to check for overdue dates
  setInterval(updateOverduePaymentDates, 60 * 60 * 1000); // 1 hour
  
  console.log('Date advancement scheduler started - checking for overdue payment dates every hour');
}