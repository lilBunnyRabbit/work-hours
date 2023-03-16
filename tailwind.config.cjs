/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a3e635",
      },
      boxShadow: {
        button:
          "0px 0px 6.2px rgba(0, 0, 0, 0.065), 0px 0px 20.8px rgba(0, 0, 0, 0.095), 0px 0px 93px rgba(0, 0, 0, 0.16)",
        buttonActive:
          "0px 0px 6.2px rgba(0, 0, 0, 0.129), 0px 0px 20.8px rgba(0, 0, 0, 0.191), 0px 0px 93px rgba(0, 0, 0, 0.32)",
      },
    },
  },
  plugins: [],
};
