import { useEffect, useState } from 'react'; import { aptitudeService } from '../services/aptitudeService';
export function useAptitudeTopics(categoryId) { const [state,setState]=useState({topics:[],loading:true}); useEffect(()=>{aptitudeService.getTopics(categoryId).then(topics=>setState({topics,loading:false}));},[categoryId]); return state; }
