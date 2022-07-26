import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

export class AutoComponentModel {

  public name: string;
  public description: string;
  public imageUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.name = '';
    this.description = '';
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  public clone(): AutoComponentModel {
    let clonedModel: AutoComponentModel = new AutoComponentModel(this.sanitizer);

    clonedModel.name = this.name;
    clonedModel.description = this.description;
    clonedModel.imageUrl = this.imageUrl;

    return clonedModel;
  }
}
