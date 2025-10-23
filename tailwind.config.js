/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C62828",
          dark: "#263238",
          blue: "#0277BD",
          amber: "#EF6C00",
          ok: "#2E7D32"
        },
        surface: {
          0: "#FFFFFF",
          50: "#F7F9FB",
          border: "#E0E6ED"
        }
      },
      boxShadow: {
        panel: "0 8px 24px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        xl: "14px",
        "2xl": "16px"
      }
    }
  },
  plugins: []
};
