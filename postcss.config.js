export default {
	plugins: {
		'postcss-preset-env': {
			stage: 0, // Enable all modern CSS features
			features: {
				'custom-properties': false, // Keep CSS custom properties
				'nesting-rules': true,
			},
		},
		'postcss-nested': {},
	},
};
