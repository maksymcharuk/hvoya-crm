import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component( {
  selector: 'app-form-control-error-message',
  templateUrl: './form-control-error-message.component.html',
  styleUrls: ['./form-control-error-message.component.scss']
} )
export class FormControlErrorMessageComponent {

  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() errorType!: string;
  @Input() errorMessage!: string;
}
