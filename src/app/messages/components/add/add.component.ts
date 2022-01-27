import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params }  from '@angular/router';
import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
import { FollowService } from '../../../services/follow.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';

@Component({
	selector: 'add',
	templateUrl: './add.component.html',
	providers:[FollowService, MessageService, UserService]
})

export class AddComponent implements OnInit{
	public title: string;
	public message:Message;
	public identity: User;
	public token: string;
	public url: string;
	public status:string;
	public follows: any;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _followService: FollowService,
		private _userService: UserService,
		private _messageService: MessageService
	){
		this.title = 'Enviar mensaje';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.status = '';
		this.message = new Message('','','','',this.identity._id,'')
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('add.component cargado...');
		this.getMyFollows();
	}

	onSubmit(form:any){
		console.log(this.message);
		this._messageService.addMessage(this.token, this.message).subscribe(
			response => {
				if(response.message.emitter){
					this.status = 'success';
					form.reset();
				}else{
					this.status = 'error';
				}
			},
			error => {
				this.status = 'error';
				console.log(<any>error);
			}
		);
		
	}

	getMyFollows(){
		this._followService.getMyFollows(this.token).subscribe(
			response => {
				this.follows = response.follows;
			},
			error => {
				console.log(<any>error);
			}
		);
	}
}