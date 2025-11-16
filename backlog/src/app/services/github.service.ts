import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { GitHubRepository } from "../models/github.model";
import { environment } from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class GitHubService {
    readonly baseUrl = 'https://api.github.com/';
    readonly token = environment.githubToken;

    constructor(private http: HttpClient) {}

    getAllRepos(): Observable<GitHubRepository[]> {
        const endpoint = `${this.baseUrl}user/repos`;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github+json'
        });
        
        return this.http.get<GitHubRepository[]>(endpoint, { headers });
    }
}