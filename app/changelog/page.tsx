'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

interface Commit {
    sha: string
    commit: {
        message: string
        author: {
            name: string
            date: string
        }
    }
    author: {
        login: string
        avatar_url: string
    }
}

interface ChangelogEntry {
    repo: string
    commits: Commit[]
}

export default function ChangelogPage() {
    const [changelog, setChangelog] = useState<ChangelogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [showReleases, setShowReleases] = useState(false)
    const [releases, setReleases] = useState<any[]>([])
    const [loadingReleases, setLoadingReleases] = useState(false)
    const [errorReleases, setErrorReleases] = useState<string | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        // Charger le changelog depuis l'API GitHub
        fetch('https://api.github.com/repos/ServerOpenMC/PluginV2/commits?per_page=10')
            .then(response => response.json())
            .then((commits: Commit[]) => {
                setChangelog([{
                    repo: 'PluginV2',
                    commits: commits
                }])
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])

    const handleShowReleases = async () => {
        if (!showReleases && releases.length === 0) {
            setLoadingReleases(true)
            setErrorReleases(null)
            try {
                const res = await fetch('https://api.github.com/repos/ServerOpenMC/PluginV2/releases?per_page=100')
                if (!res.ok) throw new Error('Erreur lors du chargement des releases')
                const data = await res.json()
                setReleases(data)
            } catch (e: any) {
                setErrorReleases(e.message || 'Erreur inconnue')
            } finally {
                setLoadingReleases(false)
            }
        }
        setShowReleases(!showReleases)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getCommitType = (message: string) => {
        if (message.startsWith('feat:')) return '✨ Nouvelle fonctionnalité'
        if (message.startsWith('fix:')) return '🐛 Correction'
        if (message.startsWith('docs:')) return '📚 Documentation'
        if (message.startsWith('style:')) return '🎨 Style'
        if (message.startsWith('refactor:')) return '♻️ Refactoring'
        if (message.startsWith('test:')) return '🧪 Test'
        if (message.startsWith('chore:')) return '🔧 Maintenance'
        return '📝 Modification'
    }

    return (
        <>
            <header>
                <div className="header-container">
                    <div className="header-logo">
                        <Link href="/">
                            <img src="images/ui/logo.webp" alt="OpenMC Logo" />
                        </Link>
                    </div>
                    <div className={`header-menu${menuOpen ? ' open' : ''}`}>
                        <Link href="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
                        <Link href="/screenshots" onClick={() => setMenuOpen(false)}>Galerie</Link>
                        <a href="https://wiki.openmc.fr/" target="_blank" rel="noopener noreferrer">Wiki</a>
                        <a href="https://discord.com/invite/H7DrUjHw7q" target="_blank" rel="noopener noreferrer">Discord</a>
                        <Link href="/changelog" className="active" onClick={() => setMenuOpen(false)}>Changelog</Link>
                        <a href="https://github.com/ServerOpenMC" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <button className="cta-button burger-menu-btn mt-4 w-full" onClick={() => { setMenuOpen(false); window.location.href = 'join'; }}>
                            Rejoindre le serveur
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                    <button
                        className={`burger-menu${menuOpen ? ' open' : ''}`}
                        aria-label="Ouvrir le menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <div className="cta">
                        <button className="cta-button" onClick={() => window.location.href = 'join'}>
                            Rejoindre le serveur
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                {menuOpen && (
                    <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-md transition-all duration-300 opacity-100" onClick={() => setMenuOpen(false)}></div>
                )}
            </header>

            <main className="slide-in-from-top">
                <div className="changelog-container">
                    <h1>Changelog OpenMC</h1>
                    <p>
                        Retrouvez ici les derniers changements du dépôt principal{' '}
                        <a href="https://github.com/ServerOpenMC/PluginV2" target="_blank" rel="noopener noreferrer">
                            @ServerOpenMC/PluginV2
                        </a>.
                    </p>
                    <div id="changelog-list" className="changelog-list">
                        {loading ? (
                            <p>Chargement du changelog...</p>
                        ) : changelog.length > 0 ? (
                            changelog.map((entry) => (
                                <div key={entry.repo} className="changelog-repo">
                                    <h2>
                                        <a href={`https://github.com/ServerOpenMC/${entry.repo}`} target="_blank" rel="noopener noreferrer">
                                            {entry.repo}
                                        </a>
                                        <span className="changelog-badge">public</span>
                                    </h2>
                                    <button
                                        onClick={handleShowReleases}
                                        style={{
                                            background: 'var(--accent-color)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 8,
                                            padding: '7px 18px',
                                            fontWeight: 700,
                                            fontSize: '0.98rem',
                                            marginBottom: 18,
                                            marginTop: 8,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                                            transition: 'background 0.18s',
                                            float: 'right',
                                        }}
                                    >
                                        {showReleases ? 'Masquer les releases' : 'Afficher les releases'}
                                    </button>
                                    <p style={{ clear: 'both' }}>Derniers commits du dépôt principal</p>
                                    <div className="changelog-entries">
                                        <div className="changelog-timeline">
                                            {Array.isArray(entry.commits) ? (
                                                entry.commits.map((commit) => (
                                                    <div key={commit.sha} className="changelog-timeline-entry">
                                                        <div className="changelog-timeline-dot"></div>
                                                        <div className="changelog-timeline-content">
                                                            <div className="changelog-timeline-title">
                                                                {getCommitType(commit.commit.message)}
                                                                <span className="changelog-timeline-date">
                                                                    {formatDate(commit.commit.author.date)}
                                                                </span>
                                                            </div>
                                                            <div className="changelog-timeline-body">
                                                                {commit.commit.message.split('\n')[0]}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ color: 'red' }}>Deso mais t'es rate limite par Github</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Erreur lors du chargement du changelog.</p>
                        )}
                    </div>
                </div>
                {/* MODALE RELEASES */}
                {showReleases && (
                    <div style={{
                        position: 'fixed',
                        bottom: -45,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.45)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                        onClick={() => setShowReleases(false)}
                    >
                        <div style={{
                            background: 'var(--background-color)',
                            borderRadius: 18,
                            padding: '32px 24px',
                            minWidth: 320,
                            maxWidth: 600,
                            maxHeight: 'calc(80vh - 110px)',
                            overflowY: 'auto',
                            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
                            border: '1.5px solid var(--border-color-alt)',
                            position: 'relative',
                        }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                className="close-button"
                                onClick={() => setShowReleases(false)}
                                style={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 16,
                                    background: 'none',
                                    border: '2px solid transparent',
                                    borderRadius: 10,
                                    width: 36,
                                    height: 36,
                                    fontSize: 20,
                                    color: 'var(--text-color-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    padding: 0,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                                    e.currentTarget.style.color = 'var(--accent-color)';
                                    e.currentTarget.style.background = 'rgba(244,119,150,0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-color-secondary)';
                                    e.currentTarget.style.background = 'none';
                                }}
                                aria-label="Fermer la fenêtre des releases"
                            >
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="6" y1="6" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="16" y1="6" x2="6" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                            <h2 style={{ marginBottom: 18, fontSize: '1.25rem', color: 'var(--accent-color)' }}>Releases du projet</h2>
                            {loadingReleases ? (
                                <p>Deso mais t'es rate limite par Github</p>
                            ) : errorReleases ? (
                                <p style={{ color: 'red' }}>{errorReleases}</p>
                            ) : releases.length === 0 ? (
                                <p>Deso mais t'es rate limite par Github.</p>
                            ) : (
                                releases.map((rel, idx) => (
                                    <div key={rel.id} style={{ marginBottom: 32 }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-color)', marginBottom: 2 }}>
                                            {rel.name || rel.tag_name}{' '}
                                            <span style={{ fontSize: '0.95rem', color: 'var(--text-color-secondary)', marginLeft: 8 }}>
                                                {rel.published_at ? formatDate(rel.published_at) : ''}
                                            </span>
                                        </div>
                                        <div style={{ marginBottom: 8 }}>
                                            <a href={rel.html_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'underline dotted', transition: 'color 0.18s, transform 0.18s', display: 'inline-block' }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#f38ea7'; e.currentTarget.style.transform = 'scale(1.07) translateX(4px)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent-color)'; e.currentTarget.style.transform = 'none'; }}
                                            >
                                                Voir sur GitHub
                                            </a>
                                        </div>
                                        <div style={{ color: 'var(--text-color-secondary)', fontSize: '1rem' }}>
                                            {rel.body ? <ReactMarkdown>{rel.body}</ReactMarkdown> : <em>Deso mais t'es rate limite par Github</em>}
                                        </div>
                                        {idx < releases.length - 1 && <hr style={{ margin: '28px 0', border: 'none', borderTop: '1.5px solid var(--border-color-alt)' }} />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src="images/ui/logo.webp" alt="OpenMC Logo" />
                        </div>
                        <p className="footer-description">
                            Serveur Minecraft open-source innovant et collaboratif pour la communauté.
                        </p>
                    </div>
                    <div className="footer-section">
                        <h4>Liens rapides</h4>
                        <ul className="footer-links">
                            <li><Link href="/">Accueil</Link></li>
                            <li><Link href="join">Rejoindre le serveur</Link></li>
                            <li><Link href="/screenshots">Galerie</Link></li>
                            <li><Link href="/changelog">Changelog</Link></li>
                            <li><a href="https://wiki.openmc.fr/" target="_blank" rel="noopener noreferrer">Wiki</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Communauté</h4>
                        <ul className="footer-links">
                            <li><a href="https://discord.com/invite/H7DrUjHw7q" target="_blank" rel="noopener noreferrer">Discord</a></li>
                            <li><a href="https://github.com/ServerOpenMC" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; 2025 OpenMC. Tous droits réservés.</p>
                        <div className="footer-bottom-links">
                            <a href="#">Mentions légales</a>
                            <a href="#">Politique de confidentialité</a>
                            <a href="#">Conditions d'utilisation</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
} 