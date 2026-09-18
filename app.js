const companies = [
  { id: 'red', name: 'NovaTech', sector: 'Technology', icon: '✦', color: '#d35f62', kv: 30, tc: 42, branches: 5, owned: 2, history: [18, 22, 20, 27, 30, 35, 42] },
  { id: 'yellow', name: 'HelioGrid', sector: 'Energy', icon: '◒', color: '#c5b568', kv: 20, tc: 27, branches: 3, owned: 1, history: [18, 16, 21, 19, 22, 25, 27] },
  { id: 'green', name: 'VitaPharm', sector: 'Pharma', icon: '✚', color: '#4d916f', kv: 40, tc: 55, branches: 6, owned: 4, history: [25, 31, 30, 38, 35, 48, 55] },
  { id: 'blue', name: 'UnionBank', sector: 'Finance', icon: '▦', color: '#477ca0', kv: 20, tc: 18, branches: 2, owned: 0, history: [32, 28, 25, 29, 22, 20, 18] }
];
const managementCompanies = [
  { id:'aether', name:'Aether Robotics', sector:'Automation', icon:'◈', color:'#d35f62', pros:'Fast growth, premium contracts', cons:'High R&D burn' },
  { id:'solara', name:'Solara Grid', sector:'Clean energy', icon:'☀', color:'#c5b568', pros:'Public support, stable demand', cons:'Capital-heavy rollout' },
  { id:'meridian', name:'Meridian Health', sector:'Biotech', icon:'✚', color:'#4d916f', pros:'Defensive demand, loyal talent', cons:'Long approval cycles' },
  { id:'northstar', name:'Northstar Capital', sector:'Finance', icon:'▦', color:'#477ca0', pros:'Strong cash generation', cons:'Rate sensitive, regulated' },
  { id:'orbit', name:'Orbit Logistics', sector:'Mobility', icon:'⊙', color:'#c87848', pros:'Network effects, global reach', cons:'Fuel and labor exposure' },
  { id:'terra', name:'Terra Foods', sector:'Consumer', icon:'◇', color:'#8e709b', pros:'Reliable volume, brand trust', cons:'Thin margins, climate risk' }
];
const events = [
  { title: 'AI breakthrough', text: 'NovaTech ships an everyday AI assistant. Investors rush in.', tag: 'NOVA TECH', effect: 'NovaTech +20 | all others -10' },
  { title: 'Green dividend', text: 'HelioGrid wins a major renewable infrastructure contract.', tag: 'HELIOGRID', effect: 'HelioGrid +20 | charity bonus unlocked' },
  { title: 'Rate shock', text: 'The central bank raises rates to cool inflation.', tag: 'MACRO', effect: 'UnionBank +20 | others -10' },
  { title: 'New medicine', text: 'VitaPharm announces a breakthrough treatment.', tag: 'VITAPHARM', effect: 'VitaPharm +20 | demand surges' }
];
let state = { screen: 'setup', mode: 'basic', bots: 2, skill: 'sharp', botBrains: ['sharp', 'steady', 'casual', 'steady', 'sharp', 'casual'], round: 1, turn: 0, cash: 0, charity: 0, branches: [], log: ['Welcome to Market Mayhem. Build something brilliant.'], eventIndex: 0, gameMode: 'market', managementCompany: 'aether', phase: 'pre-roll', theme: 'dark', stockSetter: 'Maya Chen', payoutCadence: 'quarterly', payoutTax: 0 };

