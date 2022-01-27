import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service';

@Component({
	selector: 'timeline',
	templateUrl: './timeline.component.html',
	providers: [UserService, PublicationService]
})

export class TimelineComponent implements OnInit{
	public identity: any;
	public token: string;
	public title: string;
	public url: string;
	public status: string;
	public page:number;
	public total: number;
	public pages: number;
	public itemsPerPage:number;
	public publications: Array<any>;
	public showImage: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _publicationService: PublicationService
	){
		this.title = "Timeline";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.status = '';
		this.page = 1;
		this.publications = [];
		this.pages = 0 ;
		this.total = 0;
		this.itemsPerPage = 0;
		this.showImage = '0';
	}

	ngOnInit(){
		console.log('timeline.component cargado correctamente');
		this.getPublications(this.page);
	}

	getPublications(page:number, adding:boolean = false){
		this._publicationService.getPublications(this.token, page).subscribe(
			response => {
				
				if(response.publications){
					this.total = response.total_items;
					this.pages = response.pages;
					this.itemsPerPage = response.items_per_page;
					if(!adding){
						this.publications = response.publications;	
					}else{
						var arrayA = this.publications;
						var arrayB = response.publications;

						this.publications = arrayA.concat(arrayB);

					}
					if(this.publications.length == (this.total)){
						this.noMore = true
					}else{
						this.page += 1;
					}
					$("html, body").animate({ scrollTop: $('body').prop("scrollHeight") }, 500);
					

					if(page > this.pages){
						this._router.navigate(['/home']);
					}
				}else{
					this.status = 'error';
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);
				if(errorMessage != null){
					this.status = 'error';
				}
			}
		);
	}
	public noMore:boolean = false;
	viewMore(){
		
		this.getPublications(this.page, true)
	}

	refresh(event:any = null){
		this.getPublications(1, false)
		this.page = 1;
	}

	showThisImage(id:string){
		if(this.showImage == id){
			this.showImage = '';	
		}else{
			this.showImage = id;
		}
	}

	deletePublication(id:string){
		this._publicationService.deletePublication(this.token, id).subscribe(
			response => {
				this.refresh();
			},
			error => {
				console.log(error)
			}
		);
	}

}