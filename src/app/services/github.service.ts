import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { expand, reduce } from "rxjs/operators";
import { GitHubRepository } from "../models/github.model";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class GitHubService {
    private readonly baseUrl = 'https://api.github.com/';
    private readonly token = environment.githubToken;
    private readonly pageSize = 100;

    constructor(private http: HttpClient) {}

    getAllRepos(): Observable<GitHubRepository[]> {
        return this.fetchReposPage(1).pipe(
            expand((repos, index) =>
                repos.length === this.pageSize
                    ? this.fetchReposPage(index + 2)
                    : EMPTY
            ),
            reduce((all, repos) => all.concat(repos), [] as GitHubRepository[])
        );
    }

    private fetchReposPage(page: number): Observable<GitHubRepository[]> {
        const endpoint = `${this.baseUrl}user/repos?per_page=${this.pageSize}&page=${page}`;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github+json'
        });

        return this.http.get<GitHubRepository[]>(endpoint, { headers });
    }
}