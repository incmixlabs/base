import UnoCSS from '@unocss/postcss'
import autoprefixer from 'autoprefixer'

const config = {
  plugins: [UnoCSS(), autoprefixer()],
}

export default config
