export function calculateFundEconomics(params) {
  const {
    fundSize = 100000000,
    managementFee = 2.0,
    carryRate = 20,
    hurdleRate = 8,
    catchUp = true,
    gpCommitment = 2,
    fundTerm = 10,
    investmentPeriod = 5,
    expectedGrossReturns = 15,
  } = params;

  const gpCommitAmount = fundSize * (gpCommitment / 100);
  const lpCommitment = fundSize - gpCommitAmount;

  // Annual management fees
  const annualMgmtFees = [];
  let totalMgmtFees = 0;
  for (let year = 1; year <= fundTerm; year++) {
    const basis = year <= investmentPeriod ? fundSize : fundSize * 0.7;
    const fee = basis * (managementFee / 100);
    totalMgmtFees += fee;
    annualMgmtFees.push({ year, fee, cumulativeFee: totalMgmtFees, basis });
  }

  // Calculate returns under different scenarios
  const scenarios = [
    { label: '1x Return', multiple: 1.0 },
    { label: '1.5x Return', multiple: 1.5 },
    { label: '2x Return', multiple: 2.0 },
    { label: '3x Return', multiple: 3.0 },
  ];

  const scenarioResults = scenarios.map((scenario) => {
    const totalProceeds = fundSize * scenario.multiple;
    const netProceeds = totalProceeds - totalMgmtFees;
    return calculateWaterfall(netProceeds, lpCommitment, gpCommitAmount, hurdleRate, carryRate, catchUp, fundTerm);
  });

  // Expected return scenario
  const expectedTotalReturn = fundSize * Math.pow(1 + expectedGrossReturns / 100, fundTerm);
  const expectedNetProceeds = expectedTotalReturn - totalMgmtFees;
  const expectedWaterfall = calculateWaterfall(expectedNetProceeds, lpCommitment, gpCommitAmount, hurdleRate, carryRate, catchUp, fundTerm);

  // Effective GP economics
  const effectiveGPEconomics = {
    totalMgmtFees,
    expectedCarry: expectedWaterfall.carry,
    totalGPRevenue: totalMgmtFees + expectedWaterfall.carry,
    gpRevenueAsPercentOfFund: ((totalMgmtFees + expectedWaterfall.carry) / fundSize) * 100,
    mgmtFeeAsPercentOfFund: (totalMgmtFees / fundSize) * 100,
  };

  return {
    annualMgmtFees,
    totalMgmtFees,
    scenarios: scenarios.map((s, i) => ({ ...s, ...scenarioResults[i] })),
    expectedWaterfall,
    effectiveGPEconomics,
    gpCommitAmount,
    lpCommitment,
  };
}

function calculateWaterfall(totalProceeds, lpCommitment, gpCommitAmount, hurdleRate, carryRate, catchUp, fundTerm) {
  const totalCommitment = lpCommitment + gpCommitAmount;
  let remaining = totalProceeds;

  // Step 1: Return of capital
  const capitalReturn = Math.min(remaining, totalCommitment);
  remaining -= capitalReturn;
  const lpCapitalReturn = capitalReturn * (lpCommitment / totalCommitment);
  const gpCapitalReturn = capitalReturn * (gpCommitAmount / totalCommitment);

  // Step 2: Preferred return (hurdle)
  const hurdleAmount = lpCommitment * (Math.pow(1 + hurdleRate / 100, fundTerm) - 1);
  const preferredReturn = Math.min(remaining, hurdleAmount);
  remaining -= preferredReturn;

  // Step 3: GP catch-up
  let gpCatchUp = 0;
  if (catchUp && remaining > 0) {
    const catchUpTarget = (preferredReturn + remaining) * (carryRate / 100);
    gpCatchUp = Math.min(remaining, catchUpTarget);
    remaining -= gpCatchUp;
  }

  // Step 4: Carry split
  const carry = remaining * (carryRate / 100);
  const lpShare = remaining * (1 - carryRate / 100);

  const totalLP = lpCapitalReturn + preferredReturn + lpShare;
  const totalGP = gpCapitalReturn + gpCatchUp + carry;
  const totalCarry = gpCatchUp + carry;

  return {
    capitalReturn: { lp: lpCapitalReturn, gp: gpCapitalReturn },
    preferredReturn,
    gpCatchUp,
    carry: totalCarry,
    lpProceeds: totalLP,
    gpProceeds: totalGP,
    totalProceeds,
    lpMultiple: lpCommitment > 0 ? totalLP / lpCommitment : 0,
    gpMultiple: gpCommitAmount > 0 ? totalGP / gpCommitAmount : 0,
    lpIRR: lpCommitment > 0 ? (Math.pow(totalLP / lpCommitment, 1 / fundTerm) - 1) * 100 : 0,
    waterfall: [
      { step: 'Return of Capital', lp: lpCapitalReturn, gp: gpCapitalReturn },
      { step: 'Preferred Return', lp: preferredReturn, gp: 0 },
      { step: 'GP Catch-up', lp: 0, gp: gpCatchUp },
      { step: 'Carried Interest Split', lp: lpShare, gp: carry },
    ],
  };
}
