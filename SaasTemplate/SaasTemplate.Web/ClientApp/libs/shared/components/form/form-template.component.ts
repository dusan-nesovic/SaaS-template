// Angular modules
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.scss'],
})
export class FormTemplateComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() formGroup!: FormGroup;
  @Output() formSubmit: EventEmitter<void> = new EventEmitter<void>();

  // Public methods

  public onSubmit() {
    this.formSubmit.emit();
  }
}
