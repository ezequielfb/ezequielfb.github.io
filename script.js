// JS básico para interatividade sutil e acessibilidade
// Seções: Footer (ano), Fade-in, Projetos (acordeão com animação)
(function () {
    // ===== Footer: ano dinâmico =====
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ===== Fade-in on scroll (IntersectionObserver) =====
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

        reveals.forEach((el) => io.observe(el));
    } else {
        // Fallback: mostra tudo sem animação
        reveals.forEach((el) => el.classList.add('in-view'));
    }

    // ===== Hero CTA: aparece após 3s, esconde ao clicar e rola até projetos =====
    const heroBtn = document.getElementById('hero-projects-btn');
    if (heroBtn) {
        setTimeout(() => heroBtn.classList.add('show'), 3000);
        heroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // esconde o botão
            heroBtn.classList.remove('show');
            // rola suave até a seção de projetos
            const target = document.getElementById('projetos');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ===== Projetos: acordeão com animação =====
    // Respeita prefers-reduced-motion. Ao abrir um, fecha os demais.
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const detailsList = Array.from(document.querySelectorAll('.project-acc'));
    if (detailsList.length) {
                // Capa tipográfica automática para projetos sem imagem real
                const toHex = (n) => n.toString(16).padStart(2, '0');
                const hash = (str) => {
                        let h = 2166136261;
                        for (let i = 0; i < str.length; i++) {
                                h ^= str.charCodeAt(i);
                                h = Math.imul(h, 16777619);
                        }
                        return h >>> 0;
                };
                const makeGradient = (seed) => {
                        const a = (seed & 0xff0000) >> 16;
                        const b = (seed & 0x00ff00) >> 8;
                        const c = (seed & 0x0000ff);
                        const c1 = `#${toHex(40 + (a % 80))}${toHex(30 + (b % 80))}${toHex(70 + (c % 120))}`;
                        const c2 = `#${toHex(90 + (c % 100))}${toHex(60 + (a % 80))}${toHex(120 + (b % 60))}`;
                        return { c1, c2 };
                };
                const escapeSVG = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
                        const createCover = (title, subtitle, variant = 'full') => {
                        const seed = hash(title);
                        const { c1, c2 } = makeGradient(seed);
                        const initials = title.split(/\s+/).filter(Boolean).slice(0,3).map(w => w[0]).join('').toUpperCase();
                                const t = escapeSVG(title);
                                const s = escapeSVG(subtitle || '');
                                const isThumb = variant === 'thumb';
                                // Ajuste de tamanho do título para evitar corte em nomes longos
                                const baseTitleSize = 64;
                                const tLen = (t || '').length;
                                const titleSize = Math.max(44, Math.min(baseTitleSize, 64 - Math.max(0, tLen - 22)));
                                const subtitleSize = 28;
                                // Layout: thumb = foco nas iniciais grandes; full = título/subtítulo
                                const svg = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='800' viewBox='0 0 1280 800'>
    <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='${c1}'/>
            <stop offset='100%' stop-color='${c2}'/>
        </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
            ${isThumb ? `
            <g fill='rgba(0,0,0,0.10)'>
                <circle cx='1080' cy='140' r='160'/>
                <circle cx='180' cy='680' r='120'/>
            </g>
            <text x='50%' y='55%' text-anchor='middle' font-family='JetBrains Mono, monospace' font-weight='800' font-size='420' fill='rgba(255,255,255,0.18)'>${initials}</text>
            ` : `
            <g fill='rgba(0,0,0,0.12)'>
                <circle cx='1100' cy='120' r='140'/>
                <circle cx='160' cy='680' r='110'/>
            </g>
            <text x='6%' y='40%' font-family='JetBrains Mono, monospace' font-weight='700' font-size='${titleSize}' fill='white'>${t}</text>
            ${s ? `<text x='6%' y='50%' font-family='JetBrains Mono, monospace' font-size='${subtitleSize}' fill='rgba(255,255,255,0.9)'>${s}</text>` : ''}
            <text x='8%' y='80%' font-family='JetBrains Mono, monospace' font-weight='700' font-size='220' fill='rgba(255,255,255,0.14)'>${initials}</text>
            `}
</svg>`;
                        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
                };
                        // Gera capas para thumbs marcados (thumb simplificada + full completa)
                document.querySelectorAll('.project-acc .project-summary').forEach(sum => {
                        const img = sum.querySelector('img.project-thumb[data-auto-cover="1"]');
                        if (!img) return;
                        const title = sum.querySelector('.project-title')?.textContent?.trim() || 'Projeto';
                        const brief = sum.querySelector('.project-brief')?.textContent?.trim() || '';
                                const thumbCover = createCover(title, brief, 'thumb');
                                const fullCover = createCover(title, brief, 'full');
                                img.setAttribute('data-thumb', thumbCover);
                                img.src = thumbCover;
                                img.setAttribute('data-full', fullCover);
                });

        // Fecha todos quando o usuário volta ao topo (UX: menus somem ao rolar para cima)
        const autoCloseAtTop = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            if (y < 120) {
                detailsList.forEach((d) => {
                    if (d.hasAttribute('open')) {
                        const evt = new Event('toggle-request-close', { bubbles: true });
                        d.dispatchEvent(evt);
                    }
                });
            }
        };
        window.addEventListener('scroll', autoCloseAtTop, { passive: true });

        const closeOthers = (current) => {
            detailsList.forEach((d) => {
                if (d !== current && d.hasAttribute('open')) {
                    const s = new Event('toggle-request-close', { bubbles: true });
                    d.dispatchEvent(s);
                }
            });
        };

        detailsList.forEach((details) => {
            const summary = details.querySelector('summary');
            const content = details.querySelector('.project-details');
            if (!summary || !content) return;

            let animating = false;

            // Rola a página para o título do projeto
        const scrollToProjectTitle = () => {
                const heading = summary.querySelector('.project-title') || summary;
                if (!heading) return;
                const doScroll = () => {
            const rect = heading.getBoundingClientRect();
            const centerTop = rect.top + window.pageYOffset + (rect.height / 2) - (window.innerHeight / 2);
            const maxScroll = Math.max(0, (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight);
            const targetTop = Math.min(maxScroll, Math.max(0, centerTop));
            window.scrollTo({ top: targetTop, behavior: reduceMotion ? 'auto' : 'smooth' });
                };
                if (reduceMotion) {
            doScroll();
            // Correção após possíveis transições (fechamento de outros e abertura deste)
            setTimeout(doScroll, 420);
                } else {
                    // Aguarda um tick para o layout aplicar o estado [open] e iniciar eventuais colapsos de outros itens
            requestAnimationFrame(() => setTimeout(doScroll, 60));
            // Correção final após as transições principais (~360ms + atraso)
            setTimeout(doScroll, 460);
                }
            };

        const swapImage = (toFull) => {
                const img = details.querySelector('.project-thumb');
                if (!img) return;
                const full = img.getAttribute('data-full');
                const thumb = img.getAttribute('data-thumb') || img.getAttribute('src');
                const targetSrc = toFull ? full : thumb;
                if (!targetSrc || img.src.endsWith(targetSrc)) return;
                const doSwap = () => { img.src = targetSrc; };
                if (toFull) {
            const pre = new Image();
                    pre.onload = () => { doSwap(); details.classList.add('hires-ready'); };
                    pre.src = targetSrc;
                } else {
            doSwap();
                    details.classList.remove('hires-ready');
                }
            };

            const expand = () => {
                if (animating) return;
                animating = true;
                // Fecha os outros antes de abrir este
                closeOthers(details);
                details.setAttribute('open', '');
                // Garante que o título fique no topo da viewport ao abrir
                scrollToProjectTitle();

                if (reduceMotion) { animating = false; return; }

                content.style.height = '0px';
                content.style.opacity = '0';
                content.style.overflow = 'hidden';
                requestAnimationFrame(() => {
                    // Troca para imagem em alta durante a expansão
                    swapImage(true);
                    const target = content.scrollHeight;
                    content.style.transition = 'height 360ms ease, opacity 260ms ease 60ms';
                    content.style.height = target + 'px';
                    content.style.opacity = '1';
                    const onEnd = (e) => {
                        if (e.propertyName !== 'height') return;
                        content.style.transition = '';
                        content.style.height = '';
                        content.style.overflow = '';
                        content.removeEventListener('transitionend', onEnd);
                        animating = false;
                    };
                    content.addEventListener('transitionend', onEnd);
                });
            };

            const collapse = () => {
                if (animating) return;
                animating = true;
                // Marca como 'closing' para permitir que o CSS anime o resumo/thumbnail de volta
                details.classList.add('closing');
                if (reduceMotion) { details.removeAttribute('open'); details.classList.remove('closing'); animating = false; return; }

                const start = content.scrollHeight;
                content.style.height = start + 'px';
                content.style.opacity = '1';
                content.style.overflow = 'hidden';
        requestAnimationFrame(() => {
                    // Espelha o timing da abertura: altura 360ms, opacidade 260ms com atraso de 60ms
                    content.style.transition = 'height 360ms ease, opacity 260ms ease 60ms';
                    content.style.height = '0px';
                    content.style.opacity = '0';
                    const onEnd = (e) => {
                        if (e.propertyName !== 'height') return;
            // Volta para o thumb após terminar de recolher (evita flicker)
            swapImage(false);
                        details.removeAttribute('open');
                        content.style.transition = '';
                        content.style.height = '';
                        content.style.overflow = '';
                        content.removeEventListener('transitionend', onEnd);
                        details.classList.remove('closing');
                        animating = false;
                    };
                    content.addEventListener('transitionend', onEnd);
                });
            };

            // Clique no summary: toggle com animação
            summary.addEventListener('click', (ev) => {
                ev.preventDefault();
                if (details.hasAttribute('open')) collapse(); else expand();
            });

            // Evento custom para fechar quando outro item abre
            details.addEventListener('toggle-request-close', () => {
                if (details.hasAttribute('open')) collapse();
            });
        });
    }
})();