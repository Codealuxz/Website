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
                    } else if (window.innerWidth <= 1100) {
                        marginTop = -100
                    } else {
                        marginTop = -130 + (scrollPercent * 130)
                    }

                    image.style.transform = `scale(${scale})`
                    image.style.marginTop = `${marginTop}px`
                }
            }
        }

        // Gestion du mouvement de la souris
        function handleMouseMove(e: MouseEvent) {
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft
            const scrollY = window.pageYOffset || document.documentElement.scrollTop

            const mouseX = e.clientX + scrollX
            const mouseY = e.clientY + scrollY

            document.documentElement.style.setProperty('--mouse-x', (mouseX) + 'px')
            document.documentElement.style.setProperty('--mouse-y', (mouseY - 150) + 'px')
        }

        // Initialisation
        initTheme()
        resetScroll()

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