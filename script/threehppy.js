
(function () {
    const gallery = document.getElementById('gallery');
    const items = Array.from(gallery.querySelectorAll('.item'));
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lbMedia = lightbox.querySelector('.lb-media');
    const lbCaption = lightbox.querySelector('.lb-caption');
    let currentIndex = -1;

    
    function getVisibleItems() {
        return items.filter(it => it.style.display !== 'none');
    }

    function applyFilter(filter) {
        items.forEach((it) => {
            const type = it.dataset.type;
            if (filter === 'all' || filter === type) {
                it.style.display = '';
            } else {
                it.style.display = 'none';
            }
        });
    }

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter);
        });
    });

    function openLightbox(index) {
        const visibleItems = getVisibleItems();
        const it = visibleItems[index];
        if (!it) return;
        currentIndex = items.indexOf(it); 
        lbMedia.innerHTML = '';
        const type = it.dataset.type;
        if (type === 'photo') {
            const img = document.createElement('img');
            img.src = it.querySelector('img').src;
            img.alt = it.querySelector('img').alt || '';
            lbMedia.appendChild(img);
        } else if (type === 'video') {
            const src = it.dataset.videoSrc;
            const vid = document.createElement('video');
            vid.controls = true;
            vid.autoplay = true; 
            vid.src = src;
            vid.style.maxWidth = '100%';
            lbMedia.appendChild(vid);
            
            const galleryVid = it.querySelector('video');
            if (galleryVid) galleryVid.pause();
        }
        lbCaption.textContent = it.querySelector('.meta h3').textContent + ' — ' + it.querySelector('.meta .date').textContent;
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('open');
       
        lightbox.querySelector('.lb-close').focus();
    }

    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.classList.remove('open');
        lbMedia.innerHTML = '';
        currentIndex = -1;
       
        items.forEach(it => {
            const vid = it.querySelector('video');
            if (vid) vid.play();
        });
    }

    function prev() {
        const visibleItems = getVisibleItems();
        const currentVisibleIndex = visibleItems.findIndex(it => items.indexOf(it) === currentIndex);
        if (currentVisibleIndex > 0) {
            openLightbox(currentVisibleIndex - 1);
        }
    }

    function next() {
        const visibleItems = getVisibleItems();
        const currentVisibleIndex = visibleItems.findIndex(it => items.indexOf(it) === currentIndex);
        if (currentVisibleIndex < visibleItems.length - 1) {
            openLightbox(currentVisibleIndex + 1);
        }
    }

    
    items.forEach((it, idx) => {
        it.addEventListener('click', () => {
            const visibleItems = getVisibleItems();
            const visibleIndex = visibleItems.indexOf(it);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
        it.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const visibleItems = getVisibleItems();
                const visibleIndex = visibleItems.indexOf(it);
                if (visibleIndex !== -1) {
                    openLightbox(visibleIndex);
                }
            }
        });
    });

    
    lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lb-prev').addEventListener('click', prev);
    lightbox.querySelector('.lb-next').addEventListener('click', next);

    
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('open')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        }
    });

    
    applyFilter('all');
})();
