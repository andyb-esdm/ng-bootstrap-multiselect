import {
  Component, OnInit, AfterViewInit, OnDestroy, ElementRef, forwardRef,
  Input, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IMultiSelectOptions } from './multi-select-options.model';
import { IMultiSelectItem } from './multi-select-item.model';
import { Observable, Subscription, fromEvent, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
export class MultiSelectComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() data: object[];
  @Input() options: IMultiSelectOptions;
  @ViewChild('search') searchInput: ElementRef;

  private searchText$: Observable<string>;
  private subscription = new Subscription();
  private noResultsSubject = new BehaviorSubject<string>(null);
  noResults$ = this.noResultsSubject.asObservable();


  items: IMultiSelectItem[] = [];
  filteredItems: IMultiSelectItem[] = [];

  onChange: (value: (string | number)[]) => void;
  onTouched;
  isDisabled;

  buttonLabel: string;

  selectAllLabel = 'Select All';
  deselectAllLabel = 'Deselect All';
  defaultLabel = 'Select a value';
  selectedLabel = 'items selected';
  noResultsLabel = 'No results matched';

  idProperty = 'id';
  nameProperty = 'name';

  private values: (string | number)[];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setupSearchSubscription();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options.currentValue) {
      this.setupOptions();
    }
    if (changes.data.currentValue) {
      const currentData = changes.data.currentValue as any[];
      this.items = currentData.map(data => ({ id: data[this.idProperty], name: data[this.nameProperty], checked: false }));
      this.filteredItems = [...this.items];
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setupSearchSubscription() {
    this.searchText$ = fromEvent<Event>(this.searchInput.nativeElement, 'input')
      .pipe(
        map($event => ($event.target as HTMLInputElement).value)
      );
    this.subscription.add(
      this.searchText$.subscribe((searchText) => {
        if (searchText) {
          this.filteredItems = this.items.filter(item =>
            item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
          );
          if (this.filteredItems.length === 0) {
            this.noResultsSubject.next(searchText);
          } else {
            this.noResultsSubject.next(null);
          }
        } else {
          this.filteredItems = [...this.items];
          this.noResultsSubject.next(null);
        }
      })
    );
  }

  private setupOptions() {
    if (this.options.defaultLabel) {
      this.defaultLabel = this.options.defaultLabel;
    }
    this.buttonLabel = this.defaultLabel;
    if (this.options.selectAllLabel) {
      this.selectAllLabel = this.options.selectAllLabel;
    }
    if (this.options.deslectAllLabel) {
      this.deselectAllLabel = this.options.deslectAllLabel;
    }
    if (this.options.selectedLabel) {
      this.selectedLabel = this.options.selectedLabel;
    }
    if (this.options.noResultsLabel) {
      this.noResultsLabel = this.options.noResultsLabel;
    }
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

  onOpenChange(open: boolean) {
    if (!open) {
      this.clearSearchInput();
    }
  }

  clearSearchInput() {
    this.searchInput.nativeElement.value = '';
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    this.searchInput.nativeElement.dispatchEvent(inputEvent);
    this.noResultsSubject.next(null);
  }

}
