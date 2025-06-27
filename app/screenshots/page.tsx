'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Screenshot {
    id: number
    filename: string
    alt: string
    width: number
    height: number
}

export default function ScreenshotsPage() {
    const [screenshots, setScreenshots] = useState<Screenshot[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        // Utiliser directement les données hardcodées
        setScreenshots([
            { id: 1, filename: 'screen1.webp', alt: 'Screenshot 1', width: 800, height: 600 },
            { id: 2, filename: 'screen2.webp', alt: 'Screenshot 2', width: 800, height: 600 },
            { id: 3, filename: 'screen3.webp', alt: 'Screenshot 3', width: 800, height: 600 },
            { id: 4, filename: 'screen4.webp', alt: 'Screenshot 4', width: 800, height: 600 },
            { id: 5, filename: 'screen5.webp', alt: 'Screenshot 5', width: 800, height: 600 },
        ])
    }, [])

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const openLightbox = (imageSrc: string) => {
        console.log('Clic détecté sur image:', imageSrc)
        setSelectedImage(imageSrc)
        console.log('selectedImage mis à jour:', imageSrc)
    }

    const closeLightbox = () => {
        console.log('Fermeture lightbox')
        setSelectedImage(null)
    }

    // Debug: afficher l'état selectedImage
    console.log('État actuel selectedImage:', selectedImage)

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
                        <Link href="/screenshots" className="active" onClick={() => setMenuOpen(false)}>Galerie</Link>
                        <a href="https://wiki.openmc.fr/" target="_blank" rel="noopener noreferrer">Wiki</a>
                        <a href="https://discord.com/invite/H7DrUjHw7q" target="_blank" rel="noopener noreferrer">Discord</a>
                        <Link href="/changelog" onClick={() => setMenuOpen(false)}>Changelog</Link>
                        <a href="https://github.com/ServerOpenMC" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <button className="cta-button burger-menu-btn mt-4 w-full" onClick={() => { setMenuOpen(false); }}>
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
                        <Link href="/join" passHref>
                            <button className="cta-button">
                                Rejoindre le serveur
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </button>
                        </Link>
                    </div>
                </div>
                {menuOpen && (
                    <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-md transition-all duration-300 opacity-100" onClick={() => setMenuOpen(false)}></div>
                )}
            </header>

            <main className="slide-in-from-top">
                <div className="gallery-container">
                    <h1>Galerie d'images</h1>
                    <p>Découvrez les plus beaux paysages et constructions du serveur OpenMC.</p>
                    <div className="screenshot-grid">
                        {screenshots.map((screenshot) => (
                            <div
                                key={screenshot.id}
                                className="screenshot-card"
                                onClick={() => openLightbox(`images/screenshots/${screenshot.filename}`)}
                            >
                                <Image
                                    src={`images/screenshots/${screenshot.filename}`}
                                    alt={screenshot.alt}
                                    width={screenshot.width}
                                    height={screenshot.height}
                                    onLoad={() => console.log(`Image chargée: ${screenshot.filename}`)}
                                    onError={() => console.error(`Erreur chargement image: ${screenshot.filename}`)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {selectedImage && (
                <div id="lightbox-overlay" className="lightbox-overlay" onClick={closeLightbox}>
                    <span className="lightbox-close" onClick={closeLightbox}>&times;</span>
                    <Image
                        className="lightbox-content"
                        src={selectedImage}
                        alt="Screenshot"
                        width={1200}
                        height={800}
                        style={{ objectFit: 'contain' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

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
                            <li><Link href="join">Rejoindre</Link></li>
                            <li><Link href="/screenshots">Galerie</Link></li>
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