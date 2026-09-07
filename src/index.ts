#!/usr/bin/env node

import { createConnection, LSPErrorCodes, ResponseError, TextDocuments, TextDocumentSyncKind } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { initExpectedVersion, validateInstalledVersion, logExpectedVersion } from "./version.js";
import { initConfigPath, logConfigPath } from "./config.js";
import { fetchDiagnostics } from "./diagnostics.js";
import { formatDocument } from "./formatting.js";
import { error } from "./log.js";

export const connection = createConnection();
const documents = new TextDocuments(TextDocument);
let glualintOk = true;

connection.onInitialize(async params => {
	await initExpectedVersion(params.initializationOptions);
	initConfigPath(params.initializationOptions);
	logExpectedVersion();
	logConfigPath();

	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			documentFormattingProvider: true,
		}
	};
});

documents.onDidChangeContent(async ({ document }) => {
	try {
		await validateInstalledVersion();
		const diagnostics = await fetchDiagnostics(document);
		glualintOk = true;
		connection.sendDiagnostics({ uri: document.uri, diagnostics });
	} catch (err) {
		handleError(err);
	}
});

connection.onDocumentFormatting(async ({ textDocument }) => {
	const document = documents.get(textDocument.uri);
	if (!document) return null;

	try {
		await validateInstalledVersion();
		const edits = await formatDocument(document);
		glualintOk = true;
		return edits;
	} catch (err) {
		handleError(err);
		const message = errorMessage(err);
		throw new ResponseError(LSPErrorCodes.RequestFailed, message);
	}
});

function errorMessage(err: unknown) {
	return err instanceof Error ? err.message : String(err);
}

function handleError(err: unknown) {
	if (glualintOk) {
		error(errorMessage(err), true);
		glualintOk = false;
	}
}

documents.listen(connection);
connection.listen();
