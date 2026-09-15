import { useEffect, useState } from 'react'; import { mockTestService } from '../services/mockTestService';
export function useMockTests(){const [state,setState]=useState({tests:[],history:[],loading:true}); useEffect(()=>{Promise.all([mockTestService.getMockTests(),mockTestService.getMockTestHistory()]).then(([tests,history])=>setState({tests,history,loading:false}));},[]); return state;}
