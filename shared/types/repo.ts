export type Repo = {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description?: string | null;
	homepage?: string | null;
	topics?: string[];
	private?: boolean;
	owner?: {
		login?: string;
		avatar_url?: string;
	};
	language?: string | null;
	stargazers_count?: number;
	forks_count?: number;
	open_issues_count?: number;
	updated_at?: string;
};
