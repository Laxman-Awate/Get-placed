export function calculateReadinessScore(metrics){if(!Array.isArray(metrics)||!metrics.length)return 0;return Math.round(metrics.reduce((sum,item)=>sum+(Number(item.score)||0),0)/metrics.length)}
export function getReadinessLevel(score){if(score<40)return 'Getting Started';if(score<60)return 'Building Foundation';if(score<75)return 'Placement Ready Soon';if(score<90)return 'Strong Preparation';return 'Highly Prepared'}
export function getRecommendations(metrics){return [...metrics].sort((a,b)=>a.score-b.score).slice(0,3)}
