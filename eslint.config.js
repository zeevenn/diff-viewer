import { antfu } from '@antfu/eslint-config'

export default antfu({
  type: 'app',
  react: true,
  typescript: true,
  rules: {
    // Disable pnpm catalog validation rule
    'pnpm/json-valid-catalog': 'off',
  },
})
