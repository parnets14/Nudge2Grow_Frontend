// Intercept image loading and fix URLs
if (typeof window !== 'undefined') {
  const BACKEND_URL = 'https://nudgebackend.onrender.com';
  
  // Function to fix URL
  const fixImageUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    
    // Replace any local URLs with production backend
    if (url.includes('192.168.1.29:5000') || url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
      return url.replace(/https?:\/\/(192\.168\.1\.29|localhost|127\.0\.0\.1):5000/g, BACKEND_URL);
    }
    
    return url;
  };
  
  // Override HTMLImageElement.prototype.src setter
  const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    get: function() {
      return originalSrcDescriptor.get.call(this);
    },
    set: function(value) {
      const fixedUrl = fixImageUrl(value);
      originalSrcDescriptor.set.call(this, fixedUrl);
    },
    configurable: true
  });
  
  // Also observe DOM changes and fix existing images
  const fixExistingImages = () => {
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        const fixedUrl = fixImageUrl(src);
        if (fixedUrl !== src) {
          img.src = fixedUrl;
        }
      }
    });
  };
  
  // Fix images when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixExistingImages);
  } else {
    fixExistingImages();
  }
  
  // Watch for new images being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'IMG') {
          const src = node.getAttribute('src');
          if (src) {
            const fixedUrl = fixImageUrl(src);
            if (fixedUrl !== src) {
              node.src = fixedUrl;
            }
          }
        } else if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
              const fixedUrl = fixImageUrl(src);
              if (fixedUrl !== src) {
                img.src = fixedUrl;
              }
            }
          });
        }
      });
    });
  });
  
  // Start observing
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}
