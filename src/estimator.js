function timeNormalizer(periodType, time) {
  let timeMultiplier;

  switch (periodType) {
    case 'days':
      timeMultiplier = 1;
      break;
    case 'weeks':
      timeMultiplier = 7;
      break;
    case 'months':
      timeMultiplier = 30;
      break;
    default:
      timeMultiplier = 1;
  }

  return time * timeMultiplier;
}

function estimate(infected, days, doublerate) {
  return infected * 2 ** Math.floor(days / doublerate);
}

const covid19ImpactEstimator = (data) => {
  const { reportedCases, timeToElapse, periodType } = data;

  const daysToDouble = 3;

  const days = timeNormalizer(periodType, timeToElapse);

  const currentlyInfected = reportedCases * 10;

  const severeInfected = reportedCases * 50;

  return {
    data,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime: estimate(currentlyInfected, days, daysToDouble)
    },
    severeImpact: {
      currentlyInfected: severeInfected,
      infectionsByRequestedTime: estimate(severeInfected, days, daysToDouble)
    }
  };
};

// console.log(
//   covid19ImpactEstimator({
//     region: {
//       name: 'Africa',
//       avgAge: 19.7,
//       avgDailyIncomeInUSD: 5,
//       avgDailyIncomePopulation: 0.71
//     },
//     periodType: 'days',
//     timeToElapse: 38,
//     reportedCases: 2747,
//     population: 66622705,
//     totalHospitalBeds: 1380614
//   })
// );

export default covid19ImpactEstimator;
