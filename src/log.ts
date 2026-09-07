import { connection } from "./index.js";

export function log(message: string) {
	connection.console.log(message);
}

export function info(message: string, show = false) {
	if (show) connection.window.showInformationMessage(message);
	connection.console.info(`[info] ${message}`);
}

export function warn(message: string, show = false) {
	if (show) connection.window.showWarningMessage(message);
	connection.console.warn(`[warn] ${message}`);
}

export function error(message: string, show = false) {
	if (show) connection.window.showErrorMessage(message);
	connection.console.error(`[error] ${message}`);
}