const app = document.querySelector('#app');
const money = value => `€${Math.max(0, Math.round(value)).toLocaleString()}`;
function render() { state.screen === 'setup' ? renderSetup() : renderGame(); }
function renderSetup() {
  state.screen = 'setup';
  if (!['market', 'operations'].includes(state.gameMode)) state.gameMode = 'market';
  if (!managementCompanies.some(company => company.id === state.managementCompany)) state.managementCompany = managementCompanies[0].id;
  app.innerHTML = `<section class="setup-shell">
    <div class="setup-art"><div class="brand"><span class="brand-mark"><i></i><i></i><i></i><i></i></span> investutor</div><div class="art-copy"><div class="eyebrow">A financial strategy game</div><h1>Make the market. Make your move.</h1><p>Grow companies, read the room, and build a portfolio that survives the next headline.</p></div><div class="ticker-strip"><span>Buy low</span><span>Build smart</span><span>Sell high</span></div></div>
    <div class="setup-panel"><div class="setup-card"><div class="eyebrow">New game</div><h2>Choose your table</h2><p class="subtitle">Play the approachable market game, or bring in events, charity and company operations for the full challenge.</p>
      <div class="mode-grid"><button class="mode-option ${state.mode === 'basic' ? 'selected' : ''}" data-mode="basic"><strong>Basic level</strong><small>Classic buy, build, dividend and sell.</small></button><button class="mode-option ${state.mode === 'advanced' ? 'selected' : ''}" data-mode="advanced"><strong>Advanced level</strong><small>Market news, market prices and charity tax relief.</small></button></div>
      <label class="field-label">Company management mode</label><button class="mode-option ${state.gameMode === 'operations' ? 'selected' : ''}" data-gamemode="operations"><strong>Run the companies <span style="color:var(--orange-dark)">NEW</span></strong><small>Hire leaders, unlock projects and expand a sector alongside the market.</small></button>
      ${state.gameMode === 'operations' ? `<label class="field-label">Choose your company</label><div class="management-picks">${managementCompanies.map(company => `<button class="management-pick ${state.managementCompany === company.id ? 'selected' : ''}" data-company="${company.id}"><strong>${company.icon} ${company.name}</strong><small>${company.sector}</small><em>+ ${company.pros}</em><em>- ${company.cons}</em></button>`).join('')}</div>` : ''}
      ${state.gameMode === 'operations' ? `<label class="field-label">Cash payout cadence</label><select class="theme-select" id="payout-cadence"><option value="turn" ${state.payoutCadence === 'turn' ? 'selected' : ''}>Every turn · +8% tax</option><option value="biquarterly" ${state.payoutCadence === 'biquarterly' ? 'selected' : ''}>Every 2 turns · +4% tax</option><option value="quarterly" ${state.payoutCadence === 'quarterly' ? 'selected' : ''}>Every 4 turns · standard tax</option><option value="yearly" ${state.payoutCadence === 'yearly' ? 'selected' : ''}>Every 16 turns · -3% tax</option></select>` : ''}
      <label class="field-label">Rival bots</label><div class="bot-picks">${Array.from({length: state.gameMode === 'operations' ? 7 : 4}, (_, index) => index).map(n => `<button class="bot-pick ${state.bots === n ? 'selected' : ''}" data-bots="${n}">${n === 0 ? 'Solo' : `${n} bot${n > 1 ? 's' : ''}`}<span>${n === 0 ? 'Practice table' : 'Compete at the table'}</span></button>`).join('')}</div>
      ${state.bots ? `<label class="field-label">Bot intelligence</label><select class="theme-select" id="skill"><option value="casual" ${state.skill === 'casual' ? 'selected' : ''}>Casual · makes bold mistakes</option><option value="steady" ${state.skill === 'steady' ? 'selected' : ''}>Steady · reads the basics</option><option value="sharp" ${state.skill === 'sharp' ? 'selected' : ''}>Sharp · hunts for value</option></select>` : ''}
      <button class="primary full" id="start">${state.gameMode === 'operations' ? 'Open company headquarters' : 'Start the market'} <span>→</span></button></div></div></section>`;
  app.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { state.mode = b.dataset.mode; render(); });
  app.querySelectorAll('[data-gamemode]').forEach(b => b.onclick = () => { state.gameMode = state.gameMode === 'market' ? 'operations' : 'market'; render(); });
  app.querySelectorAll('[data-company]').forEach(b => b.onclick = () => { state.managementCompany = b.dataset.company; render(); });
  app.querySelectorAll('[data-bots]').forEach(b => b.onclick = () => { state.bots = Number(b.dataset.bots); render(); });
  const skill = app.querySelector('#skill'); if (skill) skill.onchange = e => state.skill = e.target.value;
  const payoutCadence = app.querySelector('#payout-cadence'); if (payoutCadence) payoutCadence.onchange = e => state.payoutCadence = e.target.value;
  app.querySelector('#start').onclick = () => { state.screen = 'game'; state.cash = state.gameMode === 'operations' ? 80 : 0; state.branches = state.gameMode === 'operations' ? [] : seedBranches(); if (state.gameMode === 'operations') resetOperations(); render(); toast(state.gameMode === 'operations' ? 'Your company is incorporated. Build the team.' : 'The opening bell rings. Your move.'); };
}
function seedBranches() { return [{c:'red',p:10},{c:'red',p:11},{c:'red',p:18},{c:'yellow',p:36},{c:'yellow',p:37},{c:'green',p:53},{c:'green',p:54},{c:'green',p:61},{c:'blue',p:26},{c:'blue',p:27}]; }
function sparkline(company) { const points = company.history.map((value, index) => `${index * 12},${42 - value / 3}`).join(' '); return `<svg class="spark" viewBox="0 0 84 44" role="img" aria-label="${company.name} price trend"><polyline points="${points}" /></svg>`; }
function currentPlayer() { return state.phase === 'between' ? 'Rivals are acting' : 'You'; }
function canAct() { return state.phase !== 'between'; }
function getBotSkill(index) { return state.botBrains?.[index] || state.skill; }
function renderGame() {
  const event = events[state.eventIndex % events.length];
  const players = [{name:'You', score: portfolioValue(), cash: state.cash, me:true}, ...Array.from({length:state.bots}, (_,i) => ({name:['Maya','Theo','Aria'][i], score: [420,385,350][i] + state.round * 12, cash: 80 + state.round * 5}))];
    const actionDisabled = state.phase === 'between' ? 'disabled' : '';
     const operations = state.gameMode === 'operations' ? `<section class="card operations-card"><div class="card-head"><div><div class="eyebrow">Company control room</div><h3>Run the companies</h3></div><span class="status-live">LIVE OPS</span></div><div class="managed-company-banner"><span>You run</span><strong>${managementCompanies.find(company => company.id === state.managementCompany).name}</strong><small>${managementCompanies.find(company => company.id === state.managementCompany).pros}</small></div><div class="ops-grid">${managementCompanies.map((company, index) => `<article class="ops-company ${company.id === state.managementCompany ? 'managed' : ''}" style="--accent:${company.color}"><div class="ops-company-top"><span class="company-icon">${company.icon}</span><div><strong>${company.name}</strong><small>${company.sector} division</small></div><span class="trend-up">+${index + 1 + state.round}%</span></div><div class="ops-metrics"><span><b>${2 + index}</b> staff</span><span><b>${3 + index + state.round}</b> projects</span><span><b>${money(40 + index * 20)}</b> burn</span></div><div class="progress"><i style="width:${35 + index * 9}%"></i></div><div class="ops-actions"><button data-hire-company="${company.id}" ${actionDisabled}>Hire team</button><button data-project-company="${company.id}" ${actionDisabled}>Fund project</button></div></article>`).join('')}</div><div class="operations-footer"><span>Quarterly runway <b>${money(960 - state.round * 40)}</b></span><span>Productivity <b>${Math.min(99, 62 + state.round * 4)}%</b></span><span>Next review <b>Round ${state.round + 1}</b></span></div></section>` : '';
  app.innerHTML = `<div class="app-shell"><header class="topbar"><div class="brand"><span class="brand-mark"><i></i><i></i><i></i><i></i></span> investutor</div><div class="top-actions"><span class="round-pill">ROUND ${state.round} · ${state.mode.toUpperCase()}</span><span class="turn-chip"><b></b>${currentPlayer()}</span><button class="ghost" id="theme">☼ Light</button><button class="ghost" id="settings">⚙ Advanced settings</button><button class="ghost" id="new">New game</button></div></header><div class="dashboard"><div class="hero-row"><div><div class="eyebrow">${state.gameMode === 'operations' ? 'Market + operations desk' : 'Your trading floor'}</div><h1>Good morning, investor.</h1><p>Build chains. Spot momentum. Leave the table richer than you found it.</p><div class="table-status"><span><b>Stock setter</b> ${state.stockSetter}</span><span><b>Current turn</b> ${currentPlayer()}</span><span><b>Action window</b> ${state.phase === 'pre-roll' ? 'Before roll' : state.phase === 'post-roll' ? 'After roll' : 'Locked'}</span></div></div><span class="round-pill">YOUR PORTFOLIO ${money(portfolioValue())}</span></div><div class="dashboard-grid"><div><section class="card board-card"><div class="card-head"><h3>Company board</h3><small>Place a branch to grow a chain</small></div><div class="board">${Array.from({length:64}, (_,i) => { const branch=state.branches.find(x=>x.p===i); return `<button class="cell ${branch ? 'hot' : ''}" data-cell="${i}" ${actionDisabled}>${branch ? `<span class="branch ${branch.c}"></span>` : (i%9===0 ? '✦' : '')}</button>`; }).join('')}</div><div class="legend"><span><b style="background:var(--red)"></b>Technology</span><span><b style="background:var(--yellow)"></b>Energy</span><span><b style="background:var(--green)"></b>Pharma</span><span><b style="background:var(--blue)"></b>Finance</span></div></section>${operations}<section class="card market-card"><div class="card-head"><h3>Market board</h3><small>${state.mode === 'advanced' ? 'TC prices active this round' : 'Book values · KV'}</small></div><div class="stocks">${companies.map(company => `<article class="stock" style="--accent:${company.color}"><div class="stock-top"><h4>${company.icon} ${company.name}</h4><small>${company.sector}</small></div><div class="price">${money(state.mode === 'advanced' ? company.tc : company.kv)} <small>${state.mode === 'advanced' ? 'TC' : 'KV'}</small></div>${sparkline(company)}<div class="price-line"><span>Book value <strong>${money(company.kv)}</strong></span><span>Owned <strong>${company.owned}</strong></span></div><div class="trade-row"><button data-buy="${company.id}" ${actionDisabled}>Buy 1</button><button data-sell="${company.id}" ${actionDisabled}>Sell 1</button></div></article>`).join('')}</div></section></div><aside class="right-stack"><section class="card event-card ${state.mode === 'basic' ? 'advanced-hidden' : ''}"><div class="eyebrow">${state.mode === 'advanced' ? 'Market news · active now' : 'Advanced feature locked'}</div><h3>${state.mode === 'advanced' ? event.title : 'Unlock market news'}</h3><p>${state.mode === 'advanced' ? event.text : 'Advanced level adds price shocks, temporary restrictions and sharper table decisions.'}</p><div class="event-foot"><span>${state.mode === 'advanced' ? event.tag : 'ADVANCED ONLY'}</span><span>${state.mode === 'advanced' ? event.effect : 'Enable in setup'}</span></div></section><section class="card players-card"><div class="card-head"><h3>Table standings</h3><small>Live portfolio value</small></div>${players.map((player,index)=>`<div class="player ${player.me ? 'active-player' : ''}"><div class="avatar" style="${player.me ? 'background:#f7e5c8' : ''}">${player.name[0]}</div><div><strong>${player.name} ${player.me ? '<small style="color:var(--orange-dark)">YOU</small>' : ''}</strong><small>${player.me ? 'Your trading desk' : `${state.skill} bot · ${player.cash ? 'active' : 'waiting'}`}</small></div><div class="player-score">${money(player.score)}<small>${index === 0 ? 'in front' : `#${index+1}`}</small></div></div>`).join('')}</section><section class="card action-card"><div class="card-head"><h3>${state.phase === 'between' ? 'Turn complete' : state.gameMode === 'operations' ? 'Operations desk' : 'Your move'}</h3><span class="phase-label">${state.phase === 'between' ? 'WAITING' : state.phase === 'pre-roll' ? 'PRE-ROLL' : 'POST-ROLL'}</span></div><div class="action-grid">${state.gameMode === 'operations' ? '<button id="hire" '+actionDisabled+'><strong>Hire talent</strong><small>+1 company growth</small></button><button id="expand" '+actionDisabled+'><strong>Fund expansion</strong><small>Build a new branch</small></button>' : '<button id="roll" '+(state.phase !== 'pre-roll' || state.phase === 'between' ? 'disabled' : '')+'><strong>Roll the dice</strong><small>Grow the market</small></button><button id="charity" '+actionDisabled+'><strong>Donate €20</strong><small>Tax relief in advanced</small></button>'}<button id="event" class="advanced-control ${state.mode === 'basic' ? 'is-hidden' : ''}" ${actionDisabled}><strong>Next headline</strong><small>Change the market pulse</small></button>${state.phase === 'between' ? '<button id="resume"><strong>Start next turn</strong><small>Rivals have finished acting</small></button>' : '<button id="end" '+actionDisabled+'><strong>End turn</strong><small>Lock your action window</small></button>'}</div><div class="log">${state.log.slice(-5).reverse().map(message=>`<div>• ${message}</div>`).join('')}</div></section></aside></div></div></div>`;
  app.querySelector('.app-shell')?.classList.add(`mode-${state.gameMode}`);
  if (isOperationsMode()) decorateOperationsDesk();
  decorateLiveControls();
  wireGame();
}
function portfolioValue() { return state.cash + companies.reduce((sum,c) => sum + c.owned * c.kv, 0) + state.charity; }

