class DosPrompt {
    constructor(container) {
        this.container = container;
        this.history = [];
        this.historyIndex = -1;
        this.search = new SiteSearch();
        this.baseUrl = document.querySelector('meta[name="baseUrl"]')?.content || '';
        this.setupPrompt();
    }

    setupPrompt() {
        this.promptLine = document.createElement('div');
        this.promptLine.className = 'prompt-line';
        this.promptLine.innerHTML = `
            <span class="prompt-text">D:\\></span>
            <input type="text" class="prompt-input" autofocus>
        `;
        this.container.appendChild(this.promptLine);

        const input = this.promptLine.querySelector('.prompt-input');
        input.addEventListener('keydown', (e) => this.handleInput(e));
    }

    handleInput(e) {
        const input = e.target;
        
        if (e.key === 'Enter') {
            const command = input.value.trim().toUpperCase();
            this.history.push(command);
            this.historyIndex = this.history.length;
            
            this.executeCommand(command);
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                input.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                input.value = '';
            }
        }
    }

    executeCommand(command) {
        const output = document.createElement('div');
        output.className = 'prompt-output';

        switch(command) {
            case 'HELP':
                output.textContent = `
Available commands:
HELP     - Show this help
DIR      - List directory contents
CD       - Change directory
SEARCH   - Search rizomorf
CLS      - Clear screen
`;
                break;
            case 'DIR':
                window.location.href = `${this.baseUrl}/`;
                return;
            case 'CD BLOG':
                window.location.href = `${this.baseUrl}/blog/`;
                return;
            case 'CD SPACEWAR':
                window.location.href = `${this.baseUrl}/dos-games/`;
                return;
            case 'CD UX_WORK':
                window.location.href = `${this.baseUrl}/ux-work/`;
                return;
            case 'CLS':
                this.container.innerHTML = '';
                this.setupPrompt();
                return;
            case 'SEARCH':
                output.innerHTML = `
Enter search term:
<input type="text" class="search-input" autofocus>
`;
                const searchInput = output.querySelector('.search-input');
                searchInput.addEventListener('keydown', async (e) => {
                    if (e.key === 'Enter') {
                        const term = searchInput.value.trim();
                        if (!term) return;

                        const searchOutput = document.createElement('div');
                        searchOutput.className = 'prompt-output';
                        searchOutput.textContent = `Searching for: ${term}...\n\n`;
                        this.container.insertBefore(searchOutput, this.promptLine);

                        const results = await this.search.search(term);
                        
                        if (!results.success) {
                            searchOutput.textContent += 'Error: ' + results.error;
                            return;
                        }

                        if (results.results.length === 0) {
                            searchOutput.textContent += 'No matches found.\n';
                            return;
                        }

                        searchOutput.textContent += `Found ${results.results.length} matches:\n\n`;
                        
                        results.results.forEach(result => {
                            searchOutput.textContent += `
[${result.type.toUpperCase()}] ${result.title}
URL: ${result.url}
${result.excerpt}
`;
                        });
                    }
                });
                break;
            default:
                if (command) {
                    output.textContent = `Bad command or file name: ${command}`;
                }
        }

        this.container.insertBefore(output, this.promptLine);
        this.promptLine.querySelector('.prompt-input').focus();
    }
}

// Initialize the prompt when the script loads
document.addEventListener('DOMContentLoaded', () => {
    const promptContainer = document.getElementById('dos-prompt');
    if (promptContainer) {
        new DosPrompt(promptContainer);
    }
}); 