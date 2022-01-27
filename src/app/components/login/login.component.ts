import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	providers: [UserService]
})

export class LoginComponent implements OnInit{
	public title:string;
	public user: User;
	public status: string;
	public identity:User;
	public token:any;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.title = 'Identifícate';
		this.user = new User('','','','','','','ROLE_USER','');
		this.status = '';
		this.identity = new User('','','','','','','ROLE_USER','');
		this.token = {};
	}
	ngOnInit(){
		console.log('Componente de login cargado')
	}

	onSubmit(form:any){
		this._userService.signup(this.user).subscribe(
			response => {
				if(response.user && response.user._id){
					this.identity = response.user;
					//Persistir datos del usuario
					localStorage.setItem('identity', JSON.stringify(this.identity));

					//Obtener token
					this.getToken();
					
					

				}else{
					this.status = 'error';
				}
			},
			error => {
				this.status = 'error';
			}
		);
	}
	getToken(){
		this._userService.signup(this.user,'true').subscribe(
			response => {
				if(response.token){
					this.token = response.token;
					localStorage.setItem('token', JSON.stringify(this.token));
					
					//Conseguir contadores o estadísticas del usuario
					this._userService.countersToLocal('true');
				}else{
					this.status = 'error';
				}
			},
			error => {
				
				this.status = 'error';
			}
		);
	}

	
}