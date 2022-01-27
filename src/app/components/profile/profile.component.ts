import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import{ UserService } from '../../services/user.service';
import{ FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'profile',
	templateUrl: './profile.component.html',
	providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit{
	public title: string;
	public user: User;
	public status: string;
	public identity: User;
	public token: string;
	public stats: any;
	public url: string;
	public follow: Follow;
	public followed: boolean;
	public following: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _followService: FollowService
	){
		this.title = "Perfil";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.user = new User('','','','','','','ROLE_USER','');
		this.status = '';
		this.url = GLOBAL.url;
		this.follow = new Follow('','','');
		this.followed = false;
		this.following = false;
		this.followUserOver = '';
	}

	ngOnInit(){
		this.loadPage();
		console.log('profile.component cargado')
	
	}

	loadPage(){
		this._route.params.subscribe(params => {
			let id = params['id'];
			this.getUser(id);
			this.getCounters(id);
		});
	}

	getUser(id:string){
		this._userService.getUser(id).subscribe(
			response => {
				if(response){
					console.log(response);
					this.user = response.user;
					if(response.following){
						this.following = true;
					}
					if(response.followed){
						this.followed = true;
					}
					

				}else{
					this.status = 'error';
					console.log(this.status);
				}
			},
			error => {
				console.log(<any>error);
				this._router.navigate(['/perfil', this.identity._id]);
				this.status = 'error';
			}
		);
	}

	getCounters(id:any){
		this._userService.getCounters(id).subscribe(
			response => {
				this.stats = response;

			},
			error => {
				console.log(<any>error);
			}
		)
	}

	followUser(followed:string){
		var follow = new Follow('', this.identity._id, followed);

		this._followService.addFollow(this.token, follow).subscribe(
			response => {
				if(response){
					this.following = true;
					this._userService.countersToLocal();
				}
			},
			error => {
				console.log(<any>error)
			}
		);
	}

	unfollowUser(followed:any){
		this._followService.deleteFollow(this.token, followed).subscribe(
			response => {
				this.following = false;
				this._userService.countersToLocal();
			},
			error => {
				console.log(<any>error)
			}
		);
	}

	public followUserOver:string;

	mouseEnter(user_id:string){
		this.followUserOver = user_id;
	}

	mouseLeave(user_id:string){
		this.followUserOver = '';
	}
	
}