const expansionCountries = [
  { id: 'japan', name: 'Japan', flag: 'JP', demand: 'Precision automation', cost: 34, reward: 14, risk: 'Slow approvals' },
  { id: 'brazil', name: 'Brazil', flag: 'BR', demand: 'Fast-growing middle class', cost: 28, reward: 12, risk: 'Currency swings' },
  { id: 'germany', name: 'Germany', flag: 'DE', demand: 'Industrial partnerships', cost: 42, reward: 20, risk: 'Compliance burden' },
  { id: 'kenya', name: 'Kenya', flag: 'KE', demand: 'Mobile-first customers', cost: 22, reward: 10, risk: 'Infrastructure gaps' },
  { id: 'canada', name: 'Canada', flag: 'CA', demand: 'Public innovation funds', cost: 30, reward: 13, risk: 'Talent competition' }
];

function operationCash() {
  const operations = ensureOperationsState();
  operations.cash = state.cash;
  return operations.cash;
}

function spendOperationCash(amount) {
  if (operationCash() < amount) return false;
  state.cash -= amount;
  ensureOperationsState().cash = state.cash;
  return true;
}

function refreshLeaderPool() {
  const operations = ensureOperationsState();
  const offset = operations.poolOffset || 0;
  operations.leaderPool = [0, 1, 2].map(index => leaderRoster[(offset + index + operations.quarter) % leaderRoster.length]);
  operations.poolOffset = offset;
  return operations.leaderPool;
}

function rotateLeaderPool() {
  const operations = ensureOperationsState();
  operations.poolOffset = (operations.poolOffset || 0) + 2;
  operations.leaderPool = refreshLeaderPool();
  pushNotification('Talent market refreshed', 'Three new leadership candidates are available.', 'neutral');
  return operations.leaderPool;
}

function expandIntoCountry(countryId) {
  const operations = ensureOperationsState();
  const country = expansionCountries.find(candidate => candidate.id === countryId);
  if (!country || operations.countries?.some(active => active.id === country.id)) return false;
  if (!spendOperationCash(country.cost)) return false;
  operations.countries = operations.countries || [];
  operations.countries.push({ ...country, quarterOpened: operations.quarter });
  operations.revenue += country.reward;
  operations.reputation += 3;
  pushNotification(`Entered ${country.name}`, `${country.demand} is now part of your growth plan.`, 'positive');
  return true;
}

function bribePolitician(policyId) {
  const operations = ensureOperationsState();
  const policy = policyLevers.find(candidate => candidate.id === policyId);
  if (!policy || !spendOperationCash(policy.cost + 8)) return false;
  operations.policy += policy.power + 5;
  operations.reputation = Math.max(0, operations.reputation - 2);
  operations.selectedPolicy = policy.id;
  pushNotification('Quiet influence applied', `${policy.title} moved forward, but the reputational risk remains.`, 'negative');
  return true;
}

function campaignForPolicy(policyId) {
  const operations = ensureOperationsState();
  const policy = policyLevers.find(candidate => candidate.id === policyId);
  if (!policy || !spendOperationCash(policy.cost)) return false;
  operations.policy += policy.power;
  operations.reputation += 2;
  operations.selectedPolicy = policy.id;
  pushNotification('Public coalition built', `${policy.benefit} is now backed by a visible campaign.`, 'positive');
  return true;
}

function formatLeaderCard(leader) {
  const hired = ensureOperationsState().leaders.some(candidate => candidate.id === leader.id);
  const cost = nextLeaderCost(leader);
  return `<article class="leader-card ${hired ? 'leader-hired' : ''}"><div class="leader-avatar">${leader.name.split(' ').map(part => part[0]).join('')}</div><div class="leader-copy"><strong>${leader.name}</strong><small>${leader.role} · Level ${leader.level}</small><p>${leader.description}</p><span class="leader-specialty">${leader.specialty}</span></div><button class="ops-control" data-leader="${leader.id}" ${hired || !canAct() ? 'disabled' : ''}>${hired ? 'On board' : `Hire ${money(cost)}`}</button></article>`;
}

