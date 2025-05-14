module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // ✅ new required wrapper
    require('autoprefixer'),
  ],
}
