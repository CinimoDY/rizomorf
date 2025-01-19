// Search functionality for rizomorf
class SiteSearch {
    constructor() {
        this.searchIndex = null;
        this.loadSearchIndex();
    }

    async loadSearchIndex() {
        try {
            const baseUrl = document.querySelector('meta[name="baseUrl"]')?.content || '';
            const response = await fetch(`${baseUrl}/search-index.json`);
            this.searchIndex = await response.json();
        } catch (error) {
            console.error('Failed to load search index:', error);
        }
    }

    search(query) {
        if (!this.searchIndex) {
            return {
                success: false,
                error: 'Search index not loaded'
            };
        }

        query = query.toLowerCase();
        const results = this.searchIndex.filter(item => {
            return (
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query)
            );
        });

        return {
            success: true,
            results: results.map(item => ({
                title: item.title,
                url: item.url,
                excerpt: this.generateExcerpt(item.content, query)
            }))
        };
    }

    generateExcerpt(content, query) {
        const index = content.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return content.slice(0, 100) + '...';

        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + query.length + 50);
        return (start > 0 ? '...' : '') +
               content.slice(start, end).trim() +
               (end < content.length ? '...' : '');
    }
}

// Export for use in dos-prompt.js
window.SiteSearch = SiteSearch; 