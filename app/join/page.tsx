'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Player {
    name: string
    uuid: string
}

interface ServerStatus {
    online: boolean
    players: {
        online: number
        max: number
        list: string[]
        uuid?: { [key: string]: string }
    }
    version: string
    description: string
}

export default function JoinPage() {
    const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking')
    const [serverData, setServerData] = useState<ServerStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const fetchServerStatus = async () => {
            try {
                // Utilisation de l'API Minecraft pour récupérer le statut du serveur
                const response = await fetch(`https://api.mcsrvstat.us/2/beta.openmc.fr`)
                const data = await response.json()

                if (data.online) {
                    setServerStatus('online')
                    setServerData(data)
                } else {
                    setServerStatus('offline')
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du statut du serveur:', error)
                setServerStatus('offline')
            } finally {
                setLoading(false)
            }
        }

        fetchServerStatus()

        // Rafraîchir le statut toutes les 30 secondes
        const interval = setInterval(fetchServerStatus, 30000)

        return () => clearInterval(interval)
    }, [])

    const copyIP = () => {
        navigator.clipboard.writeText('beta.openmc.fr')
        // Optionnel: afficher une notification de succès
    }

    const getPlayerCount = () => {
        if (!serverData) return '-'
        return `${serverData.players.online}/${serverData.players.max}`
    }

    const getMaxPlayers = () => {
        if (!serverData) return '-'
        return serverData.players.max.toString()
    }

    const getServerVersion = () => {
        if (!serverData || !serverData.version) return 'Version: -'
        // L'API retourne la version directement comme une chaîne, pas dans un objet .name
        return `Version: ${serverData.version}`
    }

    const getOnlinePlayers = () => {
        if (!serverData || !serverData.players.list) {
            return []
        }

        // L'API retourne players.list comme un tableau de noms et players.uuid comme un objet
        const playerNames = serverData.players.list;
        const playerUuids = serverData.players.uuid || {};

        // Transformer les données au format attendu
        const players = playerNames.map(name => ({
            name: name,
            uuid: playerUuids[name] || 'undefined'
        }));

        return players;
    }

    const getPlayerHead = (player: Player) => {
        // Si l'UUID n'est pas disponible, utiliser l'UUID de Steve comme fallback
        if (!player.uuid || player.uuid === 'undefined') {
            return 'https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=80&overlay'
        }
        return `https://crafatar.com/avatars/${player.uuid}?size=80&overlay`;
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
                        <Link href="/changelog" onClick={() => setMenuOpen(false)}>Changelog</Link>
                        <a href="https://github.com/ServerOpenMC" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <button className="cta-button mt-4 w-full" onClick={() => { setMenuOpen(false); window.location.href = 'join'; }}>
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
                <div className="join-container">
                    <div className="join-content">
                        <div className="join-header">
                            <h1>Rejoindre OpenMC</h1>
                            <p>Connectez-vous à notre serveur Minecraft open-source</p>
                        </div>

                        <div className="server-info">
                            <div className="ip-card">
                                <h2>Adresse du serveur</h2>
                                <div className="ip-display">
                                    <span className="ip-text" id="server-ip">beta.openmc.fr</span>
                                    <button className="copy-btn" onClick={copyIP}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                </div>
                                <p className="ip-note">Copiez cette adresse dans votre client Minecraft</p>
                            </div>

                            <div className="server-status">
                                <h3>Statut du serveur</h3>
                                <div className="status-indicator">
                                    <div className={`status-dot ${serverStatus}`} id="status-dot"></div>
                                    <span className="status-text" id="status-text">
                                        {loading ? 'Vérification...' :
                                            serverStatus === 'online' ? 'En ligne' :
                                                serverStatus === 'offline' ? 'Hors ligne' : 'Vérification...'}
                                    </span>
                                </div>
                                <div className="player-count">
                                    <span className="player-number" id="player-count">
                                        {getPlayerCount()}
                                    </span>
                                    <span className="player-label">
                                        joueurs connectés
                                    </span>
                                </div>
                                <div className="server-version">
                                    <span className="version-text" id="server-version">
                                        {getServerVersion()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="join-steps">
                            <h3>Comment rejoindre ?</h3>
                            <div className="steps-grid">
                                <div key="step-1" className="step">
                                    <div className="step-number">1</div>
                                    <h4>Ouvrez Minecraft</h4>
                                    <p>Lancez votre client Minecraft (Java Edition)</p>
                                </div>
                                <div key="step-2" className="step">
                                    <div className="step-number">2</div>
                                    <h4>Cliquez sur "Multijoueur"</h4>
                                    <p>Dans le menu principal, sélectionnez "Multijoueur"</p>
                                </div>
                                <div key="step-3" className="step">
                                    <div className="step-number">3</div>
                                    <h4>Ajoutez le serveur</h4>
                                    <p>Cliquez sur "Ajouter un serveur" et collez l'adresse</p>
                                </div>
                                <div key="step-4" className="step">
                                    <div className="step-number">4</div>
                                    <h4>Connectez-vous !</h4>
                                    <p>Double-cliquez sur le serveur pour vous connecter</p>
                                </div>
                            </div>
                        </div>

                        <div className="online-players-section">
                            <h3>Qui est en ligne ?</h3>
                            <div id="online-players-grid" className="players-grid">
                                {(() => {
                                    const onlinePlayers = getOnlinePlayers();
                                    if (loading) {
                                        return (
                                            <div key="loading-placeholder" className="player-placeholder">
                                                <p>Vérification du statut du serveur...</p>
                                            </div>
                                        );
                                    } else if (onlinePlayers.length > 0) {
                                        return onlinePlayers.map((player, index) => (
                                            <div key={`${player.name}-${index}`} className="player-card">
                                                <Image
                                                    src={getPlayerHead(player)}
                                                    alt={`Tête de ${player.name}`}
                                                    title={player.name}
                                                    width={80}
                                                    height={80}
                                                    className="player-head"
                                                    onError={(e) => {
                                                        // En cas d'erreur, utiliser l'UUID de Steve comme fallback
                                                        const target = e.target as HTMLImageElement
                                                        target.src = 'https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=80&overlay'
                                                    }}
                                                />
                                                <span className="player-name">{player.name}</span>
                                            </div>
                                        ));
                                    } else {
                                        return (
                                            <div key="empty-placeholder" className="player-placeholder">
                                                <p>Personne n'est connecté pour le moment.</p>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>

                        <div className="join-actions">
                            <a href="https://discord.com/invite/H7DrUjHw7q" target="_blank" rel="noopener noreferrer" className="discord-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                                Rejoindre Discord
                            </a>
                            <button className="back-btn" onClick={() => window.location.href = '/'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
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