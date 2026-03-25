import type { EncryptAlgorithm } from "uncsrf";

export interface ModuleOptions {
	key: string;
	header?: string;
	encryptSecret?: string; // for non serverless runtime
	encryptAlgorithm?: EncryptAlgorithm;
}
