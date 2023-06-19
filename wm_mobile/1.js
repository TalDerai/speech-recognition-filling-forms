import { template, action } from './utils/templates.js'
import stringComparison from 'string-comparison'

const w =  'פקיד' //['פקידה','פקודה','הפקדה']
const str1 = 'פקידות להציק'

const findClosest = (k,list,w) => {
    let ls = stringComparison.levenshtein
    let ar = ls.sortMatch(w, list)
    let best = ar[ar.length - 1]    
    return {key: k, src: w, member: best.member, rate: best.rating}
}

const checkWord = (a,sum) => {
    const res = Object.keys(template).map(k=>{
        return findClosest(k,template[k],a)       
    }).sort((a1,a2)=>a2.rate-a1.rate)[0]
        return {...res,weight:res.src.length*res.rate/sum}
}

const findClosestAction = (w) => {
    let ls = stringComparison.levenshtein
    let ar = ls.sortMatch(w, Object.keys(action([''])))
    let best = ar[ar.length - 1]    
    return best //{key: k, src: w, member: best.member, rate: best.rating}
}

const permutator = (inputArr) => {
    let result = []
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice()
          let next = curr.splice(i, 1)
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
   
   return result;
}

const permuteStrings = s =>{
    const pr = s.split(/(\s+)/).filter( function(e) { return e.trim().length > 0 } )
    return permutator(pr).map(a=>a.join(' '))
    //console.log(123,p)
    //const res = p.join(' ')
    //return res
}

const check = (str) =>{
    const ar = str.split(/(\s+)/).filter( function(e) { return e.trim().length > 0 } )    
    const sum = ar.reduce((s,x)=>(0||s)+x.length,0)
    const arForReplace = ar.map(x=>checkWord(x,sum))
    const src = str
    arForReplace.forEach(x=>{
        str = str.replace(x.src,x.key)  
    })
    
    const all = permuteStrings(str)
    const act = all.map(x=>findClosestAction(x)).sort((a1,a2)=>a2.rating-a1.rating)[0]
    const res = {action: action([''])[act.member], src: src, norm: act.member }
    console.log(JSON.stringify(res))
}

check(str1)

