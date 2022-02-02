import { defineConfig } from 'tsup'

const header =
`// ---------------------------------------------------
// Copyright (c) ${new Date().getFullYear()}, Aarnav Tale
// See the attached LICENSE file for more information.
// ---------------------------------------------------`

export default defineConfig((options) => {
	return {
		entry: ['./src/index.ts'],
		target: 'node16',
		splitting: false,
		format: ['esm'],
		platform: 'node',
		banner: {
			'js': header
		},

		// Development Hook
		onSuccess: options.watch ? 'pnpm start' : undefined
	}
})
