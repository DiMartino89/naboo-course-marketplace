import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Component({
    moduleId: module.id,
    selector: 'app-map',
    templateUrl: 'map.component.html'
})

export class MapComponent implements OnInit {
	public latitude: number;
	public longitude: number;
	public searchControl: FormControl;
	public zoom: number;
	
	@ViewChild("search")
	public searchElementRef: ElementRef;

    constructor(private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone) { }

    ngOnInit() {
		this.searchControl = new FormControl();
		
		this.setCurrentPosition();
	
        this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ["address"]
			});
			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					this.latitude = place.geometry.location.lat();
					this.longitude = place.geometry.location.lng();
					this.zoom = 12;
				});
			});
		});
    }
	
	private setCurrentPosition() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
				this.zoom = 12;
			});
		}
	}
}