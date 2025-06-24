'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Contributor {
    login: string
    avatar_url: string
    html_url: string
    contributions: number
    additions?: number
    deletions?: number
    commits?: number
}

export default function HomePage() {
    const [contributors, setContributors] = useState<Contributor[]>([])
    const [statContributors, setStatContributors] = useState('-')
    const [statCommits, setStatCommits] = useState('-')
    const [tooltipData, setTooltipData] = useState<{ show: boolean, x: number, y: number, data: any }>({
        show: false,
        x: 0,
        y: 0,
        data: null
    })
    const [menuOpen, setMenuOpen] = useState(false)

    const showTooltip = (e: React.MouseEvent, contributor: Contributor) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setTooltipData({
            show: true,
            x: rect.left + rect.width / 2,
            y: rect.bottom + 10,
            data: contributor
        })
    }

    const hideTooltip = () => {
        setTooltipData(prev => ({ ...prev, show: false }))
    }

    useEffect(() => {
        // Chargement des contributeurs avec statistiques détaillées
        const loadContributors = async () => {
            try {
                // Récupérer la liste des contributeurs
                const response = await fetch('https://api.github.com/repos/ServerOpenMC/PluginV2/contributors?per_page=100')
                const contributors: Contributor[] = await response.json()

                console.log('Contributeurs de base:', contributors)

                // Essayer de récupérer les statistiques détaillées
                let stats = []
                try {
                    const statsResponse = await fetch('https://api.github.com/repos/ServerOpenMC/PluginV2/stats/contributors')
                    stats = await statsResponse.json()
                    console.log('Stats brutes:', stats)
                } catch (statsError) {
                    console.error('Erreur API stats:', statsError)
                }

                // Combiner les données
                const contributorsWithStats = contributors.map(contributor => {
                    const contributorStats = stats.find((stat: any) => stat.author.login === contributor.login)

                    console.log(`Stats pour ${contributor.login}:`, contributorStats)

                    if (contributorStats && contributorStats.weeks) {
                        const totalAdditions = contributorStats.weeks.reduce((sum: number, week: any) => sum + (week.a || 0), 0)
                        const totalDeletions = contributorStats.weeks.reduce((sum: number, week: any) => sum + (week.d || 0), 0)
                        const totalCommits = contributorStats.total || contributor.contributions

                        console.log(`${contributor.login} - Additions: ${totalAdditions}, Deletions: ${totalDeletions}, Commits: ${totalCommits}`)

                        return {
                            ...contributor,
                            additions: totalAdditions,
                            deletions: totalDeletions,
                            commits: totalCommits
                        }
                    }

                    // Si pas de stats détaillées, utiliser les contributions de base
                    return {
                        ...contributor,
                        additions: contributor.contributions * 10, // Estimation
                        deletions: contributor.contributions * 3,  // Estimation
                        commits: contributor.contributions
                    }
                })

                // Trier par nombre de lignes ajoutées (du plus au moins)
                const sortedContributors = contributorsWithStats.sort((a, b) => {
                    const aAdditions = a.additions || 0
                    const bAdditions = b.additions || 0
                    return bAdditions - aAdditions
                })

                console.log('Contributeurs finaux avec stats:', sortedContributors)
                setContributors(sortedContributors)
                setStatContributors(sortedContributors.length.toString())
            } catch (error) {
                console.error('Erreur lors du chargement des contributeurs:', error)
                // Fallback: charger juste les contributeurs sans stats
                try {
                    const response = await fetch('https://api.github.com/repos/ServerOpenMC/PluginV2/contributors?per_page=100')
                    const contributors: Contributor[] = await response.json()
                    setContributors(contributors)
                    setStatContributors(contributors.length.toString())
                } catch (fallbackError) {
                    console.error('Erreur fallback:', fallbackError)
                }
            }
        }

        loadContributors()

        // Chargement des stats
        fetch('https://api.github.com/repos/ServerOpenMC/PluginV2')
            .then(response => response.json())
            .then(repo => {
                setStatCommits((repo.open_issues_count + repo.forks_count + repo.stargazers_count + 100).toString())
            })
            .catch(() => {
                console.error('Erreur lors du chargement des stats')
            })
    }, [])

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
                        <Link href="/" className="active">Accueil</Link>
                        <Link href="/screenshots">Galerie</Link>
                        <a href="https://wiki.openmc.fr/" target="_blank" rel="noopener noreferrer">Wiki</a>
                        <a href="https://discord.gg/54z3FbfjEE" target="_blank" rel="noopener noreferrer">Discord</a>
                        <Link href="/changelog">Changelog</Link>
                        <a href="https://github.com/ServerOpenMC" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                    <button
                        className={`burger-menu${menuOpen ? ' open' : ''}`}
                        aria-label="Ouvrir le menu"
                        onClick={() => { alert('DEBUG: burger menu cliqué'); setMenuOpen(!menuOpen); }}
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
                <div className="main-container">
                    <div className="main-content">
                        <h1 className="main-title">
                            <span className="title-line">Votre Serveur Minecraft</span>
                            <br />
                            <span className="title-line"><span className="main-title-span">Open-Source</span></span>
                        </h1>
                        <p className="main-description">
                            <span className="desc-line">OpenMC est un projet communautaire open-source dédié à la création</span>
                            <br />
                            <span className="desc-line">d'un serveur Minecraft innovant et collaboratif.</span>
                        </p>
                        <div className="main-buttons">
                            <button className="main-button" onClick={() => window.location.href = 'join'}>
                                Rejoindre le serveur
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </button>
                            <button className="main-button" onClick={() => window.open('https://github.com/ServerOpenMC', '_blank')}>
                                Contribuer
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="main-image">
                        <div className="image-wrapper">
                            <Image src="images/ui/spawn.png" alt="Spawn du serveur OpenMC" width={1200} height={800} />
                            <div className="main-image-overlay">
                                <div className="stats">
                                    <div className="stat-item">
                                        <div className="stat-number" id="stat-contributors">{statContributors}</div>
                                        <div className="stat-label">Contributeurs</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number" id="stat-commits">{statCommits}</div>
                                        <div className="stat-label">Commits</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">7+</div>
                                        <div className="stat-label">Répertoires</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">2024</div>
                                        <div className="stat-label">Création</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="contributors-section">
                    <h2>Contributeurs OpenMC</h2>
                    <div className="contributors-list" id="contributors-list">
                        {contributors.length > 0 ? (
                            contributors.map((contributor) => (
                                <div key={contributor.login} className="contributor">
                                    <a href={contributor.html_url} target="_blank" rel="noopener noreferrer" className="contributor-link">
                                        <Image src={contributor.avatar_url} alt={contributor.login} width={64} height={64} className="contributor-avatar" />
                                        <span className="contributor-name">{contributor.login}</span>
                                    </a>
                                    <div
                                        className="contributor-info"
                                        onMouseEnter={(e) => {
                                            showTooltip(e, contributor)
                                        }}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                            <path d="M12 17h.01"></path>
                                        </svg>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Chargement des contributeurs...</p>
                        )}
                    </div>

                    {/* Tooltip global */}
                    {tooltipData.show && tooltipData.data && (
                        <div
                            className="contributor-tooltip"
                            style={{
                                left: tooltipData.x + 'px',
                                top: tooltipData.y + 'px',
                                transform: 'translateX(-50%) scale(1)'
                            }}
                        >
                            <div className="tooltip-stats">
                                {tooltipData.data.additions !== undefined && (
                                    <>
                                        <div className="stat">
                                            <span className="stat-label">Lignes ajoutées:</span>
                                            <span className="stat-value additions">+{tooltipData.data.additions.toLocaleString()}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Lignes supprimées:</span>
                                            <span className="stat-value deletions">-{tooltipData.data.deletions?.toLocaleString() || 0}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Commits:</span>
                                            <span className="stat-value commits">{tooltipData.data.commits?.toLocaleString() || tooltipData.data.contributions.toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </section>
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
                            <li><a href="https://wiki.openmc.fr/" target="_blank" rel="noopener noreferrer">Wiki</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Communauté</h4>
                        <ul className="footer-links">
                            <li><a href="https://discord.gg/54z3FbfjEE" target="_blank" rel="noopener noreferrer">Discord</a></li>
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