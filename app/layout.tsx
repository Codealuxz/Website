import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import ClientScripts from './components/ClientScripts'
import '@fontsource/geist';

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'OpenMC',
    description: 'Serveur Minecraft open-source innovant et collaboratif',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <meta name="theme-color" content="#18181b" />
                <link rel="canonical" href="https://openmc.fr/" />
                <meta property="og:title" content="OpenMC - Serveur Minecraft open-source innovant et collaboratif" />
                <meta property="og:description" content="Serveur Minecraft open-source innovant et collaboratif pour la communauté. Et en constante évolution." />
                <meta property="og:image" content="https://openmc.fr/images/ui/logo.png" />
                <meta property="og:url" content="https://openmc.fr/" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="OpenMC - Serveur Minecraft open-source innovant et collaboratif" />
                <meta name="twitter:description" content="OpenMC est un projet communautaire open-source dédié à la création d'un serveur Minecraft innovant et collaboratif." />
                <meta name="twitter:image" content="https://openmc.fr/images/ui/logo.png" />
                <meta name="keywords" content="Minecraft, Aywen, serveur Minecraft, open-source, serveur multijoueur, communauté Minecraft, plugins Minecraft, serveur innovant, serveur collaboratif, France, OpenMC, serveur français, hébergement Minecraft, développement Minecraft, projet communautaire, serveur gratuit, serveur Minecraft français, serveur Minecraft open-source, serveur Minecraft multijoueur, serveur Minecraft communautaire, serveur Minecraft innovant, serveur Minecraft collaboratif, serveur Minecraft innovatif" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            // Supprimer l'attribut cz-shortcut-listen immédiatement et de manière agressive
                            (function() {
                                function removeCzShortcutListen() {
                                    if (document.body && document.body.hasAttribute('cz-shortcut-listen')) {
                                        document.body.removeAttribute('cz-shortcut-listen');
                                    }
                                }
                                
                                // Suppression immédiate
                                removeCzShortcutListen();
                                
                                // Suppression avec intervalle très fréquent
                                setInterval(removeCzShortcutListen, 10);
                                
                                // Observer pour détecter les changements
                                if (document.body) {
                                    const observer = new MutationObserver(function(mutations) {
                                        mutations.forEach(function(mutation) {
                                            if (mutation.type === 'attributes' && mutation.attributeName === 'cz-shortcut-listen') {
                                                removeCzShortcutListen();
                                            }
                                        });
                                    });
                                    
                                    observer.observe(document.body, {
                                        attributes: true,
                                        attributeFilter: ['cz-shortcut-listen']
                                    });
                                }
                                
                                // Suppression aussi sur document.documentElement
                                function removeFromDocument() {
                                    if (document.documentElement && document.documentElement.hasAttribute('cz-shortcut-listen')) {
                                        document.documentElement.removeAttribute('cz-shortcut-listen');
                                    }
                                }
                                
                                removeFromDocument();
                                setInterval(removeFromDocument, 10);
                            })();
                        `
                    }}
                />
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: `{
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://openmc.fr/"},
                    {"@type": "ListItem", "position": 2, "name": "Rejoindre", "item": "https://openmc.fr/join"},
                    {"@type": "ListItem", "position": 3, "name": "Galerie", "item": "https://openmc.fr/screenshots"},
                    {"@type": "ListItem", "position": 4, "name": "Changelog", "item": "https://openmc.fr/changelog"}
                  ]
                }`}} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: `{
                  "@context": "https://schema.org",
                  "@type": "SiteNavigationElement",
                  "name": ["Accueil", "Rejoindre", "Galerie", "Changelog"],
                  "url": [
                    "https://openmc.fr/",
                    "https://openmc.fr/join",
                    "https://openmc.fr/screenshots",
                    "https://openmc.fr/changelog"
                  ]
                }`}} />
            </head>
            <body className="geist-font">
                <div className="theme-transition-overlay">
                    <img src="images/ui/logo.webp" alt="OpenMC Logo" className="theme-transition-logo" />
                </div>
                <div className="page-transition">
                    <img src="images/ui/logo.webp" alt="OpenMC Logo" className="page-transition-logo" />
                </div>
                <div className="page-change-transition">
                    <img src="images/ui/logo.webp" alt="OpenMC Logo" className="page-change-transition-logo" />
                    <p className="page-transition-text">Chargement...</p>
                </div>
                <div className="overlay"></div>
                <div className="day-dark" id="theme-toggle">
                    <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 2v2"></path>
                        <path d="M12 20v2"></path>
                        <path d="m4.93 4.93 1.41 1.41"></path>
                        <path d="m17.66 17.66 1.41 1.41"></path>
                        <path d="M2 12h2"></path>
                        <path d="M20 12h2"></path>
                        <path d="m6.34 17.66-1.41 1.41"></path>
                        <path d="m19.07 4.93-1.41 1.41"></path>
                    </svg>
                    <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                    </svg>
                </div>
                {children}
                <ClientScripts />
            </body>
        </html>
    )
} 