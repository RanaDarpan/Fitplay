// utils/computeTotalPoints.js
export const computeTotalPoints = (completedTasks) => {
    let totalPoints = 0;
    Object.values(completedTasks).forEach((week) => {
      if (typeof week !== "object" || week === null) return;
      Object.values(week).forEach((day) => {
        if (typeof day !== "object" || day === null) return;
        Object.values(day).forEach((exercise) => {
          if (exercise === true) {
            totalPoints += 5; // 5 points per completed exercise
          }
        });
      });
    });
    return totalPoints;
  };
  