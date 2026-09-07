import { TextDocument } from "vscode-languageserver-textdocument";
import { TextEdit } from "vscode-languageserver/node";
import { spawn } from "node:child_process";
import { basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getConfigPath } from "./config.js";
import { info } from "./log.js";

export function formatDocument(document: TextDocument): Promise<TextEdit[] | null> {
	return new Promise((resolve, reject) => {
		const options = ["--pretty-print"];
		const configPath = getConfigPath();
		if (configPath) options.push("--config", configPath);
		const cwd = dirname(fileURLToPath(document.uri));
		const child = spawn("glualint", options, { cwd });
		child.on("error", err => {
			reject(new Error(`failed to spawn glualint process: ${err.message}`));
		});

		let output = "";
		child.stdout.on("data", data => output += data.toString());
		child.stdin.write(document.getText());
		child.stdin.end();

		child.on("exit", code => {
			if (code !== 0 && code !== 1) {
				reject(new Error(`glualint exited with code \`${code}\``));
			} else if (!output) {
				resolve(null);
			} else {
				const fileName = basename(fileURLToPath(document.uri));
				info(`formatted \`${fileName}\``, true);
				resolve([TextEdit.replace({
					start: { line: 0, character: 0 },
					end: document.positionAt(document.getText().length),
				}, output)]);
			}
		});
	});
}
