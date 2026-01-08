export const loader = {
    isLoading: false,
    callbacks: [],

    show() {
        this.isLoading = true
        this.callbacks.forEach(cb => cb(true))
    },

    hide() {
        this.isLoading = false
        this.callbacks.forEach(cb => cb(false))
    },

    onChange(callback) {
        this.callbacks.push(callback)
    }
}