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
	selector: 'sended',
	templateUrl: './sended.component.html',
	providers:[FollowService, MessageService, UserService]

})

export class SendedComponent implements OnInit{
	public title: string;
	public messages:Array<any>;
	public identity: User;
	public token: string;
	public url: string;
	public status:string;
	public follows: any;
	
	public page:number;
	public next_page:number;
	public prev_page:number;
	public total:number;
	public pages:number;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _followService: FollowService,
		private _userService: UserService,
		private _messageService: MessageService
	){
		this.title = 'Mensajes enviados';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.status = '';
		this.messages = [];
		this.url = GLOBAL.url;
		this.next_page = 0;
		this.prev_page = 0;
		this.page = 1;
		this.pages = 0;
		this.total = 0;
	}

	ngOnInit(){
		this.actualPage();
		console.log('sended.component cargado...');
	}
	actualPage(){
		this._route.params.subscribe( params => {
			let user_id = params['id'];

			let page = +params['page'];
			
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

			//Devolver listado de usuarios
			this.getMessages(this.token, this.page);
			
		});
	}		

	getMessages(token:string, page:number){
		this._messageService.getEmmitMessages(token, page).subscribe(
			response => {
				if(response.messages){
					this.messages = response.messages;
					this.pages=response.pages;
					console.log({pages:this.pages ,page: this.page,next: this.next_page,prev: this.prev_page});
				}
			},
			error => {
				console.log(<any>error)
			}
		);
	}
}