function decorateOperationsDesk() {
  const operations = ensureOperationsState();
  if (!operations.leaderPool) refreshLeaderPool();
  operations.countries = operations.countries || [];
  const anchor = app.querySelector('.operations-card');
  if (!anchor) return;
  app.querySelector('.board-card')?.remove();
  app.querySelector('.market-card')?.remove();
  const consolePanel = document.createElement('div');
  consolePanel.className = 'operations-console';
  consolePanel.innerHTML = `<div class="console-header"><div><div class="eyebrow">Executive console</div><h3>Influence, talent and expansion</h3></div><span class="notification-count">${unreadNotifications()} alerts</span></div><div class="console-columns"><section class="console-section"><div class="section-title"><strong>Leadership market</strong><button class="text-control" data-refresh-leaders>Refresh pool</button></div>${operations.leaderPool.map(formatLeaderCard).join('')}</section><section class="console-section"><div class="section-title"><strong>Government relations</strong><span>Power ${operations.policy}</span></div><div class="policy-list">${policyLevers.map(policy => `<div class="policy-row"><div><strong>${policy.title}</strong><small>${policy.benefit} · Risk: ${policy.risk}</small></div><button class="ops-control" data-policy="${policy.id}" ${!canAct() ? 'disabled' : ''}>Campaign ${money(policy.cost)}</button><button class="ops-control warning" data-bribe="${policy.id}" ${!canAct() ? 'disabled' : ''}>Lobby ${money(policy.cost + 8)}</button></div>`).join('')}</div></section></div><section class="console-section expansion-section"><div class="section-title"><strong>Global expansion map</strong><span>${operations.countries.length} markets opened</span></div><div class="country-list">${expansionCountries.map(country => { const active = operations.countries.some(open => open.id === country.id); return `<button class="country-card ${active ? 'country-active' : ''}" data-country="${country.id}" ${active || !canAct() ? 'disabled' : ''}><span class="country-flag">${country.flag}</span><strong>${country.name}</strong><small>${country.demand}</small><em>${active ? 'Operating' : `Expand ${money(country.cost)}`}</em><i>${country.risk}</i></button>`; }).join('')}</div></section><section class="console-section inbox-section"><div class="section-title"><strong>Notifications</strong><button class="text-control" data-read-alerts>Mark read</button></div><div class="notification-list">${operations.notifications.slice(0, 4).map(notification => `<div class="notification ${notification.tone} ${notification.read ? 'read' : ''}"><b>${notification.title}</b><span>${notification.body}</span></div>`).join('') || '<small>No new executive alerts.</small>'}</div></section>`;
  const financePanel = document.createElement('section');
  financePanel.className = 'finance-panel';
  financePanel.innerHTML = `<div class="finance-title"><div><div class="eyebrow">Treasury cockpit</div><strong>Cash flow and payout policy</strong></div><span class="cash-available">Spendable ${money(state.cash)}</span></div><div class="finance-metrics"><div><small>Profit / turn</small><b>${money(companyProfitPerTurn())}</b><span class="metric-positive">${formatDelta(ensureOperationsState().revenue - monthlyBurn())} net</span></div><div><small>Next payout</small><b>${money(nextPayoutAmount())}</b><span>in ${turnsUntilPayout()} turns</span></div><div><small>Tax rate</small><b>${formatPercent(payoutTaxRate())}</b><span>${state.payoutCadence} distribution</span></div><div><small>Runway</small><b>${runwayQuarters()} qtrs</b><span>${money(monthlyBurn())} burn</span></div></div><div class="cash-flow-bar"><span>Income ${money(companyProfitPerTurn() + monthlyBurn())}</span><i><b style="width:${Math.min(100, Math.max(8, companyProfitPerTurn()))}%"></b></i><span>Costs ${money(monthlyBurn())}</span></div>`;
  anchor.after(financePanel);
  anchor.after(consolePanel);
  consolePanel.querySelector('[data-refresh-leaders]').onclick = () => { if (canAct()) { rotateLeaderPool(); render(); } };
  consolePanel.querySelectorAll('[data-leader]').forEach(button => button.onclick = () => { if (hireLeader(button.dataset.leader)) { state.cash = ensureOperationsState().cash; render(); toast('Leader hired. Your operating plan just got sharper.'); } else toast('That hire is unavailable or outside your runway.'); });
  consolePanel.querySelectorAll('[data-policy]').forEach(button => button.onclick = () => { if (campaignForPolicy(button.dataset.policy)) { render(); toast('Public campaign funded.'); } else toast('Not enough operating cash.'); });
  consolePanel.querySelectorAll('[data-bribe]').forEach(button => button.onclick = () => { if (bribePolitician(button.dataset.bribe)) { render(); toast('Influence applied. Watch your reputation.'); } else toast('Not enough cash for quiet influence.'); });
  consolePanel.querySelectorAll('[data-country]').forEach(button => button.onclick = () => { if (expandIntoCountry(button.dataset.country)) { render(); toast('New country entered. Global demand is now on your side.'); } else toast('Expansion unavailable or too expensive.'); });
  consolePanel.querySelector('[data-read-alerts]').onclick = () => { markNotificationsRead(); render(); };
}

function workerCondition() {
  const operations = ensureOperationsState();
  return Math.round((operations.workerMorale + operations.workerPay + operations.unionTrust + operations.productivity) / 4);
}

function workerStrikeRisk() {
  const operations = ensureOperationsState();
  return Math.max(0, Math.min(100, 100 - workerCondition() + operations.risk));
}

function negotiateWorkers() {
  const operations = ensureOperationsState();
  if (!spendOperationCash(14)) return false;
  operations.workerPay += 8;
  operations.workerMorale += 6;
  operations.unionTrust += 4;
  operations.risk = Math.max(0, operations.risk - 8);
  operations.strike = false;
  operations.strikeTurns = 0;
  pushNotification('Workforce agreement reached', 'A new contract stabilizes the floor, but raises operating costs.', 'positive');
  return true;
}

function cutCosts() {
  const operations = ensureOperationsState();
  operations.workerPay = Math.max(10, operations.workerPay - 8);
  operations.productivity = Math.max(0, operations.productivity - 9);
  operations.workerMorale = Math.max(0, operations.workerMorale - 14);
  operations.risk += 12;
  pushNotification('Cost reduction enacted', 'The quarterly budget improved, but labor unrest is rising.', 'negative');
  return true;
}

function callStrikeVote() {
  const operations = ensureOperationsState();
  if (workerStrikeRisk() < 35) return false;
  operations.strike = true;
  operations.strikeTurns = 2;
  operations.productivity = Math.max(0, operations.productivity - 30);
  pushNotification('Workers are on strike', 'Production is paused until management resolves the dispute.', 'negative');
  return true;
}

function resolveStrikeWithMediation() {
  const operations = ensureOperationsState();
  if (!operations.strike || !spendOperationCash(24)) return false;
  operations.strike = false;
  operations.strikeTurns = 0;
  operations.unionTrust = Math.min(100, operations.unionTrust + 12);
  operations.workerMorale = Math.min(100, operations.workerMorale + 8);
  operations.risk = Math.max(0, operations.risk - 18);
  pushNotification('Strike resolved', 'Independent mediation reopened the workplace.', 'positive');
  return true;
}

function updateLaborAfterQuarter() {
  const operations = ensureOperationsState();
  if (operations.strike) {
    operations.strikeTurns -= 1;
    if (operations.strikeTurns <= 0) resolveStrikeWithMediation();
    return;
  }
  operations.workerMorale = Math.max(0, Math.min(100, operations.workerMorale + (operations.workerPay > 55 ? 3 : -3)));
  operations.unionTrust = Math.max(0, Math.min(100, operations.unionTrust + (operations.workerMorale > 60 ? 2 : -4)));
  if (workerStrikeRisk() >= 62) callStrikeVote();
}

function cashPayoutDescription() {
  const interval = payoutInterval();
  const tax = payoutTaxRate();
  return `${interval === 1 ? 'Every turn' : `Every ${interval} turns`} · ${tax}% tax adjustment`;
}

function botSkillOptions(index) {
  return ['casual', 'steady', 'sharp'].map(skill => `<option value="${skill}" ${getBotSkill(index) === skill ? 'selected' : ''}>${skill[0].toUpperCase() + skill.slice(1)}</option>`).join('');
}

