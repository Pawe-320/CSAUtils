// eslint.config.js
import js from "@eslint/js"
import ts from "typescript-eslint"
import { defineConfig } from "eslint/config"

const config = defineConfig([
  js.configs.recommended,    // Standard JS rules
  ts.configs.recommended, // Specialized TS rules
  {
    // Your custom overrides
  }
])

export default config