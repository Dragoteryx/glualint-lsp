import { info } from "./log.js";

let configPath: string | undefined;

export function getConfigPath(): string | undefined {
	return configPath;
}

export function initConfigPath(options: unknown) {
	configPath = readConfigPath(options);
}

export function logConfigPath() {
	if (configPath) {
		info(`using config file at \`${configPath}\``);
	} else {
		info("no config file specified");
	}
}

function readConfigPath(options: unknown): string | undefined {
	if (typeof options !== "object" || options === null) return;
	const { config } = options as { config: unknown };
	if (typeof config !== "string") return;
	return config;
}
