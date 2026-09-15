export function calculateReadinessScore(metrics){return Math.round(metrics.reduce((sum,item)=>sum+item.score,0)/metrics.length)}
export function getReadinessLevel(score){if(score<40)return 'Getting Started';if(score<60)return 'Building Foundation';if(score<75)return 'Placement Ready Soon';if(score<90)return 'Strong Preparation';return 'Highly Prepared'}
export function getRecommendations(metrics){return [...metrics].sort((a,b)=>a.score-b.score).slice(0,3)}
