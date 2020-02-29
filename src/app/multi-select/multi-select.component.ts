import { Component, OnInit, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IMultiSelectOptions } from './multi-select-options.model';
import { IMultiSelectItem } from './multi-select-item.model';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() data: object[];
  @Input() options: IMultiSelectOptions;

  items: IMultiSelectItem[] = [];

  onChange: (value: (string | number)[]) => void;
  onTouched;
  isDisabled;

  buttonLabel: string;

  selectAllLabel = 'Select All';
  deselectAllLabel = 'Deselect All';
  defaultLabel = 'Select a value';
  selectedLabel = 'items selected';

  idProperty = 'id';
  nameProperty = 'name';

  private values: (string | number)[];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options.currentValue) {
        this.setupOptions();
    }
    if (changes.data.currentValue) {
      const currentData = changes.data.currentValue as any[];
      this.items = currentData.map(data => ({ id: data[this.idProperty], name: data[this.nameProperty], checked: false }));
    }
  }

  private setupOptions() {
    if (this.options.defaultLabel) {
      this.defaultLabel = this.options.defaultLabel;
    }
    if (this.options.selectAllLabel) {
      this.selectAllLabel = this.options.selectAllLabel;
    }
    if (this.options.deslectAllLabel) {
      this.deselectAllLabel = this.options.deslectAllLabel;
    }
    if (this.options.selectedLabel) {
      this.selectedLabel = this.options.selectedLabel;
    }
    this.buttonLabel = this.defaultLabel;
    if (this.options.idProperty) {
      this.idProperty = this.options.idProperty;
    }
    if (this.options.nameProperty) {
      this.nameProperty = this.options.nameProperty;
    }
  }

  writeValue(values: (string | number)[]): void {
    this.values = values ? [...values] : [];
    this.bindToValues();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onItemClicked(id: string | number) {
    const index = this.values.indexOf(id);
    if (index !== -1) {
      this.values.splice(index, 1);
    } else {
      this.values.push(id);
    }
    this.bindToValues();
    this.onChange(this.values);
  }

  selectAll() {
    this.values = this.items.map(item => item.id);
    this.bindToValues();
    this.onChange(this.values);
  }

  deselectAll() {
    this.values = [];
    this.bindToValues();
    this.onChange(this.values);
  }

  private bindToValues() {
    this.items.forEach(item => item.checked = false);
    this.values.forEach((value: string | number) => {
      const selectedItem = this.items.find(item => item.id === value);
      if (selectedItem) {
        selectedItem.checked = true;
      }
    });

    switch (this.values.length) {
      case 0:
        this.buttonLabel = this.defaultLabel;
        break;
      case 1:
        this.buttonLabel = this.items.find(item => item.id === this.values[0]).name;
        break;
      default:
        this.buttonLabel = `${this.values.length} ${this.selectedLabel}`;
    }
  }

}
