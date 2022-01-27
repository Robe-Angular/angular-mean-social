import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }  from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'users',
	templateUrl: './users.component.html',
	providers: [UserService,FollowService]
})
export class UsersComponent implements OnInit{
	public title: string;
	public identity:User;
	public token:string;
	public page:number;
	public next_page:number;
	public prev_page:number;
	public total:any;
	public pages:any;
	public users: Array<User>;
	public status: string;
	public follows:any;
	public url:string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _followService: FollowService
	){
		this.title = 'Gente';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.next_page = 0;
		this.prev_page = 0;
		this.status = '';
		this.users = [];
		this.url = GLOBAL.url;
		this.follows = [];
		this.page = 1;
		console.log(this.follows);
	}

	ngOnInit(){
		console.log('users.component ha sido cargado');
		this.actualPage();
		console.log(this.page);
	}
	actualPage(){
		this._route.params.subscribe( params => {
			let page = +params['page'];
			this.page = page;
			if(!page){
				page = 1;
				this.next_page = page + 1
			}else{
				this.next_page = page + 1
				this.prev_page = page - 1
				if(this.prev_page <= 0){
					this.prev_page = 1
				}
			}
			this.page = page;
			console.log([this.page,this.next_page,this.prev_page]);
			//Devolver lostado de usuarios
			this.getUsers(page);
		});
	}

	getUsers(page:any){
		this._userService.getUsers(page).subscribe(
			response => {
				if(!response.users){
					this.status = 'error'
				}else{
					this.total = response.total;
					this.users = response.users;
					this.pages = response.pages;
					this.follows = response.users_following;
					
					if(page > this.pages){
						this._router.navigate(['/']);
					}
				}
			},
			error => {
				var errorMessage = <any> error;			
				console.log(errorMessage);
				if(errorMessage != null){
					this.status = error;
				}
			}
		)
	}

	public followUserOver:any;
	mouseEnter(user_id:string){
		this.followUserOver = user_id;
	}

	mouseLeave(user_id:string){
		this.followUserOver = '0';
	}

	followUser(followed:string){
		var follow = new Follow('', this.identity._id, followed);
		this._followService.addFollow(this.token, follow).subscribe(

			response => {
				if(!response.follow){
					this.status = 'error';
				}else{
					this.status = 'success';
					this._userService.countersToLocal('false');
					this.follows.push(followed);
				}

			},
			error => {
				var errorMessage = <any> error;			
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = error;
				}
			}
		);
	}

	unfollowUser(followed:string){
		this._followService.deleteFollow(this.token, followed).subscribe(
			response => {
				var search = this.follows.indexOf(followed);
				this._userService.countersToLocal('false');

				if(search >= 0){
					this.follows.splice(search, 1)
					
				}
			},
			error => {
				var errorMessage = <any> error;			
				console.log(errorMessage);

				if(errorMessage != null){
					this.status = error;
				}
			}
		);
	}
}
