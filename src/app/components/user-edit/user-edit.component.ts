import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'user-edit',
	templateUrl: './user-edit.component.html',
	providers: [UserService, UploadService]
})

export class UserEditComponent implements OnInit{
	public title: string;
	public user: User;
	public identity: any;
	public token: any;
	public status: string;
	public url: string;

	constructor(
		private _route:ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _uploadService: UploadService
	){
		this.title = 'Actualizar mis datos';
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
		this.status = '';
		this.filesToUpload = [];
		this.url = GLOBAL.url;
	}	
	ngOnInit(){
		console.log(this.user);
		console.log('user-edit.component se ha cargado');
	}
	onSubmit(){
		this._userService.updateUser(this.user).subscribe(
			response => {
				if(!response.user){
					this.status = 'error';
				}else{
					this.user = response.user;
					
					if(this.filesToUpload.length < 1){
						this.identity = this.user;
						this.status = 'success';
						localStorage.setItem('identity', JSON.stringify(this.user));
					}else{	
						//Subir imagen
						this._uploadService.makeFileRequest(this.url+ 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
						.then((result: any) => {
							console.log(result);
							this.user.image = result.user.image;
							localStorage.setItem('identity', JSON.stringify(this.user));
							this.identity = this.user;
							this.status = 'success';
						});
					}
				}	

				$("html, body").animate({ scrollTop: '0'}, 300 );
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);
				if(errorMessage != null){
					this.status = 'error'
				}
			}
		);
	}
	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
	}
}

