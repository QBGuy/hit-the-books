interface BetCalculationInput {
  stake: number
  odds1: number
  odds2: number
  stake2Ratio: number
  betfairScalar?: number
  isBonus?: boolean
  bookie1?: string
  bookie2?: string
}

interface BetCalculationResult {
  stake1: number
  stake2: number
  effectiveOdds1: number
  effectiveOdds2: number
  payout1: number
  payout2: number
  totalPayout: number
  outlay: number
  profit: number
  profitPercentage: number
}

export function calculateBetOutcomes(input: BetCalculationInput): BetCalculationResult {
  const {
    stake,
    odds1,
    odds2,
    stake2Ratio,
    betfairScalar = 1,
    isBonus = false,
    bookie1,
    bookie2
  } = input

  // Calculate stakes - for bonus bets, stake1 outlay is 0
  const stake1 = isBonus ? 0 : stake
  const stake2 = stake * stake2Ratio

  // Apply Betfair scalar if applicable
  let effectiveOdds1 = bookie1 === 'betfair_ex_au' ? 
    (odds1 - 1) * betfairScalar + 1 : 
    odds1

  let effectiveOdds2 = bookie2 === 'betfair_ex_au' ? 
    (odds2 - 1) * betfairScalar + 1 : 
    odds2

  // For bonus bets, we still want the full payout calculation to use the original stake
  const payoutStake1 = stake  // Always use original stake for payout calculation
  const payout1 = payoutStake1 * (isBonus ? effectiveOdds1 - 1 : effectiveOdds1)  // For bonus, only get the profit portion
  const payout2 = stake2 * effectiveOdds2

  // Calculate totals
  const outlay = stake1 + stake2  // For bonus bets, this will only be stake2
  const totalPayout = Math.min(payout1, payout2)
  const profit = totalPayout - outlay
  
  // Profit percentage is now directly from the API value
  const profitPercentage = profit / stake * 100  // No need to multiply by 100 as API already provides percentage

  return {
    stake1,
    stake2,
    effectiveOdds1,
    effectiveOdds2,
    payout1,
    payout2,
    totalPayout,
    outlay,
    profit,
    profitPercentage
  }
}

// Helper function to calculate profit for display
export function calculateDisplayProfit(
  stake: number,
  odds1: number,
  odds2: number,
  stake2Ratio: number,
  isBonus: boolean = false
): { profit: number; profitPercentage: number } {
  const result = calculateBetOutcomes({
    stake,
    odds1,
    odds2,
    stake2Ratio,
    isBonus
  })
  
  return {
    profit: result.profit,
    profitPercentage: result.profitPercentage
  }
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Helper function to format percentage
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(2)}%`
} 