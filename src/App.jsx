import { useEffect, useMemo, useRef, useState } from 'react'
import { calculateReadiness, relativeTime, releaseTone } from './lib/releaseMetrics'

const Icon = ({ name, size = 18, stroke = 1.8, className = '' }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', className, 'aria-hidden': true }
  const paths = {
    spark: <><path d="m12 2-1.55 5.45L5 9l5.45 1.55L12 16l1.55-5.45L19 9l-5.45-1.55L12 2Z"/><path d="m19 15-.75 2.25L16 18l2.25.75L19 21l.75-2.25L22 18l-2.25-.75L19 15Z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    pulse: <><path d="M3 12h3l2-7 4 14 2-7h7"/></>,
    branch: <><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M6 8v6a4 4 0 0 0 4 4h6"/><path d="M16 6h2"/></>,
    flag: <><path d="M5 21V4"/><path d="M5 5c4-3 7 3 14 0v9c-7 3-10-3-14 0"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2 2-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51v.09h-2.82V20a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-2-2 .06-.06A1.65 1.65 0 0 0 7.64 15a1.65 1.65 0 0 0-1.51-1H6.04v-2.82h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 2-2 .06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V5.1h2.82v.08a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2 2-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1h.09V14h-.09a1.65 1.65 0 0 0-1.51 1Z"/></>,
    search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.25 4.25"/></>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    command: <><path d="M18 9a3 3 0 1 0-3-3v12a3 3 0 1 1-3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 1 3 3Z"/></>,
    clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></>,
    check: <path d="m5 12 4.2 4.2L19 6.5"/>,
    alert: <><path d="M10.3 3.5 2.8 17a2.2 2.2 0 0 0 1.92 3.3h14.56A2.2 2.2 0 0 0 21.2 17L13.7 3.5a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
    wand: <><path d="m15 4-1.5 4.5L9 10l4.5 1.5L15 16l1.5-4.5L21 10l-4.5-1.5L15 4Z"/><path d="m5 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    external: <><path d="M14 5h5v5"/><path d="m19 5-9 9"/><path d="M19 14v5H5V5h5"/></>,
    play: <path d="m9 6 8 6-8 6V6Z"/>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

const nav = [
  { label: 'Command center', icon: 'grid' },
  { label: 'Signal radar', icon: 'pulse', count: 7 },
  { label: 'Workstreams', icon: 'branch' },
  { label: 'Release room', icon: 'flag' },
]

const releaseItems = [
  { id: 'DS-418', title: 'Session replay privacy gate', detail: 'frontend · 18 files', risk: 'Medium', riskClass: 'warm', checked: true, owner: 'NA' },
  { id: 'DS-423', title: 'Consolidate event retry policy', detail: 'platform · 9 files', risk: 'Low', riskClass: 'cool', checked: true, owner: 'MM' },
  { id: 'DS-401', title: 'Mobile onboarding handoff', detail: 'growth · 24 files', risk: 'High', riskClass: 'danger', checked: false, owner: 'JR' },
]

const signals = [
  { type: 'Review gap', title: 'Replay consent copy changed after legal review', impact: 'DS-418 needs a design acknowledgement', time: 18, color: 'coral', icon: 'alert' },
  { type: 'Delivery win', title: 'Retries now use the shared idempotency key', impact: 'Removes a known release rollback risk', time: 42, color: 'mint', icon: 'check' },
  { type: 'Dependency', title: 'iOS handoff waits on SDK 4.13', impact: 'Owners: Jia + Omar · expected tomorrow', time: 97, color: 'lavender', icon: 'layers' },
]

const people = {
  NA: { name: 'Nadia A.', color: 'purple' },
  MM: { name: 'Mateo M.', color: 'teal' },
  JR: { name: 'Jules R.', color: 'orange' },
  AK: { name: 'Avery K.', color: 'blue' },
}

function Avatar({ initials, size = 'md', label }) {
  const person = people[initials] || { color: 'grey' }
  return <span className={`avatar avatar-${size} ${person.color}`} aria-label={label || person.name}>{initials}</span>
}

function ProgressRing({ score }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference
  const tone = releaseTone(score)
  return <div className="ring-wrap" aria-label={`${score}% release readiness`}>
    <svg className="progress-ring" viewBox="0 0 104 104" role="img">
      <circle className="ring-track" cx="52" cy="52" r="42" />
      <circle className={`ring-value ${tone}`} cx="52" cy="52" r="42" strokeDasharray={circumference} strokeDashoffset={offset} />
    </svg>
    <div className="ring-score"><strong>{score}</strong><span>/100</span></div>
  </div>
}

function App() {
  const [activeNav, setActiveNav] = useState('Command center')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isFocusOpen, setIsFocusOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [toast, setToast] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [briefingError, setBriefingError] = useState(false)
  const [releaseQueue, setReleaseQueue] = useState(releaseItems)
  const [isBriefingExpanded, setIsBriefingExpanded] = useState(false)
  const inputRef = useRef(null)

  const resolvedRisk = Math.round((releaseQueue.filter((item) => item.risk !== 'High').length / releaseQueue.length) * 100)
  const readiness = calculateReadiness({ reviewCoverage: 88, checksPassing: 100, riskResolved: resolvedRisk })

  const commands = useMemo(() => [
    { label: 'Start a 25 minute focus session', shortcut: 'F', icon: 'clock', action: () => setIsFocusOpen(true) },
    { label: 'Generate today’s release briefing', shortcut: 'B', icon: 'wand', action: () => refreshBriefing() },
    { label: 'Open the Release room', shortcut: 'R', icon: 'flag', action: () => setActiveNav('Release room') },
    { label: 'Review signal radar', shortcut: 'G', icon: 'pulse', action: () => setActiveNav('Signal radar') },
  ], [releaseQueue])

  const filteredCommands = commands.filter((command) => command.label.toLowerCase().includes(commandQuery.toLowerCase()))

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3600)
  }

  function refreshBriefing() {
    setIsCommandOpen(false)
    setBriefingError(false)
    setIsRefreshing(true)
    window.setTimeout(() => {
      if (!window.navigator.onLine) {
        setIsRefreshing(false)
        setBriefingError(true)
        return
      }
      setIsRefreshing(false)
      setIsBriefingExpanded(true)
      notify('Briefing refreshed from 14 local project signals.')
    }, 650)
  }

  function markMerged(id) {
    const item = releaseQueue.find((candidate) => candidate.id === id)
    setReleaseQueue((queue) => queue.filter((candidate) => candidate.id !== id))
    notify(`${item.id} moved to the release notes.`)
  }

  useEffect(() => {
    function onKeyDown(event) {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsCommandOpen(true)
      }
      if (!typing && event.key.toLowerCase() === 'f') setIsFocusOpen(true)
      if (event.key === 'Escape') {
        setIsCommandOpen(false)
        setIsFocusOpen(false)
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (isCommandOpen) window.setTimeout(() => inputRef.current?.focus(), 50)
  }, [isCommandOpen])

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to workspace</a>
    <aside className={`sidebar ${isMenuOpen ? 'sidebar-open' : ''}`} aria-label="Primary navigation">
      <div className="brand-lockup">
        <div className="brand-mark"><span></span><span></span><span></span></div>
        <div><strong>developer</strong><em>Studio 1025</em></div>
      </div>

      <div className="workspace-switcher" role="button" tabIndex="0" aria-label="Switch workspace">
        <span className="workspace-icon"><Icon name="spark" size={16}/></span>
        <span><small>WORKSPACE</small><b>Orchid Labs</b></span>
        <Icon name="chevron" size={16}/>
      </div>

      <nav className="nav-list">
        <p>WORKSPACE</p>
        {nav.map((item) => <button key={item.label} className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => { setActiveNav(item.label); setIsMenuOpen(false) }}>
          <Icon name={item.icon}/><span>{item.label}</span>{item.count && <i>{item.count}</i>}
        </button>)}
      </nav>
      <nav className="nav-list nav-bottom">
        <p>PERSONAL</p>
        <button className="nav-item" onClick={() => notify('Your notes are ready for a quiet moment.')}><Icon name="book"/><span>Field notes</span></button>
        <button className="nav-item" onClick={() => notify('Workspace preferences are saved locally.')}><Icon name="settings"/><span>Preferences</span></button>
      </nav>
      <div className="sidebar-footer">
        <button className="help-card" onClick={() => setIsFocusOpen(true)}><span className="help-orbit"><Icon name="spark" size={17}/></span><span><b>Make space to think</b><small>Start a focus session</small></span><Icon name="arrow" size={15}/></button>
        <div className="account-row"><Avatar initials="AK" size="sm"/><span><b>Avery Kim</b><small>Product engineer</small></span><button aria-label="Account options"><Icon name="dots"/></button></div>
      </div>
    </aside>
    {isMenuOpen && <button className="scrim" aria-label="Close menu" onClick={() => setIsMenuOpen(false)} />}

    <main id="main-content" className="main-area">
      <header className="topbar">
        <button className="mobile-menu" aria-label="Open menu" onClick={() => setIsMenuOpen(true)}><Icon name="menu"/></button>
        <div className="breadcrumb"><span>{activeNav}</span><Icon name="chevron" size={14}/><b>Morning signal</b></div>
        <div className="top-actions">
          <button className="command-trigger" onClick={() => setIsCommandOpen(true)} aria-label="Open command menu"><Icon name="search" size={17}/><span>Search anything</span><kbd>⌘ K</kbd></button>
          <button className="icon-button has-alert" aria-label="Notifications" onClick={() => notify('You have 2 new review updates.')}><Icon name="bell"/></button>
          <button className="new-button" onClick={() => notify('A blank workstream has been staged for you.')}><Icon name="plus" size={17}/><span>New</span></button>
        </div>
      </header>

      <section className="dashboard">
        <div className="page-heading">
          <div><p className="eyebrow"><span className="live-dot"></span>LIVE PROJECT PULSE</p><h1>Good morning, Avery <span>✦</span></h1><p className="subcopy">You have one clear path to a confident release.</p></div>
          <div className="date-panel"><Icon name="calendar" size={17}/><div><small>MONDAY</small><b>September 18</b></div></div>
        </div>

        <section className="focus-banner" aria-labelledby="focus-title">
          <div className="focus-orb"><span></span><Icon name="spark" size={23}/></div>
          <div className="focus-copy"><p className="eyebrow">YOUR HIGHEST-LEVERAGE MOVE</p><h2 id="focus-title">Close the consent review loop</h2><p>One thoughtful review unblocks the last high-impact change in <b>Orbit release 2.6</b>.</p><div className="focus-meta"><span><Avatar initials="NA" size="xs"/> with Nadia</span><span><Icon name="clock" size={14}/> 12–18 min</span><span><Icon name="layers" size={14}/> 1 decision</span></div></div>
          <button className="primary-button" onClick={() => setIsFocusOpen(true)}><Icon name="play" size={16}/> Start focus</button>
          <button className="more-button" aria-label="Focus task options" onClick={() => notify('Focus plan copied to your field notes.')}><Icon name="dots"/></button>
        </section>

        <div className="dashboard-grid">
          <section className="release-card panel" aria-labelledby="release-heading">
            <div className="panel-header"><div><p className="eyebrow">SHIP WITH INTENT</p><h2 id="release-heading">Orbit 2.6 readiness</h2></div><button className="subtle-link" onClick={() => setActiveNav('Release room')}>Open release room <Icon name="arrow" size={14}/></button></div>
            <div className="readiness-content">
              <ProgressRing score={readiness}/>
              <div className="readiness-copy"><span className={`status-pill ${releaseTone(readiness)}`}><span></span>{releaseTone(readiness) === 'watch' ? 'Almost there' : 'Release ready'}</span><h3>{releaseQueue.length ? `${releaseQueue.length} changes in the final lane` : 'Release lane is clear'}</h3><p>{releaseQueue.length ? 'Everything is green except one decision that needs a human eye.' : 'Every queued change has a clear destination.'}</p><button className="text-button" onClick={() => setActiveNav('Release room')}>See the release narrative <Icon name="arrow" size={14}/></button></div>
            </div>
            <div className="metric-grid">
              <div><span>Review coverage</span><b>88%</b><small className="positive">+12% this week</small></div>
              <div><span>Checks passing</span><b>100%</b><small>42 / 42 checks</small></div>
              <div><span>Risk resolved</span><b>{resolvedRisk}%</b><small className={resolvedRisk > 65 ? 'positive' : 'warning'}>{resolvedRisk > 65 ? 'On track' : '1 item needs care'}</small></div>
            </div>
          </section>

          <section className="briefing-card panel" aria-labelledby="briefing-heading">
            <div className="briefing-top"><div className="ai-badge"><Icon name="wand" size={16}/></div><div><p className="eyebrow">STUDIO BRIEFING <span>LOCAL DEMO</span></p><h2 id="briefing-heading">The signal behind the noise</h2></div><button className="refresh-button" onClick={refreshBriefing} disabled={isRefreshing} aria-label="Refresh briefing"><Icon name="spark" size={16} className={isRefreshing ? 'spin' : ''}/></button></div>
            {isRefreshing ? <div className="briefing-loading"><span className="loading-orb"><Icon name="spark" size={18}/></span><div><b>Listening for fresh signals</b><p>Rebuilding the local release narrative…</p></div></div> : briefingError ? <div className="briefing-error"><span><Icon name="alert" size={17}/></span><div><b>Briefing is temporarily unavailable</b><p>Reconnect and retry. Your release workspace is still up to date.</p><button onClick={refreshBriefing}>Try again <Icon name="arrow" size={13}/></button></div></div> : <><p className="briefing-lede">“The scope is stable. Protect the consent review today, then the team can ship without borrowing risk from next week.”</p>{isBriefingExpanded && <div className="briefing-extra"><Icon name="check" size={15}/><span>New: retry-policy checks passed in all three environments.</span></div>}</>}
            <div className="briefing-footer"><span><span className="ai-dot"></span> Synthesized from local project activity</span><button onClick={() => setIsBriefingExpanded((value) => !value)}>{isBriefingExpanded ? 'Show less' : 'Why this matters'} <Icon name="arrow" size={13}/></button></div>
          </section>

          <section className="signals-card panel" aria-labelledby="signal-heading">
            <div className="panel-header"><div><p className="eyebrow">TODAY’S SIGNALS</p><h2 id="signal-heading">Worth your attention</h2></div><button className="count-link" onClick={() => setActiveNav('Signal radar')}>7 signals <Icon name="arrow" size={14}/></button></div>
            <div className="signal-list">
              {signals.map((signal) => <article className="signal-row" key={signal.title}><div className={`signal-icon ${signal.color}`}><Icon name={signal.icon} size={16}/></div><div><span className="signal-type">{signal.type}</span><h3>{signal.title}</h3><p>{signal.impact}</p></div><time>{relativeTime(signal.time)}</time></article>)}
            </div>
          </section>

          <section className="queue-card panel" aria-labelledby="queue-heading">
            <div className="panel-header"><div><p className="eyebrow">MERGE QUEUE</p><h2 id="queue-heading">Ready when you are</h2></div><button className="subtle-link" onClick={() => notify('Merge queue filtered to Orbit 2.6.')}>View all <Icon name="arrow" size={14}/></button></div>
            <div className="queue-list">
              {releaseQueue.length ? releaseQueue.map((item) => <article className="queue-item" key={item.id}><button className={`check-box ${item.checked ? 'checked' : ''}`} aria-label={`Toggle ${item.title}`} onClick={() => setReleaseQueue((queue) => queue.map((candidate) => candidate.id === item.id ? { ...candidate, checked: !candidate.checked } : candidate))}>{item.checked && <Icon name="check" size={13}/>}</button><div className="queue-info"><div><b>{item.id}</b><span className={`risk-badge ${item.riskClass}`}>{item.risk}</span></div><h3>{item.title}</h3><p>{item.detail}</p></div><Avatar initials={item.owner} size="sm"/><button className="merge-mini" onClick={() => markMerged(item.id)}>Merge</button></article>) : <div className="empty-queue"><span><Icon name="check" size={20}/></span><h3>Nothing left in the lane</h3><p>Give the team a clean release signal.</p></div>}
            </div>
          </section>
        </div>

        <section className="momentum panel" aria-label="Weekly momentum">
          <div className="momentum-copy"><p className="eyebrow">WEEKLY MOMENTUM</p><h2>Less thrash. More forward motion.</h2><p>You protected 4h 20m of deep work and cleared 9 handoffs this week.</p></div>
          <div className="momentum-stats"><div><b>4h 20m</b><span>focus made</span></div><i></i><div><b>9</b><span>decisions unblocked</span></div><i></i><div><b>+18%</b><span>faster review cycles</span></div></div>
          <button className="momentum-link" onClick={() => notify('Momentum report is ready to share.')}><Icon name="external" size={16}/></button>
        </section>
      </section>
    </main>

    {isCommandOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsCommandOpen(false)}><section className="command-modal" role="dialog" aria-modal="true" aria-labelledby="command-title" onMouseDown={(event) => event.stopPropagation()}><div className="command-input"><Icon name="search"/><input ref={inputRef} value={commandQuery} onChange={(event) => setCommandQuery(event.target.value)} placeholder="Search actions, workstreams, notes…" aria-label="Search commands"/><kbd>ESC</kbd></div><h2 id="command-title">Jump to</h2><div className="command-list">{filteredCommands.map((command) => <button key={command.label} onClick={() => { command.action(); setIsCommandOpen(false) }}><span className="command-icon"><Icon name={command.icon} size={17}/></span><span>{command.label}</span><kbd>{command.shortcut}</kbd></button>)}{filteredCommands.length === 0 && <p className="no-results">No matching moves. Try “release” or “focus”.</p>}</div><footer><span><kbd>↵</kbd> to select</span><span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span></footer></section></div>}

    {isFocusOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsFocusOpen(false)}><section className="focus-modal" role="dialog" aria-modal="true" aria-labelledby="focus-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close focus session" onClick={() => setIsFocusOpen(false)}><Icon name="close"/></button><div className="focus-modal-star">✦</div><p className="eyebrow">FOCUS SESSION</p><h2 id="focus-modal-title">Close the consent review loop</h2><p>A calm, bounded block for the decision that clears Orbit 2.6.</p><div className="timer-orb"><b>18</b><span>minutes</span></div><div className="session-steps"><span><Icon name="check" size={14}/> Read Nadia’s note</span><span><Icon name="check" size={14}/> Confirm final copy</span><span><Icon name="arrow" size={14}/> Hand off to release</span></div><button className="primary-button wide" onClick={() => { setIsFocusOpen(false); notify('Focus session started. We’ll keep the noise out.'); }}><Icon name="play" size={16}/> Begin with intention</button><small>Tip: press <kbd>Esc</kbd> anytime to return to the studio.</small></section></div>}
    {toast && <div className="toast" role="status"><span><Icon name="check" size={15}/></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={15}/></button></div>}
  </div>
}

export default App
