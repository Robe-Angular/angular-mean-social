import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService{
	public url:string;
	public identity:any;
	public token:any;
	public stats:any;
	constructor(
		private _http: HttpClient,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.url = GLOBAL.url;
		this.token = '';
	}

	register(user:User):Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('content-Type','application/json');

		return this._http.post(this.url + 'register', params, {headers:headers});
	}

	signup(user:any, gettoken:any = null):Observable<any>{
		if(gettoken != null){
			user.gettoken = gettoken;
		}
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('content-Type','application/json');

		return this._http.post(this.url + 'login', params, {headers:headers});
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity') as string);
		if(identity != 'undefined'){
			this.identity = identity;
		}else{
			this.identity = null;
			}
		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');
		if(token != undefined){
			this.token = token;
		}
		return this.token;
	}

	getStats(){
		let stats = JSON.parse(localStorage.getItem('stats') as string);

		if(stats != undefined){
			this.stats = stats;
		}else{
			this.stats = null;
		}
		return this.stats;
	}

	getCounters(userId = null):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
			.set('Authorization',this.getToken());
		if(userId != null){
			return this._http.get(this.url + 'counters/' + userId, {headers: headers});
		}else{
			return this._http.get(this.url + 'counters/', {headers: headers});
		}
	}

	countersToLocal(navigation:string = 'false', stats: boolean = false){
		this.getCounters().subscribe(
			response => {
				localStorage.setItem('stats', JSON.stringify(response));
				if(navigation == 'true'){
					this._router.navigate(['/']);	
				}else if(navigation == 'timeline'){
					this._router.navigate(['/timeline']);	
				}	
				
			},
			error => {
				console.log(error);
			}

		);
	}
	
	updateUser(user:User):Observable<any>{
		let params = JSON.stringify(user);
		let headers = new HttpHeaders().set('Content-Type','application/json')
		.set('Authorization', this.getToken());
		return this._http.put(this.url + 'update-user/' +  user._id, params, { headers: headers});		
	}

	getUsers(page = null):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization',this.getToken());
		return this._http.get(this.url + 'users/' + page, {headers: headers} );

	}

	getUser(id:string):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
			.set('Authorization',this.getToken());
		return this._http.get(this.url + 'user/' + id, {headers: headers} );

	}
}