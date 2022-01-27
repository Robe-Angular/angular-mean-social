import { Component, OnInit, DoCheck, EventEmitter, Input, Output, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';

@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	providers: [UserService, PublicationService, UploadService]
})

export class SidebarComponent implements OnInit, DoCheck{
	public identity:any;
	public token:string;
	public stats:any;
	public url:string;
	public status:string;
	public publication:Publication;
	@ViewChild('fileInput')
	inptFile: ElementRef;

	constructor(
		private _userService: UserService,
		private _uploadService: UploadService,
		private _publicationService: PublicationService,
		private _renderer: Renderer2
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.stats = this._userService.getStats();
		this.url = GLOBAL.url;
		this.status = '';
		this.publication = new Publication('','','','',this.identity._id);
		this.filesToUpload =[];
		this.inptFile = new ElementRef(null);
	}

	ngOnInit(){
		console.log('sidebar.component ha sido cargado');
	}
	ngDoCheck(){
		this.stats = this._userService.getStats();
	}

	onSubmit(form:any){
		this._publicationService.addPublication(this.token, this.publication).subscribe(
			response => {
				if(response.publication){
					this.status = 'success';
					
					if(this.filesToUpload.length == 0){
						this.publication = response.publication;
						this._userService.countersToLocal('timeline', true);	
						this.sended.emit({send: 'true'});
						form.reset();
					}else{
						this._uploadService.makeFileRequest(this.url+ 'publication/upload-image-pub/'+ response.publication._id,[], this.filesToUpload, this.token,'image')
							.then((result:any) => {
								this.publication.file = result.image;
								this.publication = response.publication;
								this._userService.countersToLocal('timeline', true);	
								//this.filesToUpload = [];
								this.sended.emit({send: 'true'});
								this._renderer.setProperty(this.inptFile.nativeElement, 'value','');
								form.reset();
						});
					}

				}
				else{
					this.status ='error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage)
				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput:any){
		this.filesToUpload = <Array<File>> fileInput.target.files;
	}

	//Output
	@Output() sended = new EventEmitter();	
	sendPublication(event:any){
		this.sended.emit({send: 'true'});
		console.log('emit');
	}
}