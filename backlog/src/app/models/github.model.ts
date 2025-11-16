export interface GitHubRepository {
    archived: boolean;
    created_at: Date;
    disabled: boolean;
    description: string;
    fork: boolean;
    id: number;
    language: string | null;
    name: string;
    private: boolean;
    size: number;
    stargazers_count: number;
    visibility: GithubRepoVisibility;
}

export type GithubRepoVisibility = 'public' | 'private' | 'internal';