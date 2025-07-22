// Custom Modal System
// Replaces default browser alerts with themed modals

class CustomModal {
    constructor() {
        this.modalContainer = null;
        this.init();
    }

    init() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('custom-modal-container')) {
            this.modalContainer = document.createElement('div');
            this.modalContainer.id = 'custom-modal-container';
            document.body.appendChild(this.modalContainer);
        } else {
            this.modalContainer = document.getElementById('custom-modal-container');
        }
    }

    show(options = {}) {
        const {
            title = 'Alert',
            message = '',
            type = 'alert', // alert, success, error, warning
            icon = this.getIcon(type),
            buttons = [{ text: 'OK', primary: true, callback: () => this.close() }],
            showClose = true,
            onClose = null
        } = options;

        const modalHTML = `
            <div class="custom-modal active" id="custom-modal">
                <div class="custom-modal-content ${type}">
                    ${showClose ? '<button class="custom-modal-close" onclick="customModal.close()">&times;</button>' : ''}
                    <div class="custom-modal-header">
                        <i class="${icon} custom-modal-icon"></i>
                        <h3 class="custom-modal-title">${title}</h3>
                    </div>
                    <div class="custom-modal-body">
                        ${message}
                    </div>
                    <div class="custom-modal-footer">
                        ${buttons.map((btn, index) => `
                            <button class="custom-modal-btn ${btn.primary ? 'custom-modal-btn-primary' : 'custom-modal-btn-secondary'}" 
                                    data-index="${index}">
                                ${btn.icon ? `<i class="${btn.icon}"></i>` : ''} ${btn.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.modalContainer.innerHTML = modalHTML;

        // Add event listeners to buttons
        buttons.forEach((btn, index) => {
            const buttonElement = this.modalContainer.querySelector(`[data-index="${index}"]`);
            buttonElement.addEventListener('click', () => {
                if (btn.callback) btn.callback();
                if (!btn.keepOpen) this.close();
            });
        });

        // Close on overlay click
        const modal = this.modalContainer.querySelector('.custom-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
                if (onClose) onClose();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', this.handleEscape);
    }

    handleEscape = (e) => {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    getIcon(type) {
        const icons = {
            alert: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            question: 'fas fa-question-circle',
            info: 'fas fa-chart-line'
        };
        return icons[type] || icons.alert;
    }

    close() {
        const modal = this.modalContainer.querySelector('.custom-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                this.modalContainer.innerHTML = '';
            }, 300);
        }
        document.removeEventListener('keydown', this.handleEscape);
    }

    // Convenience methods
    alert(message, title = 'Alert') {
        this.show({
            title,
            message,
            type: 'alert'
        });
    }

    success(message, title = 'Success') {
        this.show({
            title,
            message,
            type: 'success',
            buttons: [{ text: 'Great!', primary: true, icon: 'fas fa-thumbs-up' }]
        });
    }

    error(message, title = 'Error') {
        this.show({
            title,
            message,
            type: 'error'
        });
    }

    warning(message, title = 'Warning') {
        this.show({
            title,
            message,
            type: 'warning'
        });
    }

    confirm(message, title = 'Confirm', onConfirm = null, onCancel = null) {
        this.show({
            title,
            message,
            type: 'question',
            buttons: [
                { 
                    text: 'Cancel', 
                    primary: false, 
                    callback: () => {
                        if (onCancel) onCancel();
                    }
                },
                { 
                    text: 'Confirm', 
                    primary: true, 
                    icon: 'fas fa-check',
                    callback: () => {
                        if (onConfirm) onConfirm();
                    }
                }
            ]
        });
    }

    prompt(message, title = 'Input', defaultValue = '', onSubmit = null) {
        const inputId = 'custom-modal-input-' + Date.now();
        
        this.show({
            title,
            message: `
                ${message}
                <input type="text" class="custom-modal-input" id="${inputId}" value="${defaultValue}" />
            `,
            type: 'question',
            buttons: [
                { 
                    text: 'Cancel', 
                    primary: false
                },
                { 
                    text: 'Submit', 
                    primary: true, 
                    icon: 'fas fa-check',
                    callback: () => {
                        const input = document.getElementById(inputId);
                        if (onSubmit && input) onSubmit(input.value);
                    }
                }
            ]
        });

        // Focus on input
        setTimeout(() => {
            const input = document.getElementById(inputId);
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
    }
}

// Create global instance
const customModal = new CustomModal();

// Override default window methods (optional)
window.customAlert = (message, title) => customModal.alert(message, title);
window.customConfirm = (message, title, onConfirm, onCancel) => customModal.confirm(message, title, onConfirm, onCancel);
window.customPrompt = (message, title, defaultValue, onSubmit) => customModal.prompt(message, title, defaultValue, onSubmit);

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomModal;
}