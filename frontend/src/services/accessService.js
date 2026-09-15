import { ACCESS_LEVELS, CURRENT_USER_PLAN } from '../constants/access';
export function isPremiumFeature(content){return content?.access===ACCESS_LEVELS.PREMIUM||content?.premium===true||content?.isFree===false;}
export function getAccessState(content, plan=CURRENT_USER_PLAN){if(!content)return ACCESS_LEVELS.LOCKED;if(content.access===ACCESS_LEVELS.FREE||content.isFree===true||content.free===true)return ACCESS_LEVELS.FREE;if(isPremiumFeature(content))return plan==='premium'?ACCESS_LEVELS.FREE:ACCESS_LEVELS.LOCKED;return content.access||ACCESS_LEVELS.PREVIEW;}
export function canAccessContent(content, plan=CURRENT_USER_PLAN){return getAccessState(content,plan)!==ACCESS_LEVELS.LOCKED;}