function decorateLiveControls() {
  const rightStack = app.querySelector('.right-stack');
  if (!rightStack) return;
  const livePanel = document.createElement('section');
  livePanel.className = 'card live-controls';
  const operations = ensureOperationsState();
  livePanel.innerHTML = `<div class="card-head"><div><div class="eyebrow">Live controls</div><h3>Rules and rival brains</h3></div><span class="phase-label">${cashPayoutDescription()}</span></div><label class="control-label">Cash release policy</label><select id="live-payout"><option value="turn" ${state.payoutCadence === 'turn' ? 'selected' : ''}>Every turn · higher tax</option><option value="biquarterly" ${state.payoutCadence === 'biquarterly' ? 'selected' : ''}>Every 2 turns · moderate tax</option><option value="quarterly" ${state.payoutCadence === 'quarterly' ? 'selected' : ''}>Every 4 turns · standard tax</option><option value="yearly" ${state.payoutCadence === 'yearly' ? 'selected' : ''}>Every 16 turns · lower tax</option></select>${state.bots ? `<div class="bot-brain-list"><label class="control-label">Adjustable bot intelligence</label>${Array.from({length:state.bots}, (_,index) => `<div class="bot-brain"><span>${['Maya','Theo','Aria','Lena','Omar','Nia'][index]}</span><select data-bot-skill="${index}">${botSkillOptions(index)}</select></div>`).join('')}</div>` : ''}${isOperationsMode() ? `<div class="labor-panel"><div class="section-title"><strong>Workforce health</strong><span class="${workerStrikeRisk() > 55 ? 'danger-text' : 'metric-positive'}">${operations.strike ? 'ON STRIKE' : `${workerStrikeRisk()}% risk`}</span></div><div class="labor-bar"><i style="width:${workerCondition()}%"></i></div><small>Morale ${operations.workerMorale} · Pay ${operations.workerPay} · Union trust ${operations.unionTrust}</small><div class="labor-actions"><button data-labor="negotiate">Negotiate</button><button data-labor="costs">Cut costs</button>${operations.strike ? '<button data-labor="mediate">Mediate strike</button>' : ''}</div></div>` : ''}`;
  rightStack.appendChild(livePanel);
  const payout = livePanel.querySelector('#live-payout');
  payout.onchange = event => { setPayoutCadence(event.target.value); render(); toast('Payout policy updated.'); };
  livePanel.querySelectorAll('[data-bot-skill]').forEach(select => select.onchange = event => { state.botBrains[Number(select.dataset.botSkill)] = event.target.value; state.log.push(`${['Maya','Theo','Aria','Lena','Omar','Nia'][Number(select.dataset.botSkill)]} is now ${event.target.value}.`); render(); });
  livePanel.querySelector('[data-labor="negotiate"]')?.addEventListener('click', () => { if (negotiateWorkers()) { state.cash = ensureOperationsState().cash; render(); toast('Workforce agreement signed.'); } else toast('Not enough operating cash.'); });
  livePanel.querySelector('[data-labor="costs"]')?.addEventListener('click', () => { cutCosts(); render(); toast('Costs cut. Strike risk increased.'); });
  livePanel.querySelector('[data-labor="mediate"]')?.addEventListener('click', () => { if (resolveStrikeWithMediation()) { state.cash = ensureOperationsState().cash; render(); toast('Mediation reopened operations.'); } else toast('Mediation needs €24.'); });
}

function wireGame() {
  app.querySelectorAll('[data-cell]').forEach(cell => cell.onclick = () => canAct() && placeBranch(Number(cell.dataset.cell)));
  app.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => canAct() && trade(b.dataset.buy, 1));
  app.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => canAct() && trade(b.dataset.sell, -1));
  const bind = (id, fn) => { const el = app.querySelector(`#${id}`); if (el) el.onclick = fn; };
  bind('roll', () => { if (state.phase !== 'pre-roll') return; state.phase = 'post-roll'; state.log.push('You rolled a 4 and unlocked your placement window.'); toast('Dice rolled: 4. Pick any open tile to place your branch.'); render(); });
  bind('charity', () => { if (!canAct()) return; if (state.mode === 'advanced' && state.cash >= 20) { state.cash -= 20; state.charity += 20; state.log.push('You donated €20. Your tax rate improved.'); toast('Generosity pays: charity level +€20.'); render(); } else toast(state.mode === 'basic' ? 'Charity unlocks in Advanced level.' : 'You need €20 in cash to donate.'); });
  bind('event', () => { if (!canAct() || state.mode !== 'advanced') return; state.eventIndex++; applyEvent(); render(); toast(`New headline: ${events[state.eventIndex % events.length].title}`); });
  bind('end', () => { if (!canAct()) return; botsAct(); state.phase = 'between'; state.log.push('Your action window is closed. Rivals are now taking their turns.'); render(); toast('Turn locked. You can act again when the next turn begins.'); });
  bind('resume', () => { state.round++; state.phase = 'pre-roll'; state.stockSetter = ['Maya Chen', 'Theo Park', 'Aria Singh'][state.round % 3]; if (isOperationsMode()) { ensureOperationsState().cash = state.cash; ensureOperationsState().quarter = Math.max(1, Math.ceil(state.round / 4)); updateLaborAfterQuarter(); processScheduledPayout(); } state.log.push(`Round ${state.round} begins. ${state.stockSetter} is setting the market.`); render(); toast('Your new turn begins.'); });
  bind('hire', () => { if (!canAct() || state.cash < 20) return toast('You need €20 to hire talent.'); state.cash -= 20; const company = selectedManagementCompany(); state.log.push(`You hired a brilliant operator for ${company.name}.`); ensureOperationsState().staff += 2; ensureOperationsState().productivity += 6; render(); toast(`New hire onboarded at ${company.name}.`); });
  bind('expand', () => { if (!canAct() || state.cash < 20) return toast('You need €20 to fund expansion.'); state.cash -= 20; const company = selectedManagementCompany(); ensureOperationsState().revenue += 8; ensureOperationsState().productivity += 4; state.log.push(`You funded a strategic expansion for ${company.name}.`); render(); toast(`${company.name} expansion complete.`); });
  app.querySelectorAll('[data-hire-company]').forEach(button => button.onclick = () => { if (button.dataset.hireCompany !== state.managementCompany) return toast('You only control your selected company.'); if (canAct() && state.cash >= 20) { state.cash -= 20; state.log.push(`New talent hired for ${button.dataset.hireCompany}.`); toast('Team hired. Productivity increased.'); render(); } else toast('Not enough cash or the turn is locked.'); });
  app.querySelectorAll('[data-hire-company], [data-project-company]').forEach(button => { if (button.dataset.hireCompany !== state.managementCompany && button.dataset.projectCompany !== state.managementCompany) button.disabled = true; });
  app.querySelectorAll('[data-project-company]').forEach(button => button.onclick = () => { if (button.dataset.projectCompany !== state.managementCompany) return toast('You only control your selected company.'); if (canAct() && state.cash >= 30) { state.cash -= 30; const company = managementCompanies.find(item => item.id === button.dataset.projectCompany); state.log.push(`${company.name} launched a strategic project.`); toast(`${company.name} project funded.`); render(); } else toast('Not enough cash or the turn is locked.'); });
  bind('theme', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; document.body.classList.toggle('light-theme', state.theme === 'light'); render(); });
  bind('settings', showSettings);
  bind('new', () => { state = {...state, screen:'setup', log: ['Welcome back. Set up a new table.'], round:1, cash:0, charity:0, branches:[], phase:'pre-roll'}; render(); });
}
function showSettings() {
  const modal = document.createElement('div');
  modal.className = 'settings-modal';
  modal.innerHTML = `<div class="settings-sheet"><div class="card-head"><div><div class="eyebrow">Table configuration</div><h3>Advanced settings</h3></div><button class="ghost" data-close>Close</button></div><p class="subtitle">Tune the table before the next move. These settings are designed for house rules and replayability.</p><label class="field-label">Starting cash <output id="cash-output">€120</output></label><input id="cash-setting" type="range" min="60" max="300" step="20" value="${state.cash}"><label class="field-label">Event intensity</label><select id="event-setting"><option>Calm · one headline each round</option><option selected>Volatile · frequent swings</option><option>Wild · high-risk market</option></select><label class="field-label">Victory target</label><select id="target-setting"><option>First company to €100 KV</option><option>First company to €120 KV</option><option>20 rounds maximum</option></select><label class="toggle-row"><input type="checkbox" ${state.mode === 'advanced' ? 'checked' : ''} id="news-setting"><span>Keep market news active</span></label><label class="toggle-row"><input type="checkbox" checked id="tips-setting"><span>Show strategy tips after turns</span></label><button class="primary full" data-apply>Apply settings</button></div>`;
  document.body.appendChild(modal);
  const range = modal.querySelector('#cash-setting');
  range.oninput = () => modal.querySelector('#cash-output').value = money(range.value);
  modal.querySelector('[data-close]').onclick = () => modal.remove();
  modal.querySelector('[data-apply]').onclick = () => { state.cash = Number(range.value); state.log.push('Advanced table settings updated.'); modal.remove(); render(); toast('Settings applied to the table.'); };
}

