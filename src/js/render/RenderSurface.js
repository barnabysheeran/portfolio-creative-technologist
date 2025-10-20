import ApplicationLogger from '../application/ApplicationLogger.js';

import Display from '../display/Display.js';

export default class RenderSurface {
	static #CANVAS = null;
	static #GL;
	static #TEXTURE;
	static #FRAMEBUFFER;

	static #DISPLAY_SHADER_PROGRAM;
	static #DISPLAY_QUAD_VBO;
	static #DISPLAY_QUAD_VAO;
	static #DISPLAY_POSITION_ATTRIB_LOCATION;
	static #DISPLAY_TEX_COORD_ATTRIB_LOCATION;
	static #DISPLAY_TEXTURE_UNIFORM_LOCATION;

	static #width;
	static #height;

	static #DELAY_SHOW = 1;
	static #delayShowCurrent = this.#DELAY_SHOW;

	static #LOG_LEVEL = 2;

	// _________________________________________________________________________

	static initialise(width, height) {
		ApplicationLogger.log(`RenderSurface ${width} ${height}`, this.#LOG_LEVEL);

		// Get Initial Display Dimensions
		this.#width = width;
		this.#height = height;

		// Create Canvas
		this.#CANVAS = document.createElement('canvas');
		this.#CANVAS.className = 'render-surface';
		this.#CANVAS.width = this.#width;
		this.#CANVAS.height = this.#height;

		// Append Canvas to Display Holder
		Display.getDisplayHolder().appendChild(this.#CANVAS);

		// Get WebGL2 Context
		this.#GL = this.#CANVAS.getContext('webgl2');

		if (!this.#GL) {
			ApplicationLogger.warn(
				'- WebGL2 not supported or context creation failed.',
			);
			return;
		}

		const GL = this.#GL;

		// Create Texture
		this.#TEXTURE = this.#GL.createTexture();
		GL.bindTexture(GL.TEXTURE_2D, this.#TEXTURE);

		// Set Texture Parameters (NEAREST, CLAMP_TO_EDGE, etc.)
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

		// Clear texture to transparent black (0,0,0,0)
		this.#clearTexture();

		// Create Framebuffer
		this.#FRAMEBUFFER = GL.createFramebuffer();
		GL.bindFramebuffer(GL.FRAMEBUFFER, this.#FRAMEBUFFER);
		this.#GL.framebufferTexture2D(
			GL.FRAMEBUFFER,
			GL.COLOR_ATTACHMENT0,
			GL.TEXTURE_2D,
			this.#TEXTURE,
			0,
		);

		// Check Framebuffer Status
		const status = this.#GL.checkFramebufferStatus(this.#GL.FRAMEBUFFER);
		if (status !== this.#GL.FRAMEBUFFER_COMPLETE) {
			ApplicationLogger.warn(
				`RenderSurface Framebuffer incomplete: ${status.toString(16)}`,
			);
		}

		// Unbind
		GL.bindTexture(GL.TEXTURE_2D, null);
		GL.bindFramebuffer(GL.FRAMEBUFFER, null);

		this.#initDisplayResources();
	}

	static #initDisplayResources() {
		const GL = this.#GL;

		const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
		const fsSource = `
            precision mediump float;
            uniform sampler2D u_texture;
            varying vec2 v_texCoord;
            void main() {
                gl_FragColor = texture2D(u_texture, v_texCoord);
            }
        `;

		const vertexShader = this.#compileShader(GL.VERTEX_SHADER, vsSource);
		const fragmentShader = this.#compileShader(GL.FRAGMENT_SHADER, fsSource);

		if (!vertexShader || !fragmentShader) {
			ApplicationLogger.warn(
				'RenderSurface Failed to compile display shaders.',
			);
			return;
		}

		this.#DISPLAY_SHADER_PROGRAM = GL.createProgram();
		GL.attachShader(this.#DISPLAY_SHADER_PROGRAM, vertexShader);
		GL.attachShader(this.#DISPLAY_SHADER_PROGRAM, fragmentShader);
		GL.linkProgram(this.#DISPLAY_SHADER_PROGRAM);

		if (!GL.getProgramParameter(this.#DISPLAY_SHADER_PROGRAM, GL.LINK_STATUS)) {
			ApplicationLogger.warn(
				'RenderSurface Unable to initialize the display shader program: ' +
					GL.getProgramInfoLog(this.#DISPLAY_SHADER_PROGRAM),
			);
			GL.deleteProgram(this.#DISPLAY_SHADER_PROGRAM);
			this.#DISPLAY_SHADER_PROGRAM = null;
			return;
		}

		this.#DISPLAY_POSITION_ATTRIB_LOCATION = GL.getAttribLocation(
			this.#DISPLAY_SHADER_PROGRAM,
			'a_position',
		);
		this.#DISPLAY_TEX_COORD_ATTRIB_LOCATION = GL.getAttribLocation(
			this.#DISPLAY_SHADER_PROGRAM,
			'a_texCoord',
		);
		this.#DISPLAY_TEXTURE_UNIFORM_LOCATION = GL.getUniformLocation(
			this.#DISPLAY_SHADER_PROGRAM,
			'u_texture',
		);

		const quadVertices = new Float32Array([
			-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1,
			1,
		]);
		this.#DISPLAY_QUAD_VBO = GL.createBuffer();

		// Setup VAO
		this.#DISPLAY_QUAD_VAO = GL.createVertexArray();
		GL.bindVertexArray(this.#DISPLAY_QUAD_VAO);

		GL.bindBuffer(GL.ARRAY_BUFFER, this.#DISPLAY_QUAD_VBO);
		GL.bufferData(GL.ARRAY_BUFFER, quadVertices, GL.STATIC_DRAW);

		GL.enableVertexAttribArray(this.#DISPLAY_POSITION_ATTRIB_LOCATION);
		GL.vertexAttribPointer(
			this.#DISPLAY_POSITION_ATTRIB_LOCATION,
			2,
			GL.FLOAT,
			false,
			4 * Float32Array.BYTES_PER_ELEMENT,
			0,
		);

		GL.enableVertexAttribArray(this.#DISPLAY_TEX_COORD_ATTRIB_LOCATION);
		GL.vertexAttribPointer(
			this.#DISPLAY_TEX_COORD_ATTRIB_LOCATION,
			2,
			GL.FLOAT,
			false,
			4 * Float32Array.BYTES_PER_ELEMENT,
			2 * Float32Array.BYTES_PER_ELEMENT,
		);

		GL.bindBuffer(GL.ARRAY_BUFFER, null); // Unbind VBO from current VAO config
		GL.bindVertexArray(null); // Unbind VAO
	}

	static #compileShader(type, source) {
		const GL = this.#GL;
		const shader = GL.createShader(type);
		GL.shaderSource(shader, source);
		GL.compileShader(shader);
		if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
			ApplicationLogger.warn(
				`RenderSurface An error occurred compiling` +
					` the display shaders: ${GL.getShaderInfoLog(shader)}`,
			);
			GL.deleteShader(shader);
			return null;
		}
		return shader;
	}

	// __________________________________________________________________ Access

	static getWidth() {
		return this.#width;
	}

	static getHeight() {
		return this.#height;
	}

	static getCanvas() {
		return this.#CANVAS;
	}

	// ____________________________________________________________________ Tick

	static tick() {
		// Avoid Initial Frames to Avoid Flicker
		if (this.#delayShowCurrent > 0) {
			this.#delayShowCurrent--;
			return;
		}

		const GL = this.#GL;

		GL.bindFramebuffer(GL.FRAMEBUFFER, null);
		GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);

		GL.useProgram(this.#DISPLAY_SHADER_PROGRAM);
		GL.bindVertexArray(this.#DISPLAY_QUAD_VAO); // Bind VAO

		GL.activeTexture(GL.TEXTURE0);
		GL.bindTexture(GL.TEXTURE_2D, this.#TEXTURE);
		GL.uniform1i(this.#DISPLAY_TEXTURE_UNIFORM_LOCATION, 0);

		GL.drawArrays(GL.TRIANGLES, 0, 6);

		GL.bindVertexArray(null); // Unbind VAO
		GL.bindTexture(GL.TEXTURE_2D, null); // Unbind texture
	}

	// ____________________________________________________________ Texture Data

	static getTextureData(x, y, width, height) {
		if (
			x < 0 ||
			y < 0 ||
			x + width > this.#width ||
			y + height > this.#height
		) {
			// ApplicationLogger.warn(
			// 	'RenderSurface getTextureData called with out-of-bounds coordinates.',
			// );
			return null;
		}

		const GL = this.#GL;
		const buffer = new Uint8Array(width * height * 4);

		GL.bindFramebuffer(GL.FRAMEBUFFER, this.#FRAMEBUFFER);

		const yGL = this.#height - (y + height);
		GL.readPixels(x, yGL, width, height, GL.RGBA, GL.UNSIGNED_BYTE, buffer);

		GL.bindFramebuffer(GL.FRAMEBUFFER, null);
		return buffer;
	}

	static setTextureData(x, y, width, height, data) {
		if (
			x < 0 ||
			y < 0 ||
			x + width > this.#width ||
			y + height > this.#height
		) {
			// ApplicationLogger.log(
			// 	`RenderSurface setTextureData out-of-bounds ${x} ${y} ${width} ${height}`,
			// 	this.#LOG_LEVEL,
			// );

			return;
		}
		if (!data || data.byteLength !== width * height * 4) {
			ApplicationLogger.log(
				'RenderSurface setTextureData called with invalid data size.',
				this.#LOG_LEVEL,
			);
			return;
		}

		const GL = this.#GL;

		// Flip Y coordinate to match WebGL's coordinate system
		const yGL = this.#height - (y + height);

		GL.bindTexture(GL.TEXTURE_2D, this.#TEXTURE);
		GL.texSubImage2D(
			GL.TEXTURE_2D,
			0,
			x,
			yGL,
			width,
			height,
			GL.RGBA,
			GL.UNSIGNED_BYTE,
			data,
		);
		GL.bindTexture(GL.TEXTURE_2D, null);
	}

	// ____________________________________________________________________ Size

	static setSize(width, height) {
		// Width Height Changed ?
		if (width === this.#width && height === this.#height) {
			return; // No change
		}

		ApplicationLogger.log(
			`RenderSurface setSize from ${this.#width} ${this.#height}` +
				` to ${width} ${height}`,
			this.#LOG_LEVEL,
		);

		// Store New Dimensions
		this.#width = width;
		this.#height = height;

		// Resize Canvas
		this.#CANVAS.width = this.#width;
		this.#CANVAS.height = this.#height;

		// Get WebGL Context
		const GL = this.#GL;

		// Recreate Texture and clear to transparent black
		if (this.#TEXTURE) {
			GL.deleteTexture(this.#TEXTURE);
		}
		this.#TEXTURE = GL.createTexture();
		GL.bindTexture(GL.TEXTURE_2D, this.#TEXTURE);

		// Set Texture Parameters (NEAREST, CLAMP_TO_EDGE, etc.)
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
		GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
		this.#clearTexture();

		// Recreate Framebuffer
		if (this.#FRAMEBUFFER) {
			GL.deleteFramebuffer(this.#FRAMEBUFFER);
		}
		this.#FRAMEBUFFER = GL.createFramebuffer();
		GL.bindFramebuffer(GL.FRAMEBUFFER, this.#FRAMEBUFFER);
		GL.framebufferTexture2D(
			GL.FRAMEBUFFER,
			GL.COLOR_ATTACHMENT0,
			GL.TEXTURE_2D,
			this.#TEXTURE,
			0,
		);

		const status = GL.checkFramebufferStatus(GL.FRAMEBUFFER);
		if (status !== GL.FRAMEBUFFER_COMPLETE) {
			ApplicationLogger.warn(
				`RenderSurface Framebuffer incomplete after resize: ${status.toString(16)}`,
				this.#LOG_LEVEL,
			);
		}

		// Unbind
		GL.bindTexture(GL.TEXTURE_2D, null);
		GL.bindFramebuffer(GL.FRAMEBUFFER, null);
	}

	// ___________________________________________________________ Clear Texture

	static #clearTexture() {
		const emptyData = new Uint8Array(this.#width * this.#height * 4).fill(0);
		this.#GL.bindTexture(this.#GL.TEXTURE_2D, this.#TEXTURE);
		this.#GL.texImage2D(
			this.#GL.TEXTURE_2D,
			0,
			this.#GL.RGBA,
			this.#width,
			this.#height,
			0,
			this.#GL.RGBA,
			this.#GL.UNSIGNED_BYTE,
			emptyData,
		);
	}

	// ___________________________________________________________________ Clear

	static reset() {
		ApplicationLogger.log('RenderSurface Resetting texture.', this.#LOG_LEVEL);

		this.#clearTexture();
	}

	// _________________________________________________________________ Destroy

	static destroy() {
		ApplicationLogger.log(
			'RenderSurface Destroying resources.',
			this.#LOG_LEVEL,
		);
		if (this.#GL) {
			const GL = this.#GL;
			if (this.#FRAMEBUFFER) {
				GL.deleteFramebuffer(this.#FRAMEBUFFER);
				this.#FRAMEBUFFER = null;
			}
			if (this.#TEXTURE) {
				GL.deleteTexture(this.#TEXTURE);
				this.#TEXTURE = null;
			}
			if (this.#DISPLAY_SHADER_PROGRAM) {
				GL.deleteProgram(this.#DISPLAY_SHADER_PROGRAM);
				this.#DISPLAY_SHADER_PROGRAM = null;
			}
			if (this.#DISPLAY_QUAD_VBO) {
				GL.deleteBuffer(this.#DISPLAY_QUAD_VBO);
				this.#DISPLAY_QUAD_VBO = null;
			}
			if (this.#DISPLAY_QUAD_VAO) {
				GL.deleteVertexArray(this.#DISPLAY_QUAD_VAO);
				this.#DISPLAY_QUAD_VAO = null;
			}
		}
		this.#GL = null;
		this.#CANVAS = null;
	}
}
