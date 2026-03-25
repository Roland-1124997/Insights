type ChunkConfig = {
	[chunkName: string]: {
		base?: string;
		patterns?: string[];
		subChunks?: {
			[subChunkName: string]: string[];
		};
		exceptions?: {
			[exceptionName: string]: string[];
		};
	};
};
const chunkConfig: ChunkConfig = {
	highlight: {
		base: "node_modules/highlight.js",
		subChunks: {
			"highlight-languages-1": ["es/languages/gml.js", "es/languages/isbl.js", "es/languages/mathematica.js"],
			"highlight-languages-2": ["es/languages/1c.js", "es/languages/x86asm.js", "es/languages/maxima.js", "es/languages/sqf.js"],
			"highlight-languages-3": ["es/languages/scss.js", "es/languages/less.js", "es/languages/mel.js", "es/languages/stata.js", "es/languages/pgsql.js"],
		},
	},
	unovis: {
		patterns: ["node_modules/@unovis"],
		exceptions: {
			"unovis-maps": ["ts/maps/world-simple.json.js"],
		},
	},
	"vue-chrts": {
		patterns: ["node_modules/vue-chrts/dist"],
	},
	d3: {
		patterns: ["node_modules/d3"],
	},
	icons: {
		patterns: ["node_modules/@iconify", "node_modules/@nuxt/icon"],
	},
	tiptap: {
		patterns: ["node_modules/@tiptap"],
	},
	validation: {
		patterns: ["node_modules/vee-validate", "node_modules/zod"],
	},
	supabase: {
		patterns: ["node_modules/@supabase"],
	},
} as ChunkConfig;

export const loopThroughChunks = (id: string) => {
	if (!id.includes("node_modules/")) return;

	for (const [chunkName, config] of Object.entries(chunkConfig)) {
		const { base, subChunks, exceptions, patterns } = config;

		// Check voor base path (highlight.js)
		if (base && id.includes(base)) {
			// Check subChunks eerst (specifieke language files)
			if (subChunks) {
				for (const [subChunkName, subChunkPatterns] of Object.entries(subChunks)) {
					for (const pattern of subChunkPatterns) {
						if (id.includes(pattern)) return subChunkName;
					}
				}
			}
			return chunkName;
		}

		// Check voor patterns (andere libraries)
		if (patterns) {
			for (const pattern of patterns) {
				if (id.includes(pattern)) {
					// Check exceptions (zoals unovis-maps)
					if (exceptions) {
						for (const [exceptionName, exceptionPatterns] of Object.entries(exceptions)) {
							for (const excPattern of exceptionPatterns) {
								if (id.includes(excPattern)) return exceptionName;
							}
						}
					}
					return chunkName;
				}
			}
		}
	}
};
