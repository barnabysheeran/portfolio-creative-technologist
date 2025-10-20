export default {
	options: {
		doNotFollow: ['node_modules'],

		reporterOptions: {
			dot: {
				filters: {
					includeOnly: {
						path: '^src/js',
					},

					exclude: {
						path: [],
					},
				},
			},
		},
	},
};
