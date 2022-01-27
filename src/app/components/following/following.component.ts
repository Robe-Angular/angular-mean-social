import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }  from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'following',
	templateUrl: './following.component.html',
	providers: [UserService,FollowService]
})
export class FollowingComponent implements OnInit{
	public followedOrFollowing: string;
	public title: string;
	public identity:User;
	public token:string;
	public page:any;
	public next_page:number;
	public prev_page:number;
	public total:any;
	public pages:any;
	public users: Array<User>;
	public usersShow: Array<User>;
	public status: string;
	public follows:any;
	public following:any;
	public url:string;
	public userPageId: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _followService: FollowService
	){		
		this.identity = this._userService.getIdentity();
		this.title = 'Usuarios seguidos por:' ;
		this.token = this._userService.getToken();
		this.next_page = 0;
		this.prev_page = 0;
		this.user = new User('','','','','','','ROLE_USER','');
		this.status = '';
		this.users = [];
		this.url = GLOBAL.url;
		this.follows = [];
		this.userPageId = '';
		this.usersShow = [];
		this.followedOrFollowing = 'following';
	}

	ngOnInit(){
		console.log('users.component ha sido cargado');
		this.actualPage();
		
	}
	actualPage(){
		this._route.params.subscribe( params => {
			let user_id = params['id'];
			this.userPageId = user_id;

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
			console.log([this.page,this.next_page,this.prev_page]);
			//Devolver listado de usuarios
			this.getUser(user_id, page);
		});
	}

	getFollows(user_id:any, page:any){
		this._followService.getFollowing(this.token, user_id, page).subscribe(
			response => {
				if(!response.follows){
					this.status = 'error'
				}else{
					this.usersShow = [];				
					this.total = response.total;
					this.following = response.follows;
					this.following.forEach((follow:any) => {
						this.usersShow.push(follow.followed);
					});
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

	public user: User;
	getUser(user_id:string, page: number){
		this._userService.getUser(user_id).subscribe(
			response => {
				if(response.user){
					this.user = response.user;
					this.getFollows(user_id, page);
				}else{
					this._router.navigate(['/home'])
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
