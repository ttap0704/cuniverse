/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      "deep-navy": "#0f172a",
      "dark-navy": "#1e293b",
      orange: "#ff0349",
      "white-10": "rgba(255, 255, 255, 0.1)",
      "white-20": "rgba(255, 255, 255, 0.2)",
      "white-30": "rgba(255, 255, 255, 0.3)",
      "white-40": "rgba(255, 255, 255, 0.4)",
      "white-50": "rgba(255, 255, 255, 0.5)",
      "white-60": "rgba(255, 255, 255, 0.6)",
      "white-70": "rgba(255, 255, 255, 0.7)",
      "white-80": "rgba(255, 255, 255, 0.8)",
      "white-90": "rgba(255, 255, 255, 0.9)",
      "white-100": "rgba(255, 255, 255, 1)",
      "black-10": "rgba(0, 0, 0, 0.1)",
      "black-20": "rgba(0, 0, 0, 0.2)",
      "black-30": "rgba(0, 0, 0, 0.3)",
      "black-40": "rgba(0, 0, 0, 0.4)",
      "black-50": "rgba(0, 0, 0, 0.5)",
      "black-60": "rgba(0, 0, 0, 0.6)",
      "black-70": "rgba(0, 0, 0, 0.7)",
      "black-80": "rgba(0, 0, 0, 0.8)",
      "black-90": "rgba(0, 0, 0, 0.9)",
      "black-100": "rgba(0, 0, 0, 1)",
    },
  },
  plugins: [],
};