function trade(id, direction) { if (!canAct()) return; const c = companies.find(x=>x.id===id); const price = state.mode === 'advanced' ? c.tc : c.kv; if (direction > 0 && state.cash >= price && c.owned < 20) { state.cash -= price; c.owned++; state.log.push(`Bought 1 ${c.name} share for ${money(price)}.`); toast(`Bought 1 ${c.name} share.`); render(); } else if (direction < 0 && c.owned > 0) { state.cash += price; c.owned--; state.log.push(`Sold 1 ${c.name} share for ${money(price)}.`); toast(`Sold 1 ${c.name} share.`); render(); } else toast(direction > 0 ? 'Not enough cash for that position.' : 'You do not own that share yet.'); }
function placeBranch(pos) { if (!canAct()) return; if (state.phase !== 'post-roll') return toast('Roll the dice before placing a branch.'); if (state.branches.some(b => b.p === pos)) return toast('That tile is already occupied.'); const c = companies[state.turn % 4]; state.branches.push({c:c.id,p:pos}); c.branches++; const old = c.kv; c.kv = Math.min(100, c.kv + 10); c.history.push(c.kv); state.cash += c.kv; if (c.kv > old) { c.owned && (state.cash += (c.kv-old) * c.owned); } state.phase = 'post-roll'; state.log.push(`Placed a ${c.name} branch. Building reward: ${money(c.kv)}.`); state.turn++; toast(`${c.name} expanded. You earned ${money(c.kv)}.`); render(); }
function applyEvent() { const event = events[state.eventIndex % events.length]; if (event.title === 'AI breakthrough') companies[0].tc += 20; if (event.title === 'Green dividend') companies[1].tc += 20; if (event.title === 'Rate shock') companies[3].tc += 20; if (event.title === 'New medicine') companies[2].tc += 20; state.log.push(`Headline: ${event.title}.`); }
function botsAct() { for (let i=0; i<state.bots; i++) { const c = companies[(i+state.round) % 4]; c.owned += state.skill === 'sharp' ? 2 : 1; state.log.push(`${['Maya','Theo','Aria'][i]} accumulated ${c.name} shares.`); } }
function toast(message) { const old = document.querySelector('.toast'); if (old) old.remove(); const el = document.createElement('div'); el.className='toast'; el.textContent=message; document.body.appendChild(el); setTimeout(()=>el.remove(),2600); }

const leaderRoster = [
  { id: 'mira', name: 'Mira Okafor', role: 'Chief Strategy Officer', specialty: 'growth', level: 2, salary: 18, description: 'Turns a clear vision into compounding momentum.' },
  { id: 'jonas', name: 'Jonas Reed', role: 'Chief Financial Officer', specialty: 'finance', level: 3, salary: 22, description: 'Protects runway and finds capital before you need it.' },
  { id: 'sana', name: 'Sana Iqbal', role: 'Chief Technology Officer', specialty: 'research', level: 2, salary: 20, description: 'Makes difficult research bets land on time.' },
  { id: 'elias', name: 'Elias Moretti', role: 'Public Affairs Lead', specialty: 'policy', level: 1, salary: 14, description: 'Builds coalitions when regulation gets complicated.' },
  { id: 'ruth', name: 'Ruth Kim', role: 'People Operations Lead', specialty: 'talent', level: 2, salary: 16, description: 'Converts a talented team into a durable culture.' },
  { id: 'noor', name: 'Noor Alvarez', role: 'Sustainability Director', specialty: 'impact', level: 3, salary: 19, description: 'Turns impact into trust, access and long-term value.' }
];

const departments = [
  { id: 'product', name: 'Product', icon: '⌁', base: 54, color: '#d35f62' },
  { id: 'research', name: 'Research', icon: '⌬', base: 37, color: '#8e709b' },
  { id: 'people', name: 'People', icon: '◎', base: 68, color: '#4d916f' },
  { id: 'public', name: 'Public affairs', icon: '◫', base: 43, color: '#477ca0' }
];

const policyLevers = [
  { id: 'jobs', title: 'Local jobs compact', cost: 16, power: 8, benefit: 'Hiring incentives', risk: 'Higher payroll expectations' },
  { id: 'clean', title: 'Clean infrastructure grant', cost: 22, power: 12, benefit: 'Faster permits', risk: 'Strict reporting' },
  { id: 'trade', title: 'Trade partnership', cost: 18, power: 10, benefit: 'New export access', risk: 'Foreign competition' },
  { id: 'education', title: 'Skills academy', cost: 20, power: 14, benefit: 'Talent pipeline', risk: 'Slow payoff' }
];

const companyEvents = [
  { id: 'whistleblower', tone: 'negative', title: 'Whistleblower report', text: 'A former employee questions a process. Transparency is now an asset.', choices: ['Launch audit', 'Deny everything'], impact: { trust: 8, cash: -12 } },
  { id: 'viral', tone: 'positive', title: 'Unexpected viral moment', text: 'A customer story puts the company in front of millions.', choices: ['Scale carefully', 'Spend on hype'], impact: { reputation: 12, cash: 9 } },
  { id: 'supplier', tone: 'negative', title: 'Supplier bottleneck', text: 'A key input is delayed. Operations must choose what to protect.', choices: ['Pay premium', 'Pause orders'], impact: { cash: -16, productivity: -5 } },
  { id: 'grant', tone: 'positive', title: 'Innovation grant', text: 'A public fund opens applications for ambitious projects.', choices: ['Apply now', 'Stay focused'], impact: { policy: 6, research: 10 } },
  { id: 'talent', tone: 'positive', title: 'Talent raid', text: 'A competitor is losing a team of specialists. They are listening.', choices: ['Make an offer', 'Keep the peace'], impact: { staff: 3, cash: -18 } },
  { id: 'regulator', tone: 'negative', title: 'Regulator review', text: 'A new review could become a precedent for the whole sector.', choices: ['Cooperate fully', 'Lobby aggressively'], impact: { policy: 5, cash: -10 } }
];

const contractTemplates = [
  { id: 'public', name: 'Public sector pilot', value: 48, duration: 3, demand: 62, requirement: 'policy' },
  { id: 'enterprise', name: 'Enterprise anchor client', value: 72, duration: 4, demand: 75, requirement: 'productivity' },
  { id: 'export', name: 'Export corridor', value: 55, duration: 3, demand: 57, requirement: 'reputation' },
  { id: 'research', name: 'Research consortium', value: 64, duration: 5, demand: 69, requirement: 'research' }
];

