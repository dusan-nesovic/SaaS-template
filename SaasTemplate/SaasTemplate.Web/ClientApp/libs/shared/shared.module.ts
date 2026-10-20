// Angular modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Third-party modules
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { FormTemplateComponent } from './components/form/form-template.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { GridCellDirective } from './components/data-grid/grid-cell.directive';
import { CmsContentComponent } from './components/cms-content/cms-content.component';
import { ModalComponent } from './components/modal/modal.component';
import { AppSelectComponent } from './components/select/select.component';
import { AppDatepickerComponent } from './components/datepicker/datepicker.component';
import { AppTimepickerComponent } from './components/timepicker/timepicker.component';

@NgModule({
  declarations: [FormTemplateComponent, DonutChartComponent, DataGridComponent, GridCellDirective, CmsContentComponent, ModalComponent, AppSelectComponent, AppDatepickerComponent, AppTimepickerComponent],
  imports: [
    ButtonGroupModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    ReactiveFormsModule,
    RouterModule,
    TabViewModule,
    TableModule,
    ToastModule,
    TranslateModule,
  ],
  exports: [
    // Modules
    ButtonGroupModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    ReactiveFormsModule,
    RouterModule,
    TabViewModule,
    TableModule,
    ToastModule,
    TranslateModule,
    // Components
    FormTemplateComponent,
    DonutChartComponent,
    DataGridComponent,
    GridCellDirective,
    CmsContentComponent,
    ModalComponent,
    AppSelectComponent,
    AppDatepickerComponent,
    AppTimepickerComponent
  ],
})
export class SharedModule {}
