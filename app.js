const rawData = window.GOALS_DATA || [];
const data = rawData.map(row => Object.fromEntries(Object.entries(row).map(([k,v]) => [String(k).trim(), v])));
const charts = {};
const $ = id => document.getElementById(id);
const fields = {equipe:'EQUIPE',comp:'COMPETIÇÃO',adv:'ADVERSÁRIO',mando:'MANDO',autor:'AUTOR DO GOL',origem:'ORIGEM DA JOGADA'};
const filters = Object.keys(fields);
const el = id => $('f' + id.charAt(0).toUpperCase() + id.slice(1));
const value = (r,k) => r[k] ?? 'N/A';
function uniq(key){return [...new Set(data.map(r=>value(r,key)).filter(v=>v!==''&&v!==null&&v!=='N/A'))].sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));}
for(const [id,key] of Object.entries(fields)) uniq(key).forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;el(id).appendChild(o)});
function filtered(){return data.filter(r=>filters.every(id=>!el(id).value || String(value(r,fields[id]))===el(id).value));}
function countBy(arr,key){const c={};arr.forEach(r=>{const v=value(r,key);if(v!==''&&v!=='N/A'){c[v]=(c[v]||0)+1}});return Object.entries(c).sort((a,b)=>b[1]-a[1]);}
function destroy(id){if(charts[id]){charts[id].destroy();delete charts[id];}}
function makeChart(id,type,labels,values){destroy(id);const canvas=$(id);if(!canvas)return;charts[id]=new Chart(canvas,{type,data:{labels,datasets:[{data:values,borderWidth:1,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:type==='doughnut'?{}:{x:{ticks:{color:'#9aa7b4',font:{size:10}},grid:{color:'rgba(255,255,255,.05)'}},y:{beginAtZero:true,ticks:{color:'#9aa7b4',precision:0},grid:{color:'rgba(255,255,255,.05)'}}}}});}
function kpi(id,n){$(id).textContent=Number(n).toLocaleString('pt-BR');}
function renderGoals(){const d=filtered();const games=new Set(d.map(r=>`${value(r,'DATA')}|${value(r,'ADVERSÁRIO')}`)).size;kpi('kpiGoals',d.length);kpi('kpiGames',games);$('kpiAvg').textContent=games?(d.length/games).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}):'0,00';kpi('kpiHome',d.filter(r=>String(value(r,'MANDO')).toLowerCase()==='casa').length);kpi('kpiAway',d.filter(r=>String(value(r,'MANDO')).toLowerCase()==='fora').length);
const bins=[0,0,0,0,0,0];d.forEach(r=>{const m=Number(r.MINUTO)||0;if(m<=15)bins[0]++;else if(m<=30)bins[1]++;else if(m<=45)bins[2]++;else if(m<=60)bins[3]++;else if(m<=75)bins[4]++;else bins[5]++});makeChart('minuteChart','bar',['0–15','16–30','31–45','46–60','61–75','76–90+'],bins);
let a=countBy(d,'AUTOR DO GOL').slice(0,10);makeChart('scorerChart','bar',a.map(x=>x[0]),a.map(x=>x[1]));a=countBy(d,'ORIGEM DA JOGADA');makeChart('originChart','doughnut',a.map(x=>x[0]),a.map(x=>x[1]));a=countBy(d,'ZONA DA FINALIZAÇÃO');makeChart('zoneChart','bar',a.map(x=>x[0]),a.map(x=>x[1]));a=countBy(d,'FORMA DA FINALIZAÇÃO');makeChart('finishChart','doughnut',a.map(x=>x[0]),a.map(x=>x[1]));a=countBy(d,'COMPETIÇÃO');makeChart('compChart','bar',a.map(x=>x[0]),a.map(x=>x[1]));}
function renderAssist(){const d=filtered();const assisted=d.filter(r=>value(r,'ASSISTENTE')!=='N/A'&&value(r,'ASSISTENTE')!=='').length;kpi('kpiAssisted',assisted);kpi('kpiUnassisted',d.length-assisted);kpi('kpiAssistants',new Set(d.map(r=>value(r,'ASSISTENTE')).filter(v=>v!=='N/A'&&v!=='')).size);kpi('kpiThird',d.filter(r=>String(value(r,'TERÇO DA ASSISTÊNCIA')).startsWith('3')).length);
let a=countBy(d,'ASSISTENTE').slice(0,10);makeChart('assistantChart','bar',a.map(x=>x[0]),a.map(x=>x[1]));a=countBy(d,'TIPO DE PASSE/AÇÃO DA ASSISTÊNCIA');makeChart('passChart','bar',a.map(x=>x[0]),a.map(x=>x[1]));a=countBy(d,'ZONA DA ASSISTÊNCIA');makeChart('assistZoneChart','bar',a.map(x=>x[0]),a.map(x=>x[1]));a=countBy(d,'TERÇO DA ASSISTÊNCIA');makeChart('thirdChart','doughnut',a.map(x=>x[0]),a.map(x=>x[1]));}
function renderTable(){const d=filtered();const cols=['DATA','ADVERSÁRIO','RODADA','RESULTADO','MANDO','MINUTO','AUTOR DO GOL','POSIÇÃO DO AUTOR','ZONA DA FINALIZAÇÃO','ASSISTENTE','ZONA DA ASSISTÊNCIA','TIPO DE PASSE/AÇÃO DA ASSISTÊNCIA','ORIGEM DA JOGADA','FORMA DA FINALIZAÇÃO'];$('rowCount').textContent=`${d.length} registros`;$('thead').innerHTML='<tr>'+cols.map(c=>`<th>${c}</th>`).join('')+'</tr>';$('tbody').innerHTML=d.map(r=>'<tr>'+cols.map(c=>`<td>${value(r,c)}</td>`).join('')+'</tr>').join('');}
function currentPage(){return document.querySelector('.nav-item.active')?.dataset.page||'gols';}
function renderCurrent(){const p=currentPage();requestAnimationFrame(()=>{if(p==='gols')renderGoals();if(p==='assistencias')renderAssist();if(p==='dados')renderTable();});}
function showPage(p){document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===p));document.querySelectorAll('.page').forEach(s=>s.classList.add('hidden'));$(p+'Page').classList.remove('hidden');$('pageTitle').textContent=p==='gols'?'Análise de Gols':p==='assistencias'?'Análise de Assistências':'Base de Dados';renderCurrent();}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
document.querySelectorAll('.filters select').forEach(s=>s.addEventListener('change',renderCurrent));
$('reset').addEventListener('click',()=>{document.querySelectorAll('.filters select').forEach(s=>s.value='');renderCurrent()});
showPage('gols');
