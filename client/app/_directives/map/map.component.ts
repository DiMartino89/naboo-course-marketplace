import {Component, OnInit, ViewChild, NgZone, ElementRef, Input, AfterViewInit, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AgmMap, MapsAPILoader} from '@agm/core';
import {DataService} from "../../_services/data/data.service";

declare let google: any;

@Component({
    moduleId: module.id,
    selector: 'app-map',
    templateUrl: 'map.component.html'
})

export class MapComponent implements OnInit {
    @Input() search: boolean;
    @Input() edit: boolean;
    @Input() lat: number;
    @Input() lng: number;

    @ViewChild("search")
    public searchElementRef: ElementRef;

    @ViewChild(AgmMap) map: AgmMap;

    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;

    constructor(private dataService: DataService,
                private mapsAPILoader: MapsAPILoader,
                private ngZone: NgZone) {
    }

    ngOnInit() {
        if (this.search) {
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
                        this.dataService.latitude = place.geometry.location.lat();
                        this.dataService.longitude = place.geometry.location.lng();
                        this.latitude = place.geometry.location.lat();
                        this.longitude = place.geometry.location.lng();
                        this.zoom = 12;
                    });
                });
            });
        } else {
            this.ngZone.run(() => {
                this.latitude = this.lat;
                this.longitude = this.lng;
                this.zoom = 14;
            });
        }
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

    ngOnChanges(changes: SimpleChanges) {
        if(this.edit && changes.lat.currentValue && changes.lng.currentValue) {
            this.map.triggerResize().then(() => {
                this.latitude = this.lat;
                this.longitude = this.lng;
                this.zoom = 14;
            });
        }
    }
}