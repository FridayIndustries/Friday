/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Share Tech Mono"', 'monospace'], // Sci-fi font
            },
            colors: {
                cyan: {
                    // Remapped to orange tones so existing cyan-* classes become orange
                    400: '#FF8A00', // bright orange
                    500: '#FF6A00', // primary orange
                    900: '#3a1200', // dark brown/orange for accents
                }
            }
        },
    },
    plugins: [],
}
