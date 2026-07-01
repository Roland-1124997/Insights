export type Anchor = {
	id: string;
	level: number;
	isActive: boolean;
	itemIndex: number;
	textContent: string;
};

export type search = {
	label: string;
	placeholder: string;
};

export type Filters = {
	type: string;
	iconName: string;
	label: string;
	shortLabel: string;
	alwaysShowLabel: boolean;
	ariaLabel: string;
	color: string;
	large: boolean;
};

export type Buttons = {
	iconName?: string;
	to?: string;
	description?: string;
	isSmall?: boolean;
	isButton?: boolean;
	onClick?: "triggerFileSelect" | "refresh" | "subscribe" | "unsubscribe" | "revalidate";
};

export type ToolBar = {
	groupWithFilters?: boolean;
	fallbackFilter?: string;
	buttons?: Buttons[];
	filters?: Filters[];
	search?: search;
	store: string;
};

export type RouteType = {
	hidden?: boolean;
	label: string;
	iconName: string;
	refetchOnEnter?: boolean;
	alert?: boolean;
	toolbar?: ToolBar;
	related?: string[];
};

export type ArticleContent = {
	type: "doc";
	content: Record<string, any>[];
};

export type Article = {
	created_at: string;
	updated_at: string;
	words: number;
	read_time: string;
	content: ArticleContent;
	anchors: Anchor[];
	id: string;
	title: string;
	description: string;
	topics: string[];
	published: boolean;
	thumbnail_url: string;
};

export type Inbox = {
	id: string;
	threadId: string;
	uid: number;
	subject: string;
	date: string;
	from: {
		name: string;
		address: string;
	};
	flags: string[];
	attachments: any[];
	preview: string;
	html: string;
	references?: string[];
};

export type StatusHistoryItem = {
	day: string;
	status: string;
	downtime_duration: number;
	maintenance_duration: number;
};

export type MonitorResource = {
	position?: number;
	attributes: {
		public_name: string;
		explanation?: string;
		status: string;
		position: number;
		availability: number;
		last_checked_at: string;
		status_history: StatusHistoryItem[];
		status_page_section_name: string;
		status_page_section_id: number;
		resource_type: string;
	};
};

export type GithubRepository = {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: {
		login: string;
		id: number;
		node_id: string;
		avatar_url: string;
		gravatar_id: string;
		url: string;
		html_url: string;
		followers_url: string;
		following_url: string;
		gists_url: string;
		starred_url: string;
		subscriptions_url: string;
		organizations_url: string;
		repos_url: string;
		events_url: string;
		received_events_url: string;
		type: string;
		user_view_type: string;
		site_admin: boolean;
	};
	html_url: string;
	description: string;
	fork: boolean;
	url: string;
	forks_url: string;
	keys_url: string;
	collaborators_url: string;
	teams_url: string;
	hooks_url: string;
	issue_events_url: string;
	events_url: string;
	assignees_url: string;
	branches_url: string;
	tags_url: string;
	blobs_url: string;
	git_tags_url: string;
	git_refs_url: string;
	trees_url: string;
	statuses_url: string;
	languages_url: string;
	stargazers_url: string;
	contributors_url: string;
	subscribers_url: string;
	subscription_url: string;
	commits_url: string;
	git_commits_url: string;
	comments_url: string;
	issue_comment_url: string;
	contents_url: string;
	compare_url: string;
	merges_url: string;
	archive_url: string;
	downloads_url: string;
	issues_url: string;
	pulls_url: string;
	milestones_url: string;
	notifications_url: string;
	labels_url: string;
	releases_url: string;
	deployments_url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: string | null;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string | null;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	has_discussions: boolean;
	forks_count: number;
	mirror_url: string | null;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: string | null;
	allow_forking: boolean;
	is_template: boolean;
	web_commit_signoff_required: boolean;
	has_pull_requests: boolean;
	pull_request_creation_policy: string;
	topics: string[];
	visibility: string;
	forks: number;
	open_issues: number;
	watchers: number;
	default_branch: string;
	permissions: {
		admin: boolean;
		maintain: boolean;
		push: boolean;
		triage: boolean;
		pull: boolean;
	};
};

type TableRowDefault = {
	label: string;
};

export type TableRowAnalytics = {
	weergaven: number;
	bezoekers: number;
	bezoeken: number;
	bounces: number;
	totaltime: number;
} & TableRowDefault;

export type TableRowKeys = {
	id: string;
	sleutel: string;
	vervaldatum: string;
} & TableRowDefault;
