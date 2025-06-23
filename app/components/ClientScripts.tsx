'use client'

import { useEffect } from 'react'

export default function ClientScripts() {
    useEffect(() => {
        // Gestion du thème
        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark'
            document.documentElement.setAttribute('data-theme', savedTheme)
        }

        // Fonction pour remettre le scroll à la normale
        function resetScroll() {
            document.body.style.overflow = ''
            console.log('Scroll remis à la normale')
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme')
            const newTheme = currentTheme === 'light' ? 'dark' : 'light'
            const overlay = document.querySelector('.theme-transition-overlay')
            const themeToggle = document.getElementById('theme-toggle')

            if (themeToggle) {
                themeToggle.style.transform = 'scale(0.9)'
            }

            if (overlay) {
                overlay.classList.add('active')
            }

            setTimeout(() => {
                document.documentElement.setAttribute('data-theme', newTheme)
                localStorage.setItem('theme', newTheme)

                setTimeout(() => {
                    if (overlay) {
                        overlay.classList.remove('active')
                    }
                    if (themeToggle) {
                        themeToggle.style.transform = 'scale(1)'
                    }
                }, 300)
            }, 200)
        }

        // Gestion du scroll
        function handleScroll() {
            const header = document.querySelector('header')
            const headerContainer = document.querySelector('.header-container')
            const mainImage = document.querySelector('.main-image')
            const titleLines = document.querySelectorAll('.title-line')
            const descLines = document.querySelectorAll('.desc-line')
            const imageOverlay = document.querySelector('.main-image-overlay')
            const statItems = document.querySelectorAll('.stat-item')

            if (header && headerContainer) {
                if (window.scrollY > 10) {
                    header.classList.add('scrolled')
                    headerContainer.classList.add('scrolled')
                } else {
                    header.classList.remove('scrolled')
                    headerContainer.classList.remove('scrolled')
                }
            }

            const scrollPercent = Math.min(window.scrollY / (window.innerHeight * 0.3), 1)
            if (scrollPercent > 0.3) {
                titleLines.forEach((line, index) => {
                    if (scrollPercent > 0.3 + (index * 0.2)) {
                        line.classList.add('fade-out')
                    } else {
                        line.classList.remove('fade-out')
                    }
                })
            } else {
                titleLines.forEach(line => line.classList.remove('fade-out'))
            }

            descLines.forEach((line, index) => {
                if (scrollPercent > 0.5 + (index * 0.2)) {
                    line.classList.add('fade-out')
                } else {
                    line.classList.remove('fade-out')
                }
            })

            if (imageOverlay && statItems.length > 0) {
                const imageScrollPercent = Math.min(window.scrollY / (window.innerHeight * 0.8), 1)
                if (imageScrollPercent > 0.6) {
                    imageOverlay.classList.add('visible')

                    statItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible')
                        }, index * 200)
                    })
                } else {
                    imageOverlay.classList.remove('visible')
                    statItems.forEach(item => item.classList.remove('visible'))
                }
            }

            if (mainImage) {
                const image = mainImage.querySelector('img')
                if (image) {
                    const scrollPercent = Math.min(window.scrollY / (window.innerHeight * 0.5), 1)
                    const scale = 0.7 + (scrollPercent * 0.3)

                    let marginTop
                    if (window.innerWidth <= 768) {
                        marginTop = -50 + (scrollPercent * 40)
                    } else {
                        marginTop = -130 + (scrollPercent * 130)
                    }

                    image.style.transform = `scale(${scale})`
                    image.style.marginTop = `${marginTop}px`
                }
            }
        }

        // Gestion du menu burger
        document.addEventListener('DOMContentLoaded', function () {
            const burger = document.querySelector<HTMLElement>('.burger-menu')
            const nav = document.querySelector<HTMLElement>('.header-menu')
            const cta = document.querySelector<HTMLElement>('.cta')
            const headerContainer = document.querySelector<HTMLElement>('.header-container')

            function handleBurgerClick() {
                if (burger && nav && cta && headerContainer) {
                    burger.classList.toggle('open')
                    nav.classList.toggle('open')

                    if (nav.classList.contains('open')) {
                        document.body.style.overflow = 'hidden'
                        nav.appendChild(cta)
                        cta.style.display = 'block'
                    } else {
                        document.body.style.overflow = ''
                        headerContainer.appendChild(cta)
                        cta.style.display = ''
                    }
                }
            }

            if (burger) {
                burger.addEventListener('click', handleBurgerClick)
                burger.addEventListener('touchstart', handleBurgerClick)
                // Fermer le menu quand on clique sur un lien
                if (nav && cta && headerContainer) {
                    const links = nav.querySelectorAll('a')
                    links.forEach(link => {
                        link.addEventListener('click', function () {
                            burger.classList.remove('open')
                            nav.classList.remove('open')
                            document.body.style.overflow = ''
                            headerContainer.appendChild(cta)
                            cta.style.display = ''
                        })
                        link.addEventListener('touchstart', function () {
                            burger.classList.remove('open')
                            nav.classList.remove('open')
                            document.body.style.overflow = ''
                            headerContainer.appendChild(cta)
                            cta.style.display = ''
                        })
                    })
                }
            }
        })

        // Gestion du mouvement de la souris
        function handleMouseMove(e: MouseEvent) {
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft
            const scrollY = window.pageYOffset || document.documentElement.scrollTop

            const mouseX = e.clientX + scrollX
            const mouseY = e.clientY + scrollY

            document.documentElement.style.setProperty('--mouse-x', (mouseX) + 'px')
            document.documentElement.style.setProperty('--mouse-y', (mouseY - 150) + 'px')
        }

        // Gestion des transitions de page
        function initPageTransitions() {
            const pageChangeTransition = document.querySelector('.page-change-transition')
            console.log('Page transition element:', pageChangeTransition)

            // Fonction pour attendre que toutes les images soient chargées
            function waitForImagesToLoad() {
                return new Promise<void>((resolve) => {
                    const images = document.querySelectorAll('img')
                    const totalImages = images.length
                    let loadedImages = 0

                    console.log('Images à charger:', totalImages)

                    if (totalImages === 0) {
                        resolve()
                        return
                    }

                    images.forEach((img) => {
                        if (img.complete) {
                            loadedImages++
                            if (loadedImages === totalImages) {
                                resolve()
                            }
                        } else {
                            img.addEventListener('load', () => {
                                loadedImages++
                                if (loadedImages === totalImages) {
                                    resolve()
                                }
                            })
                            img.addEventListener('error', () => {
                                loadedImages++
                                if (loadedImages === totalImages) {
                                    resolve()
                                }
                            })
                        }
                    })
                })
            }

            // Transition lors du changement de page
            const links = document.querySelectorAll('a[href^="/"]')
            console.log('Liens internes trouvés:', links.length)

            links.forEach(link => {
                link.addEventListener('click', async (e) => {
                    const href = (link as HTMLAnchorElement).getAttribute('href')
                    console.log('Clic sur lien:', href, 'Page actuelle:', window.location.pathname)

                    if (href && href !== window.location.pathname) {
                        e.preventDefault()
                        console.log('Transition déclenchée pour:', href)

                        if (pageChangeTransition) {
                            pageChangeTransition.classList.add('active')
                            console.log('Classe active ajoutée')
                        }

                        // Attendre que toutes les images soient chargées
                        await waitForImagesToLoad()
                        console.log('Toutes les images sont chargées')

                        setTimeout(() => {
                            console.log('Navigation vers:', href)
                            window.location.href = href
                        }, 500)
                    }
                })
            })
        }

        // Initialisation
        initTheme()
        resetScroll()
        initPageTransitions()

        // Event listeners
        const themeToggle = document.getElementById('theme-toggle')
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme)
        }

        window.addEventListener('scroll', handleScroll)
        document.addEventListener('mousemove', handleMouseMove)

        // Initial call
        handleScroll()

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('mousemove', handleMouseMove)
            if (themeToggle) {
                themeToggle.removeEventListener('click', toggleTheme)
            }
        }
    }, [])

    return null
} 