function ensureOperationsState() {
  if (!state.operations) {
    state.operations = {
      cash: state.cash,
      revenue: 48,
      reputation: 42,
      trust: 50,
      policy: 20,
      productivity: 57,
      research: 32,
      staff: 12,
      leaders: [],
      departments: departments.reduce((result, department) => ({ ...result, [department.id]: department.base }), {}),
      contracts: [],
      notifications: [],
      selectedPolicy: null,
      event: null,
      quarter: 1,
      consecutiveGrowth: 0,
      workerMorale: 68,
      workerPay: 52,
      unionTrust: 55,
      strike: false,
      strikeTurns: 0,
      risk: 18,
      countries: [],
      payoutCadence: state.payoutCadence,
      lastPayout: 0
    };
  }
  return state.operations;
}

function pushNotification(title, body, tone = 'neutral') {
  const operations = ensureOperationsState();
  operations.notifications.unshift({ id: `${Date.now()}-${Math.random()}`, title, body, tone, read: false });
  operations.notifications = operations.notifications.slice(0, 12);
  state.log.push(`${title}: ${body}`);
}

function unreadNotifications() {
  return ensureOperationsState().notifications.filter(notification => !notification.read).length;
}

function markNotificationsRead() {
  ensureOperationsState().notifications.forEach(notification => { notification.read = true; });
}

function selectedManagementCompany() {
  return managementCompanies.find(company => company.id === state.managementCompany) || managementCompanies[0];
}

function managementAdvantage() {
  const company = selectedManagementCompany();
  const operations = ensureOperationsState();
  const advantage = company.id === 'aether' ? operations.research : company.id === 'solara' ? operations.policy : company.id === 'meridian' ? operations.trust : operations.reputation;
  return Math.round(advantage / 10);
}

function operationReadiness() {
  const operations = ensureOperationsState();
  return Math.min(100, Math.round((operations.productivity + operations.reputation + operations.trust + operations.research) / 4));
}

function operationValue() {
  const operations = ensureOperationsState();
  return Math.round(operations.cash + operations.revenue * 8 + operations.reputation * 4 + operations.policy * 3);
}

function companyProfitPerTurn() {
  const operations = ensureOperationsState();
  const contractIncomeNow = contractIncome();
  const leaderCost = operations.leaders.reduce((total, leader) => total + leader.salary, 0);
  const countryIncome = (operations.countries || []).reduce((total, country) => total + Math.round(country.reward / 4), 0);
  const efficiency = Math.round(operations.productivity / 12);
  return Math.max(-50, operations.revenue + contractIncomeNow + countryIncome + efficiency - leaderCost - 24);
}

function payoutTaxRate() {
  const cadenceTax = { turn: 8, biquarterly: 4, quarterly: 0, yearly: -3 };
  return Math.max(0, cadenceTax[state.payoutCadence] ?? 0);
}

function payoutInterval() {
  return { turn: 1, biquarterly: 2, quarterly: 4, yearly: 16 }[state.payoutCadence] || 4;
}

function turnsUntilPayout() {
  const interval = payoutInterval();
  return interval - (state.round % interval || interval);
}

function nextPayoutAmount() {
  const operations = ensureOperationsState();
  return Math.max(0, Math.round(companyProfitPerTurn() * payoutInterval() * (1 - payoutTaxRate() / 100)));
}

function processScheduledPayout() {
  const operations = ensureOperationsState();
  if (turnsUntilPayout() !== 0) return 0;
  const payout = nextPayoutAmount();
  operations.cash += payout;
  state.cash += payout;
  operations.lastPayout = payout;
  pushNotification('Scheduled payout released', `${money(payout)} arrived after ${payoutInterval()} turns at a ${payoutTaxRate()}% cadence tax.`, 'positive');
  return payout;
}

function setPayoutCadence(cadence) {
  if (!['turn', 'biquarterly', 'quarterly', 'yearly'].includes(cadence)) return false;
  state.payoutCadence = cadence;
  ensureOperationsState().payoutCadence = cadence;
  pushNotification('Payout policy changed', `Cash will be released ${cadence}, with a ${payoutTaxRate()}% tax adjustment.`, 'neutral');
  return true;
}

function nextLeaderCost(leader) {
  return leader.salary + leader.level * 6 + ensureOperationsState().leaders.length * 3;
}

function hireLeader(leaderId) {
  const operations = ensureOperationsState();
  const leader = leaderRoster.find(candidate => candidate.id === leaderId);
  if (!leader) return false;
  if (operations.leaders.some(candidate => candidate.id === leader.id)) return false;
  const cost = nextLeaderCost(leader);
  if (operations.cash < cost) return false;
  operations.cash -= cost;
  operations.leaders.push({ ...leader, hiredQuarter: operations.quarter, morale: 70 });
  operations.staff += leader.level;
  applyLeaderBonus(leader, 1);
  pushNotification('Leader appointed', `${leader.name} joined as ${leader.role}.`, 'positive');
  return true;
}

function applyLeaderBonus(leader, multiplier = 1) {
  const operations = ensureOperationsState();
  const amount = leader.level * multiplier;
  if (leader.specialty === 'growth') operations.revenue += amount * 2;
  if (leader.specialty === 'finance') operations.cash += amount * 3;
  if (leader.specialty === 'research') operations.research += amount * 2;
  if (leader.specialty === 'policy') operations.policy += amount * 2;
  if (leader.specialty === 'talent') operations.productivity += amount * 2;
  if (leader.specialty === 'impact') operations.trust += amount * 2;
}

function trainLeader(leaderId) {
  const operations = ensureOperationsState();
  const leader = operations.leaders.find(candidate => candidate.id === leaderId);
  if (!leader || operations.cash < 12) return false;
  operations.cash -= 12;
  leader.level += 1;
  leader.morale = Math.min(100, leader.morale + 8);
  applyLeaderBonus(leader, 1);
  pushNotification('Leadership academy', `${leader.name} completed an intensive training block.`, 'positive');
  return true;
}

function launchProject(projectType = 'product') {
  const operations = ensureOperationsState();
  const costs = { product: 22, research: 30, people: 18, public: 24 };
  const gains = { product: ['revenue', 9], research: ['research', 12], people: ['productivity', 10], public: ['reputation', 8] };
  const cost = costs[projectType] || costs.product;
  if (operations.cash < cost) return false;
  operations.cash -= cost;
  operations.departments[projectType] = Math.min(100, operations.departments[projectType] + 8);
  operations[gains[projectType][0]] += gains[projectType][1];
  operations.consecutiveGrowth += 1;
  pushNotification('Project funded', `${projectType} division received a new strategic budget.`, 'positive');
  return true;
}

function influencePolicy(policyId) {
  const operations = ensureOperationsState();
  const policy = policyLevers.find(candidate => candidate.id === policyId);
  if (!policy || operations.cash < policy.cost) return false;
  operations.cash -= policy.cost;
  operations.policy += policy.power;
  operations.selectedPolicy = policy.id;
  pushNotification('Policy coalition formed', `${policy.title} now favors your operating plan.`, 'positive');
  return true;
}

function acceptContract(contractId) {
  const operations = ensureOperationsState();
  const contract = contractTemplates.find(candidate => candidate.id === contractId);
  if (!contract || operations.contracts.some(active => active.id === contract.id)) return false;
  if (operations[contract.requirement] < contract.demand) return false;
  operations.contracts.push({ ...contract, remaining: contract.duration });
  operations.revenue += Math.round(contract.value / 10);
  pushNotification('Contract signed', `${contract.name} adds ${money(contract.value)} over ${contract.duration} quarters.`, 'positive');
  return true;
}

