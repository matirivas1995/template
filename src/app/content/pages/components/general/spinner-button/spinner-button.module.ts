import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { SpinnerButtonComponent } from './spinner-button.component';

@NgModule({
	imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
	exports: [SpinnerButtonComponent],
	declarations: [SpinnerButtonComponent]
})
export class SpinnerButtonModule {}
