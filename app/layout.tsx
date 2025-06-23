import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientScripts from './components/ClientScripts'

const inter = Inter({ subsets: ['latin'] })

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
            </head>
            <body className={inter.className}>
                <div className="theme-transition-overlay">
                    <img src="/images/ui/logo.webp" alt="OpenMC Logo" className="theme-transition-logo" />
                </div>
                <div className="page-transition">
                    <img src="/images/ui/logo.webp" alt="OpenMC Logo" className="page-transition-logo" />
                </div>
                <div className="page-change-transition">
                    <img src="/images/ui/logo.webp" alt="OpenMC Logo" className="page-change-transition-logo" />
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