function resolveCompanyEvent(choice = 0) {
  const operations = ensureOperationsState();
  const event = operations.event;
  if (!event) return false;
  const multiplier = choice === 0 ? 1 : .65;
  Object.entries(event.impact).forEach(([key, value]) => {
    if (typeof operations[key] === 'number') operations[key] += Math.round(value * multiplier);
  });
  operations.event = null;
  pushNotification('Decision recorded', `The board approved option ${choice + 1}.`, choice === 0 ? 'positive' : 'neutral');
  return true;
}

function drawCompanyEvent() {
  const operations = ensureOperationsState();
  const event = companyEvents[(operations.quarter + state.eventIndex) % companyEvents.length];
  operations.event = event;
  pushNotification(event.title, event.text, event.tone);
  return event;
}

function advanceQuarter() {
  const operations = ensureOperationsState();
  operations.quarter += 1;
  operations.contracts = operations.contracts.map(contract => ({ ...contract, remaining: contract.remaining - 1 })).filter(contract => contract.remaining > 0);
  const payroll = operations.leaders.reduce((total, leader) => total + leader.salary, 0);
  operations.cash -= payroll;
  operations.revenue += Math.round(operationReadiness() / 15);
  operations.productivity = Math.max(0, Math.min(100, operations.productivity + operations.leaders.length - 2));
  operations.leaders.forEach(leader => { leader.morale = Math.max(20, leader.morale - 2); });
  if (operations.cash < 0) pushNotification('Runway warning', 'Payroll is ahead of cash. Secure a contract or cut a project.', 'negative');
  else pushNotification('Quarter closed', `Quarter ${operations.quarter} opened with ${money(operations.cash)} runway.`, 'neutral');
  if (operations.quarter % 2 === 0) drawCompanyEvent();
  return operations;
}

function investInDepartment(departmentId) {
  const operations = ensureOperationsState();
  const department = departments.find(candidate => candidate.id === departmentId);
  if (!department || operations.cash < 15) return false;
  operations.cash -= 15;
  operations.departments[departmentId] = Math.min(100, operations.departments[departmentId] + 10);
  operations.productivity += departmentId === 'people' ? 8 : 3;
  pushNotification(`${department.name} upgraded`, 'The division is operating at a higher standard.', 'positive');
  return true;
}

function replaceLeader(leaderId, replacementId) {
  const operations = ensureOperationsState();
  const index = operations.leaders.findIndex(leader => leader.id === leaderId);
  const replacement = leaderRoster.find(leader => leader.id === replacementId);
  if (index < 0 || !replacement || operations.cash < replacement.salary) return false;
  operations.cash -= replacement.salary;
  operations.leaders[index] = { ...replacement, hiredQuarter: operations.quarter, morale: 75 };
  pushNotification('Leadership reshuffle', `${replacement.name} is taking a new seat at the table.`, 'neutral');
  return true;
}

function saveGame() {
  const payload = JSON.stringify({ state, companies });
  localStorage.setItem('investutor-save', payload);
  pushNotification('Game saved', 'Your company and portfolio are stored in this browser.', 'neutral');
}

function loadGame() {
  const payload = localStorage.getItem('investutor-save');
  if (!payload) return false;
  const saved = JSON.parse(payload);
  state = saved.state;
  saved.companies.forEach((savedCompany, index) => Object.assign(companies[index], savedCompany));
  pushNotification('Game restored', 'Your last saved strategy is back on the desk.', 'neutral');
  render();
  return true;
}

function resetOperations() {
  delete state.operations;
  ensureOperationsState();
  return state.operations;
}

function formatDelta(value) {
  return `${value >= 0 ? '+' : ''}${Math.round(value)}`;
}

function formatPercent(value) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function formatStatus(value, goodThreshold = 60) {
  if (value >= goodThreshold) return 'Strong';
  if (value >= goodThreshold - 15) return 'Stable';
  return 'At risk';
}

function leaderBySpecialty(specialty) {
  return ensureOperationsState().leaders.filter(leader => leader.specialty === specialty);
}

function departmentScore(departmentId) {
  return ensureOperationsState().departments[departmentId] || 0;
}

function contractIncome() {
  return ensureOperationsState().contracts.reduce((sum, contract) => sum + Math.round(contract.value / contract.duration), 0);
}

function monthlyBurn() {
  return ensureOperationsState().leaders.reduce((sum, leader) => sum + leader.salary, 0) + 24;
}

function runwayQuarters() {
  const operations = ensureOperationsState();
  const burn = Math.max(1, monthlyBurn() - contractIncome());
  return Math.max(0, Math.round(operations.cash / burn));
}

function policyStatus() {
  return formatStatus(ensureOperationsState().policy, 55);
}

function operationsSummary() {
  const operations = ensureOperationsState();
  return {
    company: selectedManagementCompany().name,
    value: operationValue(),
    readiness: operationReadiness(),
    runway: runwayQuarters(),
    policy: policyStatus(),
    notifications: unreadNotifications()
  };
}

function notifyTurnStart() {
  const summary = operationsSummary();
  pushNotification('Executive session opened', `${summary.company} is ${formatStatus(summary.readiness)} with ${summary.runway} quarters of runway.`, 'neutral');
}

function botOperationsTurn() {
  const operations = ensureOperationsState();
  const rival = ['Maya', 'Theo', 'Aria'][state.round % 3];
  operations.reputation += state.skill === 'sharp' ? 4 : 2;
  pushNotification(`${rival} made a move`, 'A rival expanded their influence while your desk was focused.', 'neutral');
}

function canAffordOperation(cost) {
  return ensureOperationsState().cash >= cost;
}

function operationActionLabel(action) {
  const labels = { hire: 'Hire leader', train: 'Train leader', project: 'Launch project', policy: 'Influence policy', contract: 'Sign contract', quarter: 'Close quarter' };
  return labels[action] || 'Take action';
}

function operationTone(value) {
  if (value >= 70) return 'positive';
  if (value <= 35) return 'negative';
  return 'neutral';
}

function clearNotifications() {
  ensureOperationsState().notifications = [];
}

function resetTurnWindow() {
  state.phase = 'pre-roll';
  state.eventIndex += 1;
  if (state.gameMode === 'operations') notifyTurnStart();
}

function finishTurnWindow() {
  if (state.phase === 'between') return false;
  botsAct();
  if (state.gameMode === 'operations') botOperationsTurn();
  state.phase = 'between';
  return true;
}

function switchGameMode(mode) {
  state.gameMode = mode;
  state.cash = mode === 'operations' ? 80 : 0;
  state.branches = mode === 'operations' ? [] : seedBranches();
  state.phase = 'pre-roll';
  if (mode === 'operations') resetOperations();
  return state;
}

function isMarketMode() {
  return state.gameMode === 'market';
}

function isOperationsMode() {
  return state.gameMode === 'operations';
}

function advancedMarketActive() {
  return isMarketMode() && state.mode === 'advanced';
}

function actionIsVisible(action) {
  if (action === 'news' || action === 'charity') return advancedMarketActive();
  if (action === 'branch' || action === 'trade') return isMarketMode();
  return true;
}

function actionIsEnabled() {
  return state.phase !== 'between';
}

function gameSnapshot() {
  return { state: { ...state }, operations: state.operations ? { ...state.operations } : null, summary: operationsSummary() };
}

function logSnapshot() {
  return JSON.stringify(gameSnapshot(), null, 2);
}

document.body.classList.toggle('light-theme', state.theme === 'light');
